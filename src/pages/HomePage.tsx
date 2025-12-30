import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useTenant } from "../context/TenantContext";
import doctorPhotoDefault from "../assets/prashant-doctor.png";

/* --- Service Images (High-Quality) --- */
const serviceData = [
  {
    key: "psoriasis",
    image:
      "https://ysm-res.cloudinary.com/image/upload/c_fill,f_auto,g_faces:auto,h_960,q_auto,w_1280/v1/yms/prod/010ce533-5df6-441b-9d1d-3ef2a21aeadc",
  },
  {
    key: "vitiligo",
    image:
      "https://my.clevelandclinic.org/-/scassets/images/org/health/articles/12419-vitiligo",
  },
  {
    key: "eczema",
    image:
      "https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/visual_guide_to_eczema_slideshow/1800ss_science_source_rm_eczema_on_hand.jpg",
  },
  {
    key: "acne",
    image:
      "https://www.news-medical.net/image-handler/picture/2017/3/shutterstock_459808462.jpg",
  },
  {
    key: "skinAllergy",
    image:
      "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2022/10/types-rashes-slide42.jpg",
  },
  {
    key: "fungal",
    image:
      "https://media.post.rvohealth.io/wp-content/uploads/2020/08/648x364_Ringworm_Body_Tinea_Corporis.jpg",
  },
  {
    key: "hairfall",
    image:
      "https://my.clevelandclinic.org/-/scassets/images/org/health/articles/24515-male-pattern-baldness",
  },
  {
    key: "urticaria",
    image: "https://www.houstonent.com/hubfs/shutterstock_2021018495%20(1).jpg",
  },
];

function HomePage() {
  const { t } = useTranslation();
  const { config } = useTenant();

  const services = config?.services?.length ? config.services : serviceData.map(s => ({
    title: t(`services.${s.key}`),
    image: s.image,
    description: ""
  }));

  const doctorImage = config?.assets?.doctorImage || doctorPhotoDefault;

  return (
    <div className="bg-primaryLight w-full min-h-screen">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="py-16 bg-gradient-to-br from-primaryLight via-white to-white">
        <div className="max-w-[1300px] mx-auto px-4 md:px-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div>
            <p className="text-primary font-semibold text-sm mb-2">
              {t("welcome")}
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
              {config?.clinicName || "My Homeo Clinic"}
            </h1>

            <h2 className="text-xl text-primary font-semibold mb-2">
              {config?.doctorName || "Dr. Homeo"}
            </h2>

            <p className="text-gray-700 mb-4">{config?.specialization || "Homeopathic Specialist"}</p>

            <p className="text-gray-900 text-lg font-medium mb-8">
              {t("hero.tagline")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/appointment"
                className="bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primaryHover transition font-medium"
              >
                {t("hero.cta")}
              </Link>

              <Link
                to="/about"
                className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primaryLight transition font-medium"
              >
                {t("hero.learnMore")}
              </Link>
            </div>
          </div>

          {/* Doctor Image */}
          <div className="flex justify-center">
            <div className="w-64 h-80 md:w-80 md:h-96 bg-white border border-primaryLight rounded-3xl overflow-hidden shadow-xl">
              <img
                src={doctorImage}
                alt={config?.doctorName}
                className="w-full h-full object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x500?text=Doctor+Image"; // Fallback
                }}
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
            {t("services.title")}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-primaryLight shadow-sm hover:shadow-lg transition-all"
              >
                <img
                  src={item.image || "https://via.placeholder.com/300x200?text=Service"} 
                  alt={item.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-t-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image"; 
                }}
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
            {t("appointment.title")}
          </h2>
          <p className="mb-8 text-white/90">{t("hero.subtitle")}</p>

          <Link
            to="/appointment"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold shadow hover:bg-primaryLight transition"
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
