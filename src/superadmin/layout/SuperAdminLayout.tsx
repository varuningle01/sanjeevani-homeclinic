import { Outlet, useNavigate } from "react-router-dom";
import { useSuperAdminAuth } from "../context/SuperAdminAuthContext";

const SuperAdminLayout = () => {
  const { logout } = useSuperAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/superadmin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Super Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, Super Admin</span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;
