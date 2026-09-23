import { Civilization } from "../data/civilizations";
import { Building } from "../model/buildings";
import { Resource, ResourceVector } from "../model/resources";

/**
 * How the user specifies their stone mining.
 *
 * The distinction is load-bearing for double-efficiency mines. With a mine
 * *count*, doubling changes nothing but stone output — the same mines eat the
 * same bread. With a stone-per-minute *target*, doubling genuinely reduces both
 * the mine count and the bread cost, mirroring iron.
 */
export type StoneInput =
  | { readonly kind: "mineCount"; readonly count: number }
  | { readonly kind: "perMinute"; readonly value: number };

/** Everything the solver needs besides the anchor. */
export interface SolverInputs {
  readonly civ: Civilization;
  readonly toolSmiths: number;
  readonly stone: StoneInput;
  /** Of the iron mines the solve calls for, how many sit on a double deposit. */
  readonly doubleIronMines: number;
  readonly doubleStoneMines: number;
  /**
   * Gold deposits the map allows, or `undefined` for no cap. Gold goes to T3s
   * first; soldiers beyond what the gold covers are recruited at level 1.
   */
  readonly maxGoldMines?: number;
}

/**
 * Soldiers per minute by level. A level-1 soldier costs one weapon, a level-3
 * (T3) soldier one weapon and two gold bars. Gold is spent on T3s first, so
 * level 2 (one weapon, one gold bar) never arises at a steady rate and is not
 * modelled.
 */
export interface SoldierLevels {
  readonly level3: number;
  readonly level1: number;
}

export interface BuildingResult {
  /** Total buildings needed, doubles included. */
  readonly count: number;
  readonly normal: number;
  readonly double: number;
  /** Double-deposit buildings the target does not need. They consume nothing. */
  readonly idleDouble: number;
  readonly outputPerMinute: number;
}

export type Warning =
  | {
      readonly kind: "idleDoubleMines";
      readonly building: Building;
      readonly idle: number;
      readonly spareOutputPerMinute: number;
    }
  | {
      readonly kind: "insufficientForOverhead";
      readonly building: Building;
      readonly required: number;
      readonly entered: number;
    }
  | { readonly kind: "unconstrainedAnchor"; readonly building: Building };

export interface Solution {
  /** All soldiers, whatever their level — equal to weapons consumed per minute. */
  readonly soldiersPerMinute: number;
  readonly soldierLevels: SoldierLevels;
  readonly buildings: Readonly<Record<Building, BuildingResult>>;
  /** Units per minute of each resource the build consumes. */
  readonly demand: Readonly<Record<Resource, number>>;
  /** `contributions[resource][consumer]` — who is asking for it, and how much. */
  readonly contributions: Readonly<Record<Resource, ResourceVector>>;
  readonly warnings: readonly Warning[];
}

export type Anchor =
  | { readonly kind: "building"; readonly building: Building; readonly count: number }
  | { readonly kind: "soldiers"; readonly soldiersPerMinute: number };

export interface Solved extends Solution {
  /** False when the entered count cannot even cover the toolsmith/stone overhead. */
  readonly isSufficient: boolean;
  /** What the anchor building costs at zero soldiers, i.e. the fixed overhead. */
  readonly anchorOverhead: number;
  readonly deficit: number;
}

export const EPSILON = 1e-9;
