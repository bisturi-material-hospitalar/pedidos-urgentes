import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RoleBasedRoute({ children, roles }) {
  const { role } = useAuth();
  return (role && roles.includes(role))
    ? children
    : <Navigate to="/unauthorized" replace />;
}
