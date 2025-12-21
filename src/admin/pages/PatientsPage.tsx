import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiSearch, FiUser, FiPhone, FiCalendar } from 'react-icons/fi';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchPatients } from '../../store/slices/patientSlice';
import { formatRelativeTime } from '../utils/dateUtils';
import CreatePatientModal from '../components/CreatePatientModal';

const PatientsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { patients, loading } = useSelector((state: RootState) => state.patients);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.mobileNumber.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500 mt-1">Manage patient records and medical history</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
        >
          <FiPlus className="text-lg" />
          <span className="font-medium">Add Patient</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <FiUser className="text-2xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Patients</p>
              <p className="text-2xl font-bold">{patients.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FiCalendar className="text-2xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500">New This Month</p>
              <p className="text-2xl font-bold">
                {patients.filter(p => {
                  const createdDate = new Date(p.createdAt);
                  const now = new Date();
                  return createdDate.getMonth() === now.getMonth() &&
                         createdDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <FiPhone className="text-2xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Records</p>
              <p className="text-2xl font-bold">{patients.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name or mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4">Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <FiUser className="text-5xl mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No patients found</p>
            <p className="text-sm mt-1">
              {searchQuery ? 'Try a different search term' : 'Add your first patient to get started'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {patient.photoUrl ? (
                            <img
                              src={patient.photoUrl}
                              alt={patient.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                              <FiUser className="text-teal-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{patient.name}</p>
                            <p className="text-xs text-gray-500">ID: {patient.id.slice(0, 12)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{patient.age}</td>
                      <td className="px-6 py-4 text-gray-700">{patient.gender}</td>
                      <td className="px-6 py-4 text-gray-700">{patient.mobileNumber}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {formatRelativeTime(patient.updatedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/patients/${patient.id}`}
                          className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <Link
                  key={patient.id}
                  to={`/admin/patients/${patient.id}`}
                  className="block p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-3">
                    {patient.photoUrl ? (
                      <img
                        src={patient.photoUrl}
                        alt={patient.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <FiUser className="text-xl text-teal-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{patient.name}</h3>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-600">
                          {patient.age} years • {patient.gender}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FiPhone className="text-xs flex-shrink-0" />
                          <span className="truncate">{patient.mobileNumber}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Updated {formatRelativeTime(patient.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-teal-600 text-sm font-medium">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Patient Modal */}
      {showCreateModal && (
        <CreatePatientModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default PatientsPage;
