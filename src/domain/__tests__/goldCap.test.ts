import { CIVILIZATION_IDS, civilizationById } from "../data/civilizations";
import { ANCHOR_BUILDINGS, Building, BUILDINGS } from "../model/buildings";
import { outputRatePerMinute } from "../model/rates";
import { goldBarCapPerMinute } from "../solve/allocators";
import { bisectForward } from "../solve/bisect";
import { breakpointsInSoldierRate } from "../solve/breakpoints";
import { solveForward } from "../solve/forward";
import { solveInverse } from "../solve/inverse";
import { SolverInputs } from "../solve/types";

const inputsFor = (overrides: Partial<SolverInputs> = {}): SolverInputs => ({
  civ: civilizationById("romans"),
  toolSmiths: 1,
  stone: { kind: "mineCount", count: 0 },
  doubleIronMines: 0,
  doubleStoneMines: 0,
  ...overrides,
});

/** Soldier rate at which `cap` gold mines are exactly used up by T3s. */
const saturationRate = (inputs: SolverInputs) => goldBarCapPerMinute(inputs) / 2;

const GOLD_CHAIN: readonly Building[] = ["goldMine", "goldSmelt", "fisher"];

describe("gold mine cap", () => {
  it("is a no-op when absent", () => {
    const solution = solveForward(12, inputsFor());
    expect(goldBarCapPerMinute(inputsFor())).toBe(Infinity);
    expect(breakpointsInSoldierRate(inputsFor())).toEqual([]);
    expect(solution.soldierLevels.level3).toBeCloseTo(12, 12);
    expect(solution.soldierLevels.level1).toBe(0);
  });

  it("changes nothing while the cap is not reached", () => {
    const uncapped = inputsFor();
    const needed = solveForward(6, uncapped).buildings.goldMine.count;
    const capped = inputsFor({ maxGoldMines: Math.ceil(needed) + 1 });

    const a = solveForward(6, uncapped);
    const b = solveForward(6, capped);
    for (const building of BUILDINGS) {
      expect(b.buildings[building].count).toBeCloseTo(a.buildings[building].count, 12);
    }
    expect(b.soldierLevels.level1).toBe(0);
  });

  it("derives the gold bar cap from the gold mine rate", () => {
    const inputs = inputsFor({ maxGoldMines: 3 });
    expect(goldBarCapPerMinute(inputs)).toBeCloseTo(
      3 * outputRatePerMinute("goldMine", inputs.civ),
      12
    );
  });

  it("kinks exactly where the capped mines are used up", () => {
    const inputs = inputsFor({ maxGoldMines: 3 });
    const [kink] = breakpointsInSoldierRate(inputs);
    expect(kink).toBeCloseTo(saturationRate(inputs), 12);
    expect(solveForward(kink, inputs).buildings.goldMine.count).toBeCloseTo(3, 9);
  });

  describe.each(CIVILIZATION_IDS)("%s", (civId) => {
    const inputs = inputsFor({ civ: civilizationById(civId), maxGoldMines: 4 });
    const beyond = saturationRate(inputs) * 3;
    const solution = solveForward(beyond, inputs);
    const uncapped = solveForward(beyond, { ...inputs, maxGoldMines: undefined });

    it("never builds more gold mines than the cap", () => {
      expect(solution.buildings.goldMine.count).toBeCloseTo(4, 9);
    });

    it("spends all the gold on T3s and makes the rest level 1", () => {
      expect(solution.soldierLevels.level3).toBeCloseTo(saturationRate(inputs), 9);
      expect(solution.soldierLevels.level1).toBeCloseTo(
        beyond - saturationRate(inputs),
        9
      );
      expect(solution.soldierLevels.level3 + solution.soldierLevels.level1).toBeCloseTo(
        solution.soldiersPerMinute,
        12
      );
    });

    it("still gives every soldier a weapon", () => {
      for (const building of ["weaponSmith", "ironSmelt", "ironMine"] as const) {
        expect(solution.buildings[building].count).toBeCloseTo(
          uncapped.buildings[building].count,
          9
        );
      }
    });

    it("shrinks the gold and coal chains relative to no cap", () => {
      for (const building of [...GOLD_CHAIN, "coalMine"] as const) {
        expect(solution.buildings[building].count).toBeLessThan(
          uncapped.buildings[building].count
        );
      }
    });
  });

  it("with a cap of zero, recruits only level 1 and builds no gold chain", () => {
    const solution = solveForward(10, inputsFor({ maxGoldMines: 0 }));
    expect(solution.soldierLevels).toEqual({ level3: 0, level1: 10 });
    for (const building of GOLD_CHAIN) expect(solution.buildings[building].count).toBe(0);
    expect(solution.buildings.weaponSmith.count).toBeGreaterThan(0);
  });

  it("never decreases any building count as the target rises", () => {
    const inputs = inputsFor({ maxGoldMines: 2, doubleIronMines: 3 });
    let previous = solveForward(0, inputs);
    for (let t = 0.25; t < 40; t += 0.25) {
      const next = solveForward(t, inputs);
      for (const building of BUILDINGS) {
        expect(next.buildings[building].count).toBeGreaterThanOrEqual(
          previous.buildings[building].count - 1e-9
        );
      }
      previous = next;
    }
  });
});

describe("inverse under a gold mine cap", () => {
  const targets = [0.5, 3, 9, 25];
  const configs: Partial<SolverInputs>[] = [
    { maxGoldMines: 2 },
    { maxGoldMines: 5, doubleIronMines: 2 },
    { maxGoldMines: 0, toolSmiths: 2, stone: { kind: "mineCount", count: 3 } },
  ];

  describe.each(configs)("%o", (overrides) => {
    const inputs = inputsFor(overrides);
    const saturation = saturationRate(inputs);

    for (const target of targets) {
      // Past saturation the gold chain is flat, so it pins no target.
      const invertible = ANCHOR_BUILDINGS.filter(
        (b) => target <= saturation || !GOLD_CHAIN.includes(b)
      );

      it.each(invertible)(`round-trips through %s (target ${target})`, (building) => {
        const count = solveForward(target, inputs).buildings[building].count;
        if (count <= 0) return;
        const back = solveInverse(building, count, inputs);
        expect(back.soldiersPerMinute).toBeCloseTo(target, 9);
      });
    }

    it("agrees with the bisection oracle", () => {
      for (const target of targets) {
        const count = solveForward(target, inputs).buildings.grainFarm.count;
        expect(solveInverse("grainFarm", count, inputs).soldiersPerMinute).toBeCloseTo(
          bisectForward("grainFarm", count, inputs),
          6
        );
      }
    });
  });

  it("flags gold mines beyond the cap as unable to pin a target", () => {
    const solved = solveInverse("goldMine", 5, inputsFor({ maxGoldMines: 3 }));
    expect(solved.warnings).toContainEqual({ kind: "unconstrainedAnchor", building: "goldMine" });
  });
});
