import { AxiosError } from "axios";
import type { UseFormReset } from "react-hook-form";
import type { LoginSchemaType } from "../schemas/authSchema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuthStore } from "../store/authStore";

const useLogin = (reset: UseFormReset<LoginSchemaType>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (data: LoginSchemaType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/auth/login", data);
      console.log("API Response:", response?.data);
      if (response?.data?.success) {
        console.log("Login successful");
        
        // Extract user from response (token is in HTTP-only cookie)
        const user = response?.data?.data;
        
        // Save user to Zustand store
        // Token is automatically handled via HTTP-only cookie
        setUser(user);
        
        reset();
        navigate("/", { replace: true });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err?.response?.data?.message || err?.message || "Login failed. Please try again.";
        setError(errorMessage);
        console.error("Login failed:", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
};

export default useLogin;
