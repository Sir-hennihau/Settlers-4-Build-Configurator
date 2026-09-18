import { Building } from "../model/buildings";

export const CIVILIZATION_IDS = ["romans", "vikings", "maya", "trojans"] as const;
export type CivilizationId = (typeof CIVILIZATION_IDS)[number];

/**
 * How long one production cycle takes, in game ticks.
 *
 * `unitsPerCycle` is a real batch size and defaults to 1. It is 3 for the animal
 * ranch and only for the animal ranch: 1685/3 is not an integer, so storing
 * ticks-per-unit-output would lose exactness there (the published 561.66 is a
 * rounded value). Do not confuse it with `Recipe.outputQty`, which is a ratio.
 */
export interface BuildingTiming {
  readonly ticksPerCycle: number;
  readonly unitsPerCycle?: number;
}

/** The fisher is derived from the gold mine, not tabulated — see `rates.ts`. */
export type TimedBuilding = Exclude<Building, "fisher">;

export interface Civilization {
  readonly id: CivilizationId;
  readonly displayName: string;
  readonly timings: Readonly<Record<TimedBuilding, BuildingTiming>>;
}

/**
 * Ticks per cycle, transcribed from the game's "Ticks/Ressource" table ([out]
 * column). Every input rate is derived from these via the shared recipe ratios,
 * so there is deliberately no input column here — `rates.test.ts` checks the
 * derived inputs against the published per-minute table for all four civs.
 *
 * Two transcription traps, both already handled below:
 *  - the tick table is ordered R, W, M, T, U while the per-minute table is
 *    ordered W, R, M, T, U (Romans and Vikings swapped);
 *  - "Trojans" here means the Ubo Trojaner (U) column, the modern variant.
 * Grain farm and waterworks use the [opt] rows.
 */
export const CIVILIZATIONS: Readonly<Record<CivilizationId, Civilization>> = {
  romans: {
    id: "romans",
    displayName: "Romans",
    timings: {
      grainFarm: { ticksPerCycle: 478 },
      waterworks: { ticksPerCycle: 143 },
      mill: { ticksPerCycle: 187 },
      bakery: { ticksPerCycle: 489 },
      animalRanch: { ticksPerCycle: 1685, unitsPerCycle: 3 },
      butcher: { ticksPerCycle: 178 },
      coalMine: { ticksPerCycle: 156 },
      ironMine: { ticksPerCycle: 288 },
      goldMine: { ticksPerCycle: 376 },
      stoneMine: { ticksPerCycle: 288 },
      ironSmelt: { ticksPerCycle: 283 },
      goldSmelt: { ticksPerCycle: 301 },
      weaponSmith: { ticksPerCycle: 390 },
      toolSmith: { ticksPerCycle: 308 },
    },
  },
  vikings: {
    id: "vikings",
    displayName: "Vikings",
    timings: {
      grainFarm: { ticksPerCycle: 490 },
      waterworks: { ticksPerCycle: 165 },
      mill: { ticksPerCycle: 224 },
      bakery: { ticksPerCycle: 412 },
      animalRanch: { ticksPerCycle: 1397, unitsPerCycle: 3 },
      butcher: { ticksPerCycle: 217 },
      coalMine: { ticksPerCycle: 156 },
      ironMine: { ticksPerCycle: 306 },
      goldMine: { ticksPerCycle: 376 },
      // 306, not the coal mine's 156. The old vikingsConfig.ts had the stone
      // mine's bread input copied from the coal mine row (0.722 instead of
      // 0.736); deriving inputs from ticks makes that class of typo impossible.
      stoneMine: { ticksPerCycle: 306 },
      ironSmelt: { ticksPerCycle: 272 },
      goldSmelt: { ticksPerCycle: 279 },
      weaponSmith: { ticksPerCycle: 326 },
      toolSmith: { ticksPerCycle: 291 },
    },
  },
  maya: {
    id: "maya",
    displayName: "Maya",
    timings: {
      grainFarm: { ticksPerCycle: 481 },
      waterworks: { ticksPerCycle: 142 },
      mill: { ticksPerCycle: 237 },
      bakery: { ticksPerCycle: 396 },
      animalRanch: { ticksPerCycle: 1025, unitsPerCycle: 3 },
      butcher: { ticksPerCycle: 207 },
      coalMine: { ticksPerCycle: 170 },
      ironMine: { ticksPerCycle: 318 },
      goldMine: { ticksPerCycle: 406 },
      stoneMine: { ticksPerCycle: 320 },
      ironSmelt: { ticksPerCycle: 373 },
      goldSmelt: { ticksPerCycle: 319 },
      weaponSmith: { ticksPerCycle: 422 },
      toolSmith: { ticksPerCycle: 377 },
    },
  },
  trojans: {
    id: "trojans",
    displayName: "Trojans",
    timings: {
      grainFarm: { ticksPerCycle: 459 },
      waterworks: { ticksPerCycle: 117 },
      mill: { ticksPerCycle: 204 },
      bakery: { ticksPerCycle: 395 },
      animalRanch: { ticksPerCycle: 1193, unitsPerCycle: 3 },
      butcher: { ticksPerCycle: 144 },
      coalMine: { ticksPerCycle: 170 },
      ironMine: { ticksPerCycle: 306 },
      goldMine: { ticksPerCycle: 391 },
      stoneMine: { ticksPerCycle: 306 },
      ironSmelt: { ticksPerCycle: 336 },
      goldSmelt: { ticksPerCycle: 414 },
      weaponSmith: { ticksPerCycle: 376 },
      toolSmith: { ticksPerCycle: 321 },
    },
  },
};

export const civilizationById = (id: CivilizationId): Civilization => CIVILIZATIONS[id];
