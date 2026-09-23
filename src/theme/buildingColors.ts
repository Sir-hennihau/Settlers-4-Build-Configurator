import { PaletteMode } from "@mui/material";
import { Building } from "../domain/model/buildings";
import { Hue, PALETTE } from "./palette";

/**
 * Colour group of each building in the output list, so the parts of the chain
 * can be told apart at a glance: food green, mines blue, smelters orange.
 * `null` keeps the default text colour (the smiths).
 *
 * Total over `Building`, so a new building without an entry is a compile error.
 */
const FOOD: Hue = "green";
const MINE: Hue = "blue";
const SMELT: Hue = "orange";

const BUILDING_HUES: Readonly<Record<Building, Hue | null>> = {
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
  weaponSmith: null,
  toolSmith: null,
};

/**
 * Shade 600 on light backgrounds and 400 on dark ones: both clear WCAG AA for
 * text (about 4.8:1 and 8.6:1) for every hue used here.
 */
export const buildingColor = (building: Building, mode: PaletteMode): string | undefined => {
  const hue = BUILDING_HUES[building];
  if (!hue) return undefined;
  return PALETTE[hue][mode === "dark" ? 400 : 600];
};
