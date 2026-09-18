import { civilizationById, CivilizationId } from "../data/civilizations";
import { Building } from "../model/buildings";
import { solve } from "../solve/solve";
import { SolverInputs } from "../solve/types";
import legacyCases from "../fixtures/legacy-regression.json";

/**
 * Pins the refactor against the behaviour of the pre-refactor implementation in
 * `store/hooks.ts`, captured before it was deleted.
 *
 * The fixture was harvested after two data/logic bugs in that implementation
 * were repaired, so it represents *corrected* legacy behaviour:
 *  - vikings stoneMine bread input was the coal mine's value (0.722 vs 0.736);
 *  - the toolsmith overhead computed butchers from `coalMine.in` (bread per
 *    coal mine) instead of `ironMine.in` (meat per iron mine).
 * With both fixed, the old forward and inverse functions agree with each other
 * to machine precision, which is what makes them a trustworthy reference.
 *
 * It was also harvested with the old civ configs regenerated from the tick
 * table, so both implementations use identical rates and the comparison is
 * exact rather than tolerance-bound.
 */

const BUILDING_OF_LEGACY_KEY: Record<string, Building> = {
  grainFarms: "grainFarm",
  waterworks: "waterworks",
  mills: "mill",
  animalFarms: "animalRanch",
  bakeries: "bakery",
  butchers: "butcher",
  coalMines: "coalMine",
  ironMines: "ironMine",
  goldMines: "goldMine",
  stoneMines: "stoneMine",
  ironSmelts: "ironSmelt",
  weaponSmiths: "weaponSmith",
  goldSmelts: "goldSmelt",
  toolSmiths: "toolSmith",
};

const ANCHOR_OF_LEGACY_RESOURCE: Record<string, Building> = {
  grain: "grainFarm",
  water: "waterworks",
  weat: "mill",
  bread: "bakery",
  animal: "animalRanch",
  meat: "butcher",
  coal: "coalMine",
  ironOre: "ironMine",
  goldOre: "goldMine",
  ironBar: "ironSmelt",
  weapon: "weaponSmith",
  goldBar: "goldSmelt",
};

interface LegacyCase {
  civ: string;
  resource: string;
  amount: number;
  stoneMines: number;
  toolSmiths: number;
  soldiersPerMinute: number;
  isSufficient: boolean;
  buildings: Record<string, number>;
}

const cases = legacyCases as LegacyCase[];

const inputsFor = (c: LegacyCase): SolverInputs => ({
  civ: civilizationById(c.civ as CivilizationId),
  toolSmiths: c.toolSmiths,
  stone: { kind: "mineCount", count: c.stoneMines },
  doubleIronMines: 0,
  doubleStoneMines: 0,
});

describe("legacy regression", () => {
  it("has a non-trivial fixture", () => {
    expect(cases.length).toBeGreaterThanOrEqual(10);
  });

  test.each(cases.map((c) => [`${c.civ}/${c.resource}x${c.amount}`, c] as const))(
    "%s reproduces the legacy solution",
    (_label, c) => {
      const anchor = ANCHOR_OF_LEGACY_RESOURCE[c.resource];
      const solved = solve(
        { kind: "building", building: anchor, count: c.amount },
        inputsFor(c)
      );

      expect(solved.soldiersPerMinute).toBeCloseTo(c.soldiersPerMinute, 9);
      expect(solved.isSufficient).toBe(c.isSufficient);

      for (const [legacyKey, expected] of Object.entries(c.buildings)) {
        const building = BUILDING_OF_LEGACY_KEY[legacyKey];
        const actual = solved.buildings[building].count;
        // Named explicitly so a failure says which building drifted.
        if (Math.abs(actual - expected) > 1e-9) {
          throw new Error(
            `${c.civ}/${c.resource}: ${building} = ${actual}, legacy = ${expected}`
          );
        }
        expect(actual).toBeCloseTo(expected, 9);
      }
    }
  );

  test.each(cases.map((c) => [`${c.civ}/${c.resource}x${c.amount}`, c] as const))(
    "%s round-trips through the anchor building",
    (_label, c) => {
      const anchor = ANCHOR_OF_LEGACY_RESOURCE[c.resource];
      const solved = solve(
        { kind: "building", building: anchor, count: c.amount },
        inputsFor(c)
      );
      expect(solved.buildings[anchor].count).toBeCloseTo(c.amount, 9);
    }
  );
});
