import { useTenant } from "../context/TenantContext";
import { useState, useEffect } from "react";
import { FiSettings, FiX } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TenantSwitcher = () => {
  const { setTenantId, currentTenantId } = useTenant();
  const [isOpen, setIsOpen] = useState(false);

  // Feature flag check
  const isEnabled = import.meta.env.VITE_ENABLE_TENANT_SWITCHER === "true";
  
  if (!isEnabled) return null;

  const [tenants, setTenants] = useState<{id: string, name: string, color: string}[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/tenant/list`)
        .then(res => res.json())
        .then(data => setTenants(data))
        .catch(err => console.error("Failed to fetch tenants", err));
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 mb-3 w-64 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Switch Tenant (Dev)</h3>
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
          <p className="text-[10px] text-gray-400 mt-4 text-center">
            Only visible because VITE_ENABLE_TENANT_SWITCHER is true
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-gray-700 p-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:scale-110 active:scale-95 group"
        >
          <FiSettings size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};

export default TenantSwitcher;
