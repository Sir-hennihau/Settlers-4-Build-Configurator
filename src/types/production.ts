// Types for Settlers 4 production relationships

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

export interface ProductionRule {
  building: string;
  inputs: { resource: Resource; amount: number | "x" }[];
  outputs: { resource: Resource; amount: number }[];
}

export type ProductionChain = ProductionRule[];

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

export type CivilizationProductionRate = Record<
  Building,
  {
    in: { resource: Resource; amount: number }[];
    out: { resource: Resource; amount: number };
  }
>;

export interface CivilizationsConfig {
  [civName: string]: CivilizationProductionRate;
}
