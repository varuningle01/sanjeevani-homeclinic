import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import doctorPhoto from "../assets/prashant-doctor.png";
import { FiCheckCircle } from "react-icons/fi";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />

      {/* PAGE WRAPPER */}
      <div className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          {/* Page Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#0B7A75]">
            {t("about.title")}
          </h1>
          <p className="text-gray-600 text-center mt-2 mb-12">
            {t("about.subtitle")}
          </p>

          {/* DOCTOR CARD */}
          <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200">
            <div className="md:flex">
              {/* Doctor Image */}
              <div className="md:w-1/3 bg-gray-100">
                <img
                  src={doctorPhoto}
                  alt={t("doctor.name")}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              {/* Doctor Info */}
              <div className="md:w-2/3 p-8">
                <h2 className="text-2xl font-bold text-[#0B7A75] mb-1">
                  {t("doctor.name")}
                </h2>

                <p className="text-gray-600 text-sm mb-4">
                  {t("doctor.qualification")}
                </p>

                {/* Stats */}
                <div className="flex gap-10 mb-6">
                  <div>
                    <p className="text-3xl font-extrabold text-[#0B7A75]">
                      {t("doctor.experienceYears")}+
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("about.experience")}
                    </p>
                  </div>

                  <div>
                    <p className="text-3xl font-extrabold text-[#0B7A75]">
                      {t("doctor.patientsTreated")}+
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("about.patients")}
                    </p>
                  </div>
                </div>

                {/* About Doctor */}
                <p className="text-gray-700 leading-relaxed">
                  {t("doctor.about")}
                </p>
              </div>
            </div>
          </div>

          {/* SPECIALIZATIONS SECTION */}
          <div className="mt-14">
            <h3 className="text-2xl font-bold text-[#0B7A75] mb-6">
              {t("services.title")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                "eczema",
                "psoriasis",
                "skinAllergy",
                "acne",
                "vitiligo",
                "hairfall",
                "fungal",
                "urticaria",
              ].map((key) => (
                <div
                  key={key}
                  className="flex items-center gap-3 bg-[#F4FAFB] border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <FiCheckCircle className="text-[#0B7A75] text-2xl" />
                  <p className="font-medium text-gray-800">
                    {t(`services.${key}`)}
                  </p>
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
