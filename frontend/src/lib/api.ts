import axios from "axios";
import { useAuthStore } from "@/store/auth";

// In browser: use same-origin `/api` (nginx proxies to backend)
// In Docker SSR: call backend container directly
const isServer = typeof window === "undefined";
const baseURL = isServer ? "http://backend:8080/api" : "/api";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && !config.url?.includes("/auth/refresh")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshed = await useAuthStore.getState().refresh();
      if (refreshed) {
        const token = localStorage.getItem("accessToken");
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);
