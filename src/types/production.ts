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

export interface CivilizationProductionRate {
  [buildingGerman: string]: {
    in: number;
    out: number;
  };
}

export interface CivilizationsConfig {
  [civName: string]: CivilizationProductionRate;
}
