import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { Building, Resource } from "../types/production";
import { setBuildingRequirements } from "./building-requirements/buildingRequirementsSlice";
import { civilizationsConfig } from "../data/civilizationsConfig";
import { selectConfig } from "./config-store/configSlice";
import { useMemo } from "react";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useResources = (resource: Resource, amount: number) => {
  const dispatch = useAppDispatch();
  const { selectedCivilization } = useAppSelector(selectConfig);

  const soldiersPerMinute =
    getT3SolderProductionPerMinutePerResourceType(
      resource,
      amount,
      selectedCivilization
    ) || 0;

  const allBuildingsConfig = getAllBuildingAmountsFromT3PerMinute(
    soldiersPerMinute,
    selectedCivilization
  );

  // Update the store with calculated building requirements
  dispatch(setBuildingRequirements(allBuildingsConfig));

  return allBuildingsConfig;
};

export const getT3SolderProductionPerMinutePerResourceType = (
  resource: Resource,
  amount: number,
  civilization?: string
) => {
  const civConfig = civilization
    ? civilizationsConfig[civilization as keyof typeof civilizationsConfig]
    : civilizationsConfig.romans;

  // Calculate resource requirements for this civilization
  const coalPerSoldier = 4;
  const ironOrePerSoldier = 1;
  const goldOrePerSoldier = 2;
  const ironBarsPerSoldier = 1;
  const goldBarsPerSoldier = 2;
  const weaponsPerSoldier = 1;

  const meatPerSoldier = civConfig.ironMine.in / civConfig.ironMine.out;
  const breadPerSoldier =
    (civConfig.coalMine.in / civConfig.coalMine.out) * coalPerSoldier;
  const animalPerSoldier = meatPerSoldier;
  const weatPerSoldier = breadPerSoldier;
  const waterPerSoldier = meatPerSoldier + weatPerSoldier;
  const grainPerSoldier =
    (meatPerSoldier * civConfig.animalFarm.in) / civConfig.animalFarm.out +
    weatPerSoldier;

  switch (resource) {
    case "coal":
      return (civConfig.coalMine.out / coalPerSoldier) * amount;

    case "ironOre":
      return (civConfig.ironMine.out / ironOrePerSoldier) * amount;

    case "goldOre":
      return (civConfig.goldMine.out / goldBarsPerSoldier) * amount;

    case "ironBar":
      return (civConfig.ironSmelt.out / ironBarsPerSoldier) * amount;

    case "goldBar":
      return (civConfig.goldSmelt.out / goldBarsPerSoldier) * amount;

    case "weapon":
      return (civConfig.weaponSmith.out / weaponsPerSoldier) * amount;

    case "meat":
      return (civConfig.butcher.out / meatPerSoldier) * amount;

    case "bread":
      return (civConfig.bakery.out / breadPerSoldier) * amount;

    case "animal":
      return (civConfig.animalFarm.out / animalPerSoldier) * amount;

    case "weat":
      return (civConfig.mill.out / weatPerSoldier) * amount;

    case "grain":
      return (civConfig.grainFarm.out / grainPerSoldier) * amount;

    case "water":
      return (civConfig.waterworks.out / waterPerSoldier) * amount;
  }
};

const getBuildingAmountFromT3PerMinute = (
  building: Building,
  t3pm: number,
  civilization?: string
) => {
  const civConfig = civilization
    ? civilizationsConfig[civilization as keyof typeof civilizationsConfig]
    : civilizationsConfig.romans;

  // Calculate resource requirements for this civilization
  const coalPerSoldier = 4;
  const ironOrePerSoldier = 1;
  const goldOrePerSoldier = 2;
  const ironBarsPerSoldier = 1;
  const goldBarsPerSoldier = 2;
  const weaponsPerSoldier = 1;

  const meatPerSoldier = civConfig.ironMine.in / civConfig.ironMine.out;
  const breadPerSoldier =
    (civConfig.coalMine.in / civConfig.coalMine.out) * coalPerSoldier;
  const animalPerSoldier = meatPerSoldier;
  const weatPerSoldier = breadPerSoldier;
  const waterPerSoldier = meatPerSoldier + weatPerSoldier;
  const grainPerSoldier =
    (meatPerSoldier * civConfig.animalFarm.in) / civConfig.animalFarm.out +
    weatPerSoldier;

  console.log(
    "(t3pm * coalPerSoldier) / civConfig.coalMine.out",
    (t3pm * coalPerSoldier) / civConfig.coalMine.out
  );
  console.log(
    "t3pm, coalPerSoldier, civConfig.coalMine.out",
    t3pm,
    coalPerSoldier,
    civConfig.coalMine.out
  );

  switch (building) {
    case "grainFarm":
      return (t3pm * grainPerSoldier) / civConfig.grainFarm.out;
    case "mill":
      return (t3pm * weatPerSoldier) / civConfig.mill.out;
    case "bakery":
      return (t3pm * breadPerSoldier) / civConfig.bakery.out;
    case "animalFarm":
      return (t3pm * animalPerSoldier) / civConfig.animalFarm.out;
    case "butcher":
      return (t3pm * meatPerSoldier) / civConfig.butcher.out;
    case "waterworks":
      return (t3pm * waterPerSoldier) / civConfig.waterworks.out;
    case "coalMine":
      return (t3pm * coalPerSoldier) / civConfig.coalMine.out;
    case "ironMine":
      return (t3pm * ironOrePerSoldier) / civConfig.ironMine.out;
    case "goldMine":
      return (t3pm * goldOrePerSoldier) / civConfig.goldMine.out;
    case "goldSmelt":
      return (t3pm * goldBarsPerSoldier) / civConfig.goldSmelt.out;
    case "ironSmelt":
      return (t3pm * ironBarsPerSoldier) / civConfig.ironSmelt.out;
    case "weaponSmith":
      return (t3pm * weaponsPerSoldier) / civConfig.weaponSmith.out;
    default:
      console.log("0 returned");
      return 0;
  }
};

// Hook to calculate resource requirements per soldier based on civilization
export const useResourceRequirementsPerSoldier = (civilization?: string) => {
  return useMemo(() => {
    const civConfig = civilization
      ? civilizationsConfig[civilization as keyof typeof civilizationsConfig]
      : civilizationsConfig.romans;

    const coalPerSoldier = 4;
    const ironOrePerSoldier = 1;
    const goldOrePerSoldier = 2;
    const ironBarsPerSoldier = 1;
    const goldBarsPerSoldier = 2;
    const weaponsPerSoldier = 1;

    const meatPerSoldier = civConfig.ironMine.in / civConfig.ironMine.out;
    const breadPerSoldier =
      (civConfig.coalMine.in / civConfig.coalMine.out) * coalPerSoldier;
    const animalPerSoldier = meatPerSoldier;
    const weatPerSoldier = breadPerSoldier;
    const grainPerSoldier =
      (meatPerSoldier * civConfig.animalFarm.in) / civConfig.animalFarm.out +
      weatPerSoldier;
    const waterPerSoldier = grainPerSoldier;

    return {
      coalPerSoldier,
      ironOrePerSoldier,
      goldOrePerSoldier,
      ironBarsPerSoldier,
      goldBarsPerSoldier,
      weaponsPerSoldier,
      meatPerSoldier,
      breadPerSoldier,
      animalPerSoldier,
      weatPerSoldier,
      waterPerSoldier,
      grainPerSoldier,
    };
  }, [civilization]);
};

// Get all building amounts for a given soldiersPerMinute value
export const getAllBuildingAmountsFromT3PerMinute = (
  soldiersPerMinute: number,
  civilization?: string
) => ({
  grainFarms: getBuildingAmountFromT3PerMinute(
    "grainFarm",
    soldiersPerMinute,
    civilization
  ),
  animalFarms: getBuildingAmountFromT3PerMinute(
    "animalFarm",
    soldiersPerMinute,
    civilization
  ),
  waterworks: getBuildingAmountFromT3PerMinute(
    "waterworks",
    soldiersPerMinute,
    civilization
  ),
  mills: getBuildingAmountFromT3PerMinute(
    "mill",
    soldiersPerMinute,
    civilization
  ),
  bakeries: getBuildingAmountFromT3PerMinute(
    "bakery",
    soldiersPerMinute,
    civilization
  ),
  butchers: getBuildingAmountFromT3PerMinute(
    "butcher",
    soldiersPerMinute,
    civilization
  ),
  coalMines: getBuildingAmountFromT3PerMinute(
    "coalMine",
    soldiersPerMinute,
    civilization
  ),
  ironMines: getBuildingAmountFromT3PerMinute(
    "ironMine",
    soldiersPerMinute,
    civilization
  ),
  goldMines: getBuildingAmountFromT3PerMinute(
    "goldMine",
    soldiersPerMinute,
    civilization
  ),
  goldSmelts: getBuildingAmountFromT3PerMinute(
    "goldSmelt",
    soldiersPerMinute,
    civilization
  ),
  ironSmelts: getBuildingAmountFromT3PerMinute(
    "ironSmelt",
    soldiersPerMinute,
    civilization
  ),
  weaponSmiths: getBuildingAmountFromT3PerMinute(
    "weaponSmith",
    soldiersPerMinute,
    civilization
  ),
});
