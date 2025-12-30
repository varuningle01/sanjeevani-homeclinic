import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  bookAppointment,
  fetchBookedSlots,
} from "../services/appointmentService";
import {
  generateTimeSlots,
  isValidPhone,
  isTimeSlotDisabled,
  formatIsoToHHMM,
} from "../utils/helpers";
import { useTenant } from "../context/TenantContext";
import labels from "../locales/en-us.json";

export default function Appointment() {
  const { config } = useTenant();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    problem: "",
  });

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Use helper to generate slots
  const allSlots = generateTimeSlots();

  useEffect(() => {
    if (formData.date) {
      const dateObj = new Date(formData.date);
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = days[dateObj.getDay()];
      const closedDay = config?.timings?.closedDay || "Sunday";

      if (dayName === closedDay) {
        setError(`Clinic is closed on ${closedDay}s`);
        setFormData({ ...formData, date: "" });
        return;
      } else {
        setError(null);
      }

      fetchBookedSlots(formData.date)
        .then((data: string[]) => {
          // Use helper to format
          const times = data.map(formatIsoToHHMM);
          setBookedSlots(times);
        })
        .catch((err) => console.error(err));
      setSelectedTime(null); // Reset selection on date change
    }
  }, [formData.date]);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    if (/^\d*$/.test(value)) {
      // Limit to 10 digits
      if (value.length <= 10) {
        setFormData({ ...formData, phone: value });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      setError("Please select a time slot");
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const appointmentTime = new Date(`${formData.date}T${selectedTime}`);

      await bookAppointment({
        name: formData.name,
        phone: formData.phone,
        appointmentTime: appointmentTime.toISOString(),
        problem: formData.problem,
      });

      setSubmitted(true);
      setFormData({ name: "", phone: "", date: "", problem: "" });
      setSelectedTime(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Navbar />

      <div className="py-12 bg-[#F4FAFB] min-h-screen">
        <div className="max-w-lg mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-3">
            {labels.appointment.title}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 space-y-5 transition"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {labels.appointment.name}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {labels.appointment.phone}
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {labels.appointment.date}
              </label>
              <input
                type="date"
                required
                min={today}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Slot Grid */}
            {formData.date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Slot (15 mins)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {allSlots.map((time) => {
                    const disabled = isTimeSlotDisabled(
                      time,
                      bookedSlots,
                      formData.date
                    );
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-1 text-sm rounded-md border text-center transition
                                 ${
                                   isSelected
                                     ? "bg-primary text-white border-primary"
                                     : disabled
                                     ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                     : "bg-white text-gray-700 hover:border-primary hover:text-primary"
                                 }
                               `}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {labels.appointment.problem}
              </label>
              <textarea
                required
                rows={4}
                value={formData.problem}
                onChange={(e) =>
                  setFormData({ ...formData, problem: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg text-lg font-semibold transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:opacity-90"
                }`}
            >
              {loading ? "Booking..." : labels.appointment.submit}
            </button>
          </form>

          {submitted && (
            <div className="mt-6">
              <div className="bg-primaryLight border border-primary/30 text-primary rounded-xl p-4 text-center shadow-sm">
                <p className="font-semibold text-lg">
                  {labels.appointment.successTitle}
                </p>
                <p className="text-sm mt-1">
                  {labels.appointment.successMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
