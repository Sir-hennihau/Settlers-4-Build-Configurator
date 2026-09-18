import { civilizationById } from "../data/civilizations";
import { outputRatePerMinute } from "../model/rates";
import { solveForward } from "../solve/forward";
import { SolverInputs } from "../solve/types";

const romans = civilizationById("romans");

const inputsFor = (overrides: Partial<SolverInputs> = {}): SolverInputs => ({
  civ: romans,
  toolSmiths: 0,
  stone: { kind: "mineCount", count: 0 },
  doubleIronMines: 0,
  doubleStoneMines: 0,
  ...overrides,
});

describe("idle double mines", () => {
  const rate = outputRatePerMinute("ironMine", romans);

  it("uses only as many doubles as the target needs", () => {
    // A target needing two double mines' worth of ore, with five available.
    const target = 2 * 2 * rate;
    const solution = solveForward(target, inputsFor({ doubleIronMines: 5 }));

    expect(solution.buildings.ironMine.double).toBeCloseTo(2, 9);
    expect(solution.buildings.ironMine.normal).toBeCloseTo(0, 9);
    expect(solution.buildings.ironMine.count).toBeCloseTo(2, 9);
    expect(solution.buildings.ironMine.idleDouble).toBeCloseTo(3, 9);
  });

  it("sizes the food chain for the mines in use, not the mines available", () => {
    // The trap: charging meat for idle mines. Two mines are running, so the
    // butcher must be sized for two, not five.
    const target = 2 * 2 * rate;
    const withIdle = solveForward(target, inputsFor({ doubleIronMines: 5 }));
    const withoutIdle = solveForward(target, inputsFor({ doubleIronMines: 2 }));

    expect(withIdle.demand.meat).toBeCloseTo(withoutIdle.demand.meat, 9);
    expect(withIdle.buildings.butcher.count).toBeCloseTo(
      withoutIdle.buildings.butcher.count,
      9
    );
    expect(withIdle.buildings.animalRanch.count).toBeCloseTo(
      withoutIdle.buildings.animalRanch.count,
      9
    );
  });

  it("warns about the spare capacity", () => {
    const target = 2 * 2 * rate;
    const solution = solveForward(target, inputsFor({ doubleIronMines: 5 }));
    const warning = solution.warnings.find((w) => w.kind === "idleDoubleMines");

    expect(warning).toBeDefined();
    expect(warning).toMatchObject({ kind: "idleDoubleMines", building: "ironMine" });
    if (warning && warning.kind === "idleDoubleMines") {
      expect(warning.idle).toBeCloseTo(3, 9);
      expect(warning.spareOutputPerMinute).toBeCloseTo(3 * 2 * rate, 9);
    }
  });

  it("emits no warning when every double is in use", () => {
    const target = 5 * 2 * rate;
    const solution = solveForward(target, inputsFor({ doubleIronMines: 5 }));
    expect(solution.warnings.filter((w) => w.kind === "idleDoubleMines")).toEqual([]);
    expect(solution.buildings.ironMine.idleDouble).toBeCloseTo(0, 9);
  });

  it("emits no zero-valued noise warning when there are no doubles at all", () => {
    const solution = solveForward(10, inputsFor({ doubleIronMines: 0 }));
    expect(solution.warnings).toEqual([]);
  });

  it("falls back to ordinary mines once the doubles are exhausted", () => {
    const target = 5 * 2 * rate; // exactly the double capacity
    const beyond = solveForward(target + 3 * rate, inputsFor({ doubleIronMines: 5 }));
    expect(beyond.buildings.ironMine.double).toBeCloseTo(5, 9);
    expect(beyond.buildings.ironMine.normal).toBeCloseTo(3, 9);
    expect(beyond.buildings.ironMine.idleDouble).toBeCloseTo(0, 9);
  });
});
