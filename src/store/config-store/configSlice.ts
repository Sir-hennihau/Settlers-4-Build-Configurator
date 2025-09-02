import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { CivilizationType } from "../../types/civilization";

export interface ConfigState {
  soldiersPerMinute: number;
  selectedCivilization: CivilizationType;
}

const initialState: ConfigState = {
  soldiersPerMinute: 1,
  selectedCivilization: "romans",
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setSoldiersPerMinute: (state, action: PayloadAction<number>) => {
      state.soldiersPerMinute = action.payload;
    },
    setSelectedCivilization: (
      state,
      action: PayloadAction<CivilizationType>
    ) => {
      state.selectedCivilization = action.payload;
    },
  },
});

export const { setSoldiersPerMinute, setSelectedCivilization } =
  configSlice.actions;

export const selectConfig = (state: RootState) => state.config;

export default configSlice.reducer;
