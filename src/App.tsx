import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminLayout from "./admin/pages/AdminLayout";
import { SuperAdminAuthProvider } from "./superadmin/context/SuperAdminAuthContext";
import SuperAdminProtectedRoute from "./superadmin/components/SuperAdminProtectedRoute";
import SuperAdminLayout from "./superadmin/layout/SuperAdminLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const AppointmentPage = lazy(() => import("./pages/AppointmentPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminLoginPage = lazy(() => import("./admin/pages/AdminLoginPage"));
const PatientsPage = lazy(() => import("./admin/pages/PatientsPage"));
const PatientDetailsPage = lazy(
  () => import("./admin/pages/PatientDetailsPage")
);
const AppointmentsPage = lazy(() => import("./admin/pages/AppointmentsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SuperAdminLoginPage = lazy(
  () => import("./superadmin/pages/SuperAdminLoginPage")
);
const SuperAdminDashboard = lazy(
  () => import("./superadmin/pages/SuperAdminDashboard")
);

import { useTenant } from "./context/TenantContext";
import TenantSwitcher from "./components/TenantSwitcher";

export default function App() {
  const { loading } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading…</div>}>
      <SuperAdminAuthProvider>
        <ScrollToTop />
        <TenantSwitcher />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Tenant Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <PatientsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients/:id"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <PatientDetailsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AppointmentsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes */}
          <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
          <Route element={<SuperAdminProtectedRoute />}>
            <Route element={<SuperAdminLayout />}>
              <Route
                path="/superadmin/dashboard"
                element={<SuperAdminDashboard />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SuperAdminAuthProvider>
    </Suspense>
  );
}
