import type { Appointment } from '../types/appointment.types';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const mapBackendToFrontend = (data: any): Appointment => {
  const dateObj = new Date(data.appointmentTime);
  const dateStr = dateObj.toISOString().split("T")[0];
  
  // Ensure timeStr is HH:mm format (sometimes toLocaleTimeString can vary based on locale)
  // Let's use getHours/getMinutes for consistency with previous logic
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const timeFormatted = `${hours}:${minutes}`;

  return {
    id: data._id,
    patientName: data.name,
    phoneNumber: data.phone,
    appointmentDate: dateStr,
    appointmentTime: timeFormatted,
    problem: data.problem,
    status: 'confirmed', // Default status as backend doesn't store it yet
    createdAt: data.createdAt,
  };
};

/**
 * Fetch all appointments
 */
export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    // Get token from auth state in local storage
    const savedAuth = localStorage.getItem("adminAuth");
    let token = "";
    if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        token = parsed.token;
    }

    const response = await fetch(`${API_URL}/appointments`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        throw new Error("Unauthorized");
    }
    
    if (!response.ok) {
        throw new Error("Failed to fetch appointments");
    }
    const data = await response.json();
    return data.map(mapBackendToFrontend);
  } catch (error) {
    console.error("Error in getAllAppointments:", error);
    throw error;
  }
};

/**
 * Fetch appointments by date range
 */
export const getAppointmentsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Appointment[]> => {
  // Currently backend does not support range query in GET /, so we fetch all and filter
  // Optimization: Implement backend range query later
  const all = await getAllAppointments();
  return all.filter(appointment => {
    const aptDate = new Date(appointment.appointmentDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return aptDate >= start && aptDate <= end;
  });
};

/**
 * Fetch appointments for a specific date
 */
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
   // Optimization: Backend could support ?date= query on GET /appointments
   const all = await getAllAppointments();
   return all.filter(apt => apt.appointmentDate === date);
};
