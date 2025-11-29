import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaClock,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0b1120] text-white pt-16 pb-10 w-full">
      {/* MAIN CONTENT */}
      <div className="w-full max-w-[1300px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Clinic Info */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold">{t("clinicName")}</h3>
          <p className="text-sm">{t("doctorName")}</p>
          <p className="text-sm text-gray-300">{t("specialization")}</p>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">{t("contact.title")}</h4>

          {/* Address */}
          <div className="flex items-start gap-3 text-sm leading-relaxed">
            <FaMapMarkerAlt className="text-red-500 mt-1" />
            <p>
              <strong>{t("contact.address")}:</strong> <br />
              {t("contact.addressLine1")} <br />
              {t("contact.addressLine2")}
            </p>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 text-sm leading-relaxed">
            <FaPhoneAlt className="text-red-500 mt-1" />
            <p>
              <strong>{t("contact.phone")}:</strong> <br />
              +91 {t("contact.phoneNumber")}
            </p>
          </div>

          {/* Timings */}
          {/* Timings */}
          {/* Timings */}
          <div className="flex items-start gap-3 text-sm leading-relaxed">
            <FaClock className="text-red-500 mt-1" />

            <div className="space-y-1">
              <p>
                <span className="font-medium">{t("contact.morning")}:</span>{" "}
                {t("contact.morningTime")}
              </p>
              <p>
                <span className="font-medium">{t("contact.afternoon")}:</span>{" "}
                {t("contact.afternoonTime")}
              </p>
              <p>
                <span className="font-medium">{t("contact.evening")}:</span>{" "}
                {t("contact.eveningTime")}
              </p>

              <p className="text-red-400 font-semibold pt-1">
                {t("contact.closed")}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4">
            {t("footer.quickLinks")}
          </h4>

          <div className="space-y-2 text-sm flex flex-col">
            <Link to="/" className="hover:text-gray-300 transition">
              {t("nav.home")}
            </Link>
            <Link to="/about" className="hover:text-gray-300 transition">
              {t("nav.about")}
            </Link>
            <Link to="/gallery" className="hover:text-gray-300 transition">
              {t("gallery.title")}
            </Link>
            <Link to="/appointment" className="hover:text-gray-300 transition">
              {t("nav.appointment")}
            </Link>
            <Link to="/contact" className="hover:text-gray-300 transition">
              {t("nav.contact")}
            </Link>
            <Link to="/admin/login" className="hover:text-gray-300 transition">
              {t("admin.login")}
            </Link>
          </div>
        </div>

        {/* Socials */}
        <div>
          <h4 className="font-semibold text-lg mb-4">{t("footer.followUs")}</h4>
          <div className="flex gap-4 text-2xl">
            <a href="#" className="hover:text-red-500 transition">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-red-500 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-red-500 transition">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="max-w-[1300px] mx-auto px-4 mt-12">
        <div className="h-60 sm:h-72 md:h-80 overflow-hidden rounded-xl shadow-lg border border-white/10">
          <iframe
            title="clinic-location"
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3731.800171959041!2d77.01160519999999!3d20.718337599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjDCsDQzJzA2LjAiTiA3N8KwMDAnNDEuOCJF!5e0!3m2!1sen!2sin!4v1764363802006!5m2!1sen!2sin"
            className="w-full h-full"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-sm mt-10 text-white/60">
        © {new Date().getFullYear()} {t("clinicName")}. {t("footer.rights")}.
      </p>
    </footer>
  );
}
