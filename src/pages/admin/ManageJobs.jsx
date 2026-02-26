import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { adminDeleteJobApi, adminJobsApi } from "../../api/adminApi";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const jobsPerPage = 5;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setApiError("");

      try {
        const res = await adminJobsApi();
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setApiError(e?.response?.data || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedJobId(id);
    setShowConfirm(true);
  };

  const confirmDeleteJob = async () => {
    if (!selectedJobId) return;

    try {
      await adminDeleteJobApi(selectedJobId);

      const updatedJobs = jobs.filter((job) => job.id !== selectedJobId);
      setJobs(updatedJobs);

      setShowConfirm(false);
      setSelectedJobId(null);

      setSuccessMessage("Job deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 2500);

      // Fix pagination if last page becomes empty
      const newTotalPages = Math.ceil(updatedJobs.length / jobsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (e) {
      alert(e?.response?.data || "Failed to delete job.");
    }
  };

  const sortedJobs = useMemo(() => {
    const copy = [...jobs];
    copy.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    return copy;
  }, [jobs]);

  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const postedByName = (job) => {
    // backend returns postedBy object
    if (job?.postedBy?.name) return job.postedBy.name;
    if (job?.postedBy?.email) return job.postedBy.email;

    // fallback if you used recruiterEmail earlier
    if (job?.recruiterEmail) return job.recruiterEmail;

    return "—";
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Jobs</h1>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {loading && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            Loading…
          </div>
        )}

        {apiError && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {String(apiError)}
          </div>
        )}

        {!loading && !apiError && sortedJobs.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">No jobs available.</p>
          </div>
        ) : (
          !loading &&
          !apiError && (
            <>
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4">Title</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Posted By</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentJobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="p-4 font-medium">{job.title || "—"}</td>
                        <td className="p-4 text-gray-600">
                          {job.companyName || "—"}
                        </td>
                        <td className="p-4 text-gray-600">
                          {job.location || "—"}
                        </td>
                        <td className="p-4 text-gray-600">{postedByName(job)}</td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteClick(job.id)}
                            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-3">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          )
        )}

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-6">Are you sure you want to delete this job?</p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteJob}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;