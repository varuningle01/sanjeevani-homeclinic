import { useState } from "react";
import { updateTenant } from "../services/superAdminTenantService";

interface EditTenantModalProps {
  tenant: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTenantModal = ({ tenant, onClose, onSuccess }: EditTenantModalProps) => {
  const [formData, setFormData] = useState({
    clinicName: tenant.clinicName,
    status: tenant.status,
    plan: tenant.subscription?.plan || "trial",
    subscriptionStatus: tenant.subscription?.status || "active",
    expiryDate: tenant.subscription?.expiryDate ? new Date(tenant.subscription.expiryDate).toISOString().split('T')[0] : "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updatePayload = {
        clinicName: formData.clinicName,
        status: formData.status,
        subscription: {
          plan: formData.plan,
          status: formData.subscriptionStatus,
          expiryDate: formData.expiryDate,
        },
      };

      await updateTenant(tenant._id, updatePayload);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to update tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Edit Tenant: {tenant.tenantId}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Clinic Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Subscription Status</label>
              <select
                name="subscriptionStatus"
                value={formData.subscriptionStatus}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="trial">Trial</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
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
               {loading ? "Updating..." : "Update Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTenantModal;
