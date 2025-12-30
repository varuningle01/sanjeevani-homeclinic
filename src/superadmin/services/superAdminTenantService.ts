const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
import { getSuperAdminToken } from "./superAdminAuthService";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getSuperAdminToken()}`
});

export const fetchPlatformStats = async () => {
    const response = await fetch(`${API_URL}/superadmin/stats`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
};

export const fetchAllTenants = async () => {
  const response = await fetch(`${API_URL}/superadmin/tenants`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error("Failed to fetch tenants");
  return response.json();
};

export const onboardTenant = async (tenantData: any) => {
  const response = await fetch(`${API_URL}/superadmin/onboard`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(tenantData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Onboarding failed");
  }
  return response.json();
};

export const updateTenant = async (id: string, tenantData: any) => {
  const response = await fetch(`${API_URL}/superadmin/tenants/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(tenantData),
  });
  if (!response.ok) throw new Error("Update failed");
  return response.json();
};

export const deleteTenant = async (id: string) => {
  const response = await fetch(`${API_URL}/superadmin/tenants/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!response.ok) throw new Error("Delete failed");
  return response.json();
};
