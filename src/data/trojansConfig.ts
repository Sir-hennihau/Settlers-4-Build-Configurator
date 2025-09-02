import { CivilizationProductionRate } from "../types/production";

export const trojansProductionConfig: CivilizationProductionRate = {
  grainFarm: {
    in: 1.841, // Getreidefarm - when no [out] specified, in/out are the same
    out: 1.841,
  },
  mill: {
    in: 4.142,
    out: 4.142,
  },
  bakery: {
    in: 2.139,
    out: 2.139,
  },
  animalFarm: {
    in: 2.833,
    out: 2.125,
  },
  butcher: {
    in: 5.868,
    out: 5.868,
  },
  waterworks: {
    in: 7.222,
    out: 7.222,
  },
  coalMine: {
    in: 0.663,
    out: 4.971,
  },
  ironMine: {
    in: 0.736,
    out: 2.761,
  },
  goldMine: {
    in: 0.768,
    out: 2.161,
  },
  goldSmelt: {
    in: 2.041,
    out: 2.041,
  },
  ironSmelt: {
    in: 2.515,
    out: 2.515,
  },
  weaponSmith: {
    in: 2.247,
    out: 2.247,
  },
};
