import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  applyJobApi,
  getAllJobsApi,
  checkAppliedApi,
  getSeekerProfileApi,
} from "../../api/seekerApi";

const Apply = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    coverLetter: "",
    resume: null,
  });

  // LOAD JOB + PROFILE
  useEffect(() => {
    const load = async () => {
      try {
        // 1️⃣ Load job
        const jobsRes = await getAllJobsApi();
        const list = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const found = list.find((j) => String(j.id) === String(id));
        setJob(found || null);

        // 2️⃣ Load seeker profile
        const profileRes = await getSeekerProfileApi();
        setName(profileRes.data.name);
        setEmail(profileRes.data.email);

        // 3️⃣ Check applied
        const appliedRes = await checkAppliedApi(id);
        setAlreadyApplied(!!appliedRes?.data?.applied);
      } catch {
        setError("Failed to load job or profile.");
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      setFormData((prev) => ({ ...prev, resume: files?.[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alreadyApplied) {
      setError("You already applied for this job.");
      return;
    }

    if (!formData.phone.trim()) return setError("Phone number is required.");
    if (!formData.resume) return setError("Resume PDF is required.");

    try {
      setIsSubmitting(true);

      const fd = new FormData();
      fd.append("phone", formData.phone);
      fd.append("coverLetter", formData.coverLetter || "");
      fd.append("resume", formData.resume);

      await applyJobApi(id, fd);

      setSuccess("Application Submitted Successfully");

      setTimeout(() => navigate("/my-applications"), 1200);
    } catch (e2) {
      setError(e2?.response?.data || "Failed to apply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="SEEKER">
      <div className="min-h-screen flex justify-center py-10 bg-gray-50">
        <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            Apply for {job?.title || "Job"}
          </h1>

          {error && (
            <div className="bg-red-100 text-red-600 p-4 rounded mb-4 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded mb-4 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block font-medium mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* COVER LETTER */}
            <div>
              <label className="block font-medium mb-1">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 h-28"
              />
            </div>

            {/* RESUME */}
            <div>
              <label className="block font-medium mb-1">
                Resume (PDF) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="resume"
                accept="application/pdf"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || alreadyApplied}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Apply;