export interface AppointmentData {
  name: string;
  phone: string;
  appointmentTime: string; // ISO string
  problem: string;
}

const API_URL = "http://localhost:5000/api/appointments";

export const bookAppointment = async (data: AppointmentData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to book appointment");
  }

  return result;
};

export const fetchBookedSlots = async (date: string) => {
  const response = await fetch(`${API_URL}/slots?date=${date}`);
  if (!response.ok) {
    throw new Error("Failed to fetch slots");
  }
  return await response.json();
};
