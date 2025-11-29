import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import doctorPhoto from "../assets/prashant-doctor.png";

const AboutPage = () => {
  const { t } = useTranslation();
  const doctor = useSelector((state: RootState) => state.clinic.doctor);
  return (
    <>
      <Navbar />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <h1 className="text-3xl font-bold text-center mb-2">
            {t("about.title")}
          </h1>
          <p className="text-gray-600 text-center mb-12">
            {t("about.subtitle")}
          </p>

          {/* Doctor Profile */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={doctorPhoto}
                  alt={doctor.name}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">
                  {doctor.name}
                </h2>
                <p className="text-gray-600 mb-4">{doctor.qualification}</p>

                <div className="flex gap-6 mb-6">
                  <div>
                    <p className="text-2xl font-bold text-[var(--primary)]">
                      {doctor.experience}+
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("about.experience")}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--primary)]">
                      {doctor.patientsCount.toLocaleString()}+
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("about.patients")}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6">{t("services.title")}</h3>
            <div className="grid grid-cols-2 gap-4">
              {["eczema", "psoriasis", "skinAllergy", "acne"].map((key) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[var(--primary)]">
                    {t(`services.${key}`)}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
