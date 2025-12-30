import { useState } from "react";
import { onboardTenant } from "../services/superAdminTenantService";

interface OnboardTenantModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const OnboardTenantModal = ({ onClose, onSuccess }: OnboardTenantModalProps) => {
  const [formData, setFormData] = useState({
    tenantId: "",
    clinicName: "",
    adminUsername: "",
    adminPassword: "",
    domains: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const domainsArray = formData.domains.split(",").map((d) => d.trim()).filter((d) => d);
      await onboardTenant({ ...formData, domains: domainsArray });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to onboard tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Onboard New Clinic</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenant ID (Unique)</label>
            <input
              type="text"
              name="tenantId"
              value={formData.tenantId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g. sanjeevani-clinic"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
            <input
              type="text"
              name="clinicName"
              value={formData.clinicName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Username</label>
            <input
              type="text"
              name="adminUsername"
              value={formData.adminUsername}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Password</label>
            <input
              type="password"
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Domains (comma separated)</label>
            <input
              type="text"
              name="domains"
              value={formData.domains}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="localhost, example.com"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Onboarding..." : "Onboard Clinic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardTenantModal;
