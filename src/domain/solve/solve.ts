import { solveForward } from "./forward";
import { solveInverse } from "./inverse";
import { Anchor, Solved, SolverInputs } from "./types";

/**
 * The single entry point for the app: size every building from whichever end
 * the user chose to specify.
 */
export function solve(anchor: Anchor, inputs: SolverInputs): Solved {
  if (anchor.kind === "soldiers") {
    const solution = solveForward(Math.max(0, anchor.soldiersPerMinute), inputs);
    return { ...solution, isSufficient: true, anchorOverhead: 0, deficit: 0 };
  }
  return solveInverse(anchor.building, anchor.count, inputs);
}

export * from "./types";
export { solveForward } from "./forward";
export { solveInverse } from "./inverse";
export { breakpointsInT3pm, assertNoKinkedAncestors } from "./breakpoints";
