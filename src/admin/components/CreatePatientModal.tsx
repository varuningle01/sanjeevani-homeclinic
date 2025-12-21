import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { FiX, FiUpload, FiUser } from 'react-icons/fi';
import type { AppDispatch } from '../../store/store';
import { createPatient, fetchPatients } from '../../store/slices/patientSlice';
import type { CreatePatientData } from '../types/patient.types';
import { isValidFileType, isValidFileSize } from '../utils/fileUtils';

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePatientModal = ({ isOpen, onClose }: CreatePatientModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreatePatientData>({
    name: '',
    age: 0,
    gender: 'Male',
    mobileNumber: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isValidFileType(file, ['image/'])) {
      setErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (5MB)
    if (!isValidFileSize(file, 5)) {
      setErrors(prev => ({ ...prev, photo: 'Image size must be less than 5MB' }));
      return;
    }

    setFormData(prev => ({ ...prev, photo: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setErrors(prev => ({ ...prev, photo: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age || formData.age < 1 || formData.age > 150) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\s/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await dispatch(createPatient(formData)).unwrap();
      await dispatch(fetchPatients());
      onClose();
      // Reset form
      setFormData({
        name: '',
        age: 0,
        gender: 'Male',
        mobileNumber: '',
      });
      setPhotoPreview('');
    } catch (error) {
      console.error('Failed to create patient:', error);
      setErrors({ submit: 'Failed to create patient. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Patient</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX className="text-xl text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
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
            <p className="text-xs text-gray-500 mt-2">Upload patient photo (optional)</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter patient name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleInputChange}
                min="1"
                max="150"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Age"
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="10-digit mobile number"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
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
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatientModal;
