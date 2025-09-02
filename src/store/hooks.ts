import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { romasProductionConfig } from "../data/romasConfig";
import { Building, Resource } from "../types/production";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useResources = (resource: Resource, amount: number) => {
  const soldiersPerMinute =
    getT3SolderProductionPerMinutePerResourceType(resource, amount) || 0;

  const allBuildingsConfig =
    getAllBuildingAmountsFromT3PerMinute(soldiersPerMinute);
};

const getT3SolderProductionPerMinutePerResourceType = (
  resource: Resource,
  amount: number
) => {
  switch (resource) {
    case "coal":
      return (
        (romasProductionConfig.coalMine.out.amount / coalPerSoldier) * amount
      );

    case "ironOre":
      return (
        (romasProductionConfig.ironMine.out.amount / ironOrePerSoldier) * amount
      );

    case "goldBar":
      return (
        (romasProductionConfig.goldMine.out.amount / goldBarsPerSoldier) *
        amount
      );

    case "ironBar":
      return (
        (romasProductionConfig.ironSmelt.out.amount / ironBarsPerSoldier) *
        amount
      );

    case "goldBar":
      return (
        (romasProductionConfig.goldSmelt.out.amount / goldBarsPerSoldier) *
        amount
      );

    case "meat":
      return (
        (romasProductionConfig.butcher.out.amount / meatPerSoldier) * amount
      );

    case "bread":
      return (
        (romasProductionConfig.bakery.out.amount / breadPerSoldier) * amount
      );

    case "animal":
      return (
        (romasProductionConfig.animalFarm.out.amount / animalPerSoldier) *
        amount
      );

    case "weat":
      return (romasProductionConfig.mill.out.amount / weatPerSoldier) * amount;

    case "grain":
      return (
        (romasProductionConfig.grainFarm.out.amount / grainPerSoldier) * amount
      );

    case "water":
      return (
        (romasProductionConfig.waterworks.out.amount / waterPerSoldier) * amount
      );
  }
};

const getBuildingAmountFromT3PerMinute = (building: Building, t3pm: number) => {
  switch (building) {
    case "grainFarm":
      return (
        (t3pm * grainPerSoldier) / romasProductionConfig.grainFarm.out.amount
      );
    case "mill":
      return (t3pm * weatPerSoldier) / romasProductionConfig.mill.out.amount;
    case "bakery":
      return (t3pm * breadPerSoldier) / romasProductionConfig.bakery.out.amount;
    case "animalFarm":
      return (
        (t3pm * animalPerSoldier) / romasProductionConfig.animalFarm.out.amount
      );
    case "butcher":
      return (t3pm * meatPerSoldier) / romasProductionConfig.butcher.out.amount;
    case "waterworks":
      return (
        (t3pm * waterPerSoldier) / romasProductionConfig.waterworks.out.amount
      );
    case "coalMine":
      return (
        (t3pm * coalPerSoldier) / romasProductionConfig.coalMine.out.amount
      );
    case "ironMine":
      return (
        (t3pm * ironOrePerSoldier) / romasProductionConfig.ironMine.out.amount
      );
    case "goldMine":
      return (
        (t3pm * goldOrePerSoldier) / romasProductionConfig.goldMine.out.amount
      );
    case "goldSmelt":
      return (
        (t3pm * goldBarsPerSoldier) / romasProductionConfig.goldSmelt.out.amount
      );
    case "ironSmelt":
      return (
        (t3pm * ironBarsPerSoldier) / romasProductionConfig.ironSmelt.out.amount
      );
    case "weaponSmith":
      // If you have a weaponPerSoldier constant, use it here; otherwise, set to 0 or appropriate logic
      return (
        (t3pm * weaponsPerSoldier) /
        romasProductionConfig.weaponSmith.out.amount
      );
    default:
      return 0;
  }
};

const coalPerSoldier = 4;
const ironOrePerSoldier = 1;
const goldOrePerSoldier = 2;
const ironBarsPerSoldier = 1;
const goldBarsPerSoldier = 2;
const weaponsPerSoldier = 1;

const meatPerSoldier = ironOrePerSoldier / 10;

const breadPerSoldier = coalPerSoldier / 10;
const fishPerSoldier = goldOrePerSoldier / 10;

const animalPerSoldier = meatPerSoldier;
const weatPerSoldier = breadPerSoldier;

const waterPerSoldier = animalPerSoldier + weatPerSoldier;
const grainPerSoldier = animalPerSoldier + weatPerSoldier;

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
