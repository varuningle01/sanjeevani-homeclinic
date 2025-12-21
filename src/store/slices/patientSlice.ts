import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Patient,
  PatientWithHistory,
  PatientsState,
  CreatePatientData,
  UpdatePatientData,
  AddVisitData,
} from '../../admin/types/patient.types';
import * as patientService from '../../admin/services/patientService';

const initialState: PatientsState = {
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetchAll',
  async () => {
    return await patientService.getAllPatients();
  }
);

export const fetchPatientById = createAsyncThunk(
  'patients/fetchById',
  async (id: string) => {
    return await patientService.getPatientById(id);
  }
);

export const createPatient = createAsyncThunk(
  'patients/create',
  async (data: CreatePatientData) => {
    return await patientService.createPatient(data);
  }
);

export const updatePatient = createAsyncThunk(
  'patients/update',
  async ({ id, data }: { id: string; data: UpdatePatientData }) => {
    return await patientService.updatePatient(id, data);
  }
);

export const deletePatient = createAsyncThunk(
  'patients/delete',
  async (id: string) => {
    await patientService.deletePatient(id);
    return id;
  }
);

export const addPatientVisit = createAsyncThunk(
  'patients/addVisit',
  async ({ patientId, data }: { patientId: string; data: AddVisitData }) => {
    return await patientService.addVisit(patientId, data);
  }
);

// Slice
const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all patients
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<Patient[]>) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      });

    // Fetch patient by ID
    builder
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action: PayloadAction<PatientWithHistory | null>) => {
        state.loading = false;
        state.selectedPatient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patient';
      });

    // Create patient
    builder
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        state.patients.push(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create patient';
      });

    // Update patient
    builder
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading = false;
        const index = state.patients.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        // Update selected patient if it's the same one
        if (state.selectedPatient?.id === action.payload.id) {
          state.selectedPatient = {
            ...state.selectedPatient,
            ...action.payload,
          };
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update patient';
      });

    // Delete patient
    builder
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.patients = state.patients.filter(p => p.id !== action.payload);
        if (state.selectedPatient?.id === action.payload) {
          state.selectedPatient = null;
        }
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete patient';
      });

    // Add visit
    builder
      .addCase(addPatientVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPatientVisit.fulfilled, (state, action) => {
        state.loading = false;
        // Add visit to selected patient if loaded
        if (state.selectedPatient && state.selectedPatient.id === action.payload.patientId) {
          state.selectedPatient.visits.push(action.payload);
        }
      })
      .addCase(addPatientVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add visit';
      });
  },
});

export const { clearSelectedPatient, clearError } = patientSlice.actions;
export default patientSlice.reducer;
