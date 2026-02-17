"use client";

import { useEffect, useState, use } from "react"; // Added 'use' from React

// Updated the Type for params to be a Promise
export default function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  
  // ✅ In Next.js 15 Client Components, we use the 'use' hook to unwrap the params promise
  const resolvedParams = use(params);
  const chatId = resolvedParams.chatId;

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  // ✅ Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages/${chatId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    if (chatId) fetchMessages();
  }, [chatId]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
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
      const updatedData = await res.json();
      setMessages(updatedData);
    } catch (err) {
      console.error("Error sending message:", err);
    }
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
          <p className="text-gray-500 text-center mt-10">No messages yet...</p>
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
      <div className="p-4 bg-white flex gap-2 border-t sticky bottom-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // Better UX: send on Enter
          placeholder="Type message..."
          className="flex-1 border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          onClick={sendMessage}
          className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-6 py-2 rounded-xl font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
}