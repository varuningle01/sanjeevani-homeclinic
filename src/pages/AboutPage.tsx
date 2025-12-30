import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiCheckCircle } from "react-icons/fi";
import { useTenant } from "../context/TenantContext";
import labels from "../locales/en-us.json";
import fallbackValues from "../locales/fallback-values.json";

const AboutPage = () => {
  const { config } = useTenant();
  const services = config?.services?.length
    ? config.services
    : ["eczema", "psoriasis", "skinAllergy", "acne"].map((key) => ({
        title: (labels.services as any)[key] || key,
      }));

  return (
    <>
      <Navbar />

      {/* PAGE WRAPPER */}
      <div className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          {/* Page Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
            {labels.about.title}
          </h1>
          <p className="text-gray-600 text-center mt-2 mb-12">
            {labels.about.subtitle}
          </p>

          {/* DOCTOR CARD */}
          <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200">
            <div className="md:flex">
              {/* Doctor Image */}
              <div className="md:w-1/3 bg-gray-100">
                <img
                  src={
                    config?.assets?.doctorImage || fallbackValues.doctorImage
                  }
                  alt={labels.doctor.name}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              {/* Doctor Info */}
              <div className="md:w-2/3 p-8">
                <h2 className="text-2xl font-bold text-primary mb-1">
                  {config?.doctorName || fallbackValues.doctorName}
                </h2>

                <p className="text-gray-600 text-sm mb-4">
                  {config?.doctorQualification ||
                    fallbackValues.doctorQualification}
                </p>

                {/* Stats */}
                <div className="flex gap-10 mb-6">
                  <div>
                    <p className="text-3xl font-extrabold text-primary">
                      {config?.experienceYears ||
                        fallbackValues.experienceYears}
                      +
                    </p>
                    <p className="text-sm text-gray-600">
                      {labels.about.experience}
                    </p>
                  </div>

                  <div>
                    <p className="text-3xl font-extrabold text-primary">
                      {config?.patientsTreated ||
                        fallbackValues.patientsTreated}
                      +
                    </p>
                    <p className="text-sm text-gray-600">
                      {labels.about.patients}
                    </p>
                  </div>
                </div>

                {/* About Doctor */}
                <p className="text-gray-700 leading-relaxed">
                  {config?.aboutDoctor || fallbackValues.aboutDoctor}
                </p>
              </div>
            </div>
          </div>

          {/* SPECIALIZATIONS SECTION */}
          <div className="mt-14">
            <h3 className="text-2xl font-bold text-primary mb-6">
              {labels.services.title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-primaryLight border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <FiCheckCircle className="text-primary text-2xl" />
                  <p className="font-medium text-gray-800">{service.title}</p>
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
