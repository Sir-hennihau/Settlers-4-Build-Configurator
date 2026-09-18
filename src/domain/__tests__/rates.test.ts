import {
  CIVILIZATION_IDS,
  CivilizationId,
  civilizationById,
} from "../data/civilizations";
import { Building } from "../model/buildings";
import {
  GOLD_MINES_PER_FISHER,
  inputRatePerMinute,
  outputRatePerMinute,
  TICKS_PER_MINUTE,
} from "../model/rates";
import { Resource } from "../model/resources";
import { PUBLISHED_RATES, REPRESENTATIVE_INPUT } from "../fixtures/publishedRates";

/**
 * The highest-value test in the suite. Every per-minute figure the app uses is
 * derived from one tick number per building plus the shared recipe ratios, so a
 * wrong tick value, a wrong ratio, or a wrong batch size all surface here — and
 * across four independent civilizations at once.
 *
 * Tolerance is +/-0.001 rather than exact truncation because the published table
 * is inconsistent about it: of the 112 cells, 18 are rounded and 38 truncated
 * (e.g. vikings animalRanch out 1.81475 is published as 1.815, while romans
 * butcher 4.74759 is published as 4.747).
 */
const TOLERANCE = 0.001;

/**
 * Jest's `toBeCloseTo(x, 3)` asserts a difference below 0.0005, which is
 * stricter than the table's own precision. Assert the stated tolerance instead.
 */
function expectWithinTolerance(actual: number, expected: number, label: string): void {
  const delta = Math.abs(actual - expected);
  if (delta > TOLERANCE) {
    throw new Error(
      `${label}: model ${actual.toFixed(6)} vs published ${expected} (delta ${delta.toFixed(6)})`
    );
  }
  expect(delta).toBeLessThanOrEqual(TOLERANCE);
}

describe.each(CIVILIZATION_IDS)("%s rates", (civId: CivilizationId) => {
  const civ = civilizationById(civId);
  const published = PUBLISHED_RATES[civId];
  const buildings = Object.keys(published) as Building[];

  test.each(buildings)("%s output rate matches the published table", (building) => {
    const [, expected] = published[building] as readonly [number, number];
    expectWithinTolerance(outputRatePerMinute(building, civ), expected, `${civId}.${building}.out`);
  });

  test.each(buildings.filter((b) => REPRESENTATIVE_INPUT[b]))(
    "%s input rate is derived correctly from the recipe ratio",
    (building) => {
      const [expected] = published[building] as readonly [number, number];
      const input = REPRESENTATIVE_INPUT[building] as Resource;
      expectWithinTolerance(
        inputRatePerMinute(building, input, civ),
        expected,
        `${civId}.${building}.in`
      );
    }
  );

  it("keeps every published cell inside the stated tolerance", () => {
    const offenders: string[] = [];
    for (const building of buildings) {
      const [pubIn, pubOut] = published[building] as readonly [number, number];
      if (Math.abs(outputRatePerMinute(building, civ) - pubOut) > TOLERANCE) {
        offenders.push(`${building}.out`);
      }
      const input = REPRESENTATIVE_INPUT[building] as Resource | undefined;
      if (input && Math.abs(inputRatePerMinute(building, input, civ) - pubIn) > TOLERANCE) {
        offenders.push(`${building}.in`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("supplies exactly 1.5 gold mines per fisher hut", () => {
    const fishPerFisher = outputRatePerMinute("fisher", civ);
    const fishPerGoldMine = inputRatePerMinute("goldMine", "fish", civ);
    expect(fishPerFisher / fishPerGoldMine).toBeCloseTo(GOLD_MINES_PER_FISHER, 12);
  });

  it("models the animal ranch as a three-unit batch", () => {
    // 1685/3 is not an integer, so storing ticks-per-unit-output would lose
    // exactness. If anyone "simplifies" unitsPerCycle away, this fails.
    expect(civ.timings.animalRanch.unitsPerCycle).toBe(3);
  });
});

describe("tick constant", () => {
  it("is 60000/71", () => {
    expect(TICKS_PER_MINUTE).toBeCloseTo(845.0704225352113, 10);
  });

  it("cancels out of every building-count ratio", () => {
    // Ratios depend only on relative rates, so the absolute tick constant is
    // irrelevant to everything except the soldiers-per-minute figure itself.
    const civ = civilizationById("romans");
    const ratio =
      outputRatePerMinute("coalMine", civ) / outputRatePerMinute("ironMine", civ);
    expect(ratio).toBeCloseTo(288 / 156, 12);
  });
});
