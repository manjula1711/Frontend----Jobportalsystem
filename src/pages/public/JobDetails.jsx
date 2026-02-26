
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const found = storedJobs.find(
      (j) => j.id?.toString() === id?.toString()
    );
    setJob(found);
  }, [id]);

  if (!job)
    return (
      <div className="p-8 text-center">
        Job not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold">
          {job.title || job.role}
        </h1>

        <p className="text-blue-600 font-medium mt-2">
          {job.companyName || job.company}
        </p>

        <p className="text-gray-500 mt-1">
          {job.location} • {job.type}
        </p>

        <p className="text-green-600 font-semibold mt-3">
          {job.salary}
        </p>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">
            Job Description
          </h3>
          <p className="text-gray-700">
            {job.description || "No description provided."}
          </p>
        </div>

        <button
          onClick={() => navigate(`/apply/${job.id}`)} // ✅ Navigate only
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
