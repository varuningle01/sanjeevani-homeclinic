import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaClock,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useTenant } from "../context/TenantContext";
import ClinicLogo from "./ClinicLogo";

export default function Footer() {
  const { t } = useTranslation();
  const { config } = useTenant();

  // Helper to ensure social links or use defaults
  const renderSocials = () => {
     return (
        <div className="flex gap-4 text-2xl text-gray-500">
            <a href="#" className="hover:text-primary transition" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-primary transition" aria-label="Instagram">
              <FaInstagram />
            </a>
             <a href="#" className="hover:text-primary transition" aria-label="Twitter">
              <FaTwitter />
            </a>
             <a href="#" className="hover:text-primary transition" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
        </div>
     );
  };

  return (
    <footer className="bg-[#F4FAFB] text-gray-800 pt-16 pb-10 w-full border-t border-gray-200">
      {/* MAIN GRID */}
      <div className="w-full max-w-[1300px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Clinic Info */}
        <div className="space-y-3">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full p-1 shadow-sm">
                {config?.branding?.logoUrl ? (
                  <img src={config.branding.logoUrl} alt="Logo" className="h-full w-full object-contain" />
                ) : (
                  <ClinicLogo />
                )}
             </div>
             <h3 className="text-xl font-bold text-primary truncate">
                {config?.clinicName || t("clinicName") || "Homeo Clinic"}
             </h3>
          </div>
          <p className="text-sm font-medium">{config?.doctorName || t("doctorName") || "Dr. Homeo"}</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {config?.specialization || t("specialization") || "Specialist"}
          </p>
           <p className="text-sm text-gray-500 mt-2 line-clamp-3">
            {config?.aboutDoctor || t("footer.aboutText") || "Providing quality homeopathic care."}
          </p>
        </div>

        {/* Contact Section */}
        <div className="space-y-5">
          <h4 className="font-semibold text-lg text-primary">
            {t("contact.title") || "Contact Us"}
          </h4>

          {/* Address */}
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
            <p>
              <strong className="text-gray-900">{t("contact.address") || "Address"}:</strong>
              <br />
              {config?.addressLine1 || "Clinic Address"}
              {config?.addressLine2 && (
                <>
                  <br />
                  {config.addressLine2}
                </>
              )}
            </p>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <FaPhoneAlt className="text-primary mt-1 flex-shrink-0" />
            <p>
              <strong className="text-gray-900">{t("contact.phone") || "Phone"}:</strong>
              <br />
              {config?.phoneNumber || "0000000000"}
            </p>
          </div>

          {/* Timings */}
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <FaClock className="text-primary mt-1 flex-shrink-0" />
            <div className="space-y-1">
              <p>
                <span className="font-medium text-gray-900">
                  {t("contact.morning")}:
                </span>{" "}
                {config?.timings?.morning || "10:00 AM - 1:00 PM"}
              </p>

              <p>
                <span className="font-medium text-gray-900">
                  {t("contact.afternoon")}:
                </span>{" "}
                {config?.timings?.afternoon || "5:00 PM - 9:00 PM"}
              </p>
              
               {config?.timings?.evening && (
                 <p>
                    <span className="font-medium text-gray-900">
                    {t("contact.evening")}:
                    </span>{" "}
                    {config.timings.evening}
                </p>
               )}

              <p className="text-[#D9534F] font-semibold pt-1">
                {config?.timings?.closedDay || "Sunday Closed"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-primary">
            {t("footer.quickLinks") || "Quick Links"}
          </h4>

          <div className="space-y-3 text-sm text-gray-700 flex flex-col">
            <Link to="/" className="hover:text-primary transition">
              {t("nav.home") || "Home"}
            </Link>
            <Link to="/about" className="hover:text-primary transition">
              {t("nav.about") || "About Us"}
            </Link>
            <Link to="/gallery" className="hover:text-primary transition">
              {t("nav.gallery") || "Gallery"}
            </Link>
            <Link to="/appointment" className="hover:text-primary transition">
              {t("nav.appointment") || "Book Appointment"}
            </Link>
            <Link to="/contact" className="hover:text-primary transition">
              {t("nav.contact") || "Contact"}
            </Link>
            <Link to="/admin/login" className="hover:text-primary transition">
              {t("admin.login") || "Admin Login"}
            </Link>
             <Link to="/superadmin/login" className="hover:text-primary transition">
              Super Admin
            </Link>
          </div>
        </div>

        {/* Socials */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-primary">
            {t("footer.followUs") || "Follow Us"}
          </h4>
          {renderSocials()}
        </div>
      </div>

      {/* Google Map */}
      <div className="max-w-[1300px] mx-auto px-4 mt-14">
        <div className="h-60 sm:h-72 md:h-80 overflow-hidden rounded-xl shadow-lg border border-gray-200">
          <iframe
            title="clinic-location"
            src={config?.googleMapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5642857416954!2d77.22732107530495!3d28.61208947567491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b7187896440!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1703616000000!5m2!1sen!2sin"}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-sm mt-10 text-gray-500">
        © {new Date().getFullYear()} {config?.clinicName || "Homeo Clinic"}. {t("footer.rights") || "All Rights Reserved"}.
      </p>
    </footer>
  );
}
