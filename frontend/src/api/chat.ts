import api from "./client";

export const sendChat = (message: string) =>
  api.post<{ reply: string }>("/ai/chat", { message }).then((r) => r.data.reply);
