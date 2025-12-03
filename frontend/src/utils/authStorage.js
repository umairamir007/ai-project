const STORAGE_KEY = "isai-auth";
const AUTH_EVENT = "isai-auth-changed";
const isBrowser = typeof window !== "undefined";

const emitAuthChange = () => {
  if (!isBrowser) return;
  window.dispatchEvent(new Event(AUTH_EVENT));
};

const readRawSession = () => {
  if (!isBrowser) return null;
  return window.localStorage.getItem(STORAGE_KEY);
};

const parseSession = (raw) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Unable to parse stored auth session. Clearing it.", error);
    if (isBrowser) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  }
};

// For direct consumers that want the parsed object
export const getAuthSession = () => parseSession(readRawSession());

// For stores using useSyncExternalStore: must be a stable, cacheable snapshot
// We expose the raw string so it only changes when storage actually changes.
export const getAuthSnapshot = () => readRawSession();

// Helper to decode a snapshot (raw string) back into an object
export const parseAuthSnapshot = (raw) => parseSession(raw);

export const setAuthSession = (session) => {
  if (!isBrowser || !session) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  emitAuthChange();
};

export const clearAuthSession = () => {
  if (!isBrowser) return;
  window.localStorage.removeItem(STORAGE_KEY);
  emitAuthChange();
};

export const isTokenExpired = (expiry, skewSeconds = 30) => {
  if (!expiry) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds >= expiry - skewSeconds;
};

export const hasValidAccessToken = (session = getAuthSession()) => {
  if (!session?.accessToken?.token) return false;
  return !isTokenExpired(session.accessToken.expiry);
};

export const hasRefreshToken = (session = getAuthSession()) =>
  Boolean(session?.refreshToken?.token);

export const subscribeToAuthChanges = (callback) => {
  if (!isBrowser) return () => {};

  const customEventListener = () => callback();
  const storageListener = (event) => {
    if (event.storageArea !== window.localStorage) return;
    if (event.key && event.key !== STORAGE_KEY) return;
    callback();
  };

  window.addEventListener(AUTH_EVENT, customEventListener);
  window.addEventListener("storage", storageListener);

  return () => {
    window.removeEventListener(AUTH_EVENT, customEventListener);
    window.removeEventListener("storage", storageListener);
  };
};


