import { useState, useEffect } from "react";
import { updateTenant } from "../services/superAdminTenantService";

interface EditTenantModalProps {
  tenant: any;
  onClose: () => void;
  onSuccess: () => void;
}

const TABS = [
  { id: "basic", label: "Basic Info" },
  { id: "doctor", label: "Doctor" },
  { id: "branding", label: "Branding" },
  { id: "assets", label: "Assets" },
  { id: "services", label: "Services" },
  { id: "timings", label: "Timings" },
  { id: "subscription", label: "Subscription" },
];

const EditTenantModal = ({
  tenant,
  onClose,
  onSuccess,
}: EditTenantModalProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize state with safely accessed tenant data
  const [formData, setFormData] = useState<any>({
    clinicName: "",
    addressLine1: "",
    addressLine2: "",
    phoneNumber: "",
    googleMapsUrl: "",
    doctorName: "",
    doctorQualification: "",
    specialization: "",
    experienceYears: "",
    patientsTreated: "",
    aboutDoctor: "",
    branding: { logoUrl: "", themeColor: "#0B7A75" },
    assets: { heroImage: "", doctorImage: "", gallery: [] },
    services: [],
    timings: { morning: "", afternoon: "", evening: "", closedDay: "" },
    status: "active",
    subscription: { plan: "trial", status: "active", expiryDate: "" },
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        clinicName: tenant.clinicName || "",
        addressLine1: tenant.addressLine1 || "",
        addressLine2: tenant.addressLine2 || "",
        phoneNumber: tenant.phoneNumber || "",
        googleMapsUrl: tenant.googleMapsUrl || "",
        doctorName: tenant.doctorName || "",
        doctorQualification: tenant.doctorQualification || "",
        specialization: tenant.specialization || "",
        experienceYears: tenant.experienceYears || "",
        patientsTreated: tenant.patientsTreated || "",
        aboutDoctor: tenant.aboutDoctor || "",
        branding: {
          logoUrl: tenant.branding?.logoUrl || "",
          themeColor: tenant.branding?.themeColor || "#0B7A75",
        },
        assets: {
          heroImage: tenant.assets?.heroImage || "",
          doctorImage: tenant.assets?.doctorImage || "",
          gallery: tenant.assets?.gallery || [],
        },
        services: tenant.services || [],
        timings: {
          morning: tenant.timings?.morning || "",
          afternoon: tenant.timings?.afternoon || "",
          evening: tenant.timings?.evening || "",
          closedDay: tenant.timings?.closedDay || "",
        },
        status: tenant.status || "active",
        subscription: {
          plan: tenant.subscription?.plan || "trial",
          status: tenant.subscription?.status || "active",
          expiryDate: tenant.subscription?.expiryDate
            ? new Date(tenant.subscription.expiryDate)
                .toISOString()
                .split("T")[0]
            : "",
        },
      });
    }
  }, [tenant]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleServiceChange = (index: number, field: string, value: string) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setFormData({ ...formData, services: updatedServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [
        ...formData.services,
        { title: "", description: "", image: "" },
      ],
    });
  };

  const removeService = (index: number) => {
    const updatedServices = formData.services.filter(
      (_: any, i: number) => i !== index
    );
    setFormData({ ...formData, services: updatedServices });
  };

  // Gallery Handlers
  const handleGalleryChange = (index: number, field: string, value: string) => {
    const updatedGallery = [...formData.assets.gallery];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    handleNestedChange("assets", "gallery", updatedGallery);
  };

  const addGalleryItem = () => {
    const updatedGallery = [
      ...formData.assets.gallery,
      { before: "", after: "", caption: "" },
    ];
    handleNestedChange("assets", "gallery", updatedGallery);
  };

  const removeGalleryItem = (index: number) => {
    const updatedGallery = formData.assets.gallery.filter(
      (_: any, i: number) => i !== index
    );
    handleNestedChange("assets", "gallery", updatedGallery);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateTenant(tenant._id, formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to update tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h3 className="text-xl font-bold text-gray-800">
            Edit Tenant: {formData.clinicName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-white">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form
            id="edit-tenant-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* BASIC INFO */}
            {activeTab === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Google Maps Embed URL
                  </label>
                  <input
                    type="text"
                    name="googleMapsUrl"
                    value={formData.googleMapsUrl}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {/* DOCTOR INFO */}
            {activeTab === "doctor" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="doctorQualification"
                    value={formData.doctorQualification}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Experience Years
                  </label>
                  <input
                    type="text"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Patients Treated
                  </label>
                  <input
                    type="text"
                    name="patientsTreated"
                    value={formData.patientsTreated}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    About Doctor
                  </label>
                  <textarea
                    name="aboutDoctor"
                    value={formData.aboutDoctor}
                    onChange={handleChange}
                    className="input-field h-24"
                  />
                </div>
              </div>
            )}

            {/* BRANDING */}
            {activeTab === "branding" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={formData.branding.logoUrl}
                    onChange={(e) =>
                      handleNestedChange("branding", "logoUrl", e.target.value)
                    }
                    className="input-field"
                  />
                  {formData.branding.logoUrl && (
                    <img
                      src={formData.branding.logoUrl}
                      alt="Logo Preview"
                      className="h-10 mt-2 object-contain border p-1 rounded"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.branding.themeColor}
                      onChange={(e) =>
                        handleNestedChange(
                          "branding",
                          "themeColor",
                          e.target.value
                        )
                      }
                      className="h-10 w-20 p-1 border rounded"
                    />
                    <input
                      type="text"
                      value={formData.branding.themeColor}
                      onChange={(e) =>
                        handleNestedChange(
                          "branding",
                          "themeColor",
                          e.target.value
                        )
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ASSETS */}
            {activeTab === "assets" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Hero Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.assets.heroImage}
                      onChange={(e) =>
                        handleNestedChange(
                          "assets",
                          "heroImage",
                          e.target.value
                        )
                      }
                      className="input-field"
                    />
                    {formData.assets.heroImage && (
                      <img
                        src={formData.assets.heroImage}
                        className="w-full h-32 object-cover mt-2 rounded"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Doctor Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.assets.doctorImage}
                      onChange={(e) =>
                        handleNestedChange(
                          "assets",
                          "doctorImage",
                          e.target.value
                        )
                      }
                      className="input-field"
                    />
                    {formData.assets.doctorImage && (
                      <img
                        src={formData.assets.doctorImage}
                        className="w-full h-32 object-cover mt-2 rounded"
                      />
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-700">
                      Gallery (Before/After)
                    </h4>
                    <button
                      type="button"
                      onClick={addGalleryItem}
                      className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100"
                    >
                      + Add Image Pair
                    </button>
                  </div>
                  {formData.assets.gallery.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg mb-3 relative border border-gray-200"
                    >
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-500">
                            Before Image URL
                          </label>
                          <input
                            type="text"
                            value={item.before || ""}
                            onChange={(e) =>
                              handleGalleryChange(
                                index,
                                "before",
                                e.target.value
                              )
                            }
                            className="input-field text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">
                            After Image URL
                          </label>
                          <input
                            type="text"
                            value={item.after || ""}
                            onChange={(e) =>
                              handleGalleryChange(
                                index,
                                "after",
                                e.target.value
                              )
                            }
                            className="input-field text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">
                            Caption
                          </label>
                          <input
                            type="text"
                            value={item.caption || ""}
                            onChange={(e) =>
                              handleGalleryChange(
                                index,
                                "caption",
                                e.target.value
                              )
                            }
                            className="input-field text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SERVICES */}
            {activeTab === "services" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-700">Services</h4>
                  <button
                    type="button"
                    onClick={addService}
                    className="text-sm bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
                  >
                    + Add Service
                  </button>
                </div>
                {formData.services.map((service: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) =>
                            handleServiceChange(index, "title", e.target.value)
                          }
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={service.image}
                          onChange={(e) =>
                            handleServiceChange(index, "image", e.target.value)
                          }
                          className="input-field"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700">
                          Description
                        </label>
                        <input
                          type="text"
                          value={service.description}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TIMINGS */}
            {activeTab === "timings" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Morning Slot
                  </label>
                  <input
                    type="text"
                    value={formData.timings.morning}
                    onChange={(e) =>
                      handleNestedChange("timings", "morning", e.target.value)
                    }
                    className="input-field"
                    placeholder="e.g. 10:00 AM – 1:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Afternoon Slot
                  </label>
                  <input
                    type="text"
                    value={formData.timings.afternoon}
                    onChange={(e) =>
                      handleNestedChange("timings", "afternoon", e.target.value)
                    }
                    className="input-field"
                    placeholder="e.g. 2:00 PM – 5:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Evening Slot
                  </label>
                  <input
                    type="text"
                    value={formData.timings.evening}
                    onChange={(e) =>
                      handleNestedChange("timings", "evening", e.target.value)
                    }
                    className="input-field"
                    placeholder="e.g. 6:00 PM – 9:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Closed Day
                  </label>
                  <input
                    type="text"
                    value={formData.timings.closedDay}
                    onChange={(e) =>
                      handleNestedChange("timings", "closedDay", e.target.value)
                    }
                    className="input-field"
                    placeholder="e.g. Sunday"
                  />
                </div>
              </div>
            )}

            {/* SUBSCRIPTION */}
            {activeTab === "subscription" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tenant Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subscription Status
                  </label>
                  <select
                    value={formData.subscription.status}
                    onChange={(e) =>
                      handleNestedChange(
                        "subscription",
                        "status",
                        e.target.value
                      )
                    }
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Plan
                  </label>
                  <select
                    value={formData.subscription.plan}
                    onChange={(e) =>
                      handleNestedChange("subscription", "plan", e.target.value)
                    }
                    className="input-field"
                  >
                    <option value="trial">Trial</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.subscription.expiryDate}
                    onChange={(e) =>
                      handleNestedChange(
                        "subscription",
                        "expiryDate",
                        e.target.value
                      )
                    }
                    className="input-field"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
  );
};

export default EditTenantModal;
