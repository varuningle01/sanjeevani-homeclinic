import type {
  Patient,
  PatientWithHistory,
  CreatePatientData,
  UpdatePatientData,
  AddVisitData,
  UpdateVisitData,
  PatientVisit,
} from "../types/patient.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeader = (): Record<string, string> => {
  const savedAuth = localStorage.getItem("adminAuth");
  if (savedAuth) {
    const { token } = JSON.parse(savedAuth);
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

/**
 * Data mapping utilities
 */
const mapBackendToPatient = (bp: any): Patient => ({
  id: bp._id,
  name: bp.name,
  age: bp.age,
  gender: bp.gender.charAt(0).toUpperCase() + bp.gender.slice(1),
  mobileNumber: bp.mobile,
  photoUrl: bp.profilePhoto,
  createdAt: bp.createdAt,
  updatedAt: bp.updatedAt,
});

const mapBackendToVisit = (bv: any): PatientVisit => ({
  id: bv._id,
  patientId: bv.patientId,
  visitDate: bv.visitDate,
  bloodPressure: bv.bloodPressure,
  weight: bv.weight,
  temperature: bv.temperature,
  pulse: bv.pulse,
  height: bv.height,
  notes: bv.notes,
  reports: bv.reports.map((r: any) => ({
    id: r._id,
    visitId: bv._id,
    fileName: r.fileName || "Report",
    fileType: r.type,
    fileUrl: r.url,
    uploadedAt: r.uploadedAt,
  })),
});

/**
 * Get all patients from backend
 */
export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    const response = await fetch(`${API_URL}/patients`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to fetch patients");
    const data = await response.json();
    return data.map(mapBackendToPatient);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
};

/**
 * Get single patient with full history
 */
export const getPatientById = async (
  id: string
): Promise<PatientWithHistory | null> => {
  try {
    const [pResponse, vResponse] = await Promise.all([
      fetch(`${API_URL}/patients/${id}`, { headers: getAuthHeader() }),
      fetch(`${API_URL}/patients/${id}/visits`, { headers: getAuthHeader() }),
    ]);

    if (!pResponse.ok) return null;

    const patientData = await pResponse.json();
    const visitsData = await vResponse.json();

    return {
      ...mapBackendToPatient(patientData),
      visits: Array.isArray(visitsData)
        ? visitsData.map(mapBackendToVisit)
        : [],
    };
  } catch (error) {
    console.error("Error fetching patient:", error);
    return null;
  }
};

/**
 * Create new patient
 */
export const createPatient = async (
  data: CreatePatientData
): Promise<Patient> => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("age", data.age.toString());
    formData.append("gender", data.gender.toLowerCase());
    formData.append("mobile", data.mobileNumber);
    if (data.photo instanceof File) {
      formData.append("profilePhoto", data.photo);
    }

    const response = await fetch(`${API_URL}/patients`, {
      method: "POST",
      headers: getAuthHeader(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create patient");
    }

    const result = await response.json();
    return mapBackendToPatient(result.patient);
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
};

/**
 * Update patient details
 */
export const updatePatient = async (
  id: string,
  data: UpdatePatientData
): Promise<Patient> => {
  try {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.age) formData.append("age", data.age.toString());
    if (data.gender) formData.append("gender", data.gender.toLowerCase());
    if (data.mobileNumber) formData.append("mobile", data.mobileNumber);
    if (data.photo instanceof File) {
      formData.append("profilePhoto", data.photo);
    } else if (typeof data.photo === "string") {
      // Handle existing photo if needed, though typically we just don't send anything if it didn't change
    }

    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to update patient");

    const result = await response.json();
    return mapBackendToPatient(result);
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
};

/**
 * Delete patient
 */
export const deletePatient = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to delete patient");
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
};

/**
 * Add new visit for a patient
 */
export const addVisit = async (
  patientId: string,
  data: AddVisitData
): Promise<PatientVisit> => {
  try {
    const formData = new FormData();
    formData.append("visitDate", data.visitDate);
    if (data.notes) formData.append("notes", data.notes);
    if (data.bloodPressure)
      formData.append("bloodPressure", JSON.stringify(data.bloodPressure));
    if (data.weight) formData.append("weight", data.weight.toString());
    if (data.temperature)
      formData.append("temperature", data.temperature.toString());
    if (data.pulse) formData.append("pulse", data.pulse.toString());
    if (data.height) formData.append("height", data.height.toString());

    if (data.reports) {
      data.reports.forEach((file) => {
        formData.append("reports", file);
      });
    }

    const response = await fetch(`${API_URL}/patients/${patientId}/visits`, {
      method: "POST",
      headers: getAuthHeader(),
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to add visit");

    const result = await response.json();
    return mapBackendToVisit(result);
  } catch (error) {
    console.error("Error adding visit:", error);
    throw error;
  }
};

/**
 * Update a visit
 */
export const updateVisit = async (
  visitId: string,
  data: UpdateVisitData
): Promise<PatientVisit> => {
  try {
    const formData = new FormData();
    if (data.visitDate) formData.append("visitDate", data.visitDate);
    if (data.notes !== undefined) formData.append("notes", data.notes);
    if (data.bloodPressure)
      formData.append("bloodPressure", JSON.stringify(data.bloodPressure));
    if (data.weight !== undefined)
      formData.append("weight", data.weight.toString());
    if (data.temperature !== undefined)
      formData.append("temperature", data.temperature.toString());
    if (data.pulse !== undefined)
      formData.append("pulse", data.pulse.toString());
    if (data.height !== undefined)
      formData.append("height", data.height.toString());

    if (data.existingReports) {
      // Map MedicalReport back to what backend expects
      const reportsToKeep = data.existingReports.map((r) => ({
        url: r.fileUrl,
        type: r.fileType,
        fileName: r.fileName,
        _id: r.id,
      }));
      formData.append("existingReports", JSON.stringify(reportsToKeep));
    }

    if (data.reports) {
      data.reports.forEach((file) => {
        formData.append("reports", file);
      });
    }

    const response = await fetch(`${API_URL}/patients/visits/${visitId}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to update visit");

    const result = await response.json();
    return mapBackendToVisit(result);
  } catch (error) {
    console.error("Error updating visit:", error);
    throw error;
  }
};

/**
 * Delete a visit
 */
export const deleteVisit = async (visitId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/patients/visits/${visitId}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error("Failed to delete visit");
  } catch (error) {
    console.error("Error deleting visit:", error);
    throw error;
  }
};
