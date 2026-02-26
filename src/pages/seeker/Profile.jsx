import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { getSeekerProfileApi, updateSeekerProfileApi } from "../../api/seekerApi";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadProfile = async () => {
    setErrorMessage("");
    try {
      const res = await getSeekerProfileApi();

      // expected: { name, email, profile: {...} }
      const baseName = res?.data?.name || "";
      const baseEmail = res?.data?.email || "";
      const p = res?.data?.profile || {};

      setProfile({
        name: baseName,
        email: baseEmail,
        phone: p.phone || "",
        location: p.location || "",
        skills: p.skills || "",
        experience: p.experience ?? "",
        education: p.education || "",
      });
    } catch (e) {
      setErrorMessage(e?.response?.data || "Failed to load profile.");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    let newErrors = {};

    if (!profile.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(profile.phone)) newErrors.phone = "Phone must be 10 digits";

    if (!profile.location.trim()) newErrors.location = "Location is required";
    if (!profile.skills.trim()) newErrors.skills = "Skills are required";

    if (profile.experience === "") newErrors.experience = "Experience is required";
    else if (isNaN(profile.experience) || Number(profile.experience) < 0 || Number(profile.experience) > 30)
      newErrors.experience = "Experience must be valid";

    if (!profile.education.trim()) newErrors.education = "Education is required";

    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setSuccessMessage("");
    setErrorMessage("");

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      await updateSeekerProfileApi({
        phone: profile.phone,
        location: profile.location,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
      });

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (e) {
      setErrorMessage(e?.response?.data || "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");
    loadProfile();
  };

  return (
    <DashboardLayout role="SEEKER">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-700 border border-green-400">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
            {String(errorMessage)}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-gray-600">Full Name</label>
            <input type="text" value={profile.name} disabled className="w-full border p-3 rounded-lg bg-gray-100" />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600">Email</label>
            <input type="email" value={profile.email} disabled className="w-full border p-3 rounded-lg bg-gray-100" />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600">Phone *</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border p-3 rounded-lg ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600">Location *</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border p-3 rounded-lg ${errors.location ? "border-red-500" : ""}`}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-600">Skills *</label>
            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border p-3 rounded-lg ${errors.skills ? "border-red-500" : ""}`}
            />
            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-600">Experience *</label>
            <input
              type="number"
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border p-3 rounded-lg ${errors.experience ? "border-red-500" : ""}`}
            />
            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-600">Education *</label>
            <textarea
              name="education"
              value={profile.education}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border p-3 rounded-lg ${errors.education ? "border-red-500" : ""}`}
            />
            {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 text-right">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;