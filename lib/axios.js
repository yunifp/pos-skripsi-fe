import Axios from "axios";
import { parseCookies } from "nookies";

// Membuat instance Axios dengan base URL dari environment variable
const axiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // Timeout request setelah 10 detik
  headers: {
    "Content-Type": "application/json",
  },
});

// Menambahkan interceptor untuk request
axiosInstance.interceptors.request.use(
  (config) => {
    // Mengambil token dari cookies
    const cookies = parseCookies();
    const token = cookies.token;

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Lakukan sesuatu jika terjadi error pada request
    return Promise.reject(error);
  }
);

// Menambahkan interceptor untuk response
axiosInstance.interceptors.response.use(
  (response) => {
    // Setiap status code response yang ada di antara 200 - 299 akan trigger fungsi ini
    return response;
  },
  (error) => {
    // Setiap status code response yang di luar 200 - 299 akan trigger fungsi ini
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
