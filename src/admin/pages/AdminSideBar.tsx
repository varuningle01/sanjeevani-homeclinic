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
        fixed z-40 inset-y-0 left-0 w-64 bg-gray-900 text-white 
        transform transition-transform duration-300
        md:static md:translate-x-0 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">S</span>
        </div>
        <span className="font-bold">{t("clinicName")}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2 pb-20">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  onClick={() => setOpen(false)}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Availability */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 mb-2">{t("admin.availability")}</p>
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`w-full py-2 rounded-lg font-medium transition-colors
            ${
              isOnline
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
        >
          {isOnline ? t("status.online") : t("status.offline")}
        </button>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => {
            handleLogout();
            setOpen(false);
          }}
          className="w-full flex items-center gap-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <FiLogOut />
          {t("admin.logout")}
        </button>
      </div>
    </aside>
  );
};

export default AdminSideBar;
