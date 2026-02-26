import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { seekerDashboardApi, getSeekerProfileApi } from "../../api/seekerApi";

const SeekerDashboard = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("Seeker");
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [dashRes, profileRes] = await Promise.all([
          seekerDashboardApi(),
          getSeekerProfileApi(),
        ]);

        // ✅ profileRes expected: { name, email, profile: {...} }
        const n = profileRes?.data?.name;
        if (n) setName(n);

        // ✅ dashRes shape depends on your backend.
        // We'll support both {totalApplications, pending, shortlisted, rejected}
        // or {total, pending, shortlisted, rejected}
        const d = dashRes?.data || {};
        setStats({
          totalApplications: d.totalApplications ?? d.total ?? 0,
          pending: d.pending ?? 0,
          shortlisted: d.shortlisted ?? 0,
          rejected: d.rejected ?? 0,
        });
      } catch (e) {
        setError(e?.response?.data || "Failed to load seeker dashboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <DashboardLayout role="SEEKER">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Welcome, {name}</h1>

        {loading && <p>Loading…</p>}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {String(error)}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-100 p-6 rounded-xl text-center">
                <h2 className="text-xl font-bold">{stats.totalApplications}</h2>
                <p>Total Applications</p>
              </div>

              <div className="bg-yellow-100 p-6 rounded-xl text-center">
                <h2 className="text-xl font-bold">{stats.pending}</h2>
                <p>Pending</p>
              </div>

              <div className="bg-green-100 p-6 rounded-xl text-center">
                <h2 className="text-xl font-bold">{stats.shortlisted}</h2>
                <p>Shortlisted</p>
              </div>

              <div className="bg-red-100 p-6 rounded-xl text-center">
                <h2 className="text-xl font-bold">{stats.rejected}</h2>
                <p>Rejected</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate("/seeker/jobs")}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg hover:bg-blue-700"
              >
                💼 Browse Jobs
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SeekerDashboard;