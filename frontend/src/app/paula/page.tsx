"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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

// -------------------
// SPEECH RECOGNITION TYPES (NO `any`)
// -------------------
interface SpeechRecognitionResult {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: SpeechRecognitionResultList;
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  start(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

interface SpeechRecognitionWindow extends Window {
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  SpeechRecognition?: new () => SpeechRecognitionInstance;
}

const getSpeechRecognition = (): SpeechRecognitionInstance | null => {
  if (typeof window === "undefined") return null;
  const w = window as SpeechRecognitionWindow;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
};

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
  const [mutePaula, setMutePaula] = useState(false);

  const sessionId = `session-${user?.id}`;

  // -------------------
  // ENSURE VOICES LOAD
  // -------------------
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // -------------------
  // 🔊 TEXT TO SPEECH (STABLE REF)
  // -------------------
  const speak = useCallback(
    (text: string) => {
      if (mutePaula || !("speechSynthesis" in window)) return;

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = "en-JM";
      utterance.rate = 0.95;
      utterance.pitch = 1.1;

      const voices = synth.getVoices();

      const femaleVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (
              v.name.toLowerCase().includes("female") ||
              v.name.toLowerCase().includes("woman") ||
              v.name.toLowerCase().includes("samantha") ||
              v.name.toLowerCase().includes("zira") ||
              v.name.toLowerCase().includes("victoria")
            )
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (femaleVoice) utterance.voice = femaleVoice;
      synth.speak(utterance);
    },
    [mutePaula]
  );

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

    const loadHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/chat/history?user_id=${user.id}&session_id=${sessionId}`
        );
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch (err) {
        console.error("History load failed:", err);
      }
    };

    loadHistory();
  }, [user?.id, sessionId]);

  // -------------------
  // GREET ON ENTRY
  // -------------------
  useEffect(() => {
    if (!user?.id) return;

    const greetedKey = `paula_greeted_${user.id}`;
    if (sessionStorage.getItem(greetedKey)) return;

    const greeting: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "paula",
      text: "Mi glad yuh reach out 💛. How yuh feeling right now?",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, greeting]);
    speak(greeting.text);
    sessionStorage.setItem(greetedKey, "true");
  }, [user?.id, speak]);

  // -------------------
  // AUTO-SCROLL
  // -------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // -------------------
  // 🎤 VOICE INPUT
  // -------------------
  const startListening = () => {
    const rec = getSpeechRecognition();
    if (!rec) return alert("Voice input not supported.");

    rec.lang = "en-JM";
    rec.interimResults = false;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      setInput(e.results[0][0].transcript);
    };

    rec.start();
  };

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
      const res = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          user_id: user.id,
          session_id: sessionId,
        }),
      });

      const data = await res.json();

      const paulaReply: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "paula",
        text: data.response || "Mi nuh quite catch dat—try again?",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, paulaReply]);
      speak(paulaReply.text);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "paula",
          text: "Something went wrong. Try again in a likkle bit.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    setLoading(false);
  };

  // -------------------
  // NEW CONVERSATION
  // -------------------
  const startNewConversation = async () => {
    if (!user) return;

    sessionStorage.removeItem(`paula_greeted_${user.id}`);
    setMessages([]);

    await fetch("http://localhost:8000/chat/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        session_id: sessionId,
      }),
    });
  };

  // -------------------
  // BLOCK UI
  // -------------------
  if (isLoading || !user) {
    return <div className="h-screen flex items-center justify-center">Loading…</div>;
  }

  // -------------------
  // UI
  // -------------------
  return (
    <div className="flex flex-col items-center h-screen p-4 bg-gradient-to-b from-purple-100 to-gray-100">
      <h1 className="text-3xl font-bold text-purple-700 mb-2">
        Talk With Paula 💛
      </h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMutePaula((p) => !p)}
          className="px-3 py-1 border rounded bg-white"
        >
          {mutePaula ? "🔈 Voice ON" : "🔇 Mute"}
        </button>

        <button
          onClick={startNewConversation}
          className="px-3 py-1 border rounded bg-red-100 hover:bg-red-200"
        >
          🔄 New Conversation
        </button>
      </div>

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
            <div className="text-sm">{m.text}</div>
            <div className="text-[10px] text-gray-500 mt-1">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {loading && <div className="italic">Paula is thinking…</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex w-full max-w-xl mt-4 gap-2">
        <button onClick={startListening} className="px-3 py-2 bg-gray-200 rounded">
          🎤
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
