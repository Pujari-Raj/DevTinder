import axiosInstance from "../utils/axiosInstance";

export interface RequestResponse {
  success: boolean;
  message?: string;
}

/**
 * Send a connection request to a user (Interested)
 * @param userId - The ID of the user to send the connection request to
 * @returns Promise with success status
 */
export const sendConnectionRequest = async (
  userId: string
): Promise<RequestResponse> => {
  try {
    const response = await axiosInstance.post(
      `/request/send/interested/${userId}`
    );
    return {
      success: response?.data?.success !== false,
      message: response?.data?.message,
    };
  } catch (error) {
    console.error("Send connection request failed:", error);
    throw error;
  }
};

/**
 * Send an ignore request to a user
 * @param userId - The ID of the user to ignore
 * @returns Promise with success status
 */
export const sendIgnoreRequest = async (
  userId: string
): Promise<RequestResponse> => {
  try {
    const response = await axiosInstance.post(
      `/request/send/ignored/${userId}`
    );
    return {
      success: response?.data?.success !== false,
      message: response?.data?.message,
    };
  } catch (error) {
    console.error("Send ignore request failed:", error);
    throw error;
  }
};
