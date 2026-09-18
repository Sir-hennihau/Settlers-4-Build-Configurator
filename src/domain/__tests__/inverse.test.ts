import { CIVILIZATION_IDS, civilizationById } from "../data/civilizations";
import { ANCHOR_BUILDINGS } from "../model/buildings";
import { solveForward } from "../solve/forward";
import { solveInverse } from "../solve/inverse";
import { solve } from "../solve/solve";
import { SolverInputs } from "../solve/types";

const inputsFor = (overrides: Partial<SolverInputs> = {}): SolverInputs => ({
  civ: civilizationById("romans"),
  toolSmiths: 1,
  stone: { kind: "mineCount", count: 0 },
  doubleIronMines: 0,
  doubleStoneMines: 0,
  ...overrides,
});

describe("inverse solve", () => {
  const targets = [0.5, 3, 17.25];
  const toolSmithCounts = [0, 2];

  // The property that matters: the inverse is exact, not approximate. If this
  // ever needs loosening to toBeCloseTo(x, 2), the closed form has a bug.
  describe.each(CIVILIZATION_IDS)("%s", (civId) => {
    const civ = civilizationById(civId);
    for (const toolSmiths of toolSmithCounts) {
      for (const target of targets) {
        it.each(ANCHOR_BUILDINGS)(
          `round-trips through %s (target ${target}, ${toolSmiths} toolsmiths)`,
          (building) => {
            const inputs = inputsFor({ civ, toolSmiths, stone: { kind: "mineCount", count: 2 } });
            const count = solveForward(target, inputs).buildings[building].count;
            const back = solveInverse(building, count, inputs);
            expect(back.soldiersPerMinute).toBeCloseTo(target, 9);
            expect(back.isSufficient).toBe(true);
          }
        );
      }
    }
  });

  it("reports insufficiency exactly when the count is below the overhead", () => {
    const inputs = inputsFor({ toolSmiths: 4 });
    const overhead = solveForward(0, inputs).buildings.coalMine.count;
    expect(overhead).toBeGreaterThan(0);

    const below = solveInverse("coalMine", overhead - 0.5, inputs);
    expect(below.isSufficient).toBe(false);
    expect(below.soldiersPerMinute).toBe(0);
    expect(below.deficit).toBeCloseTo(0.5, 9);
    expect(below.warnings).toContainEqual(
      expect.objectContaining({ kind: "insufficientForOverhead", building: "coalMine" })
    );

    const exactly = solveInverse("coalMine", overhead, inputs);
    expect(exactly.isSufficient).toBe(true);
    expect(exactly.soldiersPerMinute).toBeCloseTo(0, 9);
  });

  it("reports no overhead for buildings only the soldier chain uses", () => {
    const inputs = inputsFor({ toolSmiths: 3 });
    const solved = solveInverse("goldSmelt", 0, inputs);
    expect(solved.anchorOverhead).toBeCloseTo(0, 12);
    expect(solved.isSufficient).toBe(true);
  });

  it("solves from a soldier target directly", () => {
    const inputs = inputsFor({ toolSmiths: 2 });
    const solved = solve({ kind: "soldiers", soldiersPerMinute: 12 }, inputs);
    expect(solved.soldiersPerMinute).toBeCloseTo(12, 12);
    const viaBuilding = solve(
      { kind: "building", building: "bakery", count: solved.buildings.bakery.count },
      inputs
    );
    expect(viaBuilding.soldiersPerMinute).toBeCloseTo(12, 9);
  });

  it("agrees between the two anchor modes for every building", () => {
    const inputs = inputsFor({ toolSmiths: 1, stone: { kind: "mineCount", count: 3 } });
    const fromTarget = solve({ kind: "soldiers", soldiersPerMinute: 8 }, inputs);
    for (const building of ANCHOR_BUILDINGS) {
      const fromCount = solve(
        { kind: "building", building, count: fromTarget.buildings[building].count },
        inputs
      );
      expect(fromCount.soldiersPerMinute).toBeCloseTo(8, 9);
    }
  });
});
