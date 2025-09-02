import { CivilizationProductionRate } from "../types/production";

/** Romans civilization production rates */
export const romansProductionConfig: CivilizationProductionRate = {
  grainFarm: { in: 1.768, out: 1.768 },
  mill: { in: 4.519, out: 4.519 },
  bakery: { in: 1.728, out: 1.728 },
  animalFarm: { in: 2.006, out: 1.504 },
  butcher: { in: 4.747, out: 4.747 },
  waterworks: { in: 5.909, out: 5.909 },
  coalMine: { in: 0.722, out: 5.417 },
  ironMine: { in: 0.782, out: 2.934 },
  goldMine: { in: 0.799, out: 2.247 },
  goldSmelt: { in: 2.807, out: 2.807 },
  ironSmelt: { in: 2.986, out: 2.986 },
  weaponSmith: { in: 2.167, out: 2.167 },
};
