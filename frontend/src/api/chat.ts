import api from "./client";

export const sendChat = (message: string) =>
  api.post<{ reply: string }>("/ai/chat", { message }).then((r) => r.data.reply);

export type ChatHistoryItem = { sender: "USER" | "ASSISTANT"; content: string };

export const getChatHistory = () =>
  api.get<ChatHistoryItem[]>("/ai/chat/history").then((r) => r.data);
