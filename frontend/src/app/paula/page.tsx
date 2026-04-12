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

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = API_BASE ? API_BASE.replace(/\/$/, "") : "";

export default function PaulaChat() {
const { user, isLoading } = (useAuth() as {
  user: AuthUser | null;
  isLoading: boolean;
});

const router = useRouter();
const messagesEndRef = useRef<HTMLDivElement | null>(null);

const [messages, setMessages] = useState<ChatMessage[]>([]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [chatId, setChatId] = useState<string | null>(null);

useEffect(() => {
if (!isLoading && !user) {
router.push("/auth/login");
}
}, [user, isLoading, router]);

useEffect(() => {
if (!user?.id) return;


const storedMessages = localStorage.getItem(`chat_history_${user.id}`);
const storedChatId = localStorage.getItem(`chat_id_${user.id}`);

if (storedMessages) setMessages(JSON.parse(storedMessages));
if (storedChatId) setChatId(storedChatId);


}, [user?.id]);

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

useEffect(() => {
if (!user?.id) return;


const greetedKey = `paula_greeted_${user.id}`;
if (sessionStorage.getItem(greetedKey)) return;

if (messages.length === 0) {
  setMessages([
    {
      id: crypto.randomUUID(),
      sender: "paula",
      text: "Mi glad yuh reach out 💛. How yuh feeling right now?",
      timestamp: new Date().toISOString(),
    },
  ]);
  sessionStorage.setItem(greetedKey, "true");
}


}, [user?.id, messages.length]);

useEffect(() => {
messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, loading]);

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
  const res = await fetch(`${baseUrl}/api/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user.id,
      ...(chatId && { chat_id: chatId }),
      text: userMessage.text,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.detail || "Server error");
  }

  if (data.chat_id) setChatId(data.chat_id);

  setMessages((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      sender: "paula",
      text: data.response,
      timestamp: data.timestamp || new Date().toISOString(),
    },
  ]);

} catch (err) {
  console.error(err);

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

if (isLoading || !user) {
return ( <div className="h-screen flex items-center justify-center">
Loading Paula... </div>
);
}

return ( <div className="flex flex-col items-center h-screen p-4 bg-linear-to-b from-purple-100 to-gray-100">

  <h1 className="text-3xl font-bold text-purple-700 mb-2">
    Talk With Paula 💛
  </h1>

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
        {m.text}
      </div>
    ))}

    {loading && <div>Paula typing...</div>}
    <div ref={messagesEndRef} />
  </div>

  <div className="flex w-full max-w-xl mt-4 gap-2">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      placeholder="Type your message..."
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
