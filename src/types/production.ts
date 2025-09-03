/** Available resources in the production chain */
export type Resource =
  | "stone"
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
  | "soldierT3"
  | "toolSmiths";

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
  | "stoneMine"
  | "goldSmelt"
  | "ironSmelt"
  | "weaponSmith"
  | "toolSmith";

/** Production rate configuration for a single civilization */
export type CivilizationProductionRate = Record<
  Building,
  {
    in: number;
    out: number;
  }
>;
