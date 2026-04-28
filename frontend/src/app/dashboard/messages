"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/firebaseClient";
import {
  collection, query, where, onSnapshot,
  orderBy, addDoc, setDoc, doc, serverTimestamp
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { Send, MessageSquare } from "lucide-react";

export default function UserMessagesPage() {
  const { user, isLoading: authLoading } = useAuth() as any;
  const router = useRouter();

  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const uid = user?.uid ?? user?.id;

  // ── Redirect if not logged in ──
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // ── Auto scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Load conversations in real-time ──
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((chatDoc) => ({
        id: chatDoc.id,
        ...chatDoc.data(),
      }));
      chats.sort((a: any, b: any) => {
        const aTime = a.lastMessageAt?.seconds || 0;
        const bTime = b.lastMessageAt?.seconds || 0;
        return bTime - aTime;
      });
      setConversations(chats);

      // Auto select first conversation if none selected
      if (!selectedChatId && chats.length > 0) {
        setSelectedChatId(chats[0].id);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  // ── Load messages for selected chat ──
  useEffect(() => {
    if (!selectedChatId) return;

    const q = query(
      collection(db, "chats", selectedChatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((msgDoc) => ({
        id: msgDoc.id,
        ...msgDoc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedChatId]);

  // ── Get the other person's name ──
  const getOtherPersonName = (chat: any) => {
    if (!chat.participantNames || !uid) return "Provider";
    const otherUid = chat.participants?.find((p: string) => p !== uid);
    return chat.participantNames?.[otherUid] || "Provider";
  };

  // ── Send message ──
  const sendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !selectedChatId || !uid) return;

    setSendingMessage(true);
    try {
      await addDoc(collection(db, "chats", selectedChatId, "messages"), {
        text: trimmed,
        senderId: uid,
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "chats", selectedChatId),
        { lastMessage: trimmed, lastMessageAt: serverTimestamp() },
        { merge: true }
      );

      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const selectedConversation = conversations.find((c) => c.id === selectedChatId);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user}>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">

        {/* CONVERSATIONS LIST */}
        <div className="flex w-72 shrink-0 flex-col border-r border-slate-200 dark:border-slate-700">
          <div className="border-b border-slate-200 p-4 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Messages</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your conversations with providers</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && (
              <div className="p-6 text-center">
                <MessageSquare className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No conversations yet</p>
                <p className="mt-1 text-xs text-slate-400">
                  Go to{" "}
                  <button
                    onClick={() => router.push("/dashboard/therapists")}
                    className="text-sky-600 hover:underline"
                  >
                    Find a Therapist
                  </button>{" "}
                  to start a conversation
                </p>
              </div>
            )}

            {conversations.map((conversation) => {
              const isSelected = conversation.id === selectedChatId;
              const otherName = getOtherPersonName(conversation);
              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedChatId(conversation.id)}
                  className={`w-full border-b border-slate-100 p-4 text-left transition-colors dark:border-slate-700 ${
                    isSelected
                      ? "border-l-4 border-l-sky-600 bg-sky-50 dark:bg-sky-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                      {otherName?.[0]?.toUpperCase() || "P"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-800 dark:text-white">{otherName}</p>
                      {conversation.lastMessage && (
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-900">
          {!selectedChatId || !selectedConversation ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
                  <MessageSquare className="h-8 w-8 text-sky-600" />
                </div>
                <p className="font-medium text-slate-700 dark:text-slate-200">Select a conversation</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Choose a conversation from the left to start messaging
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  {getOtherPersonName(selectedConversation)?.[0]?.toUpperCase() || "P"}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {getOtherPersonName(selectedConversation)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Provider</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto p-6">
                {messages.length === 0 && (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-slate-400">No messages yet — say hello!</p>
                  </div>
                )}
                {messages.map((message) => {
                  const isMe = message.senderId === uid;
                  return (
                    <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                        isMe
                          ? "rounded-tr-none bg-sky-600 text-white"
                          : "rounded-tl-none bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                      }`}>
                        <p>{message.text}</p>
                        {message.createdAt && (
                          <p className={`mt-1 text-right text-xs ${isMe ? "text-sky-200" : "text-slate-400"}`}>
                            {message.createdAt?.toDate?.()?.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            }) || ""}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || sendingMessage}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
