import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { romansProductionConfig } from "../data/romansConfig";
import { Building, Resource } from "../types/production";
import { setBuildingRequirements } from "./building-requirements/buildingRequirementsSlice";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const getT3SolderProductionPerMinutePerResourceType = (
  resource: Resource,
  amount: number
) => {
  switch (resource) {
    case "coal":
      return (romansProductionConfig.coalMine.out / coalPerSoldier) * amount;

    case "ironOre":
      return (romansProductionConfig.ironMine.out / ironOrePerSoldier) * amount;

    case "goldBar":
      return (
        (romansProductionConfig.goldMine.out / goldBarsPerSoldier) * amount
      );

    case "ironBar":
      return (
        (romansProductionConfig.ironSmelt.out / ironBarsPerSoldier) * amount
      );

    case "goldBar":
      return (
        (romansProductionConfig.goldSmelt.out / goldBarsPerSoldier) * amount
      );

    case "meat":
      return (romansProductionConfig.butcher.out / meatPerSoldier) * amount;

    case "bread":
      return (romansProductionConfig.bakery.out / breadPerSoldier) * amount;

    case "animal":
      return (
        (romansProductionConfig.animalFarm.out / animalPerSoldier) * amount
      );

    case "weat":
      return (romansProductionConfig.mill.out / weatPerSoldier) * amount;

    case "grain":
      return (romansProductionConfig.grainFarm.out / grainPerSoldier) * amount;

    case "water":
      return (romansProductionConfig.waterworks.out / waterPerSoldier) * amount;
  }
};

const getBuildingAmountFromT3PerMinute = (building: Building, t3pm: number) => {
  switch (building) {
    case "grainFarm":
      return (t3pm * grainPerSoldier) / romansProductionConfig.grainFarm.out;
    case "mill":
      return (t3pm * weatPerSoldier) / romansProductionConfig.mill.out;
    case "bakery":
      return (t3pm * breadPerSoldier) / romansProductionConfig.bakery.out;
    case "animalFarm":
      return (t3pm * animalPerSoldier) / romansProductionConfig.animalFarm.out;
    case "butcher":
      return (t3pm * meatPerSoldier) / romansProductionConfig.butcher.out;
    case "waterworks":
      return (t3pm * waterPerSoldier) / romansProductionConfig.waterworks.out;
    case "coalMine":
      return (t3pm * coalPerSoldier) / romansProductionConfig.coalMine.out;
    case "ironMine":
      return (t3pm * ironOrePerSoldier) / romansProductionConfig.ironMine.out;
    case "goldMine":
      return (t3pm * goldOrePerSoldier) / romansProductionConfig.goldMine.out;

    case "goldSmelt":
      return (t3pm * goldBarsPerSoldier) / romansProductionConfig.goldSmelt.out;
    case "ironSmelt":
      return (t3pm * ironBarsPerSoldier) / romansProductionConfig.ironSmelt.out;
    case "weaponSmith":
      // If you have a weaponPerSoldier constant, use it here; otherwise, set to 0 or appropriate logic
      return (
        (t3pm * weaponsPerSoldier) / romansProductionConfig.weaponSmith.out
      );

    default:
      console.log("0 returned");
      return 0;
  }
};

const coalPerSoldier = 4;
const ironOrePerSoldier = 1;
const goldOrePerSoldier = 2;
const ironBarsPerSoldier = 1;
const goldBarsPerSoldier = 2;
const weaponsPerSoldier = 1;

const meatPerSoldier =
  romansProductionConfig.ironMine.in / romansProductionConfig.ironMine.out;
console.log("meatPerSoldier", meatPerSoldier);

const breadPerSoldier =
  (romansProductionConfig.coalMine.in / romansProductionConfig.coalMine.out) *
  coalPerSoldier;
console.log("breadPerSoldier", breadPerSoldier);

const animalPerSoldier = meatPerSoldier;
const weatPerSoldier = breadPerSoldier;

const waterPerSoldier = meatPerSoldier + weatPerSoldier;

console.log("waterPerSoldier", waterPerSoldier);

const grainPerSoldier = meatPerSoldier + weatPerSoldier;
console.log("grainPerSoldier", grainPerSoldier);

// Get all building amounts for a given soldiersPerMinute value
export const getAllBuildingAmountsFromT3PerMinute = (
  soldiersPerMinute: number
) => ({
  grainFarms: getBuildingAmountFromT3PerMinute("grainFarm", soldiersPerMinute),
  animalFarms: getBuildingAmountFromT3PerMinute(
    "animalFarm",
    soldiersPerMinute
  ),
  waterworks: getBuildingAmountFromT3PerMinute("waterworks", soldiersPerMinute),
  mills: getBuildingAmountFromT3PerMinute("mill", soldiersPerMinute),
  bakeries: getBuildingAmountFromT3PerMinute("bakery", soldiersPerMinute),
  butchers: getBuildingAmountFromT3PerMinute("butcher", soldiersPerMinute),
  coalMines: getBuildingAmountFromT3PerMinute("coalMine", soldiersPerMinute),
  ironMines: getBuildingAmountFromT3PerMinute("ironMine", soldiersPerMinute),
  goldMines: getBuildingAmountFromT3PerMinute("goldMine", soldiersPerMinute),

  goldSmelts: getBuildingAmountFromT3PerMinute("goldSmelt", soldiersPerMinute),
  ironSmelts: getBuildingAmountFromT3PerMinute("ironSmelt", soldiersPerMinute),
  weaponSmiths: getBuildingAmountFromT3PerMinute(
    "weaponSmith",
    soldiersPerMinute
  ),
});
