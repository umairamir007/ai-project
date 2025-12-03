import { Navigate, Outlet } from "react-router-dom";
import { useAuthSession } from "../../hooks/useAuthSession";

// Routes that should only be visible when NOT authenticated
const PublicRoute = ({ children, redirectTo = "/user-dashboard" }) => {
  const { isAuthenticated } = useAuthSession();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children || <Outlet />;
};

export default PublicRoute;


