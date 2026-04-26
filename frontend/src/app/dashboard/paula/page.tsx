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

  // ---------------- STATE ----------------
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const [sessions, setSessions] = useState<
    { id: string; title: string }[]
  >([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const userId = user?.id || "";

  // ---------------- AUTH ----------------
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  // ---------------- LOAD SESSIONS ----------------
  useEffect(() => {
    if (!user?.id) return;

    const storedSessions = localStorage.getItem(`chat_sessions_${user.id}`);
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }

    const lastSession = localStorage.getItem(`active_session_${user.id}`);
    if (lastSession) {
      setActiveSession(lastSession);

      const storedMessages = localStorage.getItem(
        `chat_history_${user.id}_${lastSession}`
      );

      const storedChatId = localStorage.getItem(
        `chat_id_${user.id}_${lastSession}`
      );

      if (storedMessages) setMessages(JSON.parse(storedMessages));
      if (storedChatId) setChatId(storedChatId);
    }
  }, [user?.id]);

  // ---------------- SAVE ----------------
  useEffect(() => {
    if (!user?.id || !activeSession) return;

    localStorage.setItem(
      `chat_history_${user.id}_${activeSession}`,
      JSON.stringify(messages)
    );
  }, [messages, user?.id, activeSession]);

  useEffect(() => {
    if (!user?.id || !activeSession || !chatId) return;

    localStorage.setItem(
      `chat_id_${user.id}_${activeSession}`,
      chatId
    );
  }, [chatId, user?.id, activeSession]);

  // ---------------- GREETING ----------------
  useEffect(() => {
    if (!user?.id || !activeSession) return;

    const greetedKey = `paula_greeted_${user.id}_${activeSession}`;
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
  }, [user?.id, activeSession, messages.length]);

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

      if (!res.ok) throw new Error("Server error");

      const data: BackendResponse = await res.json();

      if (data.chat_id) setChatId(data.chat_id);

      const paulaReply: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "paula",
        text: data.response,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, paulaReply]);

    } catch {
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

    const confirmReset = confirm(
      "Start a new chat? Current conversation will be cleared."
    );
    if (!confirmReset) return;

    const newSessionId = crypto.randomUUID();

    const newSession = {
      id: newSessionId,
      title: "New Chat",
    };

    const updatedSessions = [newSession, ...sessions];

    setSessions(updatedSessions);
    setActiveSession(newSessionId);
    setMessages([]);
    setChatId(null);

    localStorage.setItem(
      `chat_sessions_${user.id}`,
      JSON.stringify(updatedSessions)
    );

    localStorage.setItem(`active_session_${user.id}`, newSessionId);
  };

  // ---------------- LOAD SESSION ----------------
  const loadSession = (sessionId: string) => {
    if (!user) return;

    const storedMessages = localStorage.getItem(
      `chat_history_${user.id}_${sessionId}`
    );

    const storedChatId = localStorage.getItem(
      `chat_id_${user.id}_${sessionId}`
    );

    setActiveSession(sessionId);
    setMessages(storedMessages ? JSON.parse(storedMessages) : []);
    setChatId(storedChatId || null);

    localStorage.setItem(`active_session_${user.id}`, sessionId);
  };

  // ---------------- LOADING ----------------
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Paula...
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-3 flex flex-col">

        <button
          onClick={startNewConversation}
          className="mb-3 bg-purple-600 text-white px-3 py-2 rounded-lg"
        >
          ➕ New Chat
        </button>

        <div className="flex-1 overflow-y-auto">
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => loadSession(s.id)}
              className={`p-2 rounded cursor-pointer mb-1 ${
                activeSession === s.id
                  ? "bg-purple-200"
                  : "hover:bg-gray-100"
              }`}
            >
              {s.title}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col items-center p-4 bg-gradient-to-b from-purple-100 to-gray-100">

        {/* HEADER */}
        <div className="flex justify-between items-center w-full max-w-xl mb-4">

          <h1 className="text-2xl font-bold text-purple-700">
            Talk With Paula 💛
          </h1>

          <div className="flex gap-2">

            <button
              onClick={startNewConversation}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm"
            >
              🔄 New Chat
            </button>

            <Link
              href="/safety"
              className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm"
            >
              🆘 Help
            </Link>

          </div>
        </div>

        {/* CHAT */}
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

          {loading && (
            <div className="bg-purple-100 p-3 rounded-lg w-fit">
              Paula typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
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
    </div>
  );
}