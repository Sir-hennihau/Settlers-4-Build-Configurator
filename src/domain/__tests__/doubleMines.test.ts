import { civilizationById } from "../data/civilizations";
import { BUILDINGS } from "../model/buildings";
import { outputRatePerMinute } from "../model/rates";
import { bisectForward } from "../solve/bisect";
import { breakpointsInSoldierRate } from "../solve/breakpoints";
import { solveForward } from "../solve/forward";
import { solveInverse } from "../solve/inverse";
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

describe("double iron mines", () => {
  it("produces no breakpoint when there are none", () => {
    expect(breakpointsInSoldierRate(inputsFor())).toEqual([]);
  });

  it("produces exactly one breakpoint, at the hand-computed target", () => {
    const inputs = inputsFor({ doubleIronMines: 3 });
    const points = breakpointsInSoldierRate(inputs);
    expect(points).toHaveLength(1);

    // One iron ore per soldier, so 3 double mines cover 3 * 2 * rate soldiers.
    const rate = outputRatePerMinute("ironMine", romans);
    expect(points[0]).toBeCloseTo(3 * 2 * rate, 9);
  });

  it("shifts the breakpoint down by the toolsmiths' own ore demand", () => {
    const rate = outputRatePerMinute("ironMine", romans);
    const withTools = breakpointsInSoldierRate(inputsFor({ doubleIronMines: 3, toolSmiths: 2 }));
    const toolOre = solveForward(0, inputsFor({ toolSmiths: 2 })).demand.ironOre;
    expect(withTools[0]).toBeCloseTo(3 * 2 * rate - toolOre, 9);
  });

  it("is continuous across the kink", () => {
    const inputs = inputsFor({ doubleIronMines: 3, toolSmiths: 1 });
    const [kink] = breakpointsInSoldierRate(inputs);
    const epsilon = 1e-6;
    const below = solveForward(kink - epsilon, inputs);
    const above = solveForward(kink + epsilon, inputs);
    for (const building of BUILDINGS) {
      expect(above.buildings[building].count).toBeCloseTo(
        below.buildings[building].count,
        4
      );
    }
  });

  it("halves the meat-side slope below the kink", () => {
    const inputs = inputsFor({ doubleIronMines: 5 });
    const [kink] = breakpointsInSoldierRate(inputs);

    const slope = (from: number, to: number, building: "butcher" | "animalRanch") =>
      (solveForward(to, inputs).buildings[building].count -
        solveForward(from, inputs).buildings[building].count) /
      (to - from);

    for (const building of ["butcher", "animalRanch"] as const) {
      const belowSlope = slope(0, kink * 0.5, building);
      const aboveSlope = slope(kink * 1.5, kink * 2.5, building);
      expect(belowSlope).toBeCloseTo(aboveSlope / 2, 9);
    }
  });

  it("makes the marginal iron mine ordinary above the kink", () => {
    const inputs = inputsFor({ doubleIronMines: 4 });
    const [kink] = breakpointsInSoldierRate(inputs);
    const rate = outputRatePerMinute("ironMine", romans);

    const slopeAbove =
      solveForward(kink + 2, inputs).buildings.ironMine.count -
      solveForward(kink + 1, inputs).buildings.ironMine.count;
    expect(slopeAbove).toBeCloseTo(1 / rate, 9);

    const slopeBelow =
      solveForward(kink * 0.6, inputs).buildings.ironMine.count -
      solveForward(kink * 0.6 - 1, inputs).buildings.ironMine.count;
    expect(slopeBelow).toBeCloseTo(1 / (2 * rate), 9);
  });

  it("leaves the coal side untouched by the iron kink", () => {
    const inputs = inputsFor({ doubleIronMines: 4 });
    const [kink] = breakpointsInSoldierRate(inputs);
    const slope = (from: number, to: number) =>
      (solveForward(to, inputs).buildings.coalMine.count -
        solveForward(from, inputs).buildings.coalMine.count) /
      (to - from);
    expect(slope(0, kink * 0.5)).toBeCloseTo(slope(kink * 1.5, kink * 2.5), 9);
  });

  it("gives grain and water a partial kink only", () => {
    // Grain feeds both the bread chain (unkinked) and the animal chain
    // (kinked), so its slope ratio must sit strictly between 1/2 and 1.
    const inputs = inputsFor({ doubleIronMines: 5 });
    const [kink] = breakpointsInSoldierRate(inputs);
    for (const building of ["grainFarm", "waterworks"] as const) {
      const below =
        (solveForward(kink * 0.5, inputs).buildings[building].count -
          solveForward(0, inputs).buildings[building].count) /
        (kink * 0.5);
      const above =
        (solveForward(kink * 2.5, inputs).buildings[building].count -
          solveForward(kink * 1.5, inputs).buildings[building].count) /
        kink;
      const ratio = below / above;
      expect(ratio).toBeGreaterThan(0.5);
      expect(ratio).toBeLessThan(1);
    }
  });

  it("round-trips exactly on both sides of the kink and at it", () => {
    const inputs = inputsFor({ doubleIronMines: 3, toolSmiths: 2 });
    const [kink] = breakpointsInSoldierRate(inputs);
    for (const target of [kink * 0.4, kink, kink * 2.2]) {
      const count = solveForward(target, inputs).buildings.ironMine.count;
      expect(solveInverse("ironMine", count, inputs).soldiersPerMinute).toBeCloseTo(
        target,
        9
      );
    }
  });

  it("agrees with an independent bisection", () => {
    let seed = 12345;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < 25; i += 1) {
      const inputs = inputsFor({
        doubleIronMines: Math.floor(random() * 8),
        toolSmiths: Math.floor(random() * 4),
        stone: { kind: "mineCount", count: Math.floor(random() * 5) },
      });
      const target = random() * 40;
      const count = solveForward(target, inputs).buildings.ironMine.count;
      const closed = solveInverse("ironMine", count, inputs).soldiersPerMinute;
      const bisected = bisectForward("ironMine", count, inputs);
      expect(closed).toBeCloseTo(bisected, 6);
    }
  });
});

describe("double stone mines", () => {
  it("changes no building count when stone is entered as a mine count", () => {
    // Nothing downstream consumes stone, and the same mines eat the same bread,
    // so doubling can only raise stone output. Pinned so the no-op is a
    // decision rather than an accident.
    const plain = solveForward(8, inputsFor({ stone: { kind: "mineCount", count: 4 } }));
    const doubled = solveForward(
      8,
      inputsFor({ stone: { kind: "mineCount", count: 4 }, doubleStoneMines: 4 })
    );
    for (const building of BUILDINGS) {
      expect(doubled.buildings[building].count).toBeCloseTo(
        plain.buildings[building].count,
        9
      );
    }
    expect(doubled.buildings.stoneMine.outputPerMinute).toBeCloseTo(
      2 * plain.buildings.stoneMine.outputPerMinute,
      9
    );
  });

  it("cuts mines and bread when stone is entered as a per-minute target", () => {
    const rate = outputRatePerMinute("stoneMine", romans);
    const target = 6 * rate;
    const plain = solveForward(8, inputsFor({ stone: { kind: "perMinute", value: target } }));
    const doubled = solveForward(
      8,
      inputsFor({ stone: { kind: "perMinute", value: target }, doubleStoneMines: 3 })
    );

    expect(plain.buildings.stoneMine.count).toBeCloseTo(6, 9);
    // 3 doubles cover 6 mines' worth of output, so 3 mines total.
    expect(doubled.buildings.stoneMine.count).toBeCloseTo(3, 9);
    expect(doubled.demand.bread).toBeLessThan(plain.demand.bread);
    expect(doubled.buildings.bakery.count).toBeLessThan(plain.buildings.bakery.count);
  });

  it("never emits a soldierRate breakpoint, because stone demand is exogenous", () => {
    expect(
      breakpointsInSoldierRate(
        inputsFor({ stone: { kind: "mineCount", count: 5 }, doubleStoneMines: 2 })
      )
    ).toEqual([]);
  });
});

describe("monotonicity", () => {
  it("never decreases any building count as the target rises", () => {
    let seed = 987654321;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < 200; i += 1) {
      const inputs = inputsFor({
        doubleIronMines: Math.floor(random() * 6),
        toolSmiths: Math.floor(random() * 4),
        doubleStoneMines: Math.floor(random() * 3),
        stone: { kind: "mineCount", count: Math.floor(random() * 6) },
      });
      const a = solveForward(random() * 20, inputs);
      const b = solveForward(a.soldiersPerMinute + random() * 20 + 0.01, inputs);
      for (const building of BUILDINGS) {
        expect(b.buildings[building].count).toBeGreaterThanOrEqual(
          a.buildings[building].count - 1e-9
        );
      }
    }
  });
});
