import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

/** State interface for building requirements */
export interface BuildingRequirementsState {
  grainFarms: number;
  animalFarms: number;
  waterworks: number;
  mills: number;
  bakeries: number;
  butchers: number;
  coalMines: number;
  ironMines: number;
  goldMines: number;
  stoneMines: number;
  goldSmelts: number;
  ironSmelts: number;
  weaponSmiths: number;
  toolSmiths: number;
}

const initialState: BuildingRequirementsState = {
  grainFarms: 0,
  animalFarms: 0,
  waterworks: 0,
  mills: 0,
  bakeries: 0,
  butchers: 0,
  coalMines: 0,
  ironMines: 0,
  goldMines: 0,
  stoneMines: 0,
  goldSmelts: 0,
  ironSmelts: 0,
  weaponSmiths: 0,
  toolSmiths: 1,
};

/**
 * Redux slice for managing calculated building requirements
 * Stores the number of each building type needed for current production target
 */
export const buildingRequirementsSlice = createSlice({
  name: "buildingRequirements",
  initialState,
  reducers: {
    setBuildingRequirements: (
      state,
      action: PayloadAction<BuildingRequirementsState>
    ) => {
      return action.payload;
    },
    resetBuildingRequirements: () => {
      return initialState;
    },
  },
});

export const { setBuildingRequirements, resetBuildingRequirements } =
  buildingRequirementsSlice.actions;

export const selectBuildingRequirements = (state: RootState) =>
  state.buildingRequirements;

export default buildingRequirementsSlice.reducer;
