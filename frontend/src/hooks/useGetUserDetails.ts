import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  about?: string;
  photoUrl?: string;
}

export interface UserProfileResponse {
    success: boolean;
    message: string;
    data: UserProfile[];
}

const useUserDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserProfile[]>([]);

  const getDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await axiosInstance.get<UserProfileResponse>('');

        if (response?.data?.success) {
            setUserDetails(response?.data?.data)
        }
        else {
            setError("ailed to fetch user details");
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
    isLoading,
    error
  }
};

export default useUserDetails;
