import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import { useTenant } from "../context/TenantContext";
import labels from "../locales/en-us.json";
import fallbackValues from "../locales/fallback-values.json";

const ContactPage = () => {
  const { config } = useTenant();

  return (
    <div className="bg-[#F4FAFB] min-h-screen flex flex-col">
      <Navbar />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl mb-10 font-bold text-center mb-2 text-primary">
            {labels.contact.title}
          </h1>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* LEFT INFO CARDS */}
            <div className="space-y-6">
              {/* Address Card */}
              <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md p-6 rounded-2xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <FiMapPin className="text-primary text-2xl" />
                  <h3 className="font-semibold text-primary text-lg">
                    {labels.contact.address}
                  </h3>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {config?.addressLine1 || fallbackValues.addressLine1}
                  <br />
                  {config?.addressLine2 || fallbackValues.addressLine2}
                </p>
              </div>

              {/* Phone Card */}
              <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md p-6 rounded-2xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <FiPhone className="text-primary text-2xl" />
                  <h3 className="font-semibold text-primary text-lg">
                    {labels.contact.phone}
                  </h3>
                </div>

                <a
                  href={`tel:${
                    config?.phoneNumber || fallbackValues.phoneNumber
                  }`}
                  className="text-gray-700 hover:text-primary text-lg font-medium transition"
                >
                  {config?.phoneNumber || fallbackValues.phoneNumber}
                </a>
              </div>

              {/* Timings Card */}
              <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md p-6 rounded-2xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <FiClock className="text-primary text-2xl" />
                  <h3 className="font-semibold text-primary text-lg">
                    {labels.contact.timings}
                  </h3>
                </div>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">
                      {labels.contact.morning}:
                    </span>{" "}
                    {config?.timings?.morning || fallbackValues.morningTime}
                  </p>
                  <p>
                    <span className="font-medium">
                      {labels.contact.afternoon}:
                    </span>{" "}
                    {config?.timings?.afternoon || fallbackValues.afternoonTime}
                  </p>
                  <p>
                    <span className="font-medium">
                      {labels.contact.evening}:
                    </span>{" "}
                    {config?.timings?.evening || fallbackValues.eveningTime}
                  </p>
                </div>

                <p className="text-red-500 font-semibold mt-3">
                  {config?.timings?.closedDay
                    ? `${labels.contact.closed} on ${config.timings.closedDay}`
                    : fallbackValues.closedDay}
                </p>
              </div>
            </div>

            {/* MAP SECTION */}
            <div className="w-full h-80 lg:h-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <iframe
                title="clinic-location"
                src={config?.googleMapsUrl || fallbackValues.googleMapsUrl}
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
