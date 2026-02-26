import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // ✅ uses baseURL http://localhost:8080

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError("");
      try {
        // ✅ public endpoint
        const res = await api.get("/jobs");

        const list = Array.isArray(res.data) ? res.data : [];
        // ✅ show only active jobs
        const activeJobs = list.filter((j) => j.active === true);

        setJobs(activeJobs);
      } catch (e) {
        setError(e?.response?.data || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/jobs/${id}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Jobs</h1>

      {loading && <p>Loading…</p>}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {String(error)}
        </div>
      )}

      {!loading && !error && jobs.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border text-gray-500">
          No jobs available right now.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold capitalize">
                {job.title || "Job"}
              </h2>

              <p className="text-blue-600 font-medium mt-1">
                {job.companyName || "Company"}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                📍 {job.location || "—"}
              </p>

              {/* <p className="text-sm text-gray-500">
                💼 {job.jobType || "—"}
              </p> */}

              <p className="text-sm text-gray-500">
                🧠 {job.experience || "—"}
              </p>

              <p className="text-sm text-gray-500">
                💰 {job.salary || "—"}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleViewDetails(job.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>

                <button
                  onClick={() => navigate(`/apply/${job.id}`)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Apply
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Posted by: {job?.postedBy?.name || "Recruiter"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;