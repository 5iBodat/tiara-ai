"use client";

import { useState } from "react";
import ChatBubble from "@/components/ChatBubble";

interface Chat {
  sender: "me" | "ai";
  text: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Chat[]>([]);

  const AiName = process.env.NEXT_PUBLIC_APP_NAME;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Chat = { sender: "me", text: input };
    const newChat = [...chat, userMsg];

    setChat(newChat);
    setInput("");

    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: newChat }),
    });

    const data = await res.json();
    const aiMsg: Chat = { sender: "ai", text: data.result };

    setChat((c) => [...c, aiMsg]);
  };

  return (
      <div className="flex flex-col h-screen p-6">
        <h1 className="text-xl font-bold mb-4"> {AiName} Teman Curhat 🤍</h1>

        <div className="flex-1 overflow-y-auto mb-4">
          {chat.map((c, i) => (
              <ChatBubble key={i} sender={c.sender} text={c.text} />
          ))}
        </div>

        <div className="flex gap-2">
          <input
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Ceritakan apa yang kamu rasakan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
              className="px-4 bg-blue-600 text-white rounded-lg"
              onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
  );
}
