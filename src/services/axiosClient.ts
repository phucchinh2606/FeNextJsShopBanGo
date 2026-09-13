import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5258/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor Request: Luôn đính kèm Bearer token từ Cookie
axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor Response: Xử lý Tự động Refresh Token khi gặp lỗi 401
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Nếu gặp lỗi 401 và request này chưa thử refresh lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refreshToken");
      const accessToken = Cookies.get("accessToken");

      if (refreshToken && accessToken) {
        try {
          // Gọi API cấp lại token mới
          const res = await axios.post(`${BASE_URL}/Auth/refresh-token`, {
            accessToken,
            refreshToken,
          });

          const authData = res.data;
          if (authData?.success && authData?.data) {
            const newAccessToken = authData.data.accessToken;
            const newRefreshToken = authData.data.refreshToken;

            // Lưu token mới vào Cookie với path '/'
            Cookies.set("accessToken", newAccessToken, {
              expires: 7,
              path: "/",
            });
            Cookies.set("refreshToken", newRefreshToken, {
              expires: 7,
              path: "/",
            });

            // Thử lại request ban đầu với Token mới
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          // Xóa toàn bộ Cookie khi Refresh Token cũng hết hạn
          Cookies.remove("accessToken", { path: "/" });
          Cookies.remove("refreshToken", { path: "/" });
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
