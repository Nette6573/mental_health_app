"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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

const baseUrl = "https://mentalhealthapp-production.up.railway.app";

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
  const [showConfirmReset, setShowConfirmReset] = useState(false);

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

  const refreshChat = () => {
    setShowConfirmReset(true);
  };

  const confirmRefresh = () => {
    if (user?.id) {
      setMessages([]);
      setChatId(null);
      localStorage.removeItem(`chat_history_${user.id}`);
      localStorage.removeItem(`chat_id_${user.id}`);
      sessionStorage.removeItem(`paula_greeted_${user.id}`);
    }
    setShowConfirmReset(false);
  };

  const cancelRefresh = () => {
    setShowConfirmReset(false);
  };

  const navigateToSafety = () => {
    router.push("/safety");
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Paula...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen p-4 bg-gradient-to-b from-purple-100 to-gray-100">
      {/* Header with buttons */}
      <div className="w-full max-w-xl flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-purple-700">
          Talk With Paula 💛
        </h1>
        <div className="flex gap-2">
          {/* New Chat / Refresh Button */}
          <button
            onClick={refreshChat}
            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            New Chat
          </button>

          {/* Safety Button */}
          <button
            onClick={navigateToSafety}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Safety
          </button>
        </div>
      </div>

      {/* Confirmation Modal for New Chat */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-xl font-bold mb-3 text-gray-800">Start New Conversation?</h3>
            <p className="text-gray-600 mb-6">
              This will clear your current chat history with Paula. You can't undo this action.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelRefresh}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRefresh}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-4 flex flex-col overflow-y-auto h-[70%]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>No messages yet</p>
            <p className="text-sm">Click "New Chat" to start a conversation with Paula</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`mb-2 p-3 rounded-lg max-w-[80%] ${
                m.sender === "paula"
                  ? "bg-purple-200 self-start"
                  : "bg-blue-200 self-end"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{m.text}</div>
              <div
                className={`text-xs mt-1 ${
                  m.sender === "paula" ? "text-purple-600" : "text-blue-600"
                }`}
              >
                {new Date(m.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="mb-2 p-3 rounded-lg max-w-[80%] bg-purple-200 self-start">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <span className="text-purple-600 ml-1">Paula typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex w-full max-w-xl mt-4 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}