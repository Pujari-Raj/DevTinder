import axios, { AxiosError } from "axios";
import type { UseFormReset } from "react-hook-form";
import type { SignupSchemaType } from "../schemas/authSchema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useSignUp = (reset: UseFormReset<SignupSchemaType>) => {
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";

  const handleSignup = async (data: SignupSchemaType) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
      console.log("API Response:", response?.data);
      if (response?.data?.success) {
        console.log("Signup successful:");
        navigate("/login", { replace: true });
        reset();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error("Signup failed:", err?.response?.data || err?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSignup,
    isloading,
  };
};

export default useSignUp;
