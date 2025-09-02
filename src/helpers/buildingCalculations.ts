import { getBuildingsForCivilization } from "../data/civilizationBuildings";

/**
 * Calculate buildings needed per soldier per minute for a specific civilization
 * This is now simplified to just use the direct multipliers from the building data
 */
export const calculateBuildingMultipliers = (
  civilizationType: string
): { [buildingLabel: string]: number } => {
  const buildings = getBuildingsForCivilization(civilizationType);
  const buildingMultipliers: { [buildingLabel: string]: number } = {};

  // Simply use the productionRate as the multiplier - this represents buildings needed per soldier per minute
  buildings.forEach((building) => {
    buildingMultipliers[building.label] = building.productionRate;
  });

  return buildingMultipliers;
};

/**
 * Legacy function to maintain compatibility with existing components
 * Gets the multiplier for a specific building in a civilization
 */
export const getBuildingMultiplier = (
  buildingLabel: string,
  civilizationType: string
): number => {
  const multipliers = calculateBuildingMultipliers(civilizationType);
  return multipliers[buildingLabel] || 0;
};
