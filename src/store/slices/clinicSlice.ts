import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import mockData from "../../data/mock-data.json";

interface Visit {
  date: string;
  notes: string;
  followUp: string;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  problem: string;
  lastVisit: string;
  visits: Visit[];
  images: string[];
}

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  date: string;
  problem: string;
  status: "pending" | "approved" | "cancelled";
}

interface GalleryItem {
  id: string;
  condition: string;
  beforeImage: string;
  afterImage: string;
}

interface ClinicState {
  isOnline: boolean;
  patients: Patient[];
  appointments: Appointment[];
  galleryItems: GalleryItem[];
  doctor: typeof mockData.doctor;
  clinic: typeof mockData.clinic;
}

const initialState: ClinicState = {
  isOnline: mockData.clinic.isOnline,
  patients: mockData.patients,
  appointments: mockData.appointments as Appointment[],
  galleryItems: mockData.galleryItems,
  doctor: mockData.doctor,
  clinic: mockData.clinic,
};

const clinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {
    setIsOnline(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
    updateAppointmentStatus(
      state,
      action: PayloadAction<{
        id: string;
        status: "pending" | "approved" | "cancelled";
      }>
    ) {
      const { id, status } = action.payload;
      const apt = state.appointments.find((a) => a.id === id);
      if (apt) apt.status = status;
    },
  },
});

export const { setIsOnline, updateAppointmentStatus } = clinicSlice.actions;
export default clinicSlice.reducer;
