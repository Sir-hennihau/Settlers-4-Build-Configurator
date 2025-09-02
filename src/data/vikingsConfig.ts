import { CivilizationProductionRate } from "../types/production";

/** Vikings civilization production rates */
export const vikingsProductionConfig: CivilizationProductionRate = {
  grainFarm: { in: 1.724, out: 1.724 },
  mill: { in: 3.772, out: 3.772 },
  bakery: { in: 2.051, out: 2.051 },
  animalFarm: { in: 2.419, out: 1.815 },
  butcher: { in: 3.894, out: 3.894 },
  waterworks: { in: 5.121, out: 5.121 },
  stoneMine: { in: 0.722, out: 2.761 },
  coalMine: { in: 0.722, out: 5.417 },
  ironMine: { in: 0.736, out: 2.761 },
  goldMine: { in: 0.799, out: 2.247 },
  goldSmelt: { in: 3.029, out: 3.029 },
  ironSmelt: { in: 3.107, out: 3.107 },
  weaponSmith: { in: 2.592, out: 2.592 },
};
