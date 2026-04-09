import { AxiosError } from "axios";
import type { UseFormReset } from "react-hook-form";
import type { SignupSchemaType } from "../schemas/authSchema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const useSignUp = (reset: UseFormReset<SignupSchemaType>) => {
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (data: SignupSchemaType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      console.log("API Response:", response?.data);
      if (response?.data?.success) {
        console.log("Signup successful - redirecting to login");
        
        // Signup successful but token is set on login endpoint only
        // User must manually login to get the token
        reset();
        navigate("/login", { replace: true });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err?.response?.data?.message || err?.message || "Signup failed. Please try again.";
        setError(errorMessage);
        console.error("Signup failed:", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSignup,
    isloading,
    error,
  };
};

export default useSignUp;
