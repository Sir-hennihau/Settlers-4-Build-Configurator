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

export type BuildingType =
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
  | "weaponSmith"
  | "barracks"
  | "fishery";

export interface ProductionRule {
  building: string;
  inputs: { resource: Resource; amount: number }[];
  outputs: { resource: Resource; amount: number }[];
}

export type ProductionChain = ProductionRule[];

export type CivilizationProductionRate = Record<
  BuildingType,
  {
    in: number;
    out: number;
    producedGood: Resource;
  }
>;

export interface CivilizationsConfig {
  [civName: string]: CivilizationProductionRate;
}
