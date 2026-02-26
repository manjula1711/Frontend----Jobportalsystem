import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { myApplicationsApi } from "../../api/seekerApi";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 7;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await myApplicationsApi();
        const list = Array.isArray(res.data) ? res.data : [];

        // Sort newest first
        list.sort(
          (a, b) =>
            new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0)
        );

        setApplications(list);
        setCurrentPage(1); // reset to first page after reload
      } catch (e) {
        setError(e?.response?.data || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (statusRaw) => {
    const status = String(statusRaw || "").toUpperCase();
    if (status === "PENDING") return "bg-yellow-100 text-yellow-800";
    if (status === "SHORTLISTED") return "bg-green-100 text-green-800";
    if (status === "REJECTED") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApps = applications.slice(indexOfFirstApp, indexOfLastApp);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <DashboardLayout role="SEEKER">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">My Applications</h1>

        {loading && <p>Loading...</p>}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {String(error)}
          </div>
        )}

        {!loading && !error && applications.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border text-gray-500">
            You have not applied to any jobs yet.
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="p-4">Job Title</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Applied On</th>
                  </tr>
                </thead>

                <tbody>
                  {currentApps.map((app) => (
                    <tr
                      key={app.id}
                      className="border-t text-sm hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium">
                        {app?.job?.title || "—"}
                      </td>
                      <td className="p-4">
                        {app?.job?.companyName || "—"}
                      </td>
                      <td className="p-4">
                        {app?.job?.location || "—"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {String(app.status || "PENDING").toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        {formatDate(app.appliedDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ✅ Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`px-4 py-2 rounded ${
                  currentPage === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;