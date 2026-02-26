import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getRecruiterProfileApi, updateRecruiterProfileApi } from "../../api/recruiterApi";

const RecruiterProfile = () => {
  const [nameEmail, setNameEmail] = useState({ name: "", email: "" });

  const [profile, setProfile] = useState({
    companyName: "",
    companyLocation: "",
    companyWebsite: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setApiError("");
      try {
        const res = await getRecruiterProfileApi();

        setNameEmail({
          name: res.data?.name || "",
          email: res.data?.email || "",
        });

        // res.data.profile is RecruiterProfile entity
        setProfile({
          companyName: res.data?.profile?.companyName || "",
          companyLocation: res.data?.profile?.companyLocation || "",
          companyWebsite: res.data?.profile?.companyWebsite || "",
          description: res.data?.profile?.description || "",
        });
      } catch (e) {
        setApiError(
          e?.response?.data?.message || e?.response?.data || "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    let newErrors = {};

    if (!profile.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!profile.companyLocation.trim())
      newErrors.companyLocation = "Company location is required";
    if (!profile.description.trim()) newErrors.description = "Company description is required";

    if (profile.companyWebsite) {
      try {
        new URL(profile.companyWebsite);
      } catch {
        newErrors.companyWebsite = "Enter valid website URL";
      }
    }

    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setApiError("");
    try {
      // backend expects ProfileRequest
      await updateRecruiterProfileApi({
        companyName: profile.companyName,
        companyLocation: profile.companyLocation,
        companyWebsite: profile.companyWebsite,
        description: profile.description,
      });

      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e) {
      setApiError(
        e?.response?.data?.message || e?.response?.data || "Failed to update profile."
      );
    }
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Company Profile</h2>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded"
              disabled={loading}
            >
              Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="bg-green-600 text-white px-5 py-2 rounded"
            >
              Save Changes
            </button>
          )}
        </div>

        {loading && <div className="p-3 bg-gray-100 rounded">Loading…</div>}

        {apiError && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
            {String(apiError)}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
            Profile updated successfully ✅
          </div>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label>Name</label>
              <input
                type="text"
                value={nameEmail.name}
                disabled
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                value={nameEmail.email}
                disabled
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label>Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={profile.companyName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border p-2 rounded"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label>Company Location *</label>
              <input
                type="text"
                name="companyLocation"
                value={profile.companyLocation}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border p-2 rounded"
              />
              {errors.companyLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.companyLocation}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label>Company Website</label>
              <input
                type="text"
                name="companyWebsite"
                value={profile.companyWebsite}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full border p-2 rounded"
              />
              {errors.companyWebsite && (
                <p className="text-red-500 text-sm mt-1">{errors.companyWebsite}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label>Description *</label>
              <textarea
                name="description"
                value={profile.description}
                onChange={handleChange}
                disabled={!isEditing}
                rows="4"
                className="w-full border p-2 rounded"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterProfile;