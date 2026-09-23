import { Civilization } from "../data/civilizations";
import { outputRatePerMinute } from "../model/rates";
import { inputsOf, Recipe, RECIPES } from "../model/recipes";
import { Resource, ResourceVector } from "../model/resources";
import { SolverInputs } from "./types";

export interface AllocationContext {
  readonly resource: Resource;
  readonly recipe: Recipe;
  readonly civ: Civilization;
  /** Output per minute of ONE ordinary building of this type. */
  readonly outputRatePerBuilding: number;
  /** Input consumption per minute of ONE building, whatever its efficiency. */
  readonly inputRatePerBuilding: ResourceVector;
  readonly inputs: SolverInputs;
}

export interface Allocation {
  readonly normalUnits: number;
  readonly doubleUnits: number;
  readonly totalUnits: number;
  readonly idleDoubleUnits: number;
  readonly outputCapacity: number;
  readonly inputDemand: ResourceVector;
}

/**
 * Turns a building count into the demand it places upstream.
 *
 * This is the one and only place where the double-efficiency non-linearity
 * lives: consumption is proportional to *building count*, not to output. Every
 * other part of the solver is linear and knows nothing about it.
 */
const demandFrom = (units: number, ctx: AllocationContext): ResourceVector => {
  const out: ResourceVector = {};
  for (const [resource, rate] of Object.entries(ctx.inputRatePerBuilding)) {
    out[resource as Resource] = units * (rate as number);
  }
  return out;
};

export type Allocator = (demandPerMinute: number, ctx: AllocationContext) => Allocation;

export const linearAllocator: Allocator = (demand, ctx) => {
  const rate = ctx.outputRatePerBuilding;
  const units = rate > 0 ? demand / rate : 0;
  return {
    normalUnits: units,
    doubleUnits: 0,
    totalUnits: units,
    idleDoubleUnits: 0,
    outputCapacity: units * rate,
    inputDemand: demandFrom(units, ctx),
  };
};

/**
 * Some deposits yield at double rate: the mine consumes the same food but
 * produces twice the ore, so food-per-ore halves — but only for the first
 * `availableDoubles` mines, after which ordinary mines take over. That kink is
 * why the forward map is piecewise-linear rather than linear.
 *
 * Doubles are always used first, and any the target does not need sit idle
 * consuming nothing.
 */
export function doubleEfficiencyAllocator(
  availableDoubles: (inputs: SolverInputs) => number,
  factor = 2
): Allocator {
  return (demand, ctx) => {
    const rate = ctx.outputRatePerBuilding;
    const available = Math.max(0, availableDoubles(ctx.inputs));
    if (rate <= 0) {
      return {
        normalUnits: 0,
        doubleUnits: 0,
        totalUnits: 0,
        idleDoubleUnits: available,
        outputCapacity: 0,
        inputDemand: {},
      };
    }

    const doubleCapacity = available * factor * rate;
    const doubleUnits = Math.min(available, demand / (factor * rate));
    const normalUnits = Math.max(0, demand - doubleCapacity) / rate;
    const totalUnits = doubleUnits + normalUnits;

    return {
      normalUnits,
      doubleUnits,
      totalUnits,
      idleDoubleUnits: available - doubleUnits,
      outputCapacity: doubleUnits * factor * rate + normalUnits * rate,
      inputDemand: demandFrom(totalUnits, ctx),
    };
  };
}

/**
 * Caps how much of one input a node may draw, and lets the rest of its demand
 * go without.
 *
 * Used for gold: most maps have a limited number of gold deposits, so only that
 * many mines' worth of gold bars exist. Every soldier still takes a weapon, but
 * the gold goes to T3s first (two bars each) and soldiers the gold cannot cover
 * are recruited at level 1. The node's own unit count is untouched; only the
 * capped input bends, which is why its downstream is the only part that kinks.
 */
export function cappedInputAllocator(
  input: Resource,
  cap: (inputs: SolverInputs) => number
): Allocator {
  return (demand, ctx) => {
    const base = linearAllocator(demand, ctx);
    const wanted = base.inputDemand[input] ?? 0;
    return {
      ...base,
      inputDemand: { ...base.inputDemand, [input]: Math.min(wanted, Math.max(0, cap(ctx.inputs))) },
    };
  };
}

export const DOUBLE_FACTOR = 2;

/**
 * Gold bars per minute that `maxGoldMines` gold mines can feed, or `Infinity`
 * when the map has no cap. Derived from the recipes, so a change to the gold
 * smelter's ratio flows through.
 */
export function goldBarCapPerMinute(inputs: SolverInputs): number {
  if (inputs.maxGoldMines === undefined) return Infinity;
  const smelt = RECIPES.goldBar;
  const barsPerOre = smelt.outputQty / (smelt.inputs.goldOre as number);
  return Math.max(0, inputs.maxGoldMines) * outputRatePerMinute("goldMine", inputs.civ) * barsPerOre;
}

/**
 * A node whose allocator is not linear, together with what the inverse needs
 * to know about it.
 */
interface KinkedNode {
  readonly allocator: Allocator;
  /**
   * Demand for the node's own resource at which its allocator changes slope,
   * or `null` if it never does for these inputs.
   */
  readonly kinkAt: (inputs: SolverInputs) => number | null;
  /**
   * The inputs whose demand the kink bends. Everything downstream of them is
   * piecewise rather than affine — see `assertNoKinkedAncestors`.
   */
  readonly bentInputs: readonly Resource[];
}

/**
 * Some deposits yield double: adding such a mine is the whole cost of
 * supporting another double-capable resource.
 */
function doubleDepositNode(
  resource: Resource,
  availableDoubles: (inputs: SolverInputs) => number
): KinkedNode {
  const building = RECIPES[resource].building;
  if (!building) throw new Error(`${resource} has no building to sit on a double deposit`);
  return {
    allocator: doubleEfficiencyAllocator(availableDoubles, DOUBLE_FACTOR),
    kinkAt: (inputs) => {
      const available = Math.max(0, availableDoubles(inputs));
      if (available <= 0) return null;
      return available * DOUBLE_FACTOR * outputRatePerMinute(building, inputs.civ);
    },
    bentInputs: inputsOf(resource),
  };
}

function cappedInputNode(
  resource: Resource,
  input: Resource,
  cap: (inputs: SolverInputs) => number
): KinkedNode {
  const recipe = RECIPES[resource];
  const perUnit = (recipe.inputs[input] as number) / recipe.outputQty;
  return {
    allocator: cappedInputAllocator(input, cap),
    kinkAt: (inputs) => {
      const limit = cap(inputs);
      return Number.isFinite(limit) ? Math.max(0, limit) / perUnit : null;
    },
    bentInputs: [input],
  };
}

/**
 * Every non-linear node in the graph. Each entry adds one potential breakpoint
 * to the forward map, but see `assertNoKinkedAncestors` in `breakpoints.ts`,
 * which guards the assumption that keeps the inverse closed-form.
 */
export const KINKED_NODES: Readonly<Partial<Record<Resource, KinkedNode>>> = {
  soldier: cappedInputNode("soldier", "goldBar", goldBarCapPerMinute),
  ironOre: doubleDepositNode("ironOre", (i) => i.doubleIronMines),
  stone: doubleDepositNode("stone", (i) => i.doubleStoneMines),
};

export const KINKED_RESOURCES: readonly Resource[] = Object.keys(KINKED_NODES) as Resource[];

export const allocatorFor = (r: Resource): Allocator =>
  KINKED_NODES[r]?.allocator ?? linearAllocator;
