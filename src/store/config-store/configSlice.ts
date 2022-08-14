import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../store/store";

export interface ConfigState {
  soldiersPerMinute: number;
}

const initialState: ConfigState = {
  soldiersPerMinute: 1,
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
