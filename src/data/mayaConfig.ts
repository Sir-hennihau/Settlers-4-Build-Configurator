import { CivilizationProductionRate } from "../types/production";

export const mayaProductionConfig: CivilizationProductionRate = {
  grainFarm: {
    in: 1.757, // Getreidefarm - when no [out] specified, in/out are the same
    out: 1.757,
  },
  mill: {
    in: 3.565,
    out: 3.565,
  },
  bakery: {
    in: 2.134,
    out: 2.134,
  },
  animalFarm: {
    in: 3.298,
    out: 2.473,
  },
  butcher: {
    in: 4.082,
    out: 4.082,
  },
  waterworks: {
    in: 5.951,
    out: 5.951,
  },
  stoneMine: { in: 0.704, out: 2.641 },

  coalMine: {
    in: 0.663,
    out: 4.971,
  },
  ironMine: {
    in: 0.709,
    out: 2.657,
  },
  goldMine: {
    in: 0.74,
    out: 2.081,
  },
  goldSmelt: {
    in: 2.649,
    out: 2.649,
  },
  ironSmelt: {
    in: 2.265,
    out: 2.265,
  },
  weaponSmith: {
    in: 2.002,
    out: 2.002,
  },
};
