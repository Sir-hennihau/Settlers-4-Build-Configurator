/** Every building the calculator sizes. Declaration order is the display order. */
export const BUILDINGS = [
  "grainFarm",
  "waterworks",
  "mill",
  "bakery",
  "animalRanch",
  "butcher",
  "fisher",
  "coalMine",
  "ironMine",
  "goldMine",
  "stoneMine",
  "ironSmelt",
  "goldSmelt",
  "weaponSmith",
  "toolSmith",
] as const;

export type Building = (typeof BUILDINGS)[number];

export const BUILDING_DISPLAY_NAMES: Readonly<Record<Building, string>> = {
  grainFarm: "Grain Farms",
  waterworks: "Waterworks",
  mill: "Mills",
  bakery: "Bakeries",
  animalRanch: "Animal Ranches",
  butcher: "Butchers",
  fisher: "Fisher Huts",
  coalMine: "Coal Mines",
  ironMine: "Iron Mines",
  goldMine: "Gold Mines",
  stoneMine: "Stone Mines",
  ironSmelt: "Iron Smelting Works",
  goldSmelt: "Gold Smelting Works",
  weaponSmith: "Weaponsmith's Works",
  toolSmith: "Toolsmith's Works",
};

/**
 * Buildings the user may anchor a calculation on ("I have N of these").
 *
 * `stoneMine` and `toolSmith` are excluded: they are exogenous inputs whose
 * counts the user sets directly, so their count does not vary with the soldier
 * target and cannot be inverted. (The old UI offered "Stone Mine" here and
 * silently returned 0 soldiers/min because the switch had no case for it.)
 */
export const ANCHOR_BUILDINGS: readonly Building[] = BUILDINGS.filter(
  (b) => b !== "stoneMine" && b !== "toolSmith"
);
