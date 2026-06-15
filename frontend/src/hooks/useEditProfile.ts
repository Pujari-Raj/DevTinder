import { useCallback, useState } from "react";
import type { EditProfileSchemaType } from "../schemas/profileSchema";
import { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const useEditProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [updatedUserDetails, setUpdatedUserDetails] = useState(null);

  const handleEditProfile = useCallback(async (data: EditProfileSchemaType) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.patch("/profile/update", data);

      if (response?.data?.success) {
        setUpdatedUserDetails(response?.data?.data);
        toast.success(
          response?.data?.message || "Profile updated successfully",
        );

        return true;
      }

      return false;
    } catch (err) {
      if (err instanceof AxiosError) {
        const errors = err.response?.data?.errors;

        if (Array.isArray(errors)) {
          errors.forEach((error: string) => toast.error(error));
        } else {
          toast.error(
            err.response?.data?.message ||
              err.message ||
              "Failed to update profile",
          );
        }
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    handleEditProfile,
    isLoading,
    error,
    updatedUserDetails,
  };
};

export default useEditProfile;
