import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "../store/store";
import ClinicLogo from "./ClinicLogo";
import fallbackValues from "../locales/fallback-values.json";
import labels from "../locales/en-us.json";

import { useTenant } from "../context/TenantContext";

function Navbar() {
  const { config } = useTenant();
  const isOnline = useSelector((state: RootState) => state.clinic.isOnline);
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/", label: labels.nav.home },
    { path: "/about", label: labels.nav.about },
    { path: "/gallery", label: labels.nav.gallery },
    { path: "/appointment", label: labels.nav.appointment },
    { path: "/contact", label: labels.nav.contact },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50 w-full">
      {/* Availability Bar */}
      <div
        className={`text-center py-2 text-white text-sm ${
          isOnline ? "bg-[#1c9c7c]" : "bg-red-500"
        }`}
      >
        {isOnline ? labels.status.online : labels.status.offline}
      </div>

      {/* MAIN NAV */}
      <div className="w-full px-4 md:px-10 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link className="flex items-center gap-3" to="/">
          {config?.branding?.logoUrl && (
            <div className="w-10 h-10 flex items-center justify-center">
              <ClinicLogo className="h-full w-full object-contain" />
            </div>
          )}

          <div>
            <h1 className="text-lg font-bold leading-tight text-gray-900">
              {config?.clinicName || fallbackValues.clinicName}
            </h1>
            <p className="text-sm text-gray-500 -mt-0.5">
              {config?.doctorName || fallbackValues.doctorName}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[16px] font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative pb-1 transition ${
                isActive(item.path)
                  ? "text-primary font-semibold"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              {item.label}

              {isActive(item.path) && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 right-0 -bottom-1 h-[2px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
          whileTap={{ scale: 0.85 }}
        >
          {open ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t shadow-inner"
          >
            <nav className="flex flex-col px-4 py-4 gap-4 text-lg">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`transition ${
                    isActive(item.path)
                      ? "text-primary font-semibold"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
