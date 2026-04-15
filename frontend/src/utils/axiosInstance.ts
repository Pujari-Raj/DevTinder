import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

// Extend AxiosRequestConfig to include custom flag for skipping auth redirect
interface CustomAxiosRequuestConfig extends InternalAxiosRequestConfig {
  skipAuthRedirect?: boolean; // Flag to skip auth interceptor for specific requests
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Enable cookies in requests and responses (HTTP-only cookies)
});

// Response interceptor - handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config as CustomAxiosRequuestConfig;

    // handling 401 errors
    if (
      error.response?.status === 401 &&
      !config?.skipAuthRedirect &&
      !config.url?.includes("/auth/login")
    ) {
      // Token expired or invalid - logout user
      const { logout } = useAuthStore.getState();
      logout();
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
