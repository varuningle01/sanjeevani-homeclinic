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
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        {t("admin.dashboard")}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <FiUsers className="text-red-600 text-3xl" />
          <div>
            <p className="text-xs text-gray-500">Patients</p>
            <p className="text-xl font-bold">{patients.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
          <FiClock className="text-yellow-600 text-3xl" />
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-xl font-bold">{pendingAppointments.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3 col-span-2 sm:col-span-1">
          <FiCalendar className="text-green-600 text-3xl" />
          <div>
            <p className="text-xs text-gray-500">Today</p>
            <p className="text-xl font-bold">{todayAppointments.length}</p>
          </div>
        </div>
      </div>

      {/* Two Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b flex justify-between">
            <h2 className="font-semibold text-gray-700">Pending</h2>
            <Link to="/admin/appointments" className="text-sm text-red-600">
              View All
            </Link>
          </div>

          <div className="p-4 space-y-3">
            {pendingAppointments.map((apt) => (
              <div key={apt.id} className="p-3 rounded-lg bg-gray-50">
                <p className="font-medium">{apt.patientName}</p>
                <p className="text-sm text-gray-500">{apt.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b flex justify-between">
            <h2 className="font-semibold text-gray-700">Recent Patients</h2>
            <Link to="/admin/patients" className="text-sm text-red-600">
              View All
            </Link>
          </div>

          <div className="p-4 space-y-3">
            {patients.map((patient) => (
              <div key={patient.id} className="p-3 rounded-lg bg-gray-50">
                <p className="font-medium">{patient.name}</p>
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
