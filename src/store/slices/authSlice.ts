import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

const savedAuth = localStorage.getItem("adminAuth");

const initialState: AuthState = savedAuth
  ? JSON.parse(savedAuth)
  : {
      isAuthenticated: false,
      username: null,
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ username: string; password: string }>
    ) => {
      const { username, password } = action.payload;

      if (username === "admin" && password === "sanjeevani123") {
        state.isAuthenticated = true;
        state.username = username;
        localStorage.setItem("adminAuth", JSON.stringify(state));
      } else {
        state.isAuthenticated = false;
        state.username = null;
        localStorage.removeItem("adminAuth");
      }
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      localStorage.removeItem("adminAuth");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
