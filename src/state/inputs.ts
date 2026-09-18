import { CivilizationId, civilizationById } from "../domain/data/civilizations";
import { Building } from "../domain/model/buildings";
import { Anchor, SolverInputs, StoneInput } from "../domain/solve/types";

export type AnchorMode = Anchor["kind"];
export type StoneMode = StoneInput["kind"];

/**
 * Everything the user has typed, and nothing else.
 *
 * Derived values are deliberately absent: they are recomputed by the solver on
 * read. The previous design stored the *results* in Redux and wrote them from a
 * `useEffect`, which made the store a cache that could disagree with its inputs.
 */
export interface InputsState {
  readonly civilization: CivilizationId;
  readonly anchor: Anchor;
  readonly toolSmiths: number;
  readonly stone: StoneInput;
  readonly doubleIronMines: number;
  readonly doubleStoneMines: number;
}

export const INITIAL_INPUTS: InputsState = {
  civilization: "romans",
  anchor: { kind: "building", building: "grainFarm", count: 10 },
  toolSmiths: 1,
  stone: { kind: "mineCount", count: 0 },
  doubleIronMines: 0,
  doubleStoneMines: 0,
};

export type InputsAction =
  | { type: "setCivilization"; civilization: CivilizationId }
  | { type: "setAnchorMode"; mode: AnchorMode }
  | { type: "setAnchorBuilding"; building: Building }
  | { type: "setAnchorCount"; value: unknown }
  | { type: "setSoldiersPerMinute"; value: unknown }
  | { type: "setToolSmiths"; value: unknown }
  | { type: "setStoneMode"; mode: StoneMode }
  | { type: "setStoneValue"; value: unknown }
  | { type: "setDoubleIronMines"; value: unknown }
  | { type: "setDoubleStoneMines"; value: unknown }
  | { type: "reset" };

/**
 * The single place raw input is sanitised. Previously each handler did its own
 * `Number(event.target.value)`, two of them without a guard, so an empty or
 * negative field could put `NaN` into the calculation.
 */
export function clampNonNegative(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

const stoneCount = (stone: StoneInput): number =>
  stone.kind === "mineCount" ? stone.count : 0;

export function inputsReducer(state: InputsState, action: InputsAction): InputsState {
  switch (action.type) {
    case "setCivilization":
      if (state.civilization === action.civilization) return state;
      return { ...state, civilization: action.civilization };

    case "setAnchorMode": {
      if (state.anchor.kind === action.mode) return state;
      return {
        ...state,
        anchor:
          action.mode === "soldiers"
            ? { kind: "soldiers", soldiersPerMinute: 10 }
            : { kind: "building", building: "grainFarm", count: 10 },
      };
    }

    case "setAnchorBuilding": {
      if (state.anchor.kind !== "building") return state;
      if (state.anchor.building === action.building) return state;
      return { ...state, anchor: { ...state.anchor, building: action.building } };
    }

    case "setAnchorCount": {
      if (state.anchor.kind !== "building") return state;
      const count = clampNonNegative(action.value);
      if (state.anchor.count === count) return state;
      return { ...state, anchor: { ...state.anchor, count } };
    }

    case "setSoldiersPerMinute": {
      if (state.anchor.kind !== "soldiers") return state;
      const soldiersPerMinute = clampNonNegative(action.value);
      if (state.anchor.soldiersPerMinute === soldiersPerMinute) return state;
      return { ...state, anchor: { kind: "soldiers", soldiersPerMinute } };
    }

    case "setToolSmiths": {
      const toolSmiths = clampNonNegative(action.value);
      if (state.toolSmiths === toolSmiths) return state;
      return { ...state, toolSmiths };
    }

    case "setStoneMode": {
      if (state.stone.kind === action.mode) return state;
      const stone: StoneInput =
        action.mode === "mineCount"
          ? { kind: "mineCount", count: 0 }
          : { kind: "perMinute", value: 0 };
      return { ...state, stone, doubleStoneMines: 0 };
    }

    case "setStoneValue": {
      const value = clampNonNegative(action.value);
      const stone: StoneInput =
        state.stone.kind === "mineCount"
          ? { kind: "mineCount", count: value }
          : { kind: "perMinute", value };
      // A mine can only be double if it exists.
      const doubleStoneMines =
        stone.kind === "mineCount"
          ? Math.min(state.doubleStoneMines, value)
          : state.doubleStoneMines;
      if (
        stoneCount(state.stone) === stoneCount(stone) &&
        state.stone.kind === stone.kind &&
        (state.stone.kind === "mineCount" || state.stone.value === value) &&
        state.doubleStoneMines === doubleStoneMines
      ) {
        return state;
      }
      return { ...state, stone, doubleStoneMines };
    }

    case "setDoubleIronMines": {
      const doubleIronMines = clampNonNegative(action.value);
      if (state.doubleIronMines === doubleIronMines) return state;
      return { ...state, doubleIronMines };
    }

    case "setDoubleStoneMines": {
      const raw = clampNonNegative(action.value);
      const doubleStoneMines =
        state.stone.kind === "mineCount" ? Math.min(raw, state.stone.count) : raw;
      if (state.doubleStoneMines === doubleStoneMines) return state;
      return { ...state, doubleStoneMines };
    }

    case "reset":
      return INITIAL_INPUTS;

    default:
      return state;
  }
}

export const toSolverInputs = (state: InputsState): SolverInputs => ({
  civ: civilizationById(state.civilization),
  toolSmiths: state.toolSmiths,
  stone: state.stone,
  doubleIronMines: state.doubleIronMines,
  doubleStoneMines: state.doubleStoneMines,
});
