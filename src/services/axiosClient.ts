import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5258/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor Request: Tự động đính kèm Bearer Access Token nếu có
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

// Interceptor Response: Tự động refresh token khi gặp lỗi 401 (Unauthorized)
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refreshToken");
      const accessToken = Cookies.get("accessToken");

      if (refreshToken && accessToken) {
        try {
          // Sử dụng BASE_URL thống nhất và gọi đúng route Auth/refresh-token
          const res = await axios.post(`${BASE_URL}/Auth/refresh-token`, {
            accessToken,
            refreshToken,
          });

          if (res.data.success) {
            const newAccessToken = res.data.data.accessToken;
            const newRefreshToken = res.data.data.refreshToken;

            // Cập nhật Token mới vào Cookie
            Cookies.set("accessToken", newAccessToken, { expires: 1 / 96 }); // ~15 phút
            Cookies.set("refreshToken", newRefreshToken, { expires: 7 });

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          // Xóa token và buộc đăng nhập lại khi Refresh Token hết hạn
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }
    }

    const errorMessage =
      error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
    return Promise.reject(new Error(errorMessage));
  },
);

export default axiosClient;
