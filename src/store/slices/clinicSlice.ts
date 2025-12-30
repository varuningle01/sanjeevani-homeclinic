import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ClinicState {
  isOnline: boolean;
}

const initialState: ClinicState = {
  isOnline: true,
};

const clinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {
    setIsOnline(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
  },
});

export const { setIsOnline } = clinicSlice.actions;
export default clinicSlice.reducer;
