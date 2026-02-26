import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useMemo, useState } from "react";
import { updateApplicationStatusApi, viewApplicantsApi, viewResumeApi } from "../../api/recruiterApi";

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 7;

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setApiError("");
      try {
        const res = await viewApplicantsApi();
        const list = Array.isArray(res.data) ? res.data : [];
        setApplications(list);
        setCurrentPage(1);
      } catch (e) {
        setApiError(e?.response?.data || "Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ✅ Updated formatDate
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const getStatusColor = (status) => {
    const s = String(status || "PENDING").toUpperCase();
    if (s === "PENDING") return "bg-yellow-100 text-yellow-800";
    if (s === "SHORTLISTED") return "bg-green-100 text-green-800";
    if (s === "REJECTED") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateApplicationStatusApi(id, newStatus);
      setApplications((prev) => prev.map((app) => app.id === id ? { ...app, status: newStatus } : app));
    } catch (e) {
      alert(e?.response?.data || "Failed to update status.");
    }
  };

  const handleViewResume = async (applicationId) => {
    try {
      const res = await viewResumeApi(applicationId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      alert(e?.response?.data || "No resume available.");
    }
  };

  const sortedApplications = useMemo(() => {
    const copy = [...applications];
    copy.sort((a, b) => new Date(b.appliedDate || b.createdAt || 0) - new Date(a.appliedDate || a.createdAt || 0));
    return copy;
  }, [applications]);

  const totalPages = Math.ceil(sortedApplications.length / applicantsPerPage);
  const indexOfLast = currentPage * applicantsPerPage;
  const indexOfFirst = indexOfLast - applicantsPerPage;
  const currentApplicants = sortedApplications.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const nextPage = () => { if (currentPage < totalPages) goToPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) goToPage(currentPage - 1); };

  return (
    <DashboardLayout role="RECRUITER">
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Applicants</h1>

        {loading && <div className="bg-white shadow rounded-xl p-10 text-center text-gray-500">Loading…</div>}
        {apiError && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">{String(apiError)}</div>}

        {!loading && !apiError && sortedApplications.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-10 text-center text-gray-500">No applicants yet.</div>
        ) : (
          !loading && !apiError && (
            <>
              <div className="bg-white shadow rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                    <tr>
                      <th className="p-4">Applicant</th>
                      <th className="p-4">Job Title</th>
                      <th className="p-4">Applied Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApplicants.map((app) => {
                      const status = String(app.status || "PENDING").toUpperCase();
                      const applicantName = app?.seeker?.name || app?.seeker?.username || app?.seeker?.email || "N/A";
                      return (
                        <tr key={app.id} className="border-t hover:bg-gray-50 transition">
                          <td className="p-4 font-medium">{applicantName}</td>
                          <td className="p-4 font-medium">{app?.job?.title || "N/A"}</td>
                          <td className="p-4">{formatDate(app.appliedDate || app.createdAt)}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>{status}</span>
                          </td>
                          <td className="p-4">
                            <button onClick={() => handleViewResume(app.id)} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition">View PDF</button>
                          </td>
                          <td className="p-4">
                            <select value={status} onChange={(e) => updateStatus(app.id, e.target.value)} className="border px-3 py-1 rounded focus:outline-none">
                              <option value="PENDING">Pending</option>
                              <option value="SHORTLISTED">Shortlisted</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                  <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50">Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => goToPage(page)} className={`px-4 py-2 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>{page}</button>
                  ))}
                  <button onClick={nextPage} disabled={currentPage === totalPages} className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50">Next</button>
                </div>
              )}
            </>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applicants;
