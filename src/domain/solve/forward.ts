import { Building, BUILDINGS } from "../model/buildings";
import { topologicalOrder } from "../model/graph";
import { inputRatesPerMinute, outputRatePerMinute } from "../model/rates";
import { RECIPES } from "../model/recipes";
import {
  Resource,
  RESOURCES,
  ResourceVector,
  zeroResourceRecord,
} from "../model/resources";
import { AllocationContext, allocatorFor } from "./allocators";
import {
  BuildingResult,
  EPSILON,
  Solution,
  SolverInputs,
  Warning,
} from "./types";

const emptyBuildingResult = (): BuildingResult => ({
  count: 0,
  normal: 0,
  double: 0,
  idleDouble: 0,
  outputPerMinute: 0,
});

/**
 * Stone output per minute implied by "I have S stone mines, D of them double".
 *
 * Expressing the exogenous input as *demand* rather than as a count is what
 * keeps the solve loop free of special cases: feeding this number through the
 * stone allocator is a fixed point that reproduces exactly D doubles and S - D
 * ordinary mines.
 */
function exogenousStoneDemand(inputs: SolverInputs): number {
  const rate = outputRatePerMinute("stoneMine", inputs.civ);
  if (inputs.stone.kind === "perMinute") return Math.max(0, inputs.stone.value);
  const total = Math.max(0, inputs.stone.count);
  const doubles = Math.min(Math.max(0, inputs.doubleStoneMines), total);
  return doubles * 2 * rate + (total - doubles) * rate;
}

/**
 * Sizes every building for a given T3 soldier target.
 *
 * Walks the production graph in demand order, letting each resource's allocator
 * decide how its demand is met, and pushes the resulting input demand upstream.
 * There is no branch on resource identity anywhere in the loop.
 */
export function solveForward(t3pm: number, inputs: SolverInputs): Solution {
  const { civ } = inputs;

  const demand = zeroResourceRecord();
  const contributions = Object.fromEntries(
    RESOURCES.map((r) => [r, {} as ResourceVector])
  ) as Record<Resource, ResourceVector>;
  const buildings = Object.fromEntries(
    BUILDINGS.map((b) => [b, emptyBuildingResult()])
  ) as Record<Building, BuildingResult>;
  const warnings: Warning[] = [];

  // The three exogenous entry points, which are exactly the graph's roots.
  demand.soldierT3 = Math.max(0, t3pm);
  demand.tool = Math.max(0, inputs.toolSmiths) * outputRatePerMinute("toolSmith", civ);
  demand.stone = exogenousStoneDemand(inputs);

  for (const resource of topologicalOrder()) {
    const required = demand[resource];
    if (required <= 0) continue;

    const recipe = RECIPES[resource];
    const building = recipe.building;

    // A virtual recipe (the soldier itself) has no building, so one "unit" is
    // one output per minute and the allocation degenerates to a ratio.
    const outputRatePerBuilding = building ? outputRatePerMinute(building, civ) : 1;
    const inputRatePerBuilding: ResourceVector = building
      ? inputRatesPerMinute(building, civ)
      : Object.fromEntries(
          Object.entries(recipe.inputs).map(([r, qty]) => [r, (qty as number) / recipe.outputQty])
        );

    const ctx: AllocationContext = {
      resource,
      recipe,
      civ,
      outputRatePerBuilding,
      inputRatePerBuilding,
      inputs,
    };

    const allocation = allocatorFor(resource)(required, ctx);

    if (building) {
      buildings[building] = {
        count: allocation.totalUnits,
        normal: allocation.normalUnits,
        double: allocation.doubleUnits,
        idleDouble: allocation.idleDoubleUnits,
        outputPerMinute: allocation.outputCapacity,
      };
      if (allocation.idleDoubleUnits > EPSILON) {
        warnings.push({
          kind: "idleDoubleMines",
          building,
          idle: allocation.idleDoubleUnits,
          spareOutputPerMinute: allocation.idleDoubleUnits * 2 * outputRatePerBuilding,
        });
      }
    }

    for (const [input, amount] of Object.entries(allocation.inputDemand)) {
      const key = input as Resource;
      demand[key] += amount as number;
      contributions[key][resource] = (contributions[key][resource] ?? 0) + (amount as number);
    }
  }

  return {
    soldiersPerMinute: Math.max(0, t3pm),
    buildings,
    demand,
    contributions,
    warnings,
  };
}
