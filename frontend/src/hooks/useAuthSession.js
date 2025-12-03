import { useSyncExternalStore } from "react";
import {
  getAuthSnapshot,
  hasValidAccessToken,
  parseAuthSnapshot,
  subscribeToAuthChanges,
} from "../utils/authStorage";

export const useAuthSession = () => {
  const snapshot = useSyncExternalStore(
    (listener) => subscribeToAuthChanges(listener),
    () => getAuthSnapshot(),
    () => getAuthSnapshot()
  );

  const session = parseAuthSnapshot(snapshot);

  return {
    session,
    isAuthenticated: hasValidAccessToken(session),
  };
};


