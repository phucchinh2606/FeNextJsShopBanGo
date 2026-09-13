import {
  AddToCartCommand,
  ApiResponse,
  CartDto,
  UpdateCartItemQuantityCommand,
} from "../types";
import axiosClient from "./axiosClient";

export const cartService = {
  // GET: /api/Cart
  getCart: async (): Promise<ApiResponse<CartDto>> => {
    return await axiosClient.get("/Cart");
  },

  // POST: /api/Cart/add -> Trả về CartDto mới
  addToCart: async (data: AddToCartCommand): Promise<ApiResponse<CartDto>> => {
    return await axiosClient.post("/Cart/add", data);
  },

  // PUT: /api/Cart/update-quantity -> Trả về CartDto mới
  updateQuantity: async (
    data: UpdateCartItemQuantityCommand,
  ): Promise<ApiResponse<CartDto>> => {
    return await axiosClient.put("/Cart/update-quantity", data);
  },

  // DELETE: /api/Cart/remove/{productId} -> Trả về CartDto mới
  removeFromCart: async (productId: string): Promise<ApiResponse<CartDto>> => {
    return await axiosClient.delete(`/Cart/remove/${productId}`);
  },
};
