import { Building } from "../model/buildings";
import { solveForward } from "./forward";
import { SolverInputs } from "./types";

/**
 * Numeric inverse by bisection. Not used by the app — it exists so the tests can
 * check the closed-form `solveInverse` against an independent method without a
 * second hand-written model.
 */
export function bisectForward(
  building: Building,
  targetCount: number,
  inputs: SolverInputs,
  epsilon = 1e-12
): number {
  const countAt = (t: number) => solveForward(t, inputs).buildings[building].count;

  if (targetCount <= countAt(0)) return 0;

  let hi = 1;
  while (countAt(hi) < targetCount) {
    hi *= 2;
    if (hi > 1e12) return hi;
  }

  let lo = 0;
  for (let i = 0; i < 200 && hi - lo > epsilon * Math.max(1, hi); i += 1) {
    const mid = (lo + hi) / 2;
    if (countAt(mid) < targetCount) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
