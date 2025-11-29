import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useTranslation } from "react-i18next";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiClock,
  FiLogOut,
  FiActivity,
} from "react-icons/fi";
import ClinicLogo from "../../components/ClinicLogo"; // ← IMPORT LOGO

interface SidebarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AdminSideBar = ({ open, setOpen }: SidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/admin/patients", label: "Patients", icon: <FiUsers /> },
    {
      path: "/admin/appointments",
      label: "Appointments",
      icon: <FiCalendar />,
    },
    { path: "/admin/activity", label: "Activity", icon: <FiActivity /> },
    { path: "/admin/timing", label: "Clinic Timings", icon: <FiClock /> },
  ];

  return (
    <aside
      className={`
        fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-xl 
        border-r border-gray-200
        transform transition-transform duration-300
        md:static md:translate-x-0 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <ClinicLogo className="w-10 h-10" /> {/* NEW LOGO */}
        </div>
        <span className="font-semibold text-gray-700">{t("clinicName")}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2 pb-20">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  onClick={() => setOpen(false)}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-teal-50 text-teal-700 border border-teal-200 shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-teal-700"
                    }
                  `}
                >
                  <span
                    className={`text-lg ${
                      isActive ? "text-teal-600" : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Availability Toggle */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">{t("admin.availability")}</p>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`w-full py-2.5 rounded-lg font-medium transition-all shadow-sm
            ${
              isOnline
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-red-500 text-white hover:bg-red-600"
            }
          `}
        >
          {isOnline ? t("status.online") : t("status.offline")}
        </button>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            handleLogout();
            setOpen(false);
          }}
          className="w-full flex items-center gap-3 py-2.5 rounded-lg 
          text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-all"
        >
          <FiLogOut className="text-lg" />
          <span className="font-medium">{t("admin.logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSideBar;
