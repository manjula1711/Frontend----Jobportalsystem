import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* ================= PUBLIC ================= */
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";
import Apply from "../pages/public/Apply";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";

/* ================= SEEKER ================= */
import SeekerDashboard from "../pages/seeker/SeekerDashboard";
import MyApplications from "../pages/seeker/MyApplications";
import Profile from "../pages/seeker/Profile";
import SeekerJobs from "../pages/seeker/SeekerJobs";

/* ================= RECRUITER ================= */
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import PostJob from "../pages/recruiter/PostJob";
import MyJobs from "../pages/recruiter/MyJobs";
import Applicants from "../pages/recruiter/Applicants";
import RecruiterProfile from "../pages/recruiter/RecruiterProfile";

/* ================= ADMIN ================= */
import AdminDashboard from "../pages/admin/AdminDashboard"; // ✅ FIXED PATH
import ManageUsers from "../pages/admin/ManageUsers";
import ManageJobs from "../pages/admin/ManageJobs";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="min-h-[80vh] p-5">
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/apply/:id" element={<Apply />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          

          {/* ================= SEEKER ================= */}
          <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/seeker/jobs" element={<SeekerJobs />} />

          {/* ================= RECRUITER ================= */}
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/applicants" element={<Applicants />} />
          <Route path="/recruiter-profile" element={<RecruiterProfile />} />

          {/* ================= ADMIN ================= */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/manage-jobs" element={<ManageJobs />} />

        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
};

export default AppRoutes;