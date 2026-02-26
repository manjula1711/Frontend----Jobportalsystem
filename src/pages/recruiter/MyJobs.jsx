import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { deleteJobApi, myJobsApi, updateJobApi } from "../../api/recruiterApi";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showMsg = (text, type = "success", ms = 2200) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), ms);
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await myJobsApi();
      const list = Array.isArray(res.data) ? res.data : [];
      setJobs(list);
      setCurrentPage(1); // reset page after load
    } catch (e) {
      showMsg(e?.response?.data || "Failed to load jobs.", "error", 2600);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Pagination Logic
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages !== 0) {
      setCurrentPage(totalPages);
    }
  }, [jobs, totalPages, currentPage]);

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setIsEdit(false);
  };

  const handleEdit = (job) => {
    setSelectedJob({ ...job });
    setIsEdit(true);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setIsEdit(false);
    setSaving(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = () => {
    setSelectedJob((prev) => ({ ...prev, active: !prev.active }));
  };

  const handleSave = async () => {
    if (!selectedJob?.id) return;

    if (!selectedJob.companyName?.trim())
      return showMsg("Company name is required.", "error");

    if (!selectedJob.title?.trim())
      return showMsg("Job title is required.", "error");

    if (!selectedJob.location?.trim())
      return showMsg("Location is required.", "error");

    try {
      setSaving(true);

      const payload = {
        companyName: selectedJob.companyName,
        title: selectedJob.title,
        location: selectedJob.location,
        salary: selectedJob.salary,
        experience: selectedJob.experience,
        skills: selectedJob.skills,
        description: selectedJob.description,
        active: !!selectedJob.active,
      };

      const res = await updateJobApi(selectedJob.id, payload);

      setJobs((prev) =>
        prev.map((j) => (j.id === selectedJob.id ? res.data : j))
      );

      showMsg("Job updated successfully.");
      handleCloseModal();
    } catch (e) {
      showMsg(e?.response?.data || "Failed to update job.", "error", 2600);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJobApi(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showMsg("Job deleted successfully.");
    } catch (e) {
      showMsg(e?.response?.data || "Failed to delete job.", "error", 2600);
    }
  };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">My Jobs</h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-white ${
              messageType === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <p>Loading…</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <>
            {currentJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-xl p-5 mb-4 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-blue-600 font-medium">
                    {job.companyName}
                  </p>
                  <p className="text-gray-600">{job.location}</p>
                  <span className="text-green-600 text-sm">
                    {job.active ? "Active" : "Closed"}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleView(job)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleEdit(job)}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {/* ✅ Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-4 text-gray-500 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {isEdit ? "Edit Job" : "Job Details"}
            </h2>

            <div className="space-y-4">
              {[
                "companyName",
                "title",
                "location",
                "salary",
                "experience",
                "skills",
                "description",
              ].map((field) => (
                <div key={field}>
                  <label className="block font-medium capitalize">
                    {field}
                  </label>

                  {isEdit ? (
                    field === "description" ? (
                      <textarea
                        name={field}
                        rows="4"
                        value={selectedJob[field] || ""}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                      />
                    ) : (
                      <input
                        type="text"
                        name={field}
                        value={selectedJob[field] || ""}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                      />
                    )
                  ) : (
                    <p className="text-gray-700">
                      {selectedJob[field] || "—"}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between">
                <div>
                  <label className="block font-medium">Status</label>
                  <p className="text-green-600">
                    {selectedJob.active ? "Active" : "Closed"}
                  </p>
                </div>

                {isEdit && (
                  <button
                    type="button"
                    onClick={handleToggleActive}
                    className="px-4 py-2 rounded-lg border"
                  >
                    {selectedJob.active ? "Mark Closed" : "Mark Active"}
                  </button>
                )}
              </div>

              {isEdit && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyJobs;
