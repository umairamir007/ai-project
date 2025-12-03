import axios from "axios";
import {
  clearAuthSession,
  getAuthSession,
  hasRefreshToken,
  isTokenExpired,
  setAuthSession,
} from "../utils/authStorage";

const API_BASE = import.meta.env.VITE_API_BASE;

let refreshPromise = null;

const postRefreshToken = async (refreshToken) => {
  return axios.post(`${API_BASE}/auth/refresh-token`, {
    refreshToken,
  });
};

export const refreshAccessToken = async () => {
  const session = getAuthSession();
  if (!session?.refreshToken?.token) {
    clearAuthSession();
    throw new Error("No refresh token available");
  }

  if (!refreshPromise) {
    refreshPromise = postRefreshToken(session.refreshToken.token)
      .then(({ data }) => {
        const updatedSession = {
          ...session,
          accessToken: data.accessToken,
        };
        setAuthSession(updatedSession);
        return updatedSession.accessToken.token;
      })
      .catch((error) => {
        clearAuthSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const getValidAccessToken = async () => {
  const session = getAuthSession();
  if (!session?.accessToken?.token) return null;

  if (!isTokenExpired(session.accessToken.expiry)) {
    return session.accessToken.token;
  }

  return refreshAccessToken();
};

export const ensureActiveSession = async () => {
  const session = getAuthSession();
  if (!session) return null;

  if (session.accessToken?.token && !isTokenExpired(session.accessToken.expiry)) {
    return session;
  }

  try {
    await refreshAccessToken();
    return getAuthSession();
  } catch {
    return null;
  }
};

export const hasRefreshCapability = () => hasRefreshToken();


