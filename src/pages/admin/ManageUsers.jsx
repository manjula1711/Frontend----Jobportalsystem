import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { adminDeleteUserApi, adminUsersApi } from "../../api/adminApi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const usersPerPage = 5;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setApiError("");

      try {
        const res = await adminUsersApi();
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setApiError(e?.response?.data || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setShowConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUserId) return;

    try {
      const msgRes = await adminDeleteUserApi(selectedUserId);

      const updatedUsers = users.filter((u) => u.id !== selectedUserId);
      setUsers(updatedUsers);

      setShowConfirm(false);
      setSelectedUserId(null);

      setSuccessMessage(msgRes?.data || "User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 2500);

      const newTotalPages = Math.ceil(updatedUsers.length / usersPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (e) {
      alert(e?.response?.data || "Failed to delete user.");
    }
  };

  const sortedUsers = useMemo(() => {
    const copy = [...users];
    copy.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    return copy;
  }, [users]);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const getRoleBadge = (role) => {
    const r = String(role || "").toUpperCase();
    if (r === "RECRUITER") return "bg-blue-100 text-blue-600";
    if (r === "SEEKER") return "bg-green-100 text-green-600";
    if (r === "ADMIN") return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

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

        {!loading && !apiError && sortedUsers.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          !loading &&
          !apiError && (
            <>
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="p-4 font-medium">{user.name || "—"}</td>
                        <td className="p-4 text-gray-600">
                          {user.email || "—"}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-sm rounded-full font-medium ${getRoleBadge(
                              user.role
                            )}`}
                          >
                            {String(user.role || "").toUpperCase()}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          {String(user.role || "").toUpperCase() === "ADMIN" ? (
                            <span className="text-gray-400">Protected</span>
                          ) : (
                            <button
                              onClick={() => handleDeleteClick(user.id)}
                              className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          )}
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

              <p className="mb-6">Are you sure you want to delete this user?</p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteUser}
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

export default ManageUsers;