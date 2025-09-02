import { ProductionChain, BuildingType } from "../types/production";
import { romasProductionConfig } from "../data/romasConfig";

export interface ProductionRequirements {
  [buildingType: string]: number;
}

export const calculateProductionRequirements = (
  selectedBuilding: BuildingType,
  buildingAmount: number,
  productionChain: ProductionChain
): ProductionRequirements => {
  // First, calculate the baseline requirements for 1 T3 soldier per minute
  const baselineRequirements = calculateBaselineRequirements(productionChain);

  // Find the baseline amount for the selected building
  const baselineAmount = baselineRequirements[selectedBuilding] || 0;

  if (baselineAmount === 0) {
    // If the selected building is not part of the T3 soldier chain, just return it
    return { [selectedBuilding]: buildingAmount };
  }

  // Calculate the scaling factor based on user input
  const scalingFactor = buildingAmount / baselineAmount;

  // Scale all requirements
  const requirements: ProductionRequirements = {};
  for (const [building, amount] of Object.entries(baselineRequirements)) {
    requirements[building] = amount * scalingFactor;
  }

  return requirements;
};

function calculateBaselineRequirements(
  productionChain: ProductionChain
): ProductionRequirements {
  const requirements: ProductionRequirements = {};
  const requiredResources: { [resource: string]: number } = {};

  // Start with the goal: 1 T3 soldier per minute
  requiredResources["soldierT3"] = 1;

  // Work backwards through the production chain
  const processedBuildings = new Set<string>();

  while (Object.keys(requiredResources).length > 0) {
    const nextRequiredResources: { [resource: string]: number } = {};

    for (const [resource, amount] of Object.entries(requiredResources)) {
      // Find which building produces this resource
      const producingRule = productionChain.find((rule) =>
        rule.outputs.some((output) => output.resource === resource)
      );

      if (producingRule && !processedBuildings.has(producingRule.building)) {
        const buildingConfig =
          romasProductionConfig[producingRule.building as BuildingType];

        if (buildingConfig) {
          // Calculate how many buildings we need to produce the required amount
          const requiredBuildings = amount / buildingConfig.out;
          requirements[producingRule.building] =
            (requirements[producingRule.building] || 0) + requiredBuildings;

          // Add this building's input requirements
          for (const input of producingRule.inputs) {
            const inputAmount = requiredBuildings * input.amount;
            nextRequiredResources[input.resource] =
              (nextRequiredResources[input.resource] || 0) + inputAmount;
          }

          processedBuildings.add(producingRule.building);
        }
      }
    }

    // Move to next level
    Object.keys(requiredResources).forEach(
      (key) => delete requiredResources[key]
    );
    Object.assign(requiredResources, nextRequiredResources);
  }

  return requirements;
}
