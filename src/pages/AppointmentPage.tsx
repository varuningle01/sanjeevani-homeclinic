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

  // Appointment form UI
  return (
    <>
      <Navbar />
      <div className="py-12">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            {t("appointment.title")}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="space-y-4">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent 
                outline-none transition"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent 
                outline-none transition"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent 
                outline-none transition"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-red-500 focus:border-transparent 
                outline-none transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold 
              hover:bg-red-700 transition-colors duration-200"
              >
                {t("appointment.submit")}
              </button>
            </div>
          </form>
          {submitted && (
            <div className="mt-6">
              <div className="max-w-md mx-auto px-4">
                <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg p-4 text-center shadow-sm">
                  <p className="font-semibold">
                    {t("appointment.successTitle")}
                  </p>
                  <p className="text-sm mt-1">
                    {t("appointment.successMessage")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
