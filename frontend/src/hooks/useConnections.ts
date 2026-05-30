import { useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

export interface Connection {
  _id: string;
  name: string;
  photoUrl?: string;
  age?: number;
  gender?: string;
  skills?: string[];
  about?: string;
  email?: string;
}

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<{
        data: Connection[];
      }>("/user/connections");
      setConnections(response.data.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch connections";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    connections,
    loading,
    error,
    fetchConnections,
  };
};
