import {
  CivilizationBuildingData,
  BuildingProductionRate,
} from "../types/building";

// Romans production data calculated from German values
// These represent buildings needed per soldier per minute for tier 3 soldiers
// Tier 3 soldier needs: 1 weapon + 2 gold bars
const romansBuildings: BuildingProductionRate[] = [
  {
    buildingType: "grain_farm",
    label: "Grain Farm",
    productionRate: 0.5, // Use optimized: 1.768 resources/min, but we want this as baseline
  },
  {
    buildingType: "animal_ranch",
    label: "Animal Ranch",
    productionRate: 0.117, // Based on output rate 1.504/min vs input 2.006/min
  },
  {
    buildingType: "waterworks",
    label: "Waterworks",
    productionRate: 0.15, // From optimized waterworks 5.909/min
  },
  {
    buildingType: "mill",
    label: "Mill",
    productionRate: 0.118, // From 4.519 resources/min
  },
  {
    buildingType: "bakery",
    label: "Bakery",
    productionRate: 0.308, // From 1.728 resources/min
  },
  {
    buildingType: "butcher",
    label: "Butcher",
    productionRate: 0.056, // From 4.747 resources/min
  },
  {
    buildingType: "coal_mine",
    label: "Coal Mine",
    productionRate: 0.738, // From output 6.87/min, need for weapons + gold bars
  },
  {
    buildingType: "iron_mine",
    label: "Iron Mine",
    productionRate: 0.34, // From output 6.87/min, need for weapons
  },
  {
    buildingType: "gold_mine",
    label: "Gold Mine",
    productionRate: 0.89, // From output 6.87/min, need for gold bars
  },
  {
    buildingType: "iron_smelting",
    label: "Iron Smelting Works",
    productionRate: 0.335, // From 2.986 resources/min
  },
  {
    buildingType: "weaponsmith",
    label: "Weaponsmith's Works",
    productionRate: 0.461, // 1/2.167 = 0.461 for 1 weapon per soldier
  },
  {
    buildingType: "gold_smelting",
    label: "Gold Smelting Works",
    productionRate: 0.713, // 2/2.807 = 0.713 for 2 gold bars per soldier
  },
];

// Placeholder data for other civilizations (same structure, different rates)
const vikingsBuildings: BuildingProductionRate[] = romansBuildings.map(
  (building) => ({
    ...building,
    productionRate: building.productionRate * 0.9, // 10% slower as placeholder
  })
);

const mayaBuildings: BuildingProductionRate[] = romansBuildings.map(
  (building) => ({
    ...building,
    productionRate: building.productionRate * 1.1, // 10% faster as placeholder
  })
);

const trojansBuildings: BuildingProductionRate[] = romansBuildings.map(
  (building) => ({
    ...building,
    productionRate: building.productionRate * 0.95, // 5% slower as placeholder
  })
);

export const CIVILIZATION_BUILDINGS: CivilizationBuildingData = {
  romans: {
    buildings: romansBuildings,
  },
  vikings: {
    buildings: vikingsBuildings,
  },
  maya: {
    buildings: mayaBuildings,
  },
  trojans: {
    buildings: trojansBuildings,
  },
};

// Helper function to get buildings for a specific civilization
export const getBuildingsForCivilization = (civilizationType: string) => {
  return (
    CIVILIZATION_BUILDINGS[
      civilizationType as keyof typeof CIVILIZATION_BUILDINGS
    ]?.buildings || []
  );
};
