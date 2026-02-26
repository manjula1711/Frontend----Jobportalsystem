// src/api/authApi.js
import api from "./axios";

export const registerApi = (data) => api.post("/auth/register", data);

export const loginApi = (data) => api.post("/auth/login", data);

export const forgotPasswordApi = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPasswordApi = (token, newPassword) =>
  api.post("/auth/reset-password", { token, newPassword });