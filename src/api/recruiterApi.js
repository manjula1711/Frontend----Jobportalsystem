// src/api/recruiterApi.js
import api from "./axios";

// Dashboard
export const recruiterDashboardApi = () => api.get("/recruiter/dashboard");

// Profile
export const getRecruiterProfileApi = () => api.get("/recruiter/profile");
export const updateRecruiterProfileApi = (payload) =>
  api.put("/recruiter/profile", payload); // payload is ProfileRequest

// Jobs
export const postJobApi = (payload) => api.post("/recruiter/jobs", payload);
export const myJobsApi = () => api.get("/recruiter/jobs");
export const deleteJobApi = (jobId) => api.delete(`/recruiter/jobs/${jobId}`);

// Applicants & status & resume
export const viewApplicantsApi = () => api.get("/recruiter/applicants");

export const viewResumeApi = (applicationId) =>
  api.get(`/recruiter/applications/${applicationId}/resume`, {
    responseType: "blob",
  });

export const updateApplicationStatusApi = (applicationId, status) =>
  api.put(`/recruiter/applications/${applicationId}/status`, null, {
    params: { status }, // controller expects ?status=...
  });

  export const updateJobApi = (jobId, payload) =>
  api.put(`/recruiter/jobs/${jobId}`, payload);