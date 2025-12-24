// Patient basic information
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobileNumber: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Visit record with vital signs
export interface PatientVisit {
  id: string;
  patientId: string;
  visitDate: string;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  weight?: number; // in kg
  temperature?: number; // in °F or °C
  pulse?: number; // bpm
  height?: number; // in cm
  notes?: string;
  reports: MedicalReport[];
}

// Medical reports (images, PDFs, etc.)
export interface MedicalReport {
  id: string;
  visitId: string;
  fileName: string;
  fileType: 'image' | 'pdf' | 'other';
  fileUrl: string; // base64 or URL
  uploadedAt: string;
  description?: string;
  fileSize?: number; // in bytes
}

// Form data for creating a new patient
export interface CreatePatientData {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobileNumber: string;
  photo?: File | string; // File object or base64
}

// Form data for updating patient
export interface UpdatePatientData {
  name?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  mobileNumber?: string;
  photo?: File | string;
}

// Form data for updating a visit
export interface UpdateVisitData {
  visitDate?: string;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  weight?: number;
  temperature?: number;
  pulse?: number;
  height?: number;
  notes?: string;
  reports?: File[]; // New reports to add
  existingReports?: MedicalReport[]; // Existing reports to keep
}

// Form data for adding a visit
export interface AddVisitData {
  visitDate: string;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  weight?: number;
  temperature?: number;
  pulse?: number;
  height?: number;
  notes?: string;
  reports?: File[];
}

// Complete patient data with all visits
export interface PatientWithHistory extends Patient {
  visits: PatientVisit[];
}

// State interface for Redux
export interface PatientsState {
  patients: Patient[];
  selectedPatient: PatientWithHistory | null;
  loading: boolean;
  error: string | null;
}
