import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiUsers, FiClock, FiCalendar } from "react-icons/fi";

const AdminDashboard = () => {
  const { t } = useTranslation();

  const patients = [
    { id: 1, name: "Rohit Sharma", problem: "Eczema", lastVisit: "2 days ago" },
    {
      id: 2,
      name: "Sneha Patil",
      problem: "Psoriasis",
      lastVisit: "1 week ago",
    },
    { id: 3, name: "Amit More", problem: "Acne", lastVisit: "3 days ago" },
  ];

  const pendingAppointments = [
    { id: 101, patientName: "Rohit Sharma", date: "Today 5:00 PM" },
  ];

  const todayAppointments = [{ id: 201, name: "Kunal Pawar", time: "3:00 PM" }];

  return (
    <div className="space-y-10">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900">
        {t("admin.dashboard")}
      </h1>

      {/* ===================== STAT CARDS ===================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Patients */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <FiUsers className="text-2xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Patients</p>
            <p className="text-2xl font-bold">{patients.length}</p>
          </div>
        </div>

        {/* Pending Appointments */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FiClock className="text-2xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-2xl font-bold">{pendingAppointments.length}</p>
          </div>
        </div>

        {/* Today Appointments */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition flex items-center gap-4 col-span-2 sm:col-span-1">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FiCalendar className="text-2xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Today</p>
            <p className="text-2xl font-bold">{todayAppointments.length}</p>
          </div>
        </div>
      </div>

      {/* ===================== LISTS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Appointments */}
        <div className="bg-white border rounded-2xl shadow-sm hover:shadow transition">
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">
              Pending Appointments
            </h2>
            <Link
              to="/admin/appointments"
              className="text-sm text-teal-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="p-5 space-y-4">
            {pendingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="font-medium text-gray-900">{apt.patientName}</p>
                <p className="text-sm text-gray-500">{apt.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white border rounded-2xl shadow-sm hover:shadow transition">
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Recent Patients</h2>
            <Link
              to="/admin/patients"
              className="text-sm text-teal-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="p-5 space-y-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="font-medium text-gray-900">{patient.name}</p>
                <p className="text-sm text-gray-500">{patient.problem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
