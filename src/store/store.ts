import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import configSlice from "./config-store/configSlice";
import buildingRequirementsSlice from "./building-requirements/buildingRequirementsSlice";

/** Redux store configuration */
export const store = configureStore({
  reducer: {
    config: configSlice,
    buildingRequirements: buildingRequirementsSlice,
  },
});

/** Type for dispatch actions */
export type AppDispatch = typeof store.dispatch;

/** Type for the root state */
export type RootState = ReturnType<typeof store.getState>;

/** Type for async thunk actions */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
