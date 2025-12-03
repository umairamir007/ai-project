import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthSession } from "../../hooks/useAuthSession";
import { ensureActiveSession } from "../../lib/tokenManager";

const ProtectedRoute = ({ children, redirectTo = "/sign-in" }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthSession();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    ensureActiveSession()
      .catch(() => null)
      .finally(() => {
        if (isMounted) setCheckingSession(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (checkingSession) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children || <Outlet />;
};

export default ProtectedRoute;


