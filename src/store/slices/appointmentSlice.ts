import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppointmentsState } from '../../admin/types/appointment.types';
import { getAllAppointments, getAppointmentsByDate } from '../../admin/services/appointmentService';

const initialState: AppointmentsState = {
  appointments: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async () => {
    const appointments = await getAllAppointments();
    return appointments;
  }
);

export const fetchAppointmentsByDate = createAsyncThunk(
  'appointments/fetchByDate',
  async (date: string) => {
    const appointments = await getAppointmentsByDate(date);
    return appointments;
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.appointments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointments';
      })
      // Fetch appointments by date
      .addCase(fetchAppointmentsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointmentsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointments';
      });
  },
});

export const { clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
