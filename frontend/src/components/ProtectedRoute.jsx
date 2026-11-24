import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// guards routes by login + role (backend only lets each role hit its own routes)
function ProtectedRoute({ role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === "artist" ? "/dashboard" : "/"} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
