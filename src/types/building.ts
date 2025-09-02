import { CivilizationType } from "./civilization";

export type BuildingType =
  | "sawmill"
  | "grain_farm"
  | "grain_farm_opt"
  | "mill"
  | "bakery"
  | "animal_ranch"
  | "butcher"
  | "waterworks"
  | "coal_mine"
  | "iron_mine"
  | "gold_mine"
  | "sulfur_mine"
  | "stone_mine"
  | "gold_smelting"
  | "iron_smelting"
  | "weaponsmith";

export interface BuildingProductionRate {
  buildingType: BuildingType;
  label: string;
  productionRate: number; // resources per minute
  inputRequirements?: {
    [resource: string]: number; // resource name -> amount needed per production cycle
  };
  outputResources?: {
    [resource: string]: number; // resource name -> amount produced per production cycle
  };
}

export type CivilizationBuildingData = {
  [K in CivilizationType]: {
    buildings: BuildingProductionRate[];
  };
};

// Legacy type for backward compatibility during transition
export type Building = {
  label: string;
  multiplier: number;
};
