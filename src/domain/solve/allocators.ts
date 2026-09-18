import { Civilization } from "../data/civilizations";
import { Recipe } from "../model/recipes";
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

export const DOUBLE_FACTOR = 2;

/**
 * Resources whose producers can sit on a double deposit, and where the count of
 * such deposits comes from. Adding an entry here is the whole cost of
 * supporting another double-capable mine — but see `assertNoKinkedAncestors` in
 * `breakpoints.ts`, which guards the assumption that lets the inverse stay
 * closed-form.
 */
export const DOUBLE_SOURCES: Readonly<
  Partial<Record<Resource, (inputs: SolverInputs) => number>>
> = {
  ironOre: (i) => i.doubleIronMines,
  stone: (i) => i.doubleStoneMines,
};

export const ALLOCATORS: Readonly<Partial<Record<Resource, Allocator>>> = Object.fromEntries(
  Object.entries(DOUBLE_SOURCES).map(([resource, source]) => [
    resource,
    doubleEfficiencyAllocator(source as (i: SolverInputs) => number, DOUBLE_FACTOR),
  ])
) as Partial<Record<Resource, Allocator>>;

export const KINKED_RESOURCES: readonly Resource[] = Object.keys(DOUBLE_SOURCES) as Resource[];

export const allocatorFor = (r: Resource): Allocator => ALLOCATORS[r] ?? linearAllocator;
