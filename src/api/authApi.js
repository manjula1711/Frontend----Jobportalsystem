// src/api/authApi.js
import api from "./axios";

import publicApi from "./publicApi";

// ✅ Public endpoints (NO token)
export const registerApi = (data) => publicApi.post("/auth/register", data);
export const loginApi = (data) => publicApi.post("/auth/login", data);
export const forgotPasswordApi = (email) =>
  publicApi.post("/auth/forgot-password", { email });
export const resetPasswordApi = (token, newPassword) =>
  publicApi.post("/auth/reset-password", { token, newPassword });

