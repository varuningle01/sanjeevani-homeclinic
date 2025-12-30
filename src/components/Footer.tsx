import { Link } from "react-router-dom";
import { FaPhoneAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useTenant } from "../context/TenantContext";
import ClinicLogo from "./ClinicLogo";
import { SocialIcons } from "./SocialIcons";
import fallbackValues from "../locales/fallback-values.json";
import labels from "../locales/en-us.json";

export default function Footer() {
  const { config } = useTenant();

  return (
    <footer className="bg-[#F4FAFB] text-gray-800 pt-16 pb-10 w-full border-t border-gray-200">
      {/* MAIN GRID */}
      <div className="w-full max-w-[1300px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Clinic Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full p-1 shadow-sm">
              {config?.branding?.logoUrl ? (
                <img
                  src={config.branding.logoUrl}
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <ClinicLogo />
              )}
            </div>
            <h3 className="text-xl font-bold text-primary truncate">
              {config?.clinicName || fallbackValues.clinicName}
            </h3>
          </div>
          <p className="text-sm font-medium">
            {config?.doctorName || fallbackValues.doctorName}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {config?.specialization || fallbackValues.specialization}
          </p>
          <p className="text-sm text-gray-500 mt-2 line-clamp-3">
            {config?.aboutDoctor || fallbackValues.aboutDoctor}
          </p>
        </div>

        {/* Contact Section */}
        <div className="space-y-5">
          <h4 className="font-semibold text-lg text-primary">
            {labels.contact.title}
          </h4>

          {/* Address */}
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
            <p>
              <strong className="text-gray-900">
                {labels.contact.address}:
              </strong>
              <br />
              {config?.addressLine1 || fallbackValues.addressLine1}
              <br />
              {config?.addressLine2 || fallbackValues.addressLine2}
            </p>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <FaPhoneAlt className="text-primary mt-1 flex-shrink-0" />
            <p>
              <strong className="text-gray-900">{labels.contact.phone}:</strong>
              <br />
              {config?.phoneNumber || fallbackValues.phoneNumber}
            </p>
          </div>

          {/* Timings */}
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <FaClock className="text-primary mt-1 flex-shrink-0" />
            <div className="space-y-1">
              <p>
                <span className="font-medium text-gray-900">
                  {labels.contact.morning}:
                </span>{" "}
                {config?.timings?.morning || fallbackValues.morningTime}
              </p>

              <p>
                <span className="font-medium text-gray-900">
                  {labels.contact.afternoon}:
                </span>{" "}
                {config?.timings?.afternoon || fallbackValues.afternoonTime}
              </p>

              {config?.timings?.evening && (
                <p>
                  <span className="font-medium text-gray-900">
                    {labels.contact.evening}:
                  </span>{" "}
                  {config.timings.evening || fallbackValues.eveningTime}
                </p>
              )}

              <p className="text-[#D9534F] font-semibold pt-1">
                {config?.timings?.closedDay || fallbackValues.closedDay}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-primary">
            {labels.footer.quickLinks}
          </h4>

          <div className="space-y-3 text-sm text-gray-700 flex flex-col">
            <Link to="/" className="hover:text-primary transition">
              {labels.nav.home}
            </Link>
            <Link to="/about" className="hover:text-primary transition">
              {labels.nav.about}
            </Link>
            <Link to="/gallery" className="hover:text-primary transition">
              {labels.nav.gallery}
            </Link>
            <Link to="/appointment" className="hover:text-primary transition">
              {labels.nav.appointment}
            </Link>
            <Link to="/contact" className="hover:text-primary transition">
              {labels.nav.contact}
            </Link>
            <Link to="/admin/login" className="hover:text-primary transition">
              {labels.admin.login}
            </Link>
            <Link
              to="/superadmin/login"
              className="hover:text-primary transition"
            >
              {labels.superadmin.login}
            </Link>
          </div>
        </div>

        {/* Socials */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-primary">
            {labels.footer.followUs}
          </h4>
          <SocialIcons />
        </div>
      </div>

      {/* Google Map */}
      <div className="max-w-[1300px] mx-auto px-4 mt-14">
        <div className="h-60 sm:h-72 md:h-80 overflow-hidden rounded-xl shadow-lg border border-gray-200">
          <iframe
            title="clinic-location"
            src={config?.googleMapsUrl || fallbackValues.googleMapsUrl}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-sm mt-10 text-gray-500">
        © {new Date().getFullYear()}{" "}
        {config?.clinicName || fallbackValues.clinicName} {labels.footer.rights}
      </p>
    </footer>
  );
}
