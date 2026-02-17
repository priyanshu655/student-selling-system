"use client";

import { useEffect, useState } from "react";

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const chatId = params.chatId;

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  // ✅ Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/chat/messages/${chatId}`);
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
  }, [chatId]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        text,
      }),
    });

    setText("");

    // Reload messages after sending
    const res = await fetch(`/api/chat/messages/${chatId}`);
    setMessages(await res.json());
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <div className="bg-black text-white p-4 font-bold">
        Chat Room 💬
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white p-3 rounded-xl shadow w-fit max-w-[70%]"
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white flex gap-2 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border px-4 py-2 rounded-xl"
        />

        <button
          onClick={sendMessage}
          className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
