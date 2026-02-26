import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllJobsApi, checkAppliedApi } from "../../api/seekerApi";

const SeekerJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [appliedMap, setAppliedMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await getAllJobsApi();
      const list = Array.isArray(res.data) ? res.data : [];
      const activeJobs = list.filter((j) => j.active !== false);
      setJobs(activeJobs);

      const statusEntries = await Promise.all(
        activeJobs.map(async (job) => {
          try {
            const r = await checkAppliedApi(job.id);
            return [job.id, !!r?.data?.applied];
          } catch {
            return [job.id, false];
          }
        })
      );

      setAppliedMap(Object.fromEntries(statusEntries));
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // ✅ Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <DashboardLayout role="SEEKER">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Available Jobs</h1>

        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border text-gray-500">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border text-gray-500">
            No jobs available right now.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {currentJobs.map((job) => {
                const applied = appliedMap[job.id];

                return (
                  <div
                    key={job.id}
                    className="bg-white p-6 rounded-xl shadow-sm border"
                  >
                    <h2 className="text-lg font-semibold capitalize">
                      {job.title}
                    </h2>

                    <p className="text-sm text-blue-600 mt-1">
                      {job.companyName}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">📍 {job.location}</p>
                    <p className="text-sm text-gray-500">💼 {job.jobType || "—"}</p>
                    <p className="text-sm text-gray-500">🧠 {job.experience}</p>
                    <p className="text-sm text-gray-500 mb-2">💰 {job.salary}</p>

                    <p className="text-sm text-gray-500 mb-4">
                      👤 Posted By: {job?.postedBy?.name || "Recruiter"}
                    </p>

                    {applied ? (
                      <button
                        disabled
                        className="bg-green-600 text-white px-4 py-2 rounded-lg opacity-80 cursor-not-allowed"
                      >
                        ✅ Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/apply/${job.id}`)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ✅ Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SeekerJobs;