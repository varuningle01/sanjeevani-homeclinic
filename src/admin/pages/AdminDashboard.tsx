import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiClock,
  FiCalendar,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchPatients } from "../../store/slices/patientSlice";
import { fetchAppointments } from "../../store/slices/appointmentSlice";
import { isToday, formatRelativeTime } from "../utils/dateUtils";
import labels from "../../locales/en-us.json";

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { patients, loading: patientsLoading } = useSelector(
    (state: RootState) => state.patients
  );
  const { appointments, loading: appointmentsLoading } = useSelector(
    (state: RootState) => state.appointments
  );

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchAppointments());
  }, [dispatch]);

  // --- Derived Statistics ---

  // 1. Upcoming Appointments (Status 'confirmed' AND future)
  // We want to show upcoming confirmed appointments.
  const upcomingAppointments = appointments
    .filter(
      (apt) =>
        apt.status === "confirmed" &&
        new Date(apt.appointmentDate) >=
          new Date(new Date().setHours(0, 0, 0, 0))
    )
    .sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
    );

  // 2. Today's Appointments
  const todayAppointments = appointments.filter(
    (apt) => isToday(apt.appointmentDate) && apt.status !== "cancelled"
  );

  // 3. Recent Patients (Last 5 based on createdAt or updatedAt)
  // Let's sort by descending createdAt to show newest patients
  const recentPatients = [...patients]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const loading = patientsLoading || appointmentsLoading;

  if (loading && patients.length === 0 && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {labels.admin.dashboard}
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/patients"
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm font-medium"
          >
            <FiPlus />
            Add Patient
          </Link>
        </div>
      </div>

      {/* ===================== STAT CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Patients */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <FiUsers className="text-2xl" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +Active
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Patients</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {patients.length}
            </h3>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <FiClock className="text-2xl" />
            </div>
            {upcomingAppointments.length > 0 && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                Scheduled
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Upcoming Appointments
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {upcomingAppointments.length}
            </h3>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <FiCalendar className="text-2xl" />
            </div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              Today
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Appointments Today
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {todayAppointments.length}
            </h3>
          </div>
        </div>
      </div>

      {/* ===================== LISTS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white border rounded-2xl shadow-sm flex flex-col h-full">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">
              Upcoming Appointments
            </h2>
            <Link
              to="/admin/appointments"
              className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="p-6 flex-1">
            {upcomingAppointments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6">
                <div className="p-4 bg-gray-50 rounded-full mb-3">
                  <FiCalendar className="text-2xl text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  No upcoming appointments
                </p>
                <p className="text-sm text-gray-400">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-teal-200 transition group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-lg border shadow-sm text-center">
                        <span className="text-xs font-bold text-gray-500 uppercase">
                          {new Date(apt.appointmentDate).toLocaleDateString(
                            "en-US",
                            { month: "short" }
                          )}
                        </span>
                        <span className="text-lg font-bold text-teal-600">
                          {new Date(apt.appointmentDate).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {apt.patientName}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          {apt.appointmentTime}
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span
                            className={`capitalize ${
                              apt.status === "confirmed"
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recently Added Patients */}
        <div className="bg-white border rounded-2xl shadow-sm flex flex-col h-full">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">
              Recently Added Patients
            </h2>
            <Link
              to="/admin/patients"
              className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="p-6 flex-1">
            {recentPatients.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6">
                <div className="p-4 bg-gray-50 rounded-full mb-3">
                  <FiUsers className="text-2xl text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No patients found</p>
                <Link
                  to="/admin/patients"
                  className="text-sm text-teal-600 hover:underline mt-1"
                >
                  Add your first patient
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    to={`/admin/patients/${patient.id}`}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:bg-gray-50 transition -mx-2 px-2 rounded-lg"
                  >
                    {patient.photoUrl ? (
                      <img
                        src={patient.photoUrl}
                        alt={patient.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100 text-teal-600">
                        <FiUsers />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {patient.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Added {formatRelativeTime(patient.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {patient.gender}, {patient.age}y
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
