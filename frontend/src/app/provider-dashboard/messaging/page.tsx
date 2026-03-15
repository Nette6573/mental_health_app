"use client";

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

type Conversation = {
  id: number;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
  online?: boolean;
};

type ChatMessage = {
  id: number;
  sender: "provider" | "client";
  text: string;
  time: string;
};

export default function ProviderMessagesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState(1);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "Emily Clarke",
      avatar: "http://static.photos/people/200x200/15",
      preview:
        "Hello Dr. Anderson, I'm interested in scheduling a session for my daughter...",
      time: "2h ago",
      unread: true,
      online: true,
    },
    {
      id: 2,
      name: "Robert Taylor",
      avatar: "http://static.photos/people/200x200/22",
      preview:
        "Thank you for yesterday's session. I wanted to ask about the homework...",
      time: "5h ago",
      unread: true,
    },
    {
      id: 3,
      name: "Marcus Thompson",
      avatar: "http://static.photos/people/200x200/33",
      preview:
        "Can we reschedule our appointment for next week? I have a conflict...",
      time: "1d ago",
      unread: true,
    },
    {
      id: 4,
      name: "Jennifer Brown",
      avatar: "http://static.photos/people/200x200/28",
      preview:
        "The marriage counseling session was very helpful. Looking forward to next week.",
      time: "2d ago",
      unread: false,
    },
    {
      id: 5,
      name: "David Williams",
      avatar: "http://static.photos/people/200x200/41",
      preview: "Thank you for the grief support resources you shared.",
      time: "3d ago",
      unread: false,
    },
  ]);

  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<number, ChatMessage[]>
  >({
    1: [
      {
        id: 1,
        sender: "client",
        text: "Hello Dr. Anderson, I'm interested in scheduling a session for my daughter. She's been dealing with anxiety and I think she could benefit from talking to someone.",
        time: "10:30 AM",
      },
      {
        id: 2,
        sender: "provider",
        text: "Hello Emily, thank you for reaching out. I'd be happy to help. How old is your daughter and what specific concerns are you noticing?",
        time: "10:35 AM",
      },
      {
        id: 3,
        sender: "client",
        text: "She's 16. She's been having trouble sleeping and seems withdrawn lately. I'm worried about her.",
        time: "10:37 AM",
      },
      {
        id: 4,
        sender: "provider",
        text: "I understand your concern. I work with teenagers regularly and would be glad to meet with her. I have availability next Tuesday at 2 PM or Thursday at 4 PM. Would either work for you?",
        time: "10:42 AM",
      },
      {
        id: 5,
        sender: "client",
        text: "Thursday at 4 PM works perfect. Should I book through the website or can you schedule it?",
        time: "11:15 AM",
      },
    ],
    2: [
      {
        id: 1,
        sender: "client",
        text: "Thank you for yesterday's session. I wanted to ask about the homework you mentioned.",
        time: "9:10 AM",
      },
    ],
    3: [
      {
        id: 1,
        sender: "client",
        text: "Can we reschedule our appointment for next week? I have a conflict.",
        time: "4:20 PM",
      },
    ],
    4: [
      {
        id: 1,
        sender: "client",
        text: "The marriage counseling session was very helpful. Looking forward to next week.",
        time: "1:05 PM",
      },
    ],
    5: [
      {
        id: 1,
        sender: "client",
        text: "Thank you for the grief support resources you shared.",
        time: "6:45 PM",
      },
    ],
  });

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

  const filteredConversations = useMemo(() => {
    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.preview.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  const selectedConversation =
    conversations.find((c) => c.id === selectedConversationId) ?? conversations[0];

  const selectedMessages = messagesByConversation[selectedConversationId] ?? [];

  const unreadCount = conversations.filter((c) => c.unread).length;

  const openConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unread: false }
          : conversation
      )
    );
  };

  const sendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "provider",
      text: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] ?? []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === selectedConversationId
          ? {
              ...conversation,
              preview: trimmed,
              time: "Now",
            }
          : conversation
      )
    );

    setMessageInput("");
  };

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
          <div className="hidden w-80 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 lg:flex">
            <div className="border-b border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Messages
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {unreadCount} unread conversation{unreadCount === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMobileSidebar}
                    className="rounded-lg p-2 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 md:hidden"
                    aria-label="Toggle mobile sidebar"
                  >
                    <Menu className="h-5 w-5" />
                  </button>

                  <button
                    onClick={toggleDarkMode}
                    className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Moon className="h-5 w-5 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredConversations.map((conversation) => {
                  const isSelected = conversation.id === selectedConversationId;

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
                      <div className="flex items-start gap-3">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <p className="truncate font-medium text-slate-800 dark:text-white">
                              {conversation.name}
                            </p>
                            <span
                              className={`text-xs ${
                                conversation.unread
                                  ? "font-medium text-sky-600"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {conversation.time}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                            {conversation.preview}
                          </p>
                        </div>
                        {conversation.unread && (
                          <span className="mt-2 h-2 w-2 rounded-full bg-sky-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMobileSidebar}
                  className="rounded-lg p-2 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden"
                  aria-label="Toggle mobile sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    {selectedConversation.name}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    {selectedConversation.online ? "Online" : "Active recently"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                  <Video className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-slate-600" />
                  )}
                </button>
                <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
              <div className="flex justify-center">
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                  Today
                </span>
              </div>

              {selectedMessages.map((message) =>
                message.sender === "client" ? (
                  <div key={message.id} className="flex gap-3">
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="mt-1 h-8 w-8 rounded-full object-cover"
                    />
                    <div className="max-w-[80%] sm:max-w-[70%]">
                      <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-600 dark:bg-slate-700">
                        <p className="text-sm text-slate-800 dark:text-slate-100">
                          {message.text}
                        </p>
                      </div>
                      <span className="ml-1 mt-1 block text-xs text-slate-500 dark:text-slate-400">
                        {message.time}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div key={message.id} className="flex justify-end gap-3">
                    <div className="max-w-[80%] sm:max-w-[70%]">
                      <div className="rounded-2xl rounded-tr-none bg-sky-600 p-3 shadow-sm">
                        <p className="text-sm text-white">{message.text}</p>
                      </div>
                      <span className="mr-1 mt-1 block text-right text-xs text-slate-500 dark:text-slate-400">
                        {message.time}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700">
                  <Paperclip className="h-5 w-5" />
                </button>

                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    className="w-full rounded-lg border-0 bg-slate-100 px-4 py-3 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-sky-600/20 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600"
                  />
                </div>

                <button
                  onClick={sendMessage}
                  className="rounded-lg bg-sky-600 p-3 text-white transition-colors hover:bg-sky-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>

              <div className="ml-12 mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => quickReply("I can help schedule that appointment for you.")}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Schedule Appointment
                </button>
                <button
                  onClick={() => quickReply("I’ll send some helpful resources shortly.")}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  Send Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}