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
    <footer className="bg-[#F4FAFB] text-gray-800 pt-16 pb-10 w-full border-t border-gray-200">
      {/* MAIN GRID */}
      <div className="w-full max-w-[1300px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Clinic Info */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-[#0B7A75]">
            {t("clinicName")}
          </h3>
          <p className="text-sm">{t("doctorName")}</p>
          <p className="text-sm text-gray-600">{t("specialization")}</p>
        </div>

        {/* Contact Section */}
        <div className="space-y-5">
          <h4 className="font-semibold text-lg text-[#0B7A75]">
            {t("contact.title")}
          </h4>

          {/* Address */}
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <FaMapMarkerAlt className="text-[#0B7A75] mt-1" />
            <p>
              <strong className="text-gray-900">{t("contact.address")}:</strong>
              <br />
              {t("contact.addressLine1")}
              <br />
              {t("contact.addressLine2")}
            </p>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <FaPhoneAlt className="text-[#0B7A75] mt-1" />
            <p>
              <strong className="text-gray-900">{t("contact.phone")}:</strong>
              <br />
              +91 {t("contact.phoneNumber")}
            </p>
          </div>

          {/* Timings */}
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <FaClock className="text-[#0B7A75] mt-1" />
            <div className="space-y-1">
              <p>
                <span className="font-medium text-gray-900">
                  {t("contact.morning")}:
                </span>{" "}
                {t("contact.morningTime")}
              </p>

              <p>
                <span className="font-medium text-gray-900">
                  {t("contact.afternoon")}:
                </span>{" "}
                {t("contact.afternoonTime")}
              </p>

              <p>
                <span className="font-medium text-gray-900">
                  {t("contact.evening")}:
                </span>{" "}
                {t("contact.eveningTime")}
              </p>

              <p className="text-[#D9534F] font-semibold pt-1">
                {t("contact.closed")}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-[#0B7A75]">
            {t("footer.quickLinks")}
          </h4>

          <div className="space-y-3 text-sm text-gray-700 flex flex-col">
            <Link to="/" className="hover:text-[#0B7A75] transition">
              {t("nav.home")}
            </Link>
            <Link to="/about" className="hover:text-[#0B7A75] transition">
              {t("nav.about")}
            </Link>
            <Link to="/gallery" className="hover:text-[#0B7A75] transition">
              {t("gallery.title")}
            </Link>
            <Link to="/appointment" className="hover:text-[#0B7A75] transition">
              {t("nav.appointment")}
            </Link>
            <Link to="/contact" className="hover:text-[#0B7A75] transition">
              {t("nav.contact")}
            </Link>
            <Link to="/admin/login" className="hover:text-[#0B7A75] transition">
              {t("admin.login")}
            </Link>
          </div>
        </div>

        {/* Socials */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-[#0B7A75]">
            {t("footer.followUs")}
          </h4>

          <div className="flex gap-4 text-2xl text-gray-500">
            <a href="#" className="hover:text-[#0B7A75] transition">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-[#0B7A75] transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-[#0B7A75] transition">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="max-w-[1300px] mx-auto px-4 mt-14">
        <div className="h-60 sm:h-72 md:h-80 overflow-hidden rounded-xl shadow-lg border border-gray-200">
          <iframe
            title="clinic-location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d932.9502400788441!2d77.01100396956932!3d20.71830559880341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd72f00463bc409%3A0x9c8c72c1594ed5b1!2sSanjeevani%20Homoeo%20Clinic!5e0!3m2!1sen!2sin!4v1766599742342!5m2!1sen!2sin"
            className="w-full h-full"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-sm mt-10 text-gray-500">
        © {new Date().getFullYear()} {t("clinicName")}. {t("footer.rights")}.
      </p>
    </footer>
  );
}
