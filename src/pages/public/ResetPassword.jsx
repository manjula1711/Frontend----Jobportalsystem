import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordApi } from "../../api/authApi"; // ✅ correct path from pages/public

const ResetPassword = () => {
  const [token, setToken] = useState(""); // ✅ token field
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Optional: read email from query param if you passed it
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    if (email) {
      // not required for API, but you can show it if you want later
      console.log("Reset for email:", email);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordApi(token, password);

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to reset password.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {message && (
          <div className="mb-4 text-sm text-green-600 bg-green-100 p-2 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter reset token"
            className="w-full border p-2 rounded mb-4"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-2 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border p-2 rounded mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;