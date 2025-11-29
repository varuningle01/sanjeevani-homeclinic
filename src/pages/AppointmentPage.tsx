import type React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export default function Appointment() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    problem: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Appointment request:", formData);
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <div className="py-12 bg-[#F4FAFB] min-h-screen">
        <div className="max-w-lg mx-auto px-4">
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#0B7A75] mb-3">
            {t("appointment.title")}
          </h1>

          <p className="text-center text-gray-600 mb-10">
            {t("appointment.subtitle")}
          </p>

          {/* Form Container */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 space-y-5 transition"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("appointment.name")}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-[#0B7A75] focus:border-[#0B7A75] outline-none transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("appointment.phone")}
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-[#0B7A75] focus:border-[#0B7A75] outline-none transition"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("appointment.date")}
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-[#0B7A75] focus:border-[#0B7A75] outline-none transition"
              />
            </div>

            {/* Problem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("appointment.problem")}
              </label>
              <textarea
                required
                rows={4}
                value={formData.problem}
                onChange={(e) =>
                  setFormData({ ...formData, problem: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-[#0B7A75] focus:border-[#0B7A75] outline-none transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0B7A75] text-white py-3 rounded-lg text-lg font-semibold 
              hover:bg-[#085f5a] transition"
            >
              {t("appointment.submit")}
            </button>
          </form>

          {/* Success Message */}
          {submitted && (
            <div className="mt-6">
              <div className="bg-[#E6F7F7] border border-[#0B7A75]/30 text-[#0B7A75] rounded-xl p-4 text-center shadow-sm">
                <p className="font-semibold text-lg">
                  {t("appointment.successTitle")}
                </p>
                <p className="text-sm mt-1">
                  {t("appointment.successMessage")}
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
