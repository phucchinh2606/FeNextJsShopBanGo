import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cartService";
import { AddToCartCommand, UpdateCartItemQuantityCommand } from "../types";

export const CART_QUERY_KEY = ["cart"];

// Hook lấy giỏ hàng
export const useGetCart = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartService.getCart(),
    enabled: !!token, // Chỉ gọi API khi đã có Token đăng nhập
  });
};

// Hook thêm sản phẩm vào giỏ
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartCommand) => cartService.addToCart(data),
    onSuccess: (response) => {
      // Cập nhật ngay giỏ hàng trong cache bằng data Backend trả về
      queryClient.setQueryData(CART_QUERY_KEY, response);
    },
  });
};

// Hook cập nhật số lượng
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCartItemQuantityCommand) =>
      cartService.updateQuantity(data),
    onSuccess: (response) => {
      queryClient.setQueryData(CART_QUERY_KEY, response);
    },
  });
};

// Hook xóa sản phẩm khỏi giỏ
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: (response) => {
      queryClient.setQueryData(CART_QUERY_KEY, response);
    },
  });
};
