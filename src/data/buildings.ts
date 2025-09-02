import { BuildingType } from "../types/production";

export interface BuildingInfo {
  type: BuildingType;
  label: string;
}

export const BUILDINGS: BuildingInfo[] = [
  { type: "grainFarm", label: "Grain Farm" },
  { type: "animalFarm", label: "Animal Ranch" },
  { type: "waterworks", label: "Waterworks" },
  { type: "mill", label: "Mill" },
  { type: "bakery", label: "Bakery" },
  { type: "butcher", label: "Butcher" },
  { type: "coalMine", label: "Coal Mine" },
  { type: "ironMine", label: "Iron Mine" },
  { type: "goldMine", label: "Gold Mine" },
  { type: "ironSmelt", label: "Iron Smelting Works" },
  { type: "weaponSmith", label: "Weaponsmith's Works" },
  { type: "goldSmelt", label: "Gold Smelting Works" },
  { type: "barracks", label: "Barracks" },
  { type: "fishery", label: "Fishery" },
];
