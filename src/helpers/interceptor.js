import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Set your base URL here
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or wherever it's stored)
    const { accessToken } = JSON.parse(localStorage.getItem("loggedInUser"));

    if (accessToken) {
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default apiClient;
