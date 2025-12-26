import { useTenant } from "../context/TenantContext";
import { useState } from "react";
import { FiSettings, FiX } from "react-icons/fi";

const TenantSwitcher = () => {
  const { setTenantId, currentTenantId } = useTenant();
  const [isOpen, setIsOpen] = useState(false);

  // In a real app, this might come from an API of available tenants
  const tenants = [
    { id: "sanjeevani", name: "Sanjeevani Clinic", color: "#0B7A75" },
    { id: "test-clinic", name: "Test Clinic", color: "#4f46e5" },
  ];

  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 mb-3 w-64 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Switch Tenant</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <FiX size={18} />
            </button>
          </div>
          
          <div className="space-y-2">
            {tenants.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTenantId(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition border-2 ${
                  currentTenantId === t.id 
                    ? "border-primary bg-primaryLight" 
                    : "border-transparent bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full shadow-sm" 
                  style={{ backgroundColor: t.color }}
                />
                <span className={`text-sm font-medium ${currentTenantId === t.id ? 'text-primary' : 'text-gray-700'}`}>
                  {t.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-gray-700 p-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:scale-110 active:scale-95 group"
          title="Dev Tenant Switcher"
        >
          <FiSettings size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};

export default TenantSwitcher;
