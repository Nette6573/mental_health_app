"use client";

import { db } from "@/lib/firebase/firebaseClient";
import {
  collection, addDoc, query, where,
  onSnapshot, orderBy, serverTimestamp, setDoc, doc
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3, BookOpen, Briefcase, Calendar,
  LayoutDashboard, LogOut, Menu, MessageSquare,
  Moon, Send, Settings, ShieldCheck, Sun, User,
} from "lucide-react";

export default function ProviderMessagesPage() {
  const { user } = useAuth() as any;
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const uid = user?.uid ?? user?.id;

  // ── Dark mode ──
  useEffect(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const logout = () => { window.location.href = "/provider-dashboard/login"; };

  // ── Auto scroll to latest message ──
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
      // Sort by lastMessageAt descending
      chats.sort((a: any, b: any) => {
        const aTime = a.lastMessageAt?.seconds || 0;
        const bTime = b.lastMessageAt?.seconds || 0;
        return bTime - aTime;
      });
      setConversations(chats);
    });

    return () => unsubscribe();
  }, [uid]);

  // ── Load messages for selected chat in real-time ──
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

  // ── Get the other person's name from the chat ──
  const getOtherPersonName = (chat: any) => {
    if (!chat.participantNames || !uid) return "User";
    const otherUid = chat.participants?.find((p: string) => p !== uid);
    return chat.participantNames?.[otherUid] || "User";
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

  const navItems = [
    { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider-dashboard/profile", label: "Profile", icon: User },
    { href: "/provider-dashboard/services", label: "Services", icon: Briefcase },
    { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar },
    { href: "/provider-dashboard/credentials", label: "Verification", icon: ShieldCheck },
    { href: "/provider-dashboard/messaging", label: "Messages", icon: MessageSquare, active: true },
    { href: "/provider-dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/provider-dashboard/resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
      {mobileSidebarOpen && (
        <button className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800 md:translate-x-0 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:flex`}>
        <div className="border-b border-slate-100 p-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png" alt="HopePath Logo" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
            <div>
              <h1 className="text-xl font-bold text-sky-600">HopePath</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">Provider Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href}
                className={item.active ? "flex items-center gap-3 rounded-lg bg-sky-600/10 px-4 py-3 text-sm font-medium text-sky-600" : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-slate-200 p-4 dark:border-slate-700">
          <Link href="/provider-dashboard/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700">
            <Settings className="h-5 w-5" />Settings
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="h-5 w-5" />Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex flex-1 overflow-hidden md:ml-64">
        <div className="flex w-full overflow-hidden">

          {/* CONVERSATIONS LIST */}
          <div className="flex w-80 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Messages</h2>
              <button onClick={() => setMobileSidebarOpen(p => !p)} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700 md:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <button onClick={toggleDarkMode} className="hidden rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700 md:block">
                {darkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-slate-600" />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No conversations yet
                </div>
              )}
              {conversations.map((conversation) => {
                const isSelected = conversation.id === selectedChatId;
                const otherName = getOtherPersonName(conversation);
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedChatId(conversation.id)}
                    className={`w-full border-b border-slate-100 p-4 text-left transition-colors dark:border-slate-700 ${isSelected ? "border-l-4 border-l-sky-600 bg-sky-50 dark:bg-sky-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                        {otherName?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-800 dark:text-white">{otherName}</p>
                        {conversation.lastMessage && (
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{conversation.lastMessage}</p>
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
            {!selectedChatId ? (
              // No chat selected
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
                    <MessageSquare className="h-8 w-8 text-sky-600" />
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">Select a conversation</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                    {getOtherPersonName(selectedConversation)?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {getOtherPersonName(selectedConversation)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Client</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto p-6">
                  {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-slate-400">No messages yet — start the conversation</p>
                    </div>
                  )}
                  {messages.map((message) => {
                    const isMe = message.senderId === uid;
                    return (
                      <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "rounded-tr-none bg-sky-600 text-white" : "rounded-tl-none bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100"}`}>
                          <p>{message.text}</p>
                          {message.createdAt && (
                            <p className={`mt-1 text-right text-xs ${isMe ? "text-sky-200" : "text-slate-400"}`}>
                              {message.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || ""}
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
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Type your reply..."
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
      </main>
    </div>
  );
}
