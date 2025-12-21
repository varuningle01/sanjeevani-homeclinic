import { configureStore } from "@reduxjs/toolkit";
import clinicReducer from "../store/slices/clinicSlice";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import appointmentReducer from "../store/slices/appointmentSlice";

export const store = configureStore({
  reducer: {
    clinic: clinicReducer,
    auth: authReducer,
    patients: patientReducer,
    appointments: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
