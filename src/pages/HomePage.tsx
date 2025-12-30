import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTenant } from "../context/TenantContext";
import labels from "../locales/en-us.json";
import fallbackValues from "../locales/fallback-values.json";
import { serviceData } from "../data/serviceData";

function HomePage() {
  const { config } = useTenant();

  const services = config?.services?.length
    ? config.services
    : serviceData.map((s) => ({
        title: s.key + " service",
        image: s.image,
        description: "",
      }));

  return (
    <div className="bg-primaryLight w-full min-h-screen">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="py-16 bg-gradient-to-br from-primaryLight via-white to-white">
        <div className="max-w-[1300px] mx-auto px-4 md:px-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div>
            <p className="text-primary font-semibold text-sm mb-2">
              {labels.welcome}
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
              {config?.clinicName || fallbackValues.clinicName}
            </h1>

            <h2 className="text-xl text-primary font-semibold mb-2">
              {config?.doctorName || fallbackValues.doctorName}
            </h2>

            <p className="text-gray-700 mb-4">
              {config?.specialization || fallbackValues.specialization}
            </p>

            <p className="text-gray-900 text-lg font-medium mb-8">
              {labels.hero.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/appointment"
                className="bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primaryHover transition font-medium"
              >
                {labels.hero.cta}
              </Link>

              <Link
                to="/about"
                className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primaryLight transition font-medium"
              >
                {labels.hero.learnMore}
              </Link>
            </div>
          </div>

          {/* Doctor Image */}
          <div className="flex justify-center">
            <div className="w-64 h-80 md:w-80 md:h-96 bg-white border border-primaryLight rounded-3xl overflow-hidden shadow-xl">
              <img
                src={config?.assets?.doctorImage || fallbackValues.doctorImage}
                alt="Doctor Image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      {services.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-[1300px] mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
              {labels.services.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {services.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-primaryLight shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={item.image || fallbackValues.serviceImage}
                    alt={item.title}
                    className="w-full h-40 sm:h-48 object-cover rounded-t-2xl"
                  />
                  <p className="p-4 font-semibold text-gray-900">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CTA STRIP ================= */}
      <section className="py-16 bg-gradient-to-r from-primary to-primaryHover text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {labels.appointment.title}
          </h2>
          <p className="mb-8 text-white/90">{labels.hero.subtitle}</p>

          <Link
            to="/appointment"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold shadow hover:bg-primaryLight transition"
          >
            {labels.hero.cta}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
