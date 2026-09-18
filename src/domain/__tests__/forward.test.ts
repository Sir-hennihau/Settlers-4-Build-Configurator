import { CIVILIZATION_IDS, civilizationById } from "../data/civilizations";
import { BUILDINGS } from "../model/buildings";
import { consumersOf, OUTPUT_OF, RECIPES } from "../model/recipes";
import { Resource, RESOURCES } from "../model/resources";
import { solveForward } from "../solve/forward";
import { SolverInputs } from "../solve/types";

const baseInputs = (overrides: Partial<SolverInputs> = {}): SolverInputs => ({
  civ: civilizationById("romans"),
  toolSmiths: 1,
  stone: { kind: "mineCount", count: 0 },
  doubleIronMines: 0,
  doubleStoneMines: 0,
  ...overrides,
});

describe("forward solve", () => {
  it.each(CIVILIZATION_IDS)(
    "conserves demand across every edge (%s)",
    (civId) => {
      const solution = solveForward(7, baseInputs({ civ: civilizationById(civId), toolSmiths: 2 }));
      for (const resource of RESOURCES) {
        const fromConsumers = consumersOf(resource).reduce(
          (sum, consumer) => sum + (solution.contributions[resource][consumer] ?? 0),
          0
        );
        const building = RECIPES[resource].building;
        const produced = building ? solution.buildings[building].outputPerMinute : 0;
        // Exogenous roots carry demand that no consumer accounts for.
        if (consumersOf(resource).length === 0) continue;
        expect(fromConsumers).toBeCloseTo(solution.demand[resource], 9);
        expect(produced).toBeCloseTo(solution.demand[resource], 9);
      }
    }
  );

  it("is linear in the target when no double mines are present", () => {
    const inputs = baseInputs({ toolSmiths: 3, stone: { kind: "mineCount", count: 2 } });
    const zero = solveForward(0, inputs);
    const one = solveForward(5, inputs);
    const two = solveForward(10, inputs);
    for (const building of BUILDINGS) {
      const slopeOnce = one.buildings[building].count - zero.buildings[building].count;
      const slopeTwice = two.buildings[building].count - zero.buildings[building].count;
      expect(slopeTwice).toBeCloseTo(2 * slopeOnce, 9);
    }
  });

  it("isolates the toolsmith and stone-mine overhead at a zero target", () => {
    const inputs = baseInputs({ toolSmiths: 2, stone: { kind: "mineCount", count: 3 } });
    const zero = solveForward(0, inputs);

    // Nothing on the soldier-only side of the graph is needed at zero soldiers.
    for (const building of ["weaponSmith", "goldSmelt", "goldMine", "fisher"] as const) {
      expect(zero.buildings[building].count).toBeCloseTo(0, 12);
    }
    // But the toolsmith and stone chains are.
    for (const building of ["coalMine", "ironMine", "bakery", "butcher", "toolSmith"] as const) {
      expect(zero.buildings[building].count).toBeGreaterThan(0);
    }
    expect(zero.buildings.toolSmith.count).toBeCloseTo(2, 9);
    expect(zero.buildings.stoneMine.count).toBeCloseTo(3, 9);
  });

  it("needs nothing at all with no target and no overhead", () => {
    const zero = solveForward(0, baseInputs({ toolSmiths: 0 }));
    for (const building of BUILDINGS) {
      expect(zero.buildings[building].count).toBeCloseTo(0, 12);
    }
  });

  it("splits bread demand between the coal and stone chains", () => {
    const inputs = baseInputs({ toolSmiths: 1, stone: { kind: "mineCount", count: 4 } });
    const solution = solveForward(6, inputs);
    const contributions = solution.contributions.bread;
    expect(Object.keys(contributions).sort()).toEqual(["coal", "stone"]);
    const total = (contributions.coal ?? 0) + (contributions.stone ?? 0);
    expect(total).toBeCloseTo(solution.demand.bread, 9);
    expect(contributions.stone).toBeGreaterThan(0);
  });

  it("feeds the gold chain through the fisher", () => {
    const solution = solveForward(10, baseInputs());
    expect(solution.buildings.goldMine.count).toBeGreaterThan(0);
    expect(solution.buildings.fisher.count).toBeCloseTo(
      solution.buildings.goldMine.count / 1.5,
      9
    );
  });

  it("produces a stable golden solution", () => {
    const solution = solveForward(10, baseInputs());
    const counts = Object.fromEntries(
      BUILDINGS.map((b) => [b, Number(solution.buildings[b].count.toFixed(6))])
    );
    expect(counts).toMatchInlineSnapshot(`
Object {
  "animalRanch": 2.258662,
  "bakery": 3.50951,
  "butcher": 0.715801,
  "coalMine": 8.396987,
  "fisher": 5.932444,
  "goldMine": 8.898667,
  "goldSmelt": 7.123667,
  "grainFarm": 5.993508,
  "ironMine": 4.343065,
  "ironSmelt": 4.267665,
  "mill": 1.342083,
  "stoneMine": 0,
  "toolSmith": 1,
  "waterworks": 1.793037,
  "weaponSmith": 4.615,
}
`);
  });

  it("gives every building a result object", () => {
    const solution = solveForward(3, baseInputs());
    for (const building of BUILDINGS) {
      expect(solution.buildings[building]).toBeDefined();
      expect(OUTPUT_OF[building]).toBeDefined();
    }
  });

  it("never produces negative demand", () => {
    const solution = solveForward(0, baseInputs({ toolSmiths: 0 }));
    for (const resource of RESOURCES as readonly Resource[]) {
      expect(solution.demand[resource]).toBeGreaterThanOrEqual(0);
    }
  });
});
