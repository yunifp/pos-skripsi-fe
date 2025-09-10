import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_ACCESS_TOKEN",
  },
});

// Adding a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Custom-Header"] = "CustomHeaderValue";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Adding a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      console.error("Error response:", error.response);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
