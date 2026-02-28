"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

// -------------------
// TYPES
// -------------------
interface ChatMessage {
  id: string;
  sender: "paula" | "user";
  text: string;
  timestamp: string;
}

interface AuthUser {
  id: string;
  email: string;
}

interface BackendResponse {
  response: string;
  chat_id: string;
  timestamp: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;
const baseUrl = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;

export default function PaulaChat() {
  const { user, isLoading } = useAuth() as {
    user: AuthUser | null;
    isLoading: boolean;
  };

  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const userId = user?.id || "";

  // -------------------
  // AUTH CHECK
  // -------------------
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  // -------------------
  // LOAD HISTORY
  // -------------------
  useEffect(() => {
    if (!user?.id) return;

    const storedMessages = localStorage.getItem(`chat_history_${user.id}`);
    const storedChatId = localStorage.getItem(`chat_id_${user.id}`);

    if (storedMessages) setMessages(JSON.parse(storedMessages));
    if (storedChatId) setChatId(storedChatId);
  }, [user?.id]);

  // Save history
  useEffect(() => {
    if (user?.id && messages.length > 0) {
      localStorage.setItem(
        `chat_history_${user.id}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, user?.id]);

  useEffect(() => {
    if (user?.id && chatId) {
      localStorage.setItem(`chat_id_${user.id}`, chatId);
    }
  }, [chatId, user?.id]);

  // -------------------
  // GREETING
  // -------------------
  useEffect(() => {
    if (!user?.id) return;

    const greetedKey = `paula_greeted_${user.id}`;
    if (sessionStorage.getItem(greetedKey)) return;

    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "paula",
        text: "Mi glad yuh reach out 💛. How yuh feeling right now?",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, greeting]);
      sessionStorage.setItem(greetedKey, "true");
    }
  }, [user?.id, messages.length]);

  // -------------------
  // AUTO SCROLL
  // -------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // -------------------
  // SEND MESSAGE
  // -------------------
  const sendMessage = async () => {
    if (!input.trim() || !user || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      let url = `${baseUrl}/api/send?user_id=${encodeURIComponent(userId)}`;
      if (chatId) url += `&chat_id=${encodeURIComponent(chatId)}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage.text }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data: BackendResponse = await res.json();

      if (data.chat_id) setChatId(data.chat_id);

      const paulaReply: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "paula",
        text: data.response,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, paulaReply]);
    } catch (err) {
      console.error("Send message error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "paula",
          text: "Something went wrong. Try again in a likkle bit.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // -------------------
  // NEW CHAT
  // -------------------
  const startNewConversation = () => {
    if (!user) return;

    sessionStorage.removeItem(`paula_greeted_${user.id}`);
    localStorage.removeItem(`chat_history_${user.id}`);
    localStorage.removeItem(`chat_id_${user.id}`);

    setMessages([]);
    setChatId(null);

    const greeting: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "paula",
      text: "Mi glad yuh reach out 💛. How yuh feeling right now?",
      timestamp: new Date().toISOString(),
    };

    setMessages([greeting]);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Paula...
      </div>
    );
  }

  // -------------------
  // UI
  // -------------------
  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4 bg-gradient-to-b from-purple-100 to-gray-100">

      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-4">
        <h1 className="text-3xl font-bold text-purple-700">
          Talk With Paula 💛
        </h1>

        <Link
          href="/safety"
          className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200"
        >
          🆘 Crisis Help
        </Link>
      </div>

      <button
        onClick={startNewConversation}
        className="mb-4 px-4 py-2 border rounded bg-red-100 hover:bg-red-200"
      >
        🔄 New Conversation
      </button>

      {/* Chat Window */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow p-4 flex flex-col flex-1 min-h-[450px] overflow-y-auto">

        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-3 p-3 rounded-lg max-w-[70%] md:max-w-[60%] ${
              m.sender === "paula"
                ? "bg-purple-200 self-start"
                : "bg-blue-200 self-end"
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">{m.text}</div>

            <div className="text-[10px] text-gray-500 mt-1">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {loading && (
          <div className="bg-purple-100 p-3 rounded-lg w-fit">
            Paula is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex w-full max-w-4xl mt-4 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message…"
          className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={loading}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300"
        >
          Send
        </button>
      </div>

      <div className="text-xs text-gray-400 mt-2">
        {chatId ? `Chat ID: ${chatId.substring(0, 8)}...` : "New chat"}
      </div>

    </div>
  );
}