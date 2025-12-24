export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];

  // Define shifts
  const shifts = [
    { start: 10, end: 13 }, // Morning: 10:00 - 13:00
    { start: 18, end: 21 }, // Evening: 18:00 - 21:00
  ];

  shifts.forEach(({ start, end }) => {
    let startTime = new Date();
    startTime.setHours(start, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(end, 0, 0, 0);

    while (startTime < endTime) {
      slots.push(startTime.toTimeString().slice(0, 5));
      startTime.setMinutes(startTime.getMinutes() + 15);
    }
  });

  return slots;
};

export const isValidPhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

export const formatIsoToHHMM = (isoString: string): string => {
  const d = new Date(isoString);
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const isTimeSlotDisabled = (
  time: string,
  bookedSlots: string[],
  selectedDate: string
): boolean => {
  if (bookedSlots.includes(time)) return true;

  if (selectedDate) {
    const today = new Date();
    const dateObj = new Date(selectedDate);
    
    // Check if it's today
    if (dateObj.toDateString() === today.toDateString()) {
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);

      // Disable past slots
      if (slotTime < today) return true;
    }
  }
  return false;
};
