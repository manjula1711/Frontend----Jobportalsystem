import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white font-semibold"
        : "text-gray-300 hover:bg-blue-500 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-2xl font-bold mb-8">JobPortal</h2>

        <nav className="flex-1 space-y-3">

          {/* ================= SEEKER ================= */}
          {role === "SEEKER" && (
            <>
              <NavLink to="/seeker-dashboard" className={linkClass}>
                📊 Dashboard
              </NavLink>

             <NavLink to="/seeker/jobs" className={linkClass}>
  💼 Jobs
</NavLink>

              <NavLink to="/my-applications" className={linkClass}>
                📑 My Applications
              </NavLink>

              <NavLink to="/profile" className={linkClass}>
                👤 Profile
              </NavLink>
            </>
          )}

          {/* ================= RECRUITER ================= */}
          {role === "RECRUITER" && (
            <>
              <NavLink to="/recruiter-dashboard" className={linkClass}>
                📊 Dashboard
              </NavLink>

              <NavLink to="/post-job" className={linkClass}>
                ➕ Post Job
              </NavLink>

              <NavLink to="/my-jobs" className={linkClass}>
                📂 My Jobs
              </NavLink>

              <NavLink to="/applicants" className={linkClass}>
                👥 Applicants
              </NavLink>

              <NavLink to="/recruiter-profile" className={linkClass}>
                👤 Profile
              </NavLink>
            </>
          )}

          {/* ================= ADMIN ================= */}
          {role === "ADMIN" && (
            <>
              <NavLink to="/admin-dashboard" className={linkClass}>
                📊 Dashboard
              </NavLink>

              <NavLink to="/manage-users" className={linkClass}>
                👥 Manage Users
              </NavLink>

              <NavLink to="/manage-jobs" className={linkClass}>
                💼 Manage Jobs
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;