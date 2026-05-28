import { useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

export interface Request {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    age: number;
    gender: string;
    about: string;
    skills: string[];
    photoUrl: string;
  };
}

export const useRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<{
        data: Request[];
      }>("/user/requests/received");
      setRequests(response.data.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch requests";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    requests,
    loading,
    error,
    fetchRequests,
  };
};
