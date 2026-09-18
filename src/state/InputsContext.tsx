import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import { INITIAL_INPUTS, InputsAction, inputsReducer, InputsState } from "./inputs";

const StateContext = createContext<InputsState | null>(null);
const DispatchContext = createContext<Dispatch<InputsAction> | null>(null);

/**
 * State and dispatch live in separate contexts so a component that only
 * dispatches does not re-render whenever the solution changes.
 */
export function InputsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inputsReducer, INITIAL_INPUTS);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useInputs(): InputsState {
  const state = useContext(StateContext);
  if (!state) throw new Error("useInputs must be used inside an InputsProvider");
  return state;
}

export function useInputsDispatch(): Dispatch<InputsAction> {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) throw new Error("useInputsDispatch must be used inside an InputsProvider");
  return dispatch;
}
