export interface SendChatMessageRequest {
  sessionId?: string | null;
  userId?: string | null;
  message: string;
}

export interface ChatResponseDto {
  sessionId: string;
  response: string;
}

export interface ChatMessageItem {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}
