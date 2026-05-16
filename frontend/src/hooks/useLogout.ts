import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const useLogout = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
        const response = await axiosInstance.post("/auth/logout");
                
        if(response?.data?.success){
            toast.success(response?.data?.message || "Logout successful!");
            // logginng user out and navigating user back to login screen
            logout();
            navigate("/login", {replace: true})
        }

    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Logout failed. Please try again.";
        setError(errorMessage);
        console.error("Logout failed:", errorMessage);
      }
    }
  };

  return{
    handleLogout,
    error,
  }
};
export default useLogout;
