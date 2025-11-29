import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import doctorPhoto from "../assets/prashant-doctor.png";

const serviceData = [
  {
    key: "psoriasis",
    image:
      "https://ysm-res.cloudinary.com/image/upload/c_fill%2Cf_auto%2Cg_faces%3Aauto%2Ch_960%2Cq_auto%2Cw_1280/v1/yms/prod/010ce533-5df6-441b-9d1d-3ef2a21aeadc",
  },
  {
    key: "vitiligo",
    image:
      "https://my.clevelandclinic.org/-/scassets/images/org/health/articles/12419-vitiligo",
  },
  {
    key: "eczema",
    image:
      "https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/visual_guide_to_eczema_slideshow/1800ss_science_source_rm_eczema_on_hand.jpg?output-quality=100&resize=728px%3A%2A",
  },
  {
    key: "acne",
    image:
      "https://www.news-medical.net/image-handler/picture/2017/3/shutterstock_459808462.jpg",
  },
  {
    key: "allergy",
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
    image:
      "https://www.houstonent.com/hubfs/shutterstock_2021018495%20%281%29.jpg",
  },
];

function HomePage() {
  const { t } = useTranslation();
  const doctor = useSelector((state: RootState) => state.clinic.doctor);

  return (
    <div className="bg-white w-full">
      <Navbar />

      {/* HERO SECTION */}
      <section className="py-12 md:py-20">
        <div className="max-w-[1300px] mx-auto px-4 md:px-10 grid md:grid-cols-2 gap-12 items-center">
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {serviceData.map((item) => (
              <div
                key={item.key}
                className="bg-white rounded-xl border shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  className="w-full h-36 md:h-44 object-cover rounded-t-xl"
                  alt={t(`services.${item.key}`)}
                />
                <p className="p-4 font-semibold">{t(`services.${item.key}`)}</p>
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
