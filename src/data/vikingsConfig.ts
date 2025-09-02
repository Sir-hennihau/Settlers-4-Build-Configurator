// Vikings civilization production rates
import { CivilizationProductionRate } from "../types/production";

export const vikingsProductionConfig: CivilizationProductionRate = {
  grainFarm: { in: 1.654, out: 1.654 }, // Getreidefarm
  mill: { in: 3.772, out: 3.772 }, // Mühle
  bakery: { in: 2.051, out: 2.051 }, // Bäcker
  animalFarm: { in: 2.419, out: 1.815 }, // Tierzucht [in/out]
  butcher: { in: 3.894, out: 3.894 }, // Metzger
  waterworks: { in: 5.121, out: 5.121 }, // Wasserwerk [opt]
  coalMine: { in: 0.722, out: 5.417 }, // Kohlemine [in/out]
  ironMine: { in: 0.736, out: 2.761 }, // Eisenmine [in/out]
  goldMine: { in: 0.799, out: 2.247 }, // Goldmine [in/out]
  goldSmelt: { in: 3.029, out: 3.029 }, // Goldschmelze
  ironSmelt: { in: 3.107, out: 3.107 }, // Eisenschmelze
  weaponSmith: { in: 2.592, out: 2.592 }, // Waffenschmiede
};
