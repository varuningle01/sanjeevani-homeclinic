import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import doctorPhoto from "../assets/prashant-doctor.png";

function HomePage() {
  const { t } = useTranslation();
  const doctor = useSelector((state: RootState) => state.clinic.doctor);

  return (
    <div className="bg-white w-full">
      <Navbar />

      {/* HERO */}
      <section className="py-12 md:py-20">
        <div className="w-full px-4 md:px-10 grid md:grid-cols-2 gap-12 items-center max-w-[1300px] mx-auto">
          {/* Left Text */}
          <div>
            <p className="text-primary font-semibold text-sm mb-2">
              {t("welcome")}
            </p>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              {t("clinicName")}
            </h1>

            <h2 className="text-xl text-primary font-semibold mb-2">
              {doctor.name}
            </h2>

            <p className="text-gray-700 mb-4">{t("specialization")}</p>

            <p className="text-gray-800 text-lg mb-8">{t("hero.tagline")}</p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/appointment"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primaryDark transition"
              >
                {t("hero.cta")}
              </Link>

              <Link
                to="/about"
                className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition"
              >
                {t("hero.learnMore")}
              </Link>
            </div>
          </div>

          {/* Doctor Image */}
          <div className="flex justify-center">
            <div className="w-64 h-80 md:w-80 md:h-96 bg-gray-100 rounded-2xl overflow-hidden shadow">
              <img
                src={doctorPhoto}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALIZATIONS */}
      <section className="py-16 bg-gray-50">
        <div className="w-full max-w-[1300px] mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">{t("services.title")}</h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🩹", label: t("services.eczema") },
              { icon: "🔬", label: t("services.psoriasis") },
              { icon: "💊", label: t("services.skinAllergy") },
              { icon: "🌿", label: t("services.acne") },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold">{item.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">{t("appointment.title")}</h2>

          <p className="mb-8 text-white/90">{t("hero.subtitle")}</p>

          <Link
            to="/appointment"
            className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary/90 transition"
          >
            {t("hero.cta")}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
