import { useMemo } from "react";
import { solve } from "../domain/solve/solve";
import { Solved } from "../domain/solve/types";
import { useInputs } from "./InputsContext";
import { toSolverInputs } from "./inputs";

/**
 * The whole derived state of the app, recomputed from the inputs on demand.
 *
 * The reducer returns the identical state object for no-op actions, so this
 * memo only recomputes when something actually changed.
 */
export function useSolution(): Solved {
  const inputs = useInputs();
  return useMemo(() => solve(inputs.anchor, toSolverInputs(inputs)), [inputs]);
}
