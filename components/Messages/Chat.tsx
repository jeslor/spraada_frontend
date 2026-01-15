"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket/socket";

export default function Chat({ userId }: { userId?: number }) {
  const otherId = userId === 1 ? 2 : 1;
  const socket = getSocket(userId!);
  const [messages, setMessages] = useState<{ text: string; from: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleChat = (message: { text: string; from: string }) => {
      setMessages((msgs) => [...msgs, message]);
    };
    socket.on("chats", handleChat);
    return () => {
      socket.off("chats", handleChat);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("chats", { userId: otherId, text: input });
    setMessages((msgs) => [...msgs, { text: input, from: "me" }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-80 w-full">
      <div className="flex-1 overflow-y-auto bg-white border rounded-t-xl p-3 space-y-2 w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-1 rounded-lg max-w-xs wrap-break-word text-sm shadow-sm ${
                msg.from === "me"
                  ? "bg-primary-100 text-primary-900"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={sendMessage}
        className="flex gap-2 p-2 border-t bg-gray-50 rounded-b-xl w-full"
      >
        <input
          className="flex-1 px-3 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary-200"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
