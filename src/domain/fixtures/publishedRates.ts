import { CivilizationId } from "../data/civilizations";
import { Building } from "../model/buildings";

/**
 * The published "Ressource/min" table, transcribed independently of
 * `civilizations.ts`, as [in, out] pairs.
 *
 * This is the external ground truth the derived model is checked against. Grain
 * farm and waterworks use the [opt] rows; "trojans" is the Ubo column. The
 * fisher is absent from the source table and is checked separately by ratio.
 *
 * Vikings stoneMine.in is listed here as 0.736, which is the value the table
 * gives; the repository's old `vikingsConfig.ts` had 0.722, the coal mine's
 * figure, copied in by mistake.
 */
export type PublishedRates = Record<
  CivilizationId,
  Partial<Record<Building, readonly [number, number]>>
>;

export const PUBLISHED_RATES: PublishedRates = {
  romans: {
    grainFarm: [1.768, 1.768],
    mill: [4.519, 4.519],
    bakery: [1.728, 1.728],
    animalRanch: [2.006, 1.504],
    butcher: [4.747, 4.747],
    waterworks: [5.909, 5.909],
    stoneMine: [0.782, 2.934],
    coalMine: [0.722, 5.417],
    ironMine: [0.782, 2.934],
    goldMine: [0.799, 2.247],
    goldSmelt: [2.807, 2.807],
    ironSmelt: [2.986, 2.986],
    weaponSmith: [2.167, 2.167],
    toolSmith: [2.744, 2.744],
  },
  vikings: {
    grainFarm: [1.724, 1.724],
    mill: [3.772, 3.772],
    bakery: [2.051, 2.051],
    animalRanch: [2.419, 1.815],
    butcher: [3.894, 3.894],
    waterworks: [5.121, 5.121],
    stoneMine: [0.736, 2.761],
    coalMine: [0.722, 5.417],
    ironMine: [0.736, 2.761],
    goldMine: [0.799, 2.247],
    goldSmelt: [3.029, 3.029],
    ironSmelt: [3.107, 3.107],
    weaponSmith: [2.592, 2.592],
    toolSmith: [2.904, 2.904],
  },
  maya: {
    grainFarm: [1.757, 1.757],
    mill: [3.565, 3.565],
    bakery: [2.134, 2.134],
    animalRanch: [3.298, 2.473],
    butcher: [4.082, 4.082],
    waterworks: [5.951, 5.951],
    stoneMine: [0.704, 2.641],
    coalMine: [0.663, 4.971],
    ironMine: [0.709, 2.657],
    goldMine: [0.74, 2.081],
    goldSmelt: [2.649, 2.649],
    ironSmelt: [2.265, 2.265],
    weaponSmith: [2.002, 2.002],
    toolSmith: [2.241, 2.241],
  },
  trojans: {
    grainFarm: [1.841, 1.841],
    mill: [4.142, 4.142],
    bakery: [2.139, 2.139],
    animalRanch: [2.833, 2.125],
    butcher: [5.868, 5.868],
    waterworks: [7.222, 7.222],
    stoneMine: [0.736, 2.761],
    coalMine: [0.663, 4.971],
    ironMine: [0.736, 2.761],
    goldMine: [0.768, 2.161],
    goldSmelt: [2.041, 2.041],
    ironSmelt: [2.515, 2.515],
    weaponSmith: [2.247, 2.247],
    toolSmith: [2.632, 2.632],
  },
};

/**
 * The single input resource of each tabulated building, for checking derived
 * input rates. Buildings with several inputs consume each at the same rate, so
 * one representative input is enough; buildings with none are omitted.
 */
export const REPRESENTATIVE_INPUT: Partial<Record<Building, string>> = {
  mill: "grain",
  bakery: "wheat",
  animalRanch: "grain",
  butcher: "animal",
  stoneMine: "bread",
  coalMine: "bread",
  ironMine: "meat",
  goldMine: "fish",
  goldSmelt: "goldOre",
  ironSmelt: "ironOre",
  weaponSmith: "ironBar",
  toolSmith: "ironBar",
};
