import type {
  Patient,
  PatientWithHistory,
  CreatePatientData,
  UpdatePatientData,
  AddVisitData,
  UpdateVisitData,
  PatientVisit,
  MedicalReport,
} from '../types/patient.types';
import { getCurrentISOString } from '../utils/dateUtils';
import { fileToBase64, compressImage, isImageFile, getFileTypeCategory, generateFileId } from '../utils/fileUtils';

const STORAGE_KEY = 'sanjeevani_patients';
const VISITS_STORAGE_KEY = 'sanjeevani_visits';

/**
 * Get all patients from localStorage
 */
export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};

/**
 * Get single patient with full history
 */
export const getPatientById = async (id: string): Promise<PatientWithHistory | null> => {
  try {
    const patients = await getAllPatients();
    const patient = patients.find(p => p.id === id);
    
    if (!patient) return null;

    const visits = await getPatientVisits(id);
    
    return {
      ...patient,
      visits,
    };
  } catch (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
};

/**
 * Create new patient
 */
export const createPatient = async (data: CreatePatientData): Promise<Patient> => {
  try {
    const patients = await getAllPatients();
    
    let photoUrl: string | undefined;
    if (data.photo) {
      if (typeof data.photo === 'string') {
        photoUrl = data.photo;
      } else {
        // Compress and convert to base64
        photoUrl = await compressImage(data.photo);
      }
    }

    const newPatient: Patient = {
      id: `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      age: data.age,
      gender: data.gender,
      mobileNumber: data.mobileNumber,
      photoUrl,
      createdAt: getCurrentISOString(),
      updatedAt: getCurrentISOString(),
    };

    patients.push(newPatient);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));

    return newPatient;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

/**
 * Update patient details
 */
export const updatePatient = async (id: string, data: UpdatePatientData): Promise<Patient> => {
  try {
    const patients = await getAllPatients();
    const index = patients.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error('Patient not found');
    }

    let photoUrl = patients[index].photoUrl;
    if (data.photo) {
      if (typeof data.photo === 'string') {
        photoUrl = data.photo;
      } else {
        photoUrl = await compressImage(data.photo);
      }
    }

    const updatedPatient: Patient = {
      ...patients[index],
      ...data,
      photoUrl,
      updatedAt: getCurrentISOString(),
    };

    patients[index] = updatedPatient;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));

    return updatedPatient;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

/**
 * Delete patient
 */
export const deletePatient = async (id: string): Promise<void> => {
  try {
    const patients = await getAllPatients();
    const filtered = patients.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // Also delete all visits for this patient
    const allVisits = await getAllVisits();
    const filteredVisits = allVisits.filter(v => v.patientId !== id);
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(filteredVisits));
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

/**
 * Get all visits from localStorage
 */
const getAllVisits = async (): Promise<PatientVisit[]> => {
  try {
    const data = localStorage.getItem(VISITS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching visits:', error);
    return [];
  }
};

/**
 * Get visits for a specific patient
 */
export const getPatientVisits = async (patientId: string): Promise<PatientVisit[]> => {
  try {
    const allVisits = await getAllVisits();
    return allVisits.filter(v => v.patientId === patientId);
  } catch (error) {
    console.error('Error fetching patient visits:', error);
    return [];
  }
};

/**
 * Add new visit for a patient
 */
export const addVisit = async (patientId: string, data: AddVisitData): Promise<PatientVisit> => {
  try {
    const allVisits = await getAllVisits();
    
    // Process report files
    const reports: MedicalReport[] = [];
    if (data.reports && data.reports.length > 0) {
      for (const file of data.reports) {
        const fileUrl = isImageFile(file) 
          ? await compressImage(file, 1200, 0.9)
          : await fileToBase64(file);

        const report: MedicalReport = {
          id: generateFileId(),
          visitId: '', // Will be set after visit is created
          fileName: file.name,
          fileType: getFileTypeCategory(file),
          fileUrl,
          uploadedAt: getCurrentISOString(),
          fileSize: file.size,
        };
        reports.push(report);
      }
    }

    const newVisit: PatientVisit = {
      id: `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patientId,
      visitDate: data.visitDate || getCurrentISOString(),
      bloodPressure: data.bloodPressure,
      weight: data.weight,
      temperature: data.temperature,
      pulse: data.pulse,
      height: data.height,
      notes: data.notes,
      reports: reports.map(r => ({ ...r, visitId: `visit_${Date.now()}` })),
    };

    allVisits.push(newVisit);
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(allVisits));

    // Update patient's updatedAt timestamp
    const patients = await getAllPatients();
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex !== -1) {
      patients[patientIndex].updatedAt = getCurrentISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    }

    return newVisit;
  } catch (error) {
    console.error('Error adding visit:', error);
    throw error;
  }
};

/**
 * Upload report to an existing visit
 */
export const uploadReport = async (visitId: string, file: File): Promise<MedicalReport> => {
  try {
    const allVisits = await getAllVisits();
    const visitIndex = allVisits.findIndex(v => v.id === visitId);

    if (visitIndex === -1) {
      throw new Error('Visit not found');
    }

    const fileUrl = isImageFile(file)
      ? await compressImage(file, 1200, 0.9)
      : await fileToBase64(file);

    const report: MedicalReport = {
      id: generateFileId(),
      visitId,
      fileName: file.name,
      fileType: getFileTypeCategory(file),
      fileUrl,
      uploadedAt: getCurrentISOString(),
      fileSize: file.size,
    };

    allVisits[visitIndex].reports.push(report);
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(allVisits));

    return report;
  } catch (error) {
    console.error('Error uploading report:', error);
    throw error;
  }
};

/**
 * Update a visit
 */
export const updateVisit = async (visitId: string, data: UpdateVisitData): Promise<PatientVisit> => {
  try {
    const allVisits = await getAllVisits();
    const visitIndex = allVisits.findIndex(v => v.id === visitId);

    if (visitIndex === -1) {
      throw new Error('Visit not found');
    }

    const currentVisit = allVisits[visitIndex];
    
    // Process new report files
    const newReports: MedicalReport[] = [];
    if (data.reports && data.reports.length > 0) {
      for (const file of data.reports) {
        const fileUrl = isImageFile(file) 
          ? await compressImage(file, 1200, 0.9)
          : await fileToBase64(file);

        const report: MedicalReport = {
          id: generateFileId(),
          visitId: visitId,
          fileName: file.name,
          fileType: getFileTypeCategory(file),
          fileUrl,
          uploadedAt: getCurrentISOString(),
          fileSize: file.size,
        };
        newReports.push(report);
      }
    }

    // Combine existing kept reports with new ones
    // If existingReports is not provided, we keep all current reports (safety default),
    // unless the logic is "replace all", but usually for updates we pass back what we want to keep.
    // However, in the type definition I made `existingReports` optional. 
    // Let's assume if it is passed, we filter. If not passed, we might assume no change to existing? 
    // Or simpler: The UI will pass the full list of "kept" reports.
    
    let finalReports = currentVisit.reports;
    if (data.existingReports) {
      finalReports = data.existingReports;
    }
    
    finalReports = [...finalReports, ...newReports];

    const updatedVisit: PatientVisit = {
      ...currentVisit,
      ...data,
      reports: finalReports,
      // Ensure we don't accidentally overwrite with undefined if only partial data came in, 
      // but `UpdateVisitData` fields are optional.
      // We should only update fields that are present in `data`.
      // The spread `...data` above handles it for simple fields, but we need to be careful not to unset things if `data` has undefineds.
      // Actually `...data` with undefined values does NOT overwrite existing values in JS spread? 
      // Wait, `{ a: 1, ...{ a: undefined } }` results in `{ a: undefined }`. 
      // So we need to clean `data` of undefineds or handle explicitly.
    };

    // Explicitly update fields if provided
    if (data.visitDate) updatedVisit.visitDate = data.visitDate;
    if (data.bloodPressure) updatedVisit.bloodPressure = data.bloodPressure;
    if (data.weight !== undefined) updatedVisit.weight = data.weight;
    if (data.temperature !== undefined) updatedVisit.temperature = data.temperature;
    if (data.pulse !== undefined) updatedVisit.pulse = data.pulse;
    if (data.height !== undefined) updatedVisit.height = data.height;
    if (data.notes !== undefined) updatedVisit.notes = data.notes;
    
    // Reports are already handled.

    allVisits[visitIndex] = updatedVisit;
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(allVisits));

    // Update patient's updatedAt timestamp
    const patients = await getAllPatients();
    const patientIndex = patients.findIndex(p => p.id === currentVisit.patientId);
    if (patientIndex !== -1) {
      patients[patientIndex].updatedAt = getCurrentISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    }

    return updatedVisit;
  } catch (error) {
    console.error('Error updating visit:', error);
    throw error;
  }
};

/**
 * Delete a visit
 */
export const deleteVisit = async (visitId: string): Promise<void> => {
  try {
    const allVisits = await getAllVisits();
    const visit = allVisits.find(v => v.id === visitId);
    
    if (!visit) {
        // Already gone, verify effectively deleted.
        return;
    }

    const filteredVisits = allVisits.filter(v => v.id !== visitId);
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(filteredVisits));

    // Update patient's updatedAt
    const patients = await getAllPatients();
    const patientIndex = patients.findIndex(p => p.id === visit.patientId);
    if (patientIndex !== -1) {
      patients[patientIndex].updatedAt = getCurrentISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    }
  } catch (error) {
    console.error('Error deleting visit:', error);
    throw error;
  }
};
