// Appointment information
export interface Appointment {
  id: string;
  patientName: string;
  phoneNumber: string;
  appointmentDate: string; // ISO format date
  appointmentTime: string; // HH:MM format
  problem?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

// State interface for Redux
export interface AppointmentsState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}
