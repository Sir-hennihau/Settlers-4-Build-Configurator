import { Building } from "../model/buildings";
import { breakpointsInSoldierRate } from "./breakpoints";
import { solveForward } from "./forward";
import { EPSILON, Solved, SolverInputs, Warning } from "./types";

const countAt = (t: number, building: Building, inputs: SolverInputs): number =>
  solveForward(t, inputs).buildings[building].count;

/**
 * Inverts the forward map: given N of one building, how many T3 soldiers per
 * minute does that sustain?
 *
 * There is deliberately no second implementation of the model here. The forward
 * map is continuous, monotone non-decreasing and piecewise-linear, so sampling
 * it at its breakpoints and interpolating within the containing segment is
 * *exact* rather than approximate. With no double mines there is a single
 * segment and this degenerates to `(entered - overhead) / perSoldier`.
 *
 * Bisection would work too, but its tolerance would leak into the UI as digits
 * jittering while the user types, and into the tests as a weakened round-trip
 * assertion. It is kept in `bisect.ts` as a test oracle only.
 */
export function solveInverse(
  building: Building,
  enteredCount: number,
  inputs: SolverInputs
): Solved {
  const ts = [0, ...breakpointsInSoldierRate(inputs)];
  const cs = ts.map((t) => countAt(t, building, inputs));

  const overhead = cs[0];

  // Below the fixed overhead the build cannot even feed its own toolsmiths and
  // stone mines, let alone a soldier.
  if (enteredCount < overhead - EPSILON) {
    const solution = solveForward(0, inputs);
    const warning: Warning = {
      kind: "insufficientForOverhead",
      building,
      required: overhead,
      entered: enteredCount,
    };
    return {
      ...solution,
      warnings: [...solution.warnings, warning],
      isSufficient: false,
      anchorOverhead: overhead,
      deficit: overhead - enteredCount,
    };
  }

  let soldiersPerMinute: number | null = null;

  // Inside a known segment the map is affine, so interpolation is exact.
  for (let i = 0; i < ts.length - 1; i += 1) {
    if (enteredCount <= cs[i + 1] + EPSILON) {
      const span = cs[i + 1] - cs[i];
      soldiersPerMinute =
        span > EPSILON
          ? ts[i] + ((enteredCount - cs[i]) * (ts[i + 1] - ts[i])) / span
          : ts[i];
      break;
    }
  }

  // Past the last breakpoint the map is affine forever; probe its slope.
  if (soldiersPerMinute === null) {
    const last = ts[ts.length - 1];
    const lastCount = cs[cs.length - 1];
    const slope = countAt(last + 1, building, inputs) - lastCount;
    if (slope <= EPSILON) {
      const solution = solveForward(0, inputs);
      return {
        ...solution,
        warnings: [...solution.warnings, { kind: "unconstrainedAnchor", building }],
        isSufficient: true,
        anchorOverhead: overhead,
        deficit: 0,
      };
    }
    soldiersPerMinute = last + (enteredCount - lastCount) / slope;
  }

  // Re-solve forward so every displayed number is a genuine forward solution
  // rather than something back-computed. Round-trip consistency then holds by
  // construction, not by test.
  const solution = solveForward(Math.max(0, soldiersPerMinute), inputs);
  return {
    ...solution,
    isSufficient: true,
    anchorOverhead: overhead,
    deficit: 0,
  };
}
