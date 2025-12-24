import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { FiX, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { AppDispatch } from '../../store/store';
import { updatePatientVisit } from '../../store/slices/patientSlice';
import type { PatientVisit, UpdateVisitData, MedicalReport } from '../types/patient.types';
import { isValidFileType, isValidFileSize } from '../utils/fileUtils';

interface UpdateVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: PatientVisit;
}

const UpdateVisitModal = ({ isOpen, onClose, visit }: UpdateVisitModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const reportInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [visitForm, setVisitForm] = useState<UpdateVisitData>({
    visitDate: visit.visitDate,
    bloodPressure: visit.bloodPressure,
    weight: visit.weight,
    temperature: visit.temperature,
    pulse: visit.pulse,
    height: visit.height,
    notes: visit.notes,
  });
  
  const [existingReports, setExistingReports] = useState<MedicalReport[]>(visit.reports);
  const [newReportFiles, setNewReportFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleVisitChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setVisitForm(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof UpdateVisitData] as object),
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

    setNewReportFiles(prev => [...prev, ...validFiles]);
  };

  const removeNewReportFile = (index: number) => {
    setNewReportFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingReport = (reportId: string) => {
    setExistingReports(prev => prev.filter(r => r.id !== reportId));
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await dispatch(updatePatientVisit({
        visitId: visit.id,
        data: {
          ...visitForm,
          reports: newReportFiles,
          existingReports: existingReports,
        },
      })).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Failed to update visit:', error);
      setErrors({ submit: 'Failed to update visit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Update Visit Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX className="text-xl text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Visit Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date & Time</label>
              <input
                type="datetime-local"
                name="visitDate"
                value={visitForm.visitDate?.slice(0, 16)}
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
                    value={visitForm.bloodPressure?.systolic || ''}
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
                    value={visitForm.bloodPressure?.diastolic || ''}
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
                    value={visitForm.weight || ''}
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
                    value={visitForm.temperature || ''}
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
                    value={visitForm.pulse || ''}
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
                    value={visitForm.height || ''}
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
                value={visitForm.notes || ''}
                onChange={handleVisitChange}
                rows={4}
                placeholder="Add any observations, symptoms, or treatment notes..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Medical Reports */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical Reports</label>
              
              {/* Existing Reports */}
              {existingReports.length > 0 && (
                <div className="mb-3 space-y-2">
                  <p className="text-xs text-gray-500 font-medium uppercase">Existing Reports</p>
                  {existingReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-sm text-gray-700 truncate">{report.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingReport(report.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => reportInputRef.current?.click()}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition flex items-center justify-center gap-2 text-gray-600"
              >
                <FiPlus />
                <span>Add New Reports (Images/PDFs)</span>
              </button>
              <input
                ref={reportInputRef}
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={handleReportFilesChange}
                className="hidden"
              />

              {/* New Report Files List */}
              {newReportFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                   <p className="text-xs text-gray-500 font-medium uppercase">New Uploads</p>
                  {newReportFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-teal-100"
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
                        onClick={() => removeNewReportFile(index)}
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
                {isSubmitting ? 'Updating...' : 'Update Visit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateVisitModal;
