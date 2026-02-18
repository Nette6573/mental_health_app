
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Your actual Hugging Face Space URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

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

// Backend response type
interface BackendResponse {
  response: string;
  chat_id: string;
  timestamp: string;
}

export default function PaulaChat() {
  const { user, isLoading } = useAuth() as {
    user: AuthUser | null;
    isLoading: boolean;
  };

  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // -------------------
  // STATE
  // -------------------
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  // Generate a consistent user ID from the auth user
  const userId = user?.id || '';

  // -------------------
  // AUTH CHECK
  // -------------------
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  // -------------------
  // LOAD HISTORY FROM LOCAL STORAGE
  // -------------------
  useEffect(() => {
    if (!user?.id) return;

    const loadHistory = () => {
      try {
        // Load messages from localStorage instead of backend
        const storedMessages = localStorage.getItem(`chat_history_${user.id}`);
        const storedChatId = localStorage.getItem(`chat_id_${user.id}`);
        
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
        if (storedChatId) {
          setChatId(storedChatId);
        }
      } catch (err) {
        console.error("History load failed:", err);
      }
    };

    loadHistory();
  }, [user?.id]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user?.id && messages.length > 0) {
      localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user?.id]);

  // Save chatId to localStorage
  useEffect(() => {
    if (user?.id && chatId) {
      localStorage.setItem(`chat_id_${user.id}`, chatId);
    }
  }, [chatId, user?.id]);

  // -------------------
  // GREET ON ENTRY
  // -------------------
  useEffect(() => {
    if (!user?.id) return;

    const greetedKey = `paula_greeted_${user.id}`;
    if (sessionStorage.getItem(greetedKey)) return;

    // Only greet if there are no messages
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
  // AUTO-SCROLL
  // -------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // -------------------
// SEND MESSAGE TO BACKEND
// -------------------
const sendMessage = async () => {
  if (!input.trim() || !user || loading) return;

  const userMessage: ChatMessage = {
    id: crypto.randomUUID(),
    sender: "user",
    text: input,
    timestamp: new Date().toISOString(),
  };

  // Add user message immediately
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
    if (!API_BASE) throw new Error("API_BASE is not set");

    // Build URL for FastAPI endpoint
    let url = `${API_BASE}/api/send?user_id=${encodeURIComponent(userId)}`;
    if (chatId) url += `&chat_id=${encodeURIComponent(chatId)}`;

    console.log("Sending message to:", url, "payload:", { text: userMessage.text });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: userMessage.text }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", res.status, text);
      throw new Error(`Backend responded with status ${res.status}`);
    }

    const data: BackendResponse = await res.json();
    console.log("Backend response:", data);

    // Save chat ID for future messages
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

    const errorMessage = err instanceof Error && err.message.includes("Failed to fetch")
      ? "Can't reach Paula right now. Check your internet connection."
      : "Something went wrong. Try again in a likkle bit.";

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "paula",
        text: errorMessage,
        timestamp: new Date().toISOString(),
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  // -------------------
  // NEW CONVERSATION
  // -------------------
  const startNewConversation = async () => {
    if (!user) return;

    // Clear local storage for this user
    sessionStorage.removeItem(`paula_greeted_${user.id}`);
    localStorage.removeItem(`chat_history_${user.id}`);
    localStorage.removeItem(`chat_id_${user.id}`);
    
    // Reset state
    setMessages([]);
    setChatId(null);

    // Add a new greeting
    const greeting: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "paula",
      text: "Mi glad yuh reach out 💛. How yuh feeling right now?",
      timestamp: new Date().toISOString(),
    };

    setMessages([greeting]);
    sessionStorage.setItem(`paula_greeted_${user.id}`, "true");
  };

  // -------------------
  // BLOCK UI
  // -------------------
  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">Loading Paula...</div>
          <div className="text-sm text-gray-500">Just a moment</div>
        </div>
      </div>
    );
  }

  // -------------------
  // UI
  // -------------------
  return (
    <div className="flex flex-col items-center h-screen p-4 bg-gradient-to-b from-purple-100 to-gray-100">
      <h1 className="text-3xl font-bold text-purple-700 mb-2">
        Talk With Paula 💛
      </h1>

      <button
        onClick={startNewConversation}
        className="mb-3 px-3 py-1 border rounded bg-red-100 hover:bg-red-200 transition-colors"
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
            <div className="text-[10px] text-gray-500 mt-1">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-2">
            <div className="bg-purple-100 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex w-full max-w-xl mt-4 gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message…"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={loading}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>

      {/* Debug info - remove in production */}
      <div className="text-xs text-gray-400 mt-2">
        {chatId ? `Chat ID: ${chatId.substring(0, 8)}...` : 'New chat'}
      </div>
    </div>
  );
}