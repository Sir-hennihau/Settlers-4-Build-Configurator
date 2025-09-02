import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import configSlice from "./config-store/configSlice";
import buildingRequirementsSlice from "./building-requirements/buildingRequirementsSlice";

export const store = configureStore({
  reducer: {
    config: configSlice,
    buildingRequirements: buildingRequirementsSlice,
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
