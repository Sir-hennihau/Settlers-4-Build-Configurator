import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { Building, Resource } from "../types/production";
import { civilizationsConfig } from "../data/civilizationsConfig";

/** Type-safe dispatch hook for Redux actions */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Type-safe selector hook for Redux state */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const getToolSmithAndStoneMineRequirements = (
  toolSmithAmount: number,
  stoneMineAmount: number,
  civilization: string | undefined
) => {
  const stoneMineRequirements = getStoneMineRequirements(
    stoneMineAmount,
    civilization
  );
  const toolSmithRequirements = getToolSmithRequirements(
    toolSmithAmount,
    civilization
  );

  return {
    bakeries: stoneMineRequirements.bakeries + toolSmithRequirements.bakeries,
    mills: stoneMineRequirements.mills + toolSmithRequirements.mills,
    waterworks:
      stoneMineRequirements.waterworks + toolSmithRequirements.waterWorks,
    grainFarms:
      stoneMineRequirements.grainFarms + toolSmithRequirements.grainFarms,
    ironSmelts: toolSmithRequirements.ironSmelts,
    coalMines: toolSmithRequirements.coalMines,
    ironMines: toolSmithRequirements.ironMines,
    butchers: toolSmithRequirements.butchers,
    animalFarms: toolSmithRequirements.animalFarms,
  };
};

const getToolSmithRequirements = (
  toolSmithAmount: number,
  civilization: string | undefined
) => {
  const civConfig = civilization
    ? civilizationsConfig[civilization as keyof typeof civilizationsConfig]
    : civilizationsConfig.romans;

  const ironSmelts =
    toolSmithAmount * (civConfig.toolSmith.in / civConfig.ironSmelt.out);

  const coalMines =
    toolSmithAmount * ((civConfig.toolSmith.in * 2) / civConfig.coalMine.out);
  const ironMines =
    toolSmithAmount * (civConfig.toolSmith.in / civConfig.ironMine.out);

  const bakeries = (coalMines * civConfig.coalMine.in) / civConfig.bakery.out;
  const mills = (bakeries * civConfig.bakery.out) / civConfig.mill.out;

  const butchers = (ironMines * civConfig.coalMine.in) / civConfig.butcher.out;
  const animalFarms =
    (butchers * civConfig.butcher.out) / civConfig.animalFarm.out;

  const grainFarms =
    (bakeries * civConfig.bakery.out) / civConfig.grainFarm.out +
    (animalFarms * civConfig.animalFarm.in) / civConfig.grainFarm.out;

  const waterWorks =
    (bakeries * civConfig.bakery.out) / civConfig.waterworks.out +
    (animalFarms * civConfig.animalFarm.in) / civConfig.waterworks.out;
  console.log("waterWorks", waterWorks);

  return {
    ironSmelts,
    coalMines,
    ironMines,
    bakeries,
    butchers,
    animalFarms,
    mills,
    waterWorks,
    grainFarms,
  };
};

const getStoneMineRequirements = (
  stoneMineAmount: number,
  civilization: string | undefined
) => {
  const civConfig = civilization
    ? civilizationsConfig[civilization as keyof typeof civilizationsConfig]
    : civilizationsConfig.romans;

  const bakeries =
    (stoneMineAmount * civConfig.stoneMine.in) / civConfig.bakery.out;

  const mills = (bakeries * civConfig.bakery.out) / civConfig.mill.out;

  const waterWorks =
    (bakeries * civConfig.bakery.out) / civConfig.waterworks.out;

  const grainFarms =
    (bakeries * civConfig.bakery.out) / civConfig.grainFarm.out;
  /*   console.log("bakeries asd", bakeries);
  console.log("mills", mills);
  console.log("waterworks", waterworks);
  console.log("grainFarms", grainFarms); */
  return {
    bakeries,
    mills,
    waterworks: waterWorks,
    grainFarms,
  };
};

export { getStoneMineRequirements };

/**
 * Calculates T3 soldier production per minute based on resource type, amount, and civilization
 * @param resource - The resource type being produced
 * @param amount - The amount of buildings producing this resource
 * @param civilization - The civilization (affects production rates)
 * @returns Number of T3 soldiers that can be produced per minute
 */
export const getT3SolderProductionPerMinutePerResourceType = (
  resource: Resource,
  amount: number,
  civilization?: string,
  stoneMineAmount = 0,
  toolSmithAmount = 0
) => {
  const {
    bakeries,
    mills,
    waterworks,
    grainFarms,
    ironMines,
    ironSmelts,
    coalMines,
    butchers,
    animalFarms,
  } = getToolSmithAndStoneMineRequirements(
    toolSmithAmount,
    stoneMineAmount,
    civilization
  );

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

  switch (resource) {
    case "coal": {
      const dynamicAmount = amount - coalMines;

      return {
        amount: (civConfig.coalMine.out / coalPerSoldier) * dynamicAmount,
        isSufficient: dynamicAmount >= 0,
      };
    }

    case "ironOre": {
      const dynamicAmount = amount - ironMines;

      return {
        amount: (civConfig.ironMine.out / ironOrePerSoldier) * dynamicAmount,
        isSufficient: dynamicAmount >= 0,
      };
    }

    case "goldOre":
      return {
        amount: (civConfig.goldMine.out / goldOrePerSoldier) * amount,
        isSufficient: true,
      };

    case "ironBar": {
      const dynamicAmount = amount - ironSmelts;

      return {
        amount: (civConfig.ironSmelt.out / ironBarsPerSoldier) * dynamicAmount,
        isSufficient: dynamicAmount >= 0,
      };
    }

    case "goldBar":
      return {
        amount: (civConfig.goldSmelt.out / goldBarsPerSoldier) * amount,
        isSufficient: true,
      };

    case "weapon":
      return {
        amount: (civConfig.weaponSmith.out / weaponsPerSoldier) * amount,
        isSufficient: true,
      };

    case "meat": {
      const dynamicAmount = amount - butchers;

      return {
        amount: (civConfig.butcher.out / meatPerSoldier) * dynamicAmount,
        isSufficient: dynamicAmount >= 0,
      };
    }

    case "bread": {
      const dynamicAmount = amount - bakeries;
      return {
        amount: (civConfig.bakery.out / breadPerSoldier) * dynamicAmount,
        isSufficient: dynamicAmount >= 0,
      };
    }

    case "animal": {
      const dynamicAmount = amount - animalFarms;

      return {
        amount: (civConfig.animalFarm.out / animalPerSoldier) * dynamicAmount,

        isSufficient: dynamicAmount >= 0,
      };
    }

    case "weat": {
      const dynamicAmount = amount - mills;
      return {
        amount: (civConfig.mill.out / weatPerSoldier) * dynamicAmount,
        isSufficient: dynamicAmount >= 0,
      };
    }

    case "grain": {
      const dynamicAmount = amount - grainFarms;
      return {
        amount: (civConfig.grainFarm.out / grainPerSoldier) * dynamicAmount,

        isSufficient: dynamicAmount >= 0,
      };
    }

    case "water": {
      const dynamicAmount = amount - waterworks;
      return {
        amount: (civConfig.waterworks.out / waterPerSoldier) * dynamicAmount,
        isSufficient: dynamicAmount >= 0,
      };
    }
  }
};

/**
 * Calculates the number of buildings needed to support a given T3 soldier production rate
 * @param building - The building type
 * @param t3pm - T3 soldiers per minute target
 * @param civilization - The civilization (affects production rates)
 * @returns Number of buildings needed
 */
const getBuildingAmountFromT3PerMinute = (
  building: Building,
  t3pm: number,
  civilization?: string,
  stoneMineAmount = 0,
  toolSmithsAmount = 0
) => {
  const civConfig = civilization
    ? civilizationsConfig[civilization as keyof typeof civilizationsConfig]
    : civilizationsConfig.romans;

  const coalPerSoldier = 4;
  const ironOrePerSoldier = 1;
  const goldOrePerSoldier = 2;
  const ironBarsPerSoldier = 1;
  const goldBarsPerSoldier = 2;
  const weaponsPerSoldier = 1;

  const coalPerTool = 2;

  const meatRequirement = civConfig.ironMine.in / civConfig.ironMine.out;
  const breadRequirementT3 =
    (civConfig.coalMine.in / civConfig.coalMine.out) * coalPerSoldier;
  const breadRequirementTool =
    (civConfig.coalMine.in / civConfig.coalMine.out) * coalPerTool;
  const animalRequirement = meatRequirement;

  const wheatRequirementT3 = breadRequirementT3;
  const wheatRequirementTool = breadRequirementTool;

  const grainRequirementT3 =
    (meatRequirement * civConfig.animalFarm.in) / civConfig.animalFarm.out +
    wheatRequirementT3;
  const grainRequirementTool =
    (meatRequirement * civConfig.animalFarm.in) / civConfig.animalFarm.out +
    wheatRequirementTool;

  const waterRequirementT3 = grainRequirementT3;
  const waterRequirementTool = grainRequirementTool;

  switch (building) {
    case "grainFarm":
      return (
        (t3pm * grainRequirementT3) / civConfig.grainFarm.out +
        toolSmithsAmount *
          grainRequirementTool *
          (civConfig.toolSmith.in / civConfig.grainFarm.out) +
        +(stoneMineAmount * civConfig.stoneMine.in) / civConfig.grainFarm.out
      );
    case "waterworks":
      return (
        (t3pm * waterRequirementT3) / civConfig.waterworks.out +
        toolSmithsAmount *
          waterRequirementTool *
          (civConfig.toolSmith.in / civConfig.waterworks.out) +
        +(stoneMineAmount * civConfig.stoneMine.in) / civConfig.waterworks.out
      );
    case "mill":
      return (
        (t3pm * wheatRequirementT3) / civConfig.mill.out +
        toolSmithsAmount *
          wheatRequirementTool *
          (civConfig.toolSmith.in / civConfig.mill.out) +
        +(stoneMineAmount * civConfig.stoneMine.in) / civConfig.mill.out
      );
    case "bakery":
      return (
        (t3pm * breadRequirementT3) / civConfig.bakery.out +
        toolSmithsAmount *
          breadRequirementTool *
          (civConfig.toolSmith.in / civConfig.bakery.out) +
        (stoneMineAmount * civConfig.stoneMine.in) / civConfig.bakery.out
      );
    case "animalFarm":
      return (
        (t3pm * animalRequirement) / civConfig.animalFarm.out +
        (toolSmithsAmount * animalRequirement * civConfig.toolSmith.in) /
          civConfig.animalFarm.out
      );
    case "butcher":
      return (
        (t3pm * meatRequirement) / civConfig.butcher.out +
        (toolSmithsAmount * meatRequirement * civConfig.toolSmith.in) /
          civConfig.butcher.out
      );

    case "coalMine":
      return (
        (t3pm * coalPerSoldier) / civConfig.coalMine.out +
        toolSmithsAmount *
          coalPerTool *
          (civConfig.toolSmith.in / civConfig.coalMine.out)
      );
    case "ironMine":
      return (
        (t3pm * ironOrePerSoldier) / civConfig.ironMine.out +
        toolSmithsAmount * (civConfig.toolSmith.in / civConfig.ironMine.out)
      );
    case "goldMine":
      return (t3pm * goldOrePerSoldier) / civConfig.goldMine.out;
    case "goldSmelt":
      return (t3pm * goldBarsPerSoldier) / civConfig.goldSmelt.out;
    case "ironSmelt":
      return (
        (t3pm * ironBarsPerSoldier) / civConfig.ironSmelt.out +
        (toolSmithsAmount * civConfig.toolSmith.in) / civConfig.ironSmelt.out
      );
    case "weaponSmith":
      return (t3pm * weaponsPerSoldier) / civConfig.weaponSmith.out;
    default:
      return 0;
  }
};

/**
 * Calculates all building requirements for a given T3 soldier production target
 * @param soldiersPerMinute - Target T3 soldiers per minute
 * @param civilization - The civilization type
 * @returns Object containing the number of each building type needed
 */
export const getAllBuildingAmountsFromT3PerMinute = (
  soldiersPerMinute: number,
  civilization?: string,
  stoneMineAmount = 0,
  toolSmithsAmount = 0
) => ({
  grainFarms: getBuildingAmountFromT3PerMinute(
    "grainFarm",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),

  waterworks: getBuildingAmountFromT3PerMinute(
    "waterworks",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),

  mills: getBuildingAmountFromT3PerMinute(
    "mill",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),
  animalFarms: getBuildingAmountFromT3PerMinute(
    "animalFarm",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),
  bakeries: getBuildingAmountFromT3PerMinute(
    "bakery",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),
  butchers: getBuildingAmountFromT3PerMinute(
    "butcher",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),
  coalMines: getBuildingAmountFromT3PerMinute(
    "coalMine",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),
  ironMines: getBuildingAmountFromT3PerMinute(
    "ironMine",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),
  goldMines: getBuildingAmountFromT3PerMinute(
    "goldMine",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),
  stoneMines: 0,

  ironSmelts: getBuildingAmountFromT3PerMinute(
    "ironSmelt",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),
  weaponSmiths: getBuildingAmountFromT3PerMinute(
    "weaponSmith",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),
  goldSmelts: getBuildingAmountFromT3PerMinute(
    "goldSmelt",
    soldiersPerMinute,
    civilization,
    stoneMineAmount,
    toolSmithsAmount
  ),
  toolSmiths: toolSmithsAmount,
});
