import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  about?: string;
  photoUrl?: string;
  // Add other user fields as needed
}

export interface UserFeedResponse {
  success: boolean;
  data: UserProfile[];
  totalCount?: number;
}

interface UseUserFeedOptions {
  page?: number;
  limit?: number;
}

export const useUserFeed = (options: UseUserFeedOptions = {}) => {
  const { page = 1, limit = 10 } = options;
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<UserFeedResponse>(
        `/user/feed?page=${page}&limit=${limit}`
      );

      if (response?.data?.success) {
        setUsers(response.data.data);
      } else {
        setError("Failed to fetch user feed");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err?.response?.data?.message || err?.message || "Failed to fetch user feed";
        setError(errorMessage);
        console.error("Fetch user feed failed:", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  const handleSendRequest = useCallback(
    async (userId: string, status: "interested" | "ignored") => {
      try {
        console.log('userid',userId)
        const response = await axiosInstance.post(
          `/request/send/${status}/${userId}`
        );
        return {
          success: response?.data?.success !== false,
          message: response?.data?.message,
        };
      } catch (error) {
        console.error(`Send ${status} request failed:`, error);
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    fetchUserFeed();
  }, [fetchUserFeed]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUserFeed,
    handleSendRequest,
  };
};
