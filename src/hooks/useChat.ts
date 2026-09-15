import { useState, useEffect } from "react";
import { ChatMessageItem } from "../types/chat";
import { chatService } from "../services/chatService";

export const useChat = (userId?: string) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Đọc sessionId từ localStorage khi vào trang
  useEffect(() => {
    const savedSession = localStorage.getItem("chat_session_id");
    if (savedSession) {
      setSessionId(savedSession);
    }
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Thêm tin nhắn của User vào danh sách giao diện
    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Gọi API Backend thông qua chatService
      const res = await chatService.sendMessage({
        sessionId,
        userId: userId || null,
        message: text,
      });

      // 3. Cập nhật và đồng bộ sessionId mới nếu Backend trả về
      if (res.sessionId && res.sessionId !== sessionId) {
        setSessionId(res.sessionId);
        localStorage.setItem("chat_session_id", res.sessionId);
      }

      // 4. Thêm phản hồi của AI vào giao diện
      const botMsg: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage, sessionId };
};
