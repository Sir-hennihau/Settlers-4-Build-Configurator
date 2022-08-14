import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import configSlice from "./config-store/configSlice";

export const store = configureStore({
  reducer: {
    config: configSlice,
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
