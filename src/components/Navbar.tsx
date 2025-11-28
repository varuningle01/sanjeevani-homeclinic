import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "../store/store";

function Navbar() {
  const { t, i18n } = useTranslation();
  const isOnline = useSelector((state: RootState) => state.clinic.isOnline);
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/about", label: t("nav.about") },
    { path: "/gallery", label: t("nav.gallery") },
    { path: "/appointment", label: t("nav.appointment") },
    { path: "/contact", label: t("nav.contact") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50 w-full">
      {/* Availability Bar */}
      <div
        className={`text-center py-2 text-white text-sm ${
          isOnline ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {isOnline ? t("status.online") : t("status.offline")}
      </div>

      {/* MAIN NAV */}
      <div className="w-full px-4 md:px-10 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link className="flex items-center gap-3" to="/">
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              {t("clinicName")}
            </h1>
            <p className="text-sm text-gray-500 -mt-1">{t("doctorName")}</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-[16px]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative pb-1 transition ${
                isActive(item.path)
                  ? "text-primary font-semibold"
                  : "hover:text-primary"
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

        {/* Desktop Language Switch */}
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="hidden md:block bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md px-3 py-1.5 shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>

        {/* Mobile Toggle Button */}
        <motion.button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
          whileTap={{ scale: 0.85 }}
        >
          {open ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
        </motion.button>
      </div>

      {/* MOBILE MENU (Framer Motion Animated) */}
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
                      : "hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Language Selector */}
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-gray-100 border border-gray-300 text-gray-700 text-base rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
