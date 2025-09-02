import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import configSlice from "./config-store/configSlice";
import buildingSelectionSlice from "./building-selection/buildingSelectionSlice";

export const store = configureStore({
  reducer: {
    config: configSlice,
    buildingSelection: buildingSelectionSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
