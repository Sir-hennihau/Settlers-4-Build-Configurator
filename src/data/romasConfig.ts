// Romas civilization production rates (English building names, in/out combined)
import { CivilizationProductionRate } from "../types/production";

export const romasProductionConfig: CivilizationProductionRate = {
  grainFarm: { in: 1.768, out: 1.768, producedGood: "grain" },
  mill: { in: 4.519, out: 4.519, producedGood: "weat" },
  bakery: { in: 1.728, out: 1.728, producedGood: "bread" },
  animalFarm: { in: 2.006, out: 1.504, producedGood: "animal" },
  butcher: { in: 4.747, out: 4.747, producedGood: "meat" },
  waterworks: { in: 5.909, out: 5.909, producedGood: "water" },
  coalMine: { in: 0.687, out: 6.87, producedGood: "coal" },
  ironMine: { in: 0.687, out: 6.87, producedGood: "ironOre" },
  goldMine: { in: 0.687, out: 6.87, producedGood: "goldOre" },
  goldSmelt: { in: 2.807, out: 2.807, producedGood: "goldBar" },
  ironSmelt: { in: 2.986, out: 2.986, producedGood: "ironBar" },
  weaponSmith: { in: 2.167, out: 2.167, producedGood: "weapon" },
  barracks: { in: 1, out: 1, producedGood: "soldierT3" },
  fishery: { in: 1, out: 1, producedGood: "fish" },
};
