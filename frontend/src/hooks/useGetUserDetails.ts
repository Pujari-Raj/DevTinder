import { AxiosError } from "axios";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import type { User } from "../@types/types";


export interface UserProfileResponse {
    success: boolean;
    message: string;
    data: User;
}

const useUserDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  const getDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await axiosInstance.get<UserProfileResponse>('/profile/view');

        if (response?.data?.success) {
            setUserDetails(response?.data?.data)
        }
        else {
            setError("Failed to fetch user details");
        }

    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch user feed";
        setError(errorMessage);
        console.error("Fetch user feed failed:", errorMessage);
      }
    }
  };

  return {
    getDetails,
    userDetails,
    isLoading,
    error
  }
};

export default useUserDetails;
