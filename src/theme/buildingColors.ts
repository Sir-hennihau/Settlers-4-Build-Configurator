import { PaletteMode } from "@mui/material";
import { Building } from "../domain/model/buildings";
import { Hue, PALETTE } from "./palette";

/**
 * Colour group of each building in the output list, so the parts of the chain
 * can be told apart at a glance: food green, mines blue, and the metal works
 * (smelters and smiths) orange.
 *
 * Total over `Building`, so a new building without an entry is a compile error.
 */
const FOOD: Hue = "green";
const MINE: Hue = "blue";
const SMELT: Hue = "orange";

const BUILDING_HUES: Readonly<Record<Building, Hue>> = {
  grainFarm: FOOD,
  waterworks: FOOD,
  mill: FOOD,
  bakery: FOOD,
  animalRanch: FOOD,
  butcher: FOOD,
  fisher: FOOD,
  coalMine: MINE,
  ironMine: MINE,
  goldMine: MINE,
  stoneMine: MINE,
  ironSmelt: SMELT,
  goldSmelt: SMELT,
  weaponSmith: SMELT,
  toolSmith: SMELT,
};

/**
 * Shade 600 on light backgrounds and 400 on dark ones: both clear WCAG AA for
 * text (about 4.8:1 and 8.6:1) for every hue used here.
 */
export const buildingColor = (building: Building, mode: PaletteMode): string =>
  PALETTE[BUILDING_HUES[building]][mode === "dark" ? 400 : 600];
