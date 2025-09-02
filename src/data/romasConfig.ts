// Romas civilization production rates (English building names, in/out combined)
import { CivilizationProductionRate } from "../types/production";

export const romasProductionConfig: CivilizationProductionRate = {
  grainFarm: {
    in: [],
    out: { resource: "grain", amount: 1.768 },
  },
  mill: {
    in: [{ resource: "grain", amount: 4.519 }],
    out: { resource: "weat", amount: 4.519 },
  },
  bakery: {
    in: [{ resource: "weat", amount: 1.728 }],
    out: { resource: "bread", amount: 1.728 },
  },
  animalFarm: {
    in: [
      { resource: "grain", amount: 2.006 },
      { resource: "water", amount: 2.006 },
    ],
    out: { resource: "animal", amount: 1.504 },
  },
  butcher: {
    in: [{ resource: "animal", amount: 4.747 }],
    out: { resource: "meat", amount: 4.747 },
  },
  waterworks: {
    in: [],
    out: { resource: "water", amount: 5.909 },
  },
  coalMine: {
    in: [],
    out: { resource: "coal", amount: 6.87 },
  },
  ironMine: {
    in: [],
    out: { resource: "ironOre", amount: 6.87 },
  },
  goldMine: {
    in: [],
    out: { resource: "goldOre", amount: 6.87 },
  },
  goldSmelt: {
    in: [
      { resource: "goldOre", amount: 2.807 },
      { resource: "coal", amount: 2.807 },
    ],
    out: { resource: "goldBar", amount: 2.807 },
  },
  ironSmelt: {
    in: [
      { resource: "ironOre", amount: 2.986 },
      { resource: "coal", amount: 2.986 },
    ],
    out: { resource: "ironBar", amount: 2.986 },
  },
  weaponSmith: {
    in: [
      { resource: "ironBar", amount: 2.167 },
      { resource: "coal", amount: 2.167 },
    ],
    out: { resource: "weapon", amount: 2.167 },
  },
};
