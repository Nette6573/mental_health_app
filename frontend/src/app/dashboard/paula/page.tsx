"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = API_BASE ? API_BASE.replace(/\/$/, "") : "";

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

// ---------------- AUTH CHECK ----------------
useEffect(() => {
if (!isLoading && !user) {
router.push("/auth/login");
}
}, [user, isLoading, router]);

// ---------------- LOAD HISTORY ----------------

useEffect(() => {
  if (!user?.id) return;

  const storedMessages = localStorage.getItem(`chat_history_${user.id}`);
  const storedChatId = localStorage.getItem(`chat_id_${user.id}`);

  if (storedMessages) setMessages(JSON.parse(storedMessages));
  if (storedChatId) setChatId(storedChatId);
}, [user?.id]);

// ---------------- SAVE HISTORY ----------------
useEffect(() => {
if (user?.id && messages.length > 0) {
localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(messages));
}
}, [messages, user?.id]);

useEffect(() => {
if (user?.id && chatId) {
localStorage.setItem(`chat_id_${user.id}`, chatId);
}
}, [chatId, user?.id]);

// ---------------- GREETING ----------------
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

    setMessages([greeting]);
    sessionStorage.setItem(greetedKey, "true");
  }
}, [user?.id, messages.length]);

// ---------------- AUTO SCROLL ----------------
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, loading]);

// ---------------- SEND MESSAGE ----------------
const sendMessage = async () => {
  if (!input.trim() || !user || loading || !userId) return;

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
    const res = await fetch(`${baseUrl}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: userMessage.text,
        user_id: userId,
        chat_id: chatId,
      }),
    });

    if (!res.ok) {
      console.error("Server error:", res.status);
      throw new Error("Server error");
    }

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
    console.error("Frontend error:", err);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "paula",
        text: "Mi having a likkle trouble right now… try again in a bit 💛",
        timestamp: new Date().toISOString(),
      },
    ]);
  } finally {
    setLoading(false);
  }
};

// ---------------- NEW CHAT ----------------
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
    <div className="h-screen flex items-center justify-center">
      Loading Paula...
    </div>
  );
}

return (
  <div className="flex flex-col items-center h-screen p-4 bg-gradient-to-b from-purple-100 to-gray-100">

    <div className="flex justify-between w-full max-w-xl mb-2">
      <h1 className="text-3xl font-bold text-purple-700">
        Talk With Paula 💛
      </h1>
      <Link href="/safety" className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full">
        🆘 Crisis Help
      </Link>
    </div>

    <button
      onClick={startNewConversation}
      className="mb-3 px-3 py-1 border rounded bg-red-100 hover:bg-red-200"
    >
      🔄 New Conversation
    </button>

    <div className="w-full max-w-xl bg-white rounded-xl shadow p-4 flex flex-col overflow-y-auto h-[70%]">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`mb-2 p-3 rounded-lg max-w-[80%] ${
            m.sender === "paula"
              ? "bg-purple-200 self-start"
              : "bg-blue-200 self-end"
          }`}
        >
          <div className="text-sm whitespace-pre-wrap">{m.text}</div>
        </div>
      ))}

      {loading && (
        <div className="bg-purple-100 p-3 rounded-lg w-fit">
          Paula typing...
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>

    <div className="flex w-full max-w-xl mt-4 gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message…"
        className="flex-1 p-2 border rounded"
      />

      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        Send
      </button>
    </div>
  </div>
);
}