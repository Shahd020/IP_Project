import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Loader } from "lucide-react";

function PrivateRoute({ roles }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-gray-400">
        <Loader size={28} className="animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    const home = user.role === "admin" ? "/dashboard" : user.role === "instructor" ? "/instructor" : "/student";
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
