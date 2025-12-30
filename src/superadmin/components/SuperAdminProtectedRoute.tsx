import { Navigate, Outlet } from "react-router-dom";
import { useSuperAdminAuth } from "../context/SuperAdminAuthContext";

const SuperAdminProtectedRoute = () => {
  const { isAuthenticated, loading } = useSuperAdminAuth();

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/superadmin/login" replace />;
};

export default SuperAdminProtectedRoute;
