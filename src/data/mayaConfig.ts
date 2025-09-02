import { CivilizationProductionRate } from "../types/production";

export const mayaProductionConfig: CivilizationProductionRate = {
  grainFarm: {
    in: 1.757, // Getreidefarm - when no [out] specified, in/out are the same
    out: 1.757,
  },
  mill: {
    in: 3.565, // Mühle - when no [out] specified, in/out are the same
    out: 3.565,
  },
  bakery: {
    in: 2.134, // Bäcker - when no [out] specified, in/out are the same
    out: 2.134,
  },
  animalFarm: {
    in: 3.298, // Tierzucht [in]
    out: 2.473, // Tierzucht [out]
  },
  butcher: {
    in: 4.082, // Metzger - when no [out] specified, in/out are the same
    out: 4.082,
  },
  waterworks: {
    in: 5.951, // Wasserwerk [opt] - when no [out] specified, in/out are the same
    out: 5.951,
  },
  coalMine: {
    in: 0.663, // Kohlemine [in]
    out: 4.971, // Kohlemine [out]
  },
  ironMine: {
    in: 0.709, // Eisenmine [in]
    out: 2.657, // Eisenmine [out]
  },
  goldMine: {
    in: 0.74, // Goldmine [in]
    out: 2.081, // Goldmine [out]
  },
  goldSmelt: {
    in: 2.649, // Goldschmelze - when no [out] specified, in/out are the same
    out: 2.649,
  },
  ironSmelt: {
    in: 2.265, // Eisenschmelze - when no [out] specified, in/out are the same
    out: 2.265,
  },
  weaponSmith: {
    in: 2.002, // Waffenschmiede - when no [out] specified, in/out are the same
    out: 2.002,
  },
};
