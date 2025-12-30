import { useTenant } from "../context/TenantContext";

const ClinicLogo = ({ className = "w-16 h-16" }) => {
  const { config } = useTenant();

  if (config?.branding?.logoUrl) {
    return (
      <img
        src={config.branding.logoUrl}
        alt={config.clinicName}
        className={`${className} object-contain`}
      />
    );
  }

  return null;
};

export default ClinicLogo;
