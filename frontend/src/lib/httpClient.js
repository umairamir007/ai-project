import axios from "axios";
import { clearAuthSession } from "../utils/authStorage";
import {
  getValidAccessToken,
  hasRefreshCapability,
  refreshAccessToken,
} from "./tokenManager";

const API_BASE = import.meta.env.VITE_API_BASE;
const AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const isAuthPath = (url = "") =>
  AUTH_PATHS.some((path) => url.includes(path));

const httpClient = axios.create({
  baseURL: API_BASE,
});

httpClient.interceptors.request.use(
  async (config) => {
    const token = await getValidAccessToken();
    if (token) {
      const headers = config.headers || {};
      const hasCustomAuth =
        headers.Authorization || headers.authorization;

      if (!hasCustomAuth) {
        headers.Authorization = `Bearer ${token}`;
      }

      config.headers = headers;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config || {};

    if (
      status === 401 &&
      hasRefreshCapability() &&
      !originalRequest._retry &&
      !isAuthPath(originalRequest.url || "")
    ) {
      originalRequest._retry = true;
      try {
        const token = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        clearAuthSession();
        if (typeof window !== "undefined") {
          window.location.replace("/sign-in");
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;


