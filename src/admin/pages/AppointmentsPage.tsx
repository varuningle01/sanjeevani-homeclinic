import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCalendar, FiFilter, FiX } from 'react-icons/fi';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchAppointments, fetchAppointmentsByDate } from '../../store/slices/appointmentSlice';
import AppointmentCard from '../components/AppointmentCard.tsx';
import { formatDate } from '../utils/dateUtils';

const AppointmentsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, loading } = useSelector((state: RootState) => state.appointments);
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'today' | 'tomorrow' | 'custom'>('all');

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleDateFilter = (type: 'all' | 'today' | 'tomorrow' | 'custom', customDate?: string) => {
    setFilterType(type);
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (type) {
      case 'all':
        setSelectedDate('');
        dispatch(fetchAppointments());
        break;
      case 'today':
        const todayStr = today.toISOString().split('T')[0];
        setSelectedDate(todayStr);
        dispatch(fetchAppointmentsByDate(todayStr));
        break;
      case 'tomorrow':
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        setSelectedDate(tomorrowStr);
        dispatch(fetchAppointmentsByDate(tomorrowStr));
        break;
      case 'custom':
        if (customDate) {
          setSelectedDate(customDate);
          dispatch(fetchAppointmentsByDate(customDate));
        }
        break;
    }
  };

  const clearFilter = () => {
    setSelectedDate('');
    setFilterType('all');
    dispatch(fetchAppointments());
  };

  // Group appointments by date
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = appointment.appointmentDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, typeof appointments>);

  // Sort dates
  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.appointmentDate === today);
  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate) > new Date()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-500 mt-1">Manage and view all patient appointments</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-xs text-gray-500 mb-1">Total Appointments</p>
          <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-xs text-gray-500 mb-1">Today's Appointments</p>
          <p className="text-2xl font-bold text-teal-600">{todayAppointments.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-xs text-gray-500 mb-1">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">{upcomingAppointments.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter className="text-gray-500" />
          <h2 className="font-semibold text-gray-900">Filter Appointments</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleDateFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterType === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Appointments
          </button>
          <button
            onClick={() => handleDateFilter('today')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterType === 'today'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handleDateFilter('tomorrow')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterType === 'tomorrow'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tomorrow
          </button>

          <div className="flex items-center gap-2">
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateFilter('custom', e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            {selectedDate && (
              <button
                onClick={clearFilter}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Clear filter"
              >
                <FiX className="text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
          <FiCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Found</h3>
          <p className="text-gray-500">
            {selectedDate
              ? 'No appointments scheduled for the selected date.'
              : 'There are no appointments scheduled yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dateAppointments = groupedAppointments[date];
            // Sort appointments by time
            const sortedAppointments = [...dateAppointments].sort((a, b) => 
              a.appointmentTime.localeCompare(b.appointmentTime)
            );

            return (
              <div key={date} className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                  <FiCalendar className="text-teal-600 text-xl" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {formatDate(date)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {sortedAppointments.length} appointment{sortedAppointments.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
