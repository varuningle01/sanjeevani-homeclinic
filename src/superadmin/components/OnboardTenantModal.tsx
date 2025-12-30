import { useState } from "react";
import { onboardTenant } from "../services/superAdminTenantService";

interface OnboardTenantModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const OnboardTenantModal = ({ onClose, onSuccess }: OnboardTenantModalProps) => {
  const [formData, setFormData] = useState({
    // Basic & Auth
    tenantId: "",
    clinicName: "",
    adminUsername: "",
    adminPassword: "",
    domains: "",
    
    // Doctor Details
    doctorName: "Dr. Homeo",
    qualification: "",
    specialization: "",
    experience: "",
    
    // Contact & Location
    addressLine1: "",
    addressLine2: "",
    phoneNumber: "",
    googleMapsUrl: "",
    
    // Assets
    themeColor: "#0B7A75",
    logoUrl: "",
    heroImage: "",
    doctorImage: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("basic"); // basic, doctor, contact, assets

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const domainsArray = formData.domains.split(",").map((d) => d.trim()).filter((d) => d);
      
      const payload = {
        ...formData,
        domains: domainsArray,
        assets: {
            heroImage: formData.heroImage,
            doctorImage: formData.doctorImage
        },
        timings: { // Default timings for now, could be added to form if needed
            morning: "10:00 AM – 1:00 PM",
            afternoon: "5:00 PM – 9:00 PM",
            closedDay: "Sunday"
        }
      };

      await onboardTenant(payload);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to onboard tenant");
    } finally {
      setLoading(false);
    }
  };

  const renderTabButton = (id: string, label: string) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        activeTab === id 
            ? "border-indigo-600 text-indigo-600" 
            : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800">Onboard New Clinic</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="flex border-b px-4">
            {renderTabButton("basic", "Basic & Auth")}
            {renderTabButton("doctor", "Doctor Setup")}
            {renderTabButton("contact", "Contact Info")}
            {renderTabButton("assets", "Branding & Assets")}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
            {error && <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
            
            <form id="onboard-form" onSubmit={handleSubmit} className="space-y-4">
                
                {activeTab === "basic" && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tenant ID (Unique)</label>
                                <input type="text" name="tenantId" value={formData.tenantId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g. sanjeevani" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
                                <input type="text" name="clinicName" value={formData.clinicName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Admin Username</label>
                                <input type="text" name="adminUsername" value={formData.adminUsername} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Admin Password</label>
                                <input type="password" name="adminPassword" value={formData.adminPassword} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Domains (comma separated)</label>
                            <input type="text" name="domains" value={formData.domains} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="localhost, example.com" />
                        </div>
                    </div>
                )}

                {activeTab === "doctor" && (
                     <div className="space-y-4 animate-in fade-in">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
                            <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Qualification</label>
                                <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g. BHMS, MD" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                                <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g. 10" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Specialization</label>
                            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g. Homeopathic Dermatologist" />
                        </div>
                    </div>
                )}

                {activeTab === "contact" && (
                    <div className="space-y-4 animate-in fade-in">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                            <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Google Maps Embed URL</label>
                            <input type="text" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="https://..." />
                        </div>
                    </div>
                )}

                {activeTab === "assets" && (
                    <div className="space-y-4 animate-in fade-in">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Theme Color (Hex)</label>
                            <div className="flex gap-2">
                                <input type="color" name="themeColor" value={formData.themeColor} onChange={handleChange} className="h-10 w-12 border rounded cursor-pointer" />
                                <input type="text" name="themeColor" value={formData.themeColor} onChange={handleChange} className="mt-1 block flex-1 border border-gray-300 rounded-md px-3 py-2 uppercase" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                            <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hero Image URL</label>
                            <input type="text" name="heroImage" value={formData.heroImage} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="https://..." />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Doctor Image URL</label>
                            <input type="text" name="doctorImage" value={formData.doctorImage} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" placeholder="https://..." />
                        </div>
                        <p className="text-xs text-gray-500">Note: Default placeholder images will be used if URLs are left empty.</p>
                    </div>
                )}
            </form>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
            <button
              type="submit"
              form="onboard-form"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
              {loading ? "Onboarding..." : "Complete Onboarding"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardTenantModal;
