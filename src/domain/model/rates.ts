import {
  BuildingTiming,
  Civilization,
  TimedBuilding,
} from "../data/civilizations";
import { Building } from "./buildings";
import { OUTPUT_OF, RECIPES } from "./recipes";
import { Resource, ResourceVector } from "./resources";

export const MS_PER_TICK = 71;

/**
 * Reproduces every published per-minute value to within 0.001 across all four
 * civilizations. Note that only the *absolute* soldiers-per-minute figure
 * depends on this constant — every building-count ratio is independent of it,
 * because it cancels.
 */
export const TICKS_PER_MINUTE = 60000 / MS_PER_TICK;

/**
 * "One fisher hut supplies 1.5 gold mines", the only figure in the model not
 * backed by a tick table. Encoded as a derived cycle length so the fisher stays
 * an ordinary node in the graph instead of a special case in the solver.
 */
export const GOLD_MINES_PER_FISHER = 1.5;

export function deriveFisherTiming(civ: Civilization): BuildingTiming {
  const goldMine = civ.timings.goldMine;
  const recipe = RECIPES.goldOre;
  const fishPerGoldOre = (recipe.inputs.fish as number) / recipe.outputQty;
  return {
    ticksPerCycle: goldMine.ticksPerCycle / fishPerGoldOre / GOLD_MINES_PER_FISHER,
    unitsPerCycle: goldMine.unitsPerCycle,
  };
}

export function timingOf(building: Building, civ: Civilization): BuildingTiming {
  if (building === "fisher") return deriveFisherTiming(civ);
  return civ.timings[building as TimedBuilding];
}

/** Units of its output this building produces per minute, at full productivity. */
export function outputRatePerMinute(building: Building, civ: Civilization): number {
  const { ticksPerCycle, unitsPerCycle = 1 } = timingOf(building, civ);
  return (TICKS_PER_MINUTE * unitsPerCycle) / ticksPerCycle;
}

/**
 * Units of `input` this building consumes per minute.
 *
 * This single line replaces every hand-entered `in` value in the old configs:
 * input rates are a consequence of the output rate and the shared recipe ratio,
 * never independent data.
 */
export function inputRatePerMinute(
  building: Building,
  input: Resource,
  civ: Civilization
): number {
  const output = OUTPUT_OF[building];
  if (!output) throw new Error(`building ${building} produces nothing`);
  const recipe = RECIPES[output];
  const qty = recipe.inputs[input];
  if (qty === undefined) return 0;
  return (outputRatePerMinute(building, civ) * qty) / recipe.outputQty;
}

/** Every input rate of a building, per minute per building. */
export function inputRatesPerMinute(
  building: Building,
  civ: Civilization
): ResourceVector {
  const output = OUTPUT_OF[building];
  if (!output) return {};
  const out: ResourceVector = {};
  for (const input of Object.keys(RECIPES[output].inputs) as Resource[]) {
    out[input] = inputRatePerMinute(building, input, civ);
  }
  return out;
}
