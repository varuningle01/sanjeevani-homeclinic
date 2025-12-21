import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiUser,
  FiPhone,
  FiCalendar,
  FiPlus,
} from 'react-icons/fi';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchPatientById, deletePatient, clearSelectedPatient } from '../../store/slices/patientSlice';
import { formatRelativeTime } from '../utils/dateUtils';
import VisitTimeline from '../components/VisitTimeline.tsx';
import UpdatePatientModal from '../components/UpdatePatientModal.tsx';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.tsx';

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPatient, loading } = useSelector((state: RootState) => state.patients);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatientById(id));
    }
    return () => {
      dispatch(clearSelectedPatient());
    };
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await dispatch(deletePatient(id)).unwrap();
      navigate('/admin/patients');
    } catch (error) {
      console.error('Failed to delete patient:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!selectedPatient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiUser className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-700">Patient not found</p>
          <Link
            to="/admin/patients"
            className="inline-block mt-4 text-teal-600 hover:text-teal-700"
          >
            ← Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/patients')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <FiArrowLeft className="text-xl text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">
        <div className="flex flex-col gap-6">
          {/* Photo and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {selectedPatient.photoUrl ? (
              <img
                src={selectedPatient.photoUrl}
                alt={selectedPatient.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-teal-100 flex items-center justify-center border-4 border-gray-200 flex-shrink-0">
                <FiUser className="text-3xl sm:text-4xl text-teal-600" />
              </div>
            )}

            <div className="flex-1 text-center sm:text-left space-y-3 w-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                <p className="text-sm text-gray-500">ID: {selectedPatient.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-6">
                <div>
                  <p className="text-xs text-gray-500">Age</p>
                  <p className="font-medium text-gray-900">{selectedPatient.age} years</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="font-medium text-gray-900">{selectedPatient.gender}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Mobile Number</p>
                  <p className="font-medium text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                    <FiPhone className="text-teal-600" />
                    {selectedPatient.mobileNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FiCalendar className="text-teal-600" />
                  <span>Registered {formatRelativeTime(selectedPatient.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              <FiEdit />
              <span className="font-medium">Edit</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-200"
            >
              <FiTrash2 />
              <span className="font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-xs text-gray-500 mb-1">Total Visits</p>
          <p className="text-2xl font-bold text-gray-900">{selectedPatient.visits.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-xs text-gray-500 mb-1">Last Visit</p>
          <p className="text-lg font-semibold text-gray-900">
            {selectedPatient.visits.length > 0
              ? formatRelativeTime(selectedPatient.visits[0].visitDate)
              : 'No visits yet'}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-xs text-gray-500 mb-1">Total Reports</p>
          <p className="text-2xl font-bold text-gray-900">
            {selectedPatient.visits.reduce((sum, visit) => sum + visit.reports.length, 0)}
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Medical History Timeline</h3>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition border border-teal-200"
          >
            <FiPlus />
            <span className="font-medium">Add Visit</span>
          </button>
        </div>

        <VisitTimeline visits={selectedPatient.visits} />
      </div>

      {/* Modals */}
      {showUpdateModal && (
        <UpdatePatientModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          patient={selectedPatient}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          patientName={selectedPatient.name}
        />
      )}
    </div>
  );
};

export default PatientDetailsPage;
