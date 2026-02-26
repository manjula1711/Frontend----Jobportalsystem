import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginApi,
  forgotPasswordApi,
  resetPasswordApi,
} from "../../api/authApi";// ✅ adjust path if needed

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState(""); // ✅ NEW (backend needs token)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors({});
    setApiError("");
  };

  // ==============================
  // LOGIN LOGIC (API)
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      const res = await loginApi({
        email: formData.email,
        password: formData.password,
      });

      // ✅ If your loginApi already stores token/user, you can skip below.
      // Otherwise store based on your backend response keys:
      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;

      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // ✅ Determine role from response (adjust based on backend)
      const role = user?.role || res?.role || res?.data?.role;

      if (role === "ADMIN") navigate("/admin-dashboard");
      else if (role === "RECRUITER") navigate("/recruiter-dashboard");
      else navigate("/seeker-dashboard"); // default seeker
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Invalid email or password";
      setApiError(String(msg));
      setErrors({ email: " " }); // to keep same UI style (optional)
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // FORGOT PASSWORD (API)
  // 1) send token to email
  // 2) reset using token + new password
  // ==============================
  const handleSendResetToken = async () => {
    setForgotMessage("");
    setForgotError("");

    if (!forgotEmail.trim()) {
      setForgotError("Email is required.");
      return;
    }

    try {
      await forgotPasswordApi(forgotEmail);
      setForgotMessage(
        "Reset token sent! Check your email and paste the token below."
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to send reset token";
      setForgotError(String(msg));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setForgotMessage("");
    setForgotError("");

    if (!forgotEmail || !resetToken || !newPassword || !confirmPassword) {
      setForgotError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    try {
      await resetPasswordApi(resetToken, newPassword);
      setForgotMessage("Password updated successfully! You can login now.");

      setTimeout(() => {
        setShowForgot(false);
        setForgotEmail("");
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
        setForgotMessage("");
        setForgotError("");
      }, 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to reset password";
      setForgotError(String(msg));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* ================= LOGIN FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          {(apiError || errors.email) && (
            <p className="text-red-500 text-sm">{apiError || errors.email}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password Link */}
        <p
          className="text-sm text-blue-600 text-center mt-3 cursor-pointer hover:underline"
          onClick={() => setShowForgot(true)}
        >
          Forgot Password?
        </p>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>

        {/* ================= FORGOT PASSWORD MODAL ================= */}
        {showForgot && (
          <div className="absolute inset-0 bg-white p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-center">
              Reset Password
            </h3>

            {forgotMessage && (
              <p className="text-sm text-green-600 mb-3 text-center">
                {forgotMessage}
              </p>
            )}
            {forgotError && (
              <p className="text-sm text-red-600 mb-3 text-center">
                {forgotError}
              </p>
            )}

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />

              <button
                type="button"
                onClick={handleSendResetToken}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Send Reset Token
              </button>

              <form onSubmit={handleResetPassword} className="space-y-3">
                <input
                  type="text"
                  placeholder="Paste reset token"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Update Password
                </button>
              </form>

              <button
                onClick={() => setShowForgot(false)}
                className="text-red-500 text-sm mt-2 block mx-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;