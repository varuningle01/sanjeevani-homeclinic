import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import { useTenant } from "../context/TenantContext";

const ContactPage = () => {
  const { t } = useTranslation();
  const { config } = useTenant();

  return (
    <div className="bg-[#F4FAFB] min-h-screen flex flex-col">
      <Navbar />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl mb-10 font-bold text-center mb-2 text-primary">
            {t("contact.title")}
          </h1>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* LEFT INFO CARDS */}
            <div className="space-y-6">
              {/* Address Card */}
              <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md p-6 rounded-2xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <FiMapPin className="text-primary text-2xl" />
                  <h3 className="font-semibold text-primary text-lg">
                    {t("contact.address")}
                  </h3>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {config?.addressLine1 || t("contact.addressLine1")}
                  <br />
                  {config?.addressLine2 || t("contact.addressLine2")}
                </p>
              </div>

              {/* Phone Card */}
              <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md p-6 rounded-2xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <FiPhone className="text-primary text-2xl" />
                  <h3 className="font-semibold text-primary text-lg">
                    {t("contact.phone")}
                  </h3>
                </div>

                <a
                  href={`tel:${config?.phoneNumber || t("contact.phoneNumber")}`}
                  className="text-gray-700 hover:text-primary text-lg font-medium transition"
                >
                  {config?.phoneNumber || t("contact.phoneNumber")}
                </a>
              </div>

              {/* Timings Card */}
              <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md p-6 rounded-2xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <FiClock className="text-primary text-2xl" />
                  <h3 className="font-semibold text-primary text-lg">
                    {t("contact.timings")}
                  </h3>
                </div>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">{t("contact.morning")}:</span>{" "}
                    {config?.timings?.morning || t("contact.morningTime")}
                  </p>
                  <p>
                    <span className="font-medium">{t("contact.afternoon")}:</span>{" "}
                    {config?.timings?.afternoon || t("contact.afternoonTime")}
                  </p>
                  <p>
                    <span className="font-medium">{t("contact.evening")}:</span>{" "}
                    {config?.timings?.evening || t("contact.eveningTime")}
                  </p>
                </div>

                <p className="text-red-500 font-semibold mt-3">
                  {config?.timings?.closedDay ? `${t("contact.closed")} on ${config.timings.closedDay}` : t("contact.closed")}
                </p>
              </div>
            </div>

            {/* MAP SECTION */}
            <div className="w-full h-80 lg:h-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <iframe
                title="clinic-location"
                src={config?.googleMapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5642857416954!2d77.22732107530495!3d28.61208947567491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b7187896440!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1703616000000!5m2!1sen!2sin"}
                width="100%"
                height="100%"
                className="w-full h-full"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
