import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface TenantConfig {
  tenantId: string;
  clinicName: string;
  doctorName: string;
  doctorQualification?: string;
  specialization?: string;
  experienceYears?: string;
  patientsTreated?: string;
  aboutDoctor?: string;
  addressLine1: string;
  addressLine2?: string;
  phoneNumber: string;
  googleMapsUrl?: string;
  timings?: {
    morning?: string;
    afternoon?: string;
    evening?: string;
    closedDay?: string;
  };
  assets: {
    heroImage?: string;
    doctorImage?: string;
    gallery?: Array<{
      url: string;
      caption?: string;
    }>;
  };
  services: Array<{
    title: string;
    description?: string;
    image?: string;
  }>;
  branding: {
    logoUrl?: string;
    themeColor?: string;
    faviconUrl?: string;
  };
}

interface TenantContextType {
  config: TenantConfig | null;
  loading: boolean;
  error: string | null;
  setTenantId: (id: string) => void;
  currentTenantId: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTenantId] = useState<string | null>(
    localStorage.getItem("activeTenantId")
  );

  const fetchConfig = async (tenantId: string | null) => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (tenantId) {
        headers["x-tenant-id"] = tenantId;
      }

      const response = await fetch(`${API_URL}/tenant/config`, { headers });
      if (!response.ok) {
        throw new Error("Failed to fetch tenant configuration");
      }
      const data = await response.json();
      setConfig(data);
      applyBranding(data.branding);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching tenant config:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyBranding = (branding: TenantConfig["branding"]) => {
    if (branding.themeColor) {
      document.documentElement.style.setProperty("--primary", branding.themeColor);
      // Generate hover color (slightly darker) - simplistic approach
      // For a better approach, we could use a library or predefined shades
      document.documentElement.style.setProperty("--primary-hover", branding.themeColor + "CC"); 
      document.documentElement.style.setProperty("--primary-light", branding.themeColor + "1A");
    }
    
    if (branding.faviconUrl) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = branding.faviconUrl;
      }
    }
  };

  useEffect(() => {
    if (config?.clinicName) {
        document.title = config.clinicName;
    }
  }, [config]);

  useEffect(() => {
    // Check URL params for tenant override
    const params = new URLSearchParams(window.location.search);
    const tenantParam = params.get("tenant");
    
    if (tenantParam) {
      localStorage.setItem("activeTenantId", tenantParam);
      // Clean up URL and reload to apply
      window.location.href = window.location.pathname;
    } else {
      fetchConfig(currentTenantId);
    }
  }, []);

  const setTenantId = (id: string) => {
    localStorage.setItem("activeTenantId", id);
    // Reload to ensure all components re-fetch based on new tenant from scratch
    window.location.reload();
  };

  return (
    <TenantContext.Provider value={{ config, loading, error, setTenantId, currentTenantId }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
