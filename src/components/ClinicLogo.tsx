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

  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--primary-hover)" />
        </linearGradient>
      </defs>

      {/* Bottle */}
      <rect
        x="70"
        y="40"
        width="60"
        height="120"
        rx="12"
        fill="url(#tealGradient)"
      />

      {/* Cap */}
      <rect x="70" y="25" width="60" height="20" rx="6" fill="#0b5351" />

      {/* Liquid highlight */}
      <rect
        x="78"
        y="45"
        width="12"
        height="110"
        rx="6"
        fill="rgba(255,255,255,0.35)"
      />

      {/* Leaf */}
      <path
        d="M140 85C160 100 160 130 130 145C120 150 105 150 95 145C125 140 135 120 130 100C125 85 140 85 140 85Z"
        fill="url(#tealGradient)"
      />
    </svg>
  );
};

export default ClinicLogo;
