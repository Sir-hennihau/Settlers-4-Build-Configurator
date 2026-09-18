import { demandAncestors } from "../model/graph";
import { outputRatePerMinute } from "../model/rates";
import { RECIPES } from "../model/recipes";
import { Resource } from "../model/resources";
import { DOUBLE_FACTOR, DOUBLE_SOURCES, KINKED_RESOURCES } from "./allocators";
import { solveForward } from "./forward";
import { EPSILON, SolverInputs } from "./types";

/**
 * Soldier-per-minute values at which the forward map changes slope, i.e. where
 * the double-deposit mines of some resource run out and ordinary ones take over.
 *
 * A resource's own demand curve is unaffected by its own allocator, so it is
 * affine in the target and two samples pin it exactly — provided no *other*
 * kinked resource lies upstream of it, which `assertNoKinkedAncestors` checks.
 */
export function breakpointsInT3pm(inputs: SolverInputs): number[] {
  const atZero = solveForward(0, inputs);
  const atOne = solveForward(1, inputs);
  const found: number[] = [];

  for (const resource of KINKED_RESOURCES) {
    const source = DOUBLE_SOURCES[resource];
    const building = RECIPES[resource].building;
    if (!source || !building) continue;

    const available = Math.max(0, source(inputs));
    if (available <= 0) continue;

    const rate = outputRatePerMinute(building, inputs.civ);
    const capacity = available * DOUBLE_FACTOR * rate;

    const fixed = atZero.demand[resource];
    const slope = atOne.demand[resource] - fixed;
    // Exogenous demand (stone) has zero slope, so it never kinks in t3pm.
    if (slope <= EPSILON) continue;

    const t = (capacity - fixed) / slope;
    if (t > EPSILON) found.push(t);
  }

  return Array.from(new Set(found)).sort((a, b) => a - b);
}

/**
 * The invariant the closed-form inverse rests on: no kinked resource may sit
 * upstream of another kinked resource's demand, or that demand would itself be
 * piecewise and two samples would no longer pin it.
 *
 * Today `demandAncestors('ironOre')` is {ironBar, weapon, tool, soldierT3} and
 * nothing consumes stone at all, so this holds. If it ever fires, either drop
 * the offending allocator or switch the inverse to `bisectForward`.
 */
export function assertNoKinkedAncestors(): void {
  const kinked = new Set<Resource>(KINKED_RESOURCES);
  for (const resource of KINKED_RESOURCES) {
    for (const ancestor of Array.from(demandAncestors(resource))) {
      if (kinked.has(ancestor)) {
        throw new Error(
          `${resource} has a kinked demand ancestor (${ancestor}); ` +
            `its demand is no longer affine and the closed-form inverse is invalid`
        );
      }
    }
  }
}

assertNoKinkedAncestors();
