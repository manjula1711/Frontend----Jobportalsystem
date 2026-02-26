import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { recruiterDashboardApi, getRecruiterProfileApi } from "../../api/recruiterApi";

const RecruiterDashboard = () => {
  const [data, setData] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    recentJobs: [],
    recentApplications: [],
  });

  const [recruiterName, setRecruiterName] = useState("Recruiter");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        // ✅ load dashboard + profile in parallel
        const [dashRes, profileRes] = await Promise.all([
          recruiterDashboardApi(),
          getRecruiterProfileApi(),
        ]);

        setData(dashRes.data || {});

        const nameFromProfile = profileRes?.data?.name;
        if (nameFromProfile) setRecruiterName(nameFromProfile);
      } catch (e) {
        setError(
          e?.response?.data?.message ||
            e?.response?.data ||
            "Failed to load recruiter dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <DashboardLayout role="RECRUITER">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome,{" "}
            <span className="text-blue-600">{recruiterName}</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your job postings and applicants
          </p>
        </div>

        {loading && (
          <div className="bg-white p-4 rounded-xl shadow">Loading…</div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl">
            {String(error)}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <p className="text-sm opacity-80">Total Jobs</p>
                <h2 className="text-3xl font-bold mt-2">
                  {data.totalJobs ?? 0}
                </h2>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <p className="text-sm opacity-80">Active Jobs</p>
                <h2 className="text-3xl font-bold mt-2">
                  {data.activeJobs ?? 0}
                </h2>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <p className="text-sm opacity-80">Total Applicants</p>
                <h2 className="text-3xl font-bold mt-2">
                  {data.totalApplications ?? 0}
                </h2>
              </div>
            </div>

            {/* Recent Jobs + Applicants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
                <ul className="space-y-3 text-gray-700">
                  {(data.recentJobs || []).map((job) => (
                    <li
                      key={job.id}
                      className="flex justify-between border-b pb-2"
                    >
                      <span>{job.title || "Job"}</span>
                      <span className="font-medium text-green-600">
                        {job.active ? "Active" : "Closed"}
                      </span>
                    </li>
                  ))}
                  {(data.recentJobs || []).length === 0 && (
                    <li>No jobs posted yet.</li>
                  )}
                </ul>
              </div>

              {/* Recent Applicants */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Applicants</h3>
                <ul className="space-y-3 text-gray-700">
                  {(data.recentApplications || []).map((app) => (
                    <li
                      key={app.id}
                      className="flex justify-between border-b pb-2"
                    >
                      <span>
  {app?.seeker?.name || app?.seeker?.username || app?.seeker?.email || "Applicant"}
</span>
                      <span className="text-sm text-gray-500">
                        {app?.job?.title || "Job"}
                      </span>
                    </li>
                  ))}
                  {(data.recentApplications || []).length === 0 && (
                    <li>No applicants yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;