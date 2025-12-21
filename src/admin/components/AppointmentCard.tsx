import { FiClock, FiPhone, FiUser } from 'react-icons/fi';
import type { Appointment } from '../types/appointment.types';

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: Appointment['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <FiUser className="text-lg sm:text-xl text-teal-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{appointment.patientName}</h3>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mt-0.5">
              <FiPhone className="text-xs flex-shrink-0" />
              <span className="truncate">{appointment.phoneNumber}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border self-start ${getStatusColor(
            appointment.status
          )}`}
        >
          {getStatusLabel(appointment.status)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiClock className="text-teal-600 flex-shrink-0" />
          <span className="font-medium">{appointment.appointmentTime}</span>
        </div>

        {appointment.problem && (
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-3">
            <p className="text-xs text-gray-500 mb-1">Problem/Reason</p>
            <p className="text-gray-700">{appointment.problem}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
