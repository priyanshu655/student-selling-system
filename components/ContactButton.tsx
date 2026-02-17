"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactButton({ productId, sellerId }: { productId: string, sellerId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContact = async () => {
    setLoading(true);
    try {
      // ✅ Call the API to find/create a conversation
      const res = await fetch("/api/chat/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, sellerId }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Success: Move to the chat screen
        router.push(`/chat/${data.conversationId}`);
      } else {
        alert(data.message || "Failed to start chat.");
      }
    } catch (err) {
      alert("Something went wrong. Check your login status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleContact} 
      disabled={loading} 
      className="cta-btn"
      style={{ border: 'none' }}
    >
      {loading ? "Connecting..." : "Contact Seller"}
      {!loading && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      )}
    </button>
  );
}