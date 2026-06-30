import { useEffect, useRef, useState } from "react";
import { IconMessageChatbot, IconX, IconSend } from "@tabler/icons-react";
import { sendChat } from "../api/chat";

type Msg = { from: "user" | "bot"; text: string };

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hi! Ask me about your jobs, applications, or matches." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendChat(text);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
    } catch {
      setMessages((m) => [...m, { from: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-bright-sun-400 text-mine-shaft-950 shadow-lg flex items-center justify-center hover:bg-bright-sun-300 transition-colors"
      >
        {open ? <IconX size={24} /> : <IconMessageChatbot size={26} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[90vw] h-[480px] flex flex-col bg-mine-shaft-900 border border-mine-shaft-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3 bg-mine-shaft-800 border-b border-mine-shaft-700">
            <div className="text-mine-shaft-100 font-semibold">HireSense Assistant</div>
            <div className="text-xs text-mine-shaft-400">Answers from your real data</div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "user" ? "self-end max-w-[80%]" : "self-start max-w-[85%]"}>
                <div
                  className={`px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                    m.from === "user"
                      ? "bg-bright-sun-400 text-mine-shaft-950"
                      : "bg-mine-shaft-800 text-mine-shaft-100"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="self-start text-xs text-mine-shaft-400 px-2">thinking...</div>}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-mine-shaft-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask something..."
              className="flex-1 bg-mine-shaft-800 text-mine-shaft-100 text-sm rounded-lg px-3 py-2 outline-none placeholder:text-mine-shaft-500"
            />
            <button
              onClick={send}
              disabled={loading}
              aria-label="Send"
              className="bg-bright-sun-400 text-mine-shaft-950 rounded-lg px-3 disabled:opacity-50 flex items-center"
            >
              <IconSend size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
