import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { FiX, FiUpload, FiUser, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { AppDispatch } from '../../store/store';
import { updatePatient, addPatientVisit, fetchPatientById } from '../../store/slices/patientSlice';
import type { PatientWithHistory, UpdatePatientData, AddVisitData } from '../types/patient.types';
import { isValidFileType, isValidFileSize } from '../utils/fileUtils';

interface UpdatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientWithHistory;
}

type TabType = 'details' | 'visit';

const UpdatePatientModal = ({ isOpen, onClose, patient }: UpdatePatientModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Basic Details Form
  const [detailsForm, setDetailsForm] = useState<UpdatePatientData>({
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    mobileNumber: patient.mobileNumber,
  });
  const [photoPreview, setPhotoPreview] = useState<string>(patient.photoUrl || '');

  // Visit Form
  const [visitForm, setVisitForm] = useState<AddVisitData>({
    visitDate: new Date().toISOString().slice(0, 16),
    notes: '',
  });
  const [reportFiles, setReportFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  // Details Tab Handlers
  const handleDetailsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetailsForm(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidFileType(file, ['image/'])) {
      setErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }));
      return;
    }

    if (!isValidFileSize(file, 5)) {
      setErrors(prev => ({ ...prev, photo: 'Image size must be less than 5MB' }));
      return;
    }

    setDetailsForm(prev => ({ ...prev, photo: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setErrors(prev => ({ ...prev, photo: '' }));
  };

  const handleUpdateDetails = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (detailsForm.name && !detailsForm.name.trim()) {
      newErrors.name = 'Name cannot be empty';
    }
    if (detailsForm.age && (detailsForm.age < 1 || detailsForm.age > 150)) {
      newErrors.age = 'Please enter a valid age';
    }
    if (detailsForm.mobileNumber && !/^\d{10}$/.test(detailsForm.mobileNumber.replace(/\s/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(updatePatient({ id: patient.id, data: detailsForm })).unwrap();
      await dispatch(fetchPatientById(patient.id));
      onClose();
    } catch (error) {
      console.error('Failed to update patient:', error);
      setErrors({ submit: 'Failed to update patient. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Visit Tab Handlers
  const handleVisitChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setVisitForm(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof AddVisitData] as object),
          [child]: parseFloat(value) || undefined,
        },
      }));
    } else {
      setVisitForm(prev => ({
        ...prev,
        [name]: name === 'weight' || name === 'temperature' || name === 'pulse' || name === 'height'
          ? parseFloat(value) || undefined
          : value,
      }));
    }
  };

  const handleReportFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (!isValidFileType(file, ['image/', 'application/pdf'])) {
        return false;
      }
      if (!isValidFileSize(file, 10)) {
        return false;
      }
      return true;
    });

    setReportFiles(prev => [...prev, ...validFiles]);
  };

  const removeReportFile = (index: number) => {
    setReportFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddVisit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await dispatch(addPatientVisit({
        patientId: patient.id,
        data: {
          ...visitForm,
          reports: reportFiles,
        },
      })).unwrap();
      await dispatch(fetchPatientById(patient.id));
      
      // Reset visit form
      setVisitForm({
        visitDate: new Date().toISOString().slice(0, 16),
        notes: '',
      });
      setReportFiles([]);
      
      onClose();
    } catch (error) {
      console.error('Failed to add visit:', error);
      setErrors({ submit: 'Failed to add visit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Update Patient</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX className="text-xl text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b sticky top-[65px] sm:top-[73px] bg-white z-10">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-4 sm:px-6 py-3 font-medium transition text-sm sm:text-base ${
              activeTab === 'details'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Basic Details
          </button>
          <button
            onClick={() => setActiveTab('visit')}
            className={`flex-1 px-4 sm:px-6 py-3 font-medium transition text-sm sm:text-base ${
              activeTab === 'visit'
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Add Visit
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'details' ? (
            <form onSubmit={handleUpdateDetails} className="space-y-5">
              {/* Photo Upload */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                      <FiUser className="text-4xl text-gray-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition shadow-lg"
                  >
                    <FiUpload className="text-sm" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                {errors.photo && (
                  <p className="text-red-500 text-xs mt-2">{errors.photo}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={detailsForm.name}
                  onChange={handleDetailsChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Age and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={detailsForm.age || ''}
                    onChange={handleDetailsChange}
                    min="1"
                    max="150"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={detailsForm.gender}
                    onChange={handleDetailsChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={detailsForm.mobileNumber}
                  onChange={handleDetailsChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Details'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddVisit} className="space-y-5">
              {/* Visit Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date & Time</label>
                <input
                  type="datetime-local"
                  name="visitDate"
                  value={visitForm.visitDate}
                  onChange={handleVisitChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Vital Signs */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Vital Signs</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Systolic BP</label>
                    <input
                      type="number"
                      name="bloodPressure.systolic"
                      onChange={handleVisitChange}
                      placeholder="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Diastolic BP</label>
                    <input
                      type="number"
                      name="bloodPressure.diastolic"
                      onChange={handleVisitChange}
                      placeholder="80"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      onChange={handleVisitChange}
                      placeholder="70"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Temperature (°F)</label>
                    <input
                      type="number"
                      name="temperature"
                      onChange={handleVisitChange}
                      placeholder="98.6"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Pulse (bpm)</label>
                    <input
                      type="number"
                      name="pulse"
                      onChange={handleVisitChange}
                      placeholder="72"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      onChange={handleVisitChange}
                      placeholder="170"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={visitForm.notes}
                  onChange={handleVisitChange}
                  rows={4}
                  placeholder="Add any observations, symptoms, or treatment notes..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Medical Reports Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Reports</label>
                <button
                  type="button"
                  onClick={() => reportInputRef.current?.click()}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition flex items-center justify-center gap-2 text-gray-600"
                >
                  <FiPlus />
                  <span>Add Reports (Images/PDFs)</span>
                </button>
                <input
                  ref={reportInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={handleReportFilesChange}
                  className="hidden"
                />

                {/* Report Files List */}
                {reportFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {reportFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FiUpload className="text-teal-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeReportFile(index)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Visit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePatientModal;
