import api from "./axios"; // your axios instance

// Dashboard
export const adminDashboardApi = () =>
  api.get("/admin/dashboard");

// Users
export const adminUsersApi = () =>
  api.get("/admin/users");

export const adminDeleteUserApi = (id) =>
  api.delete(`/admin/users/${id}`);

// Jobs
export const adminJobsApi = () =>
  api.get("/admin/jobs");

export const adminDeleteJobApi = (id) =>
  api.delete(`/admin/jobs/${id}`);