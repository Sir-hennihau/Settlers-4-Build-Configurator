import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { ProductionChain } from "../../types/production";
import { romasProductionConfig } from "../../data/romasConfig";

export interface ConfigState {
  soldiersPerMinute: number;
  productionChain: ProductionChain;
}

const initialState: ConfigState = {
  soldiersPerMinute: 1,
  productionChain: [
    {
      building: "grainFarm",
      inputs: [],
      outputs: [{ resource: "grain", amount: 1 }],
    },
    {
      building: "waterworks",
      inputs: [],
      outputs: [{ resource: "water", amount: 1 }],
    },
    {
      building: "animalFarm",
      inputs: [
        {
          resource: "grain",
          amount:
            romasProductionConfig.animalFarm.in /
            romasProductionConfig.animalFarm.out,
        },
        {
          resource: "water",
          amount:
            romasProductionConfig.animalFarm.in /
            romasProductionConfig.animalFarm.out,
        },
      ],
      outputs: [{ resource: "animal", amount: 1 }],
    },
    {
      building: "butcher",
      inputs: [{ resource: "animal", amount: 1 }],
      outputs: [{ resource: "meat", amount: 1 }],
    },
    {
      building: "mill",
      inputs: [{ resource: "grain", amount: 1 }],
      outputs: [{ resource: "weat", amount: 1 }],
    },
    {
      building: "bakery",
      inputs: [
        { resource: "weat", amount: 1 },
        { resource: "water", amount: 1 },
      ],
      outputs: [{ resource: "bread", amount: 1 }],
    },
    {
      building: "coalMine",
      inputs: [
        {
          resource: "bread",
          amount:
            romasProductionConfig.coalMine.in /
            romasProductionConfig.coalMine.out,
        },
      ],
      outputs: [{ resource: "coal", amount: 1 }],
    },
    {
      building: "ironMine",
      inputs: [
        {
          resource: "meat",
          amount:
            romasProductionConfig.ironMine.in /
            romasProductionConfig.ironMine.out,
        },
      ],
      outputs: [{ resource: "ironOre", amount: 1 }],
    },
    {
      building: "goldMine",
      inputs: [
        {
          resource: "fish",
          amount:
            romasProductionConfig.goldMine.in /
            romasProductionConfig.goldMine.out,
        },
      ],
      outputs: [{ resource: "goldOre", amount: 1 }],
    },
    {
      building: "ironSmelt",
      inputs: [
        { resource: "coal", amount: 1 },
        { resource: "ironOre", amount: 1 },
      ],
      outputs: [{ resource: "ironBar", amount: 1 }],
    },
    {
      building: "weaponSmith",
      inputs: [
        { resource: "coal", amount: 1 },
        { resource: "ironBar", amount: 1 },
      ],
      outputs: [{ resource: "weapon", amount: 1 }],
    },
    {
      building: "goldSmelt",
      inputs: [
        { resource: "coal", amount: 1 },
        { resource: "goldOre", amount: 1 },
      ],
      outputs: [{ resource: "goldBar", amount: 1 }],
    },
    {
      building: "fishery",
      inputs: [],
      outputs: [{ resource: "fish", amount: 1 }],
    },
    {
      building: "barracks",
      inputs: [
        { resource: "weapon", amount: 1 },
        { resource: "goldBar", amount: 2 },
      ],
      outputs: [{ resource: "soldierT3", amount: 1 }],
    },
  ],
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setSoldiersPerMinute: (state, action: PayloadAction<number>) => {
      state.soldiersPerMinute = action.payload;
    },
  },
});

export const { setSoldiersPerMinute } = configSlice.actions;

export const selectConfig = (state: RootState) => state.config;

export default configSlice.reducer;
