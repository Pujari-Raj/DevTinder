import { useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

export type ReviewStatus = "accepted" | "rejected";

export const useReviewRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewRequest = useCallback(
    async (requestId: string, status: ReviewStatus) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.patch(
          `/request/review/${status}/${requestId}`,
        );

        const successMessage = `Request ${status}!`;
        toast.success(response?.data?.message || successMessage);
        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : `Failed to ${status} request`;
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    reviewRequest,
  };
};
