"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/src/hooks/useChat";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";

export const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { messages, loading, sendMessage } = useChat();
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const msg = inputMessage;
    setInputMessage("");
    await sendMessage(msg);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end">
      {/* Cửa sổ Popup Chatbot */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] sm:w-[380px] h-[calc(100vh-100px)] max-h-[480px] sm:max-h-[500px] bg-white rounded-2xl shadow-2xl border border-amber-100 flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-amber-950 px-4 py-3 flex items-center justify-between text-white border-b border-amber-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-amber-800/80 border border-amber-600/50 flex items-center justify-center text-amber-300 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-amber-50 flex items-center gap-1.5">
                  Mỹ Nghệ AI{" "}
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-[10px] text-amber-300/80">
                  Tư vấn đồ gỗ mỹ nghệ 24/7
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-amber-900 rounded-lg text-amber-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Danh sách Tin nhắn */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-neutral-50/50 text-sm">
            {messages.length === 0 && (
              <div className="text-center py-6 px-3 space-y-2.5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-neutral-600 font-medium text-xs sm:text-sm">
                  Xin chào! Tôi có thể tư vấn gì cho bạn về các sản phẩm đồ gỗ
                  mỹ nghệ hôm nay?
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    msg.sender === "user"
                      ? "bg-amber-600 text-white"
                      : "bg-amber-950 text-amber-300 border border-amber-800"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                <div
                  className={`max-w-[80%] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl leading-relaxed text-xs sm:text-sm ${
                    msg.sender === "user"
                      ? "bg-amber-600 text-white rounded-tr-none shadow-sm"
                      : "bg-white text-neutral-800 border border-neutral-200/80 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-neutral-400 text-xs py-1 pl-8">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>AI đang suy nghĩ...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô Nhập liệu */}
          <form
            onSubmit={handleSend}
            className="p-2.5 sm:p-3 bg-white border-t border-neutral-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Hỏi về chất liệu, giá..."
              disabled={loading}
              className="flex-1 bg-neutral-100/80 border-0 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-600/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2 sm:p-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-200 text-white rounded-xl shadow-md transition shrink-0"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-950 hover:bg-amber-900 text-amber-400 rounded-full shadow-2xl flex items-center justify-center border-2 border-amber-600/60 transition transform hover:scale-105 active:scale-95 shrink-0"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        ) : (
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>
    </div>
  );
};
