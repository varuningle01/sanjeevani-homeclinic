import { useState, useEffect } from "react";
import { fetchPlatformStats, fetchAllTenants, deleteTenant } from "../services/superAdminTenantService";
import OnboardTenantModal from "../components/OnboardTenantModal";
import EditTenantModal from "../components/EditTenantModal";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any>(null);

  const loadData = async () => {
    try {
      const [statsData, tenantsData] = await Promise.all([
        fetchPlatformStats(),
        fetchAllTenants(),
      ]);
      setStats(statsData);
      setTenants(tenantsData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete tenant '${name}'? This cannot be undone.`)) {
      try {
        await deleteTenant(id);
        loadData(); // Reload data
      } catch (error) {
        alert("Failed to delete tenant");
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Total Tenants</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalTenants || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Active Tenants</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats?.activeTenants || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Suspended Tenants</div>
          <div className="text-3xl font-bold text-red-600 mt-2">{stats?.suspendedTenants || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Platform Status</div>
          <div className="text-xl font-bold text-indigo-600 mt-2 uppercase">{stats?.platformStatus || "Unknown"}</div>
        </div>
      </div>

      {/* Tenants Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Tenant Management</h2>
          <button
            onClick={() => setShowOnboardModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-sm"
          >
            + Onboard New Clinic
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tenant.tenantId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.clinicName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tenant.status === 'active' ? 'bg-green-100 text-green-800' : 
                        tenant.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{tenant.subscription?.plan || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {tenant.subscription?.expiryDate ? new Date(tenant.subscription.expiryDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingTenant(tenant)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tenant._id, tenant.clinicName)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No tenants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showOnboardModal && (
        <OnboardTenantModal
          onClose={() => setShowOnboardModal(false)}
          onSuccess={() => {
            setShowOnboardModal(false);
            loadData();
          }}
        />
      )}

      {editingTenant && (
        <EditTenantModal
          tenant={editingTenant}
          onClose={() => setEditingTenant(null)}
          onSuccess={() => {
            setEditingTenant(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard;
