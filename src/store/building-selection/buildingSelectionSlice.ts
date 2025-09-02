import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { BuildingType } from "../../types/production";

export interface BuildingSelectionState {
  selectedBuilding: BuildingType | null;
  buildingAmount: number;
}

const initialState: BuildingSelectionState = {
  selectedBuilding: null,
  buildingAmount: 1,
};

export const buildingSelectionSlice = createSlice({
  name: "buildingSelection",
  initialState,
  reducers: {
    setSelectedBuilding: (state, action: PayloadAction<BuildingType>) => {
      state.selectedBuilding = action.payload;
    },
    setBuildingAmount: (state, action: PayloadAction<number>) => {
      state.buildingAmount = action.payload;
    },
    resetSelection: (state) => {
      state.selectedBuilding = null;
      state.buildingAmount = 1;
    },
  },
});

export const { setSelectedBuilding, setBuildingAmount, resetSelection } =
  buildingSelectionSlice.actions;

export const selectBuildingSelection = (state: RootState) =>
  state.buildingSelection;

export default buildingSelectionSlice.reducer;
