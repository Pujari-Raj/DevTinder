import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { user, isLoading } = useAuthStore();

  // Waiting until auth state is initialized
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-sky-500 mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ If user is logged in → redirect to feed
  if (user) {
    return <Navigate to="/feed" replace />;
  }

  // ✅ Otherwise allow access
  return <>{children}</>;
}
