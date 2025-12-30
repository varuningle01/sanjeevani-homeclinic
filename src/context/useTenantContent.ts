import { useTenant } from "./TenantContext";
import doctorDefault from "../assets/prashant-doctor.png";

// Default Fallback Data (SaaS Defaults)
const DEFAULTS = {
  clinicName: "My Homeo Clinic",
  doctorName: "Dr. Homeo",
  specialization: "Homeopathy Specialist",
  about: "Providing the best homeopathic care for you and your family.",
  heroImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2070",
  doctorImage: doctorDefault,
  logoUrl: "", // Empty will usage text logo
  addressLine1: "123 Health Street",
  phoneNumber: "123-456-7890",
  email: "contact@clinic.com",
};

export const useTenantContent = () => {
  const { config, loading } = useTenant();


  return {
    clinicName: config?.clinicName || DEFAULTS.clinicName,
    doctorName: config?.doctorName || DEFAULTS.doctorName,
    specialization: config?.specialization || DEFAULTS.specialization,
    heroImage: config?.assets?.heroImage || DEFAULTS.heroImage,
    doctorImage: config?.assets?.doctorImage || DEFAULTS.doctorImage,
    logoUrl: config?.branding?.logoUrl || DEFAULTS.logoUrl,
    address: {
        line1: config?.addressLine1 || DEFAULTS.addressLine1,
        line2: config?.addressLine2 || "",
        phone: config?.phoneNumber || DEFAULTS.phoneNumber
    },
    timings: config?.timings || {},
    services: config?.services || [],
    loading
  };
};
