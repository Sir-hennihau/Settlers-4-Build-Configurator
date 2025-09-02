/** Available resources in the production chain */
export type Resource =
  | "grain"
  | "water"
  | "animal"
  | "meat"
  | "weat"
  | "bread"
  | "coal"
  | "ironOre"
  | "ironBar"
  | "weapon"
  | "goldOre"
  | "goldBar"
  | "fish"
  | "soldierT3";

/** Available building types */
export type Building =
  | "grainFarm"
  | "mill"
  | "bakery"
  | "animalFarm"
  | "butcher"
  | "waterworks"
  | "coalMine"
  | "ironMine"
  | "goldMine"
  | "goldSmelt"
  | "ironSmelt"
  | "weaponSmith";

/** Production rate configuration for a single civilization */
export type CivilizationProductionRate = Record<
  Building,
  {
    in: number;
    out: number;
  }
>;
