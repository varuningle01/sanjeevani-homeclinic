import { configureStore } from "@reduxjs/toolkit";
import clinicReducer from "../store/slices/clinicSlice";
import authReducer from "../store/slices/authSlice";

export const store = configureStore({
  reducer: {
    clinic: clinicReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
