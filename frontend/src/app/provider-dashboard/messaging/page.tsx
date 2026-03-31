"use client";

import { db } from "@/lib/firebase/firebaseClient";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sun,
  User,
  Video,
} from "lucide-react";

export default function ProviderMessagesPage() {
  const { user } = useAuth() as any;
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");

  // 🔥 FIRESTORE STATES (REPLACES FAKE DATA)
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // 🌙 DARK MODE (UNCHANGED)
  useEffect(() => {
    const savedTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDarkMode = !darkMode;
    setDarkMode(nextDarkMode);

    if (nextDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const logout = () => {
    window.location.href = "/provider-dashboard/login";
  };

  // 🔥 LOAD CONVERSATIONS (REAL-TIME)
  useEffect(() => {
  if (!user?.uid) return; // 🔴 VERY IMPORTANT

  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setConversations(chats as any);
  });

  return () => unsubscribe();
}, [user]);

  // 🔥 LOAD MESSAGES FOR SELECTED CHAT
  useEffect(() => {
    if (!selectedChatId) return;

    const q = query(
      collection(db, "chats", selectedChatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedChatId]);

  // 🔥 OPEN CHAT
  const openConversation = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  // 🔥 SEND MESSAGE
  const sendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !selectedChatId || !user) return;

    await addDoc(
      collection(db, "chats", selectedChatId, "messages"),
      {
        text: trimmed,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      }
    );

    setMessageInput("");
  };

  // 🔍 FILTER (SAFE VERSION)
  const filteredConversations = useMemo(() => {
    return conversations.filter(() => true); // keep UI working for now
  }, [conversations]);

  const selectedConversation =
    conversations.find((c) => c.id === selectedChatId) || conversations[0];

  const selectedMessages = messages;

  const unreadCount = 0; // placeholder for now

  const quickReply = (text: string) => {
    setMessageInput(text);
  };

  const navItems = [
    {
      href: "/provider-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/provider-dashboard/profile",
      label: "Profile",
      icon: User,
    },
    {
      href: "/provider-dashboard/services",
      label: "Services",
      icon: Briefcase,
    },
    {
      href: "/provider-dashboard/availability",
      label: "Availability",
      icon: Calendar,
    },
    {
      href: "/provider-dashboard/credentials",
      label: "Verification",
      icon: ShieldCheck,
    },
    {
      href: "/provider-dashboard/messaging",
      label: "Messages",
      icon: MessageSquare,
      badge: unreadCount > 0 ? String(unreadCount) : undefined,
      active: true,
    },
    {
      href: "/provider-dashboard/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      href: "/provider-dashboard/resources",
      label: "Resources",
      icon: BookOpen,
    },
  ];
  return (
  <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
    {mobileSidebarOpen && (
      <button
        className="fixed inset-0 z-30 bg-black/40 md:hidden"
        onClick={() => setMobileSidebarOpen(false)}
        aria-label="Close sidebar overlay"
      />
    )}

    <aside
      className={`fixed z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800 md:translate-x-0 ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:flex`}
    >
      <div className="border-b border-slate-100 p-6 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <img
            src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png"
            alt="HopePath Logo"
            className="h-10 w-10 rounded-xl object-cover shadow-lg"
          />
          <div>
            <h1 className="text-xl font-bold text-sky-600">HopePath</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Provider Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.active
                  ? "flex items-center gap-3 rounded-lg bg-sky-600/10 px-4 py-3 text-sm font-medium text-sky-600"
                  : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
              {item.badge && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-200 p-4 dark:border-slate-700">
        <Link
          href="/provider-dashboard/settings"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>

    <main className="flex flex-1 overflow-hidden md:ml-64">
      <div className="flex w-full overflow-hidden">
        
        {/* LEFT SIDEBAR (CONVERSATIONS) */}
        <div className="hidden w-80 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 lg:flex">
          <div className="border-b border-slate-200 p-4 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Messages
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => {
              const isSelected = conversation.id === selectedChatId;

              return (
                <button
                  key={conversation.id}
                  onClick={() => openConversation(conversation.id)}
                  className={`w-full p-4 text-left transition-colors ${
                    isSelected
                      ? "border-l-4 border-l-sky-600 bg-sky-600/5"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <p className="font-medium text-slate-800 dark:text-white">
                    Chat
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE (MESSAGES) */}
        <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-900">
          
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 sm:px-6">
            <p className="font-medium text-slate-800 dark:text-white">
              Chat
            </p>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {selectedMessages.map((message) =>
              message.senderId !== user?.uid ? (
                <div key={message.id} className="flex gap-3">
                  <div className="max-w-[70%]">
                    <div className="rounded-2xl rounded-tl-none border bg-white p-3">
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[70%]">
                    <div className="rounded-2xl rounded-tr-none bg-sky-600 p-3">
                      <p className="text-sm text-white">{message.text}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* INPUT */}
          <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                className="w-full rounded-lg bg-slate-100 px-4 py-3 outline-none"
              />

              <button
                onClick={sendMessage}
                className="rounded-lg bg-sky-600 p-3 text-white"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
 );
}
