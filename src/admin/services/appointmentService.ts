import type { Appointment } from '../types/appointment.types';

// Mock data for development
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Rajesh Kumar',
    phoneNumber: '+91 98765 43210',
    appointmentDate: '2025-12-22',
    appointmentTime: '10:00',
    problem: 'Regular checkup and consultation',
    status: 'confirmed',
    createdAt: '2025-12-20T10:30:00Z',
  },
  {
    id: '2',
    patientName: 'Priya Sharma',
    phoneNumber: '+91 87654 32109',
    appointmentDate: '2025-12-22',
    appointmentTime: '11:30',
    problem: 'Follow-up for chronic headache',
    status: 'confirmed',
    createdAt: '2025-12-20T14:20:00Z',
  },
  {
    id: '3',
    patientName: 'Amit Patel',
    phoneNumber: '+91 76543 21098',
    appointmentDate: '2025-12-22',
    appointmentTime: '14:00',
    problem: 'Skin allergy consultation',
    status: 'pending',
    createdAt: '2025-12-21T09:15:00Z',
  },
  {
    id: '4',
    patientName: 'Sneha Desai',
    phoneNumber: '+91 65432 10987',
    appointmentDate: '2025-12-23',
    appointmentTime: '09:30',
    problem: 'Digestive issues',
    status: 'confirmed',
    createdAt: '2025-12-21T11:45:00Z',
  },
  {
    id: '5',
    patientName: 'Vikram Singh',
    phoneNumber: '+91 54321 09876',
    appointmentDate: '2025-12-23',
    appointmentTime: '15:00',
    problem: 'Joint pain and stiffness',
    status: 'pending',
    createdAt: '2025-12-21T16:30:00Z',
  },
  {
    id: '6',
    patientName: 'Meera Reddy',
    phoneNumber: '+91 43210 98765',
    appointmentDate: '2025-12-24',
    appointmentTime: '10:30',
    problem: 'Respiratory issues',
    status: 'confirmed',
    createdAt: '2025-12-21T18:00:00Z',
  },
  {
    id: '7',
    patientName: 'Arjun Mehta',
    phoneNumber: '+91 32109 87654',
    appointmentDate: '2025-12-24',
    appointmentTime: '13:00',
    status: 'pending',
    createdAt: '2025-12-21T20:15:00Z',
  },
  {
    id: '8',
    patientName: 'Kavita Joshi',
    phoneNumber: '+91 21098 76543',
    appointmentDate: '2025-12-25',
    appointmentTime: '11:00',
    problem: 'Anxiety and stress management',
    status: 'confirmed',
    createdAt: '2025-12-22T08:30:00Z',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all appointments
 */
export const getAllAppointments = async (): Promise<Appointment[]> => {
  await delay(500);
  return mockAppointments;
};

/**
 * Fetch appointments by date range
 */
export const getAppointmentsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Appointment[]> => {
  await delay(500);
  
  return mockAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return appointmentDate >= start && appointmentDate <= end;
  });
};

/**
 * Fetch appointments for a specific date
 */
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  await delay(500);
  
  return mockAppointments.filter(appointment => appointment.appointmentDate === date);
};
