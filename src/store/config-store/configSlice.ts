import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../store/store";

export interface ConfigState {
  amount: number;
}

const initialState: ConfigState = {
  amount: 1,
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
  },
});

export const { setAmount } = configSlice.actions;

export const selectConfig = (state: RootState) => state.config;

export default configSlice.reducer;
