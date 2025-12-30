const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const superAdminLogin = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/superadmin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await response.json();
  localStorage.setItem("superAdminToken", data.token);
  localStorage.setItem("superAdminUser", JSON.stringify(data));
  return data;
};

export const getSuperAdminToken = () => localStorage.getItem("superAdminToken");

export const logoutSuperAdmin = () => {
  localStorage.removeItem("superAdminToken");
  localStorage.removeItem("superAdminUser");
  window.location.href = "/superadmin/login";
};

export const isSuperAdminAuthenticated = () => !!localStorage.getItem("superAdminToken");
