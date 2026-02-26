import api from "./axios";

export const seekerDashboardApi = () => api.get("/seeker/dashboard");

export const getSeekerProfileApi = () => api.get("/seeker/profile");
export const updateSeekerProfileApi = (data) => api.put("/seeker/profile", data);

export const getAllJobsApi = () => api.get("/jobs");

export const myApplicationsApi = () => api.get("/seeker/applications");

export const checkAppliedApi = (jobId) => api.get(`/seeker/applied/${jobId}`);

export const applyJobApi = (jobId, formData) =>
  api.post(`/seeker/apply/${jobId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });