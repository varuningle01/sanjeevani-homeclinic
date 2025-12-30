import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const savedAuth = localStorage.getItem("adminAuth");
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialState: AuthState = savedAuth
  ? JSON.parse(savedAuth)
  : {
      isAuthenticated: false,
      username: null,
      token: null,
      loading: false,
      error: null,
    };

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password, tenantId }: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, tenantId }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      return { username, token: data.token };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("adminAuth");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.username = action.payload.username;
        state.token = action.payload.token;
        localStorage.setItem("adminAuth", JSON.stringify(state));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
