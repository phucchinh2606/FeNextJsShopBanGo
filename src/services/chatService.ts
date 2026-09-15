import { ChatResponseDto, SendChatMessageRequest } from "../types/chat";
import axiosClient from "./axiosClient";

export const chatService = {
  sendMessage: async (
    payload: SendChatMessageRequest,
  ): Promise<ChatResponseDto> => {
    // Gọi API POST /Chat
    const response: any = await axiosClient.post("/Chat", payload);

    // Nếu Backend bọc trong ApiResponse { success, data, message }
    // thì lấy response.data, ngược lại nếu trả về trực tiếp thì lấy response
    return response?.data || response;
  },
};
