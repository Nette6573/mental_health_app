"use client";

import { db } from "@/lib/firebase/firebaseClient";
import {
  collection, getDocs, doc, getDoc,
  addDoc, query, where, onSnapshot,
  orderBy, serverTimestamp, setDoc
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import {
  X, MapPin, Briefcase, Globe, Phone,
  Mail, Clock, DollarSign, Send, ChevronLeft,
  ShieldCheck, AlertCircle, XCircle, Clock3,
} from "lucide-react";

// ── Verification badge helper ─────────────────────────────────────────────────
function VerificationBadge({ status }: { status: string }) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <ShieldCheck className="h-3 w-3" />Verified
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="h-3 w-3" />Do Not Book
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Clock3 className="h-3 w-3" />Pending Review
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
          <AlertCircle className="h-3 w-3" />Unverified
        </span>
      );
  }
}

export default function TherapistsPage() {
  const { user, isLoading: authLoading } = useAuth() as any;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [layoutUser, setLayoutUser] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatProvider, setChatProvider] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setFetchError("");
        const uid = user.uid ?? user.id;

        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setLayoutUser({
            firstName: userData.first_name || userData.firstName || "",
            lastName: userData.last_name || userData.lastName || "",
            email: userData.email || user.email || "",
          });
        } else {
          setLayoutUser({
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ")[1] || "",
            email: user.email || "",
          });
        }

        const snapshot = await getDocs(collection(db, "providers"));
        const providerList: any[] = [];
        snapshot.forEach((providerDoc) => {
          const data = providerDoc.data();
          providerList.push({
            id: providerDoc.id,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            professional_title: data.professional_title || "",
            professional_email: data.professional_email || "",
            phone_number: data.phone_number || "",
            website: data.website || "",
            organization: data.organization || "",
            parish: data.parish || "",
            biography: data.biography || "",
            experience: data.experience || "",
            category: data.category || "",
            practice_areas: Array.isArray(data.practice_areas)
              ? data.practice_areas
              : data.specialization ? [data.specialization] : [],
            session_types: data.session_types || "",
            session_cost: data.session_cost || "",
            payment_options: data.payment_options || "",
            languages: Array.isArray(data.languages) ? data.languages : [],
            profile_photo_url: data.profile_photo_url || "",
            cover_photo_url: data.cover_photo_url || "",       // ← cover photo
            is_accepting_clients: data.is_accepting_clients ?? true,
            application_status: data.application_status || "", // ← verification status
          });
        });
        setProviders(providerList);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setFetchError(error.message || "Failed to load therapists");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Open chat — but do NOT create the Firestore doc yet.
  // The chat is only created when the user actually sends their first message.
  const openChat = async (provider: any) => {
    if (!user) return;
    const uid = user.uid ?? user.id;

    setChatProvider(provider);
    setChatOpen(true);
    setSelectedProvider(null);
    setMessages([]);
    setChatId(null); // reset so no premature creation

    // Check if a chat already exists between this user and provider
    try {
      const existingChatQuery = query(
        collection(db, "chats"),
        where("participants", "array-contains", uid)
      );
      const existingSnap = await getDocs(existingChatQuery);

      let foundChatId: string | null = null;
      existingSnap.forEach((chatDoc) => {
        const data = chatDoc.data();
        if (data.participants.includes(provider.id)) {
          foundChatId = chatDoc.id;
        }
      });

      if (foundChatId) {
        // Existing chat — load it
        setChatId(foundChatId);
      }
      // If no existing chat, chatId stays null until the user sends a message
    } catch (error) {
      console.error("Error checking for existing chat:", error);
    }
  };

  // Subscribe to messages when chatId is set
  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [chatId]);

  // ── Send message — creates the chat doc on first send if it doesn't exist ──
  const sendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !chatProvider || !user) return;

    const uid = user.uid ?? user.id;
    setSendingMessage(true);

    try {
      let activeChatId = chatId;

      // First message in a new conversation — create the chat doc now
      if (!activeChatId) {
        const newChatRef = await addDoc(collection(db, "chats"), {
          participants: [uid, chatProvider.id],
          participantNames: {
            [uid]: layoutUser?.firstName
              ? `${layoutUser.firstName} ${layoutUser.lastName || ""}`.trim()
              : user.email || "User",
            [chatProvider.id]: `${chatProvider.first_name} ${chatProvider.last_name}`,
          },
          createdAt: serverTimestamp(),
          lastMessage: "",
          lastMessageAt: serverTimestamp(),
        });
        activeChatId = newChatRef.id;
        setChatId(activeChatId);
      }

      await addDoc(collection(db, "chats", activeChatId, "messages"), {
        text: trimmed,
        senderId: uid,
        senderName: layoutUser?.firstName
          ? `${layoutUser.firstName} ${layoutUser.lastName || ""}`.trim()
          : user.email || "User",
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "chats", activeChatId),
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

  const filteredProviders = providers.filter((provider) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const fullName = `${provider.first_name} ${provider.last_name}`.toLowerCase();
    return (
      fullName.includes(q) ||
      (provider.biography || "").toLowerCase().includes(q) ||
      (provider.professional_title || "").toLowerCase().includes(q) ||
      (provider.parish || "").toLowerCase().includes(q)
    );
  });

  const uid = user?.uid ?? user?.id;

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  }
  if (!user) return null;

  return (
    <DashboardLayout user={layoutUser}>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Find Your Therapist</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Browse licensed providers and connect with the right fit for you</p>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, title, or parish..."
          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />

        {!isLoading && !fetchError && (
          <p className="text-sm text-gray-500">{filteredProviders.length} {filteredProviders.length === 1 ? "therapist" : "therapists"} found</p>
        )}

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => <div key={n} className="h-40 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />)}
          </div>
        )}

        {!isLoading && fetchError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-700">Failed to load therapists</p>
            <p className="mt-1 text-sm text-red-500">{fetchError}</p>
            <button onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Try Again</button>
          </div>
        )}

        {!isLoading && !fetchError && filteredProviders.length === 0 && (
          <div className="rounded-xl border border-slate-200 p-10 text-center text-gray-500">
            <p className="text-lg font-medium">No therapists found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        )}

        {/* Provider Cards */}
        {!isLoading && !fetchError && filteredProviders.length > 0 && (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">

                {/* Cover photo */}
                {provider.cover_photo_url ? (
                  <div className="h-28 w-full overflow-hidden">
                    <img src={provider.cover_photo_url} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-16 w-full bg-gradient-to-r from-sky-500 to-cyan-600" />
                )}

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar — overlaps cover */}
                    <div className="-mt-10 shrink-0">
                      {provider.profile_photo_url ? (
                        <img src={provider.profile_photo_url} alt={`${provider.first_name} ${provider.last_name}`}
                          className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md dark:border-slate-800"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-sky-600 text-lg font-bold text-white shadow-md dark:border-slate-800">
                          {(provider.first_name?.[0] || "").toUpperCase()}{(provider.last_name?.[0] || "").toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{provider.first_name} {provider.last_name}</h3>
                          {provider.professional_title && <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{provider.professional_title}</p>}
                          {provider.organization && <p className="text-xs text-slate-500 dark:text-slate-400">{provider.organization}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${provider.is_accepting_clients ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                            {provider.is_accepting_clients ? "Accepting Clients" : "Not Accepting"}
                          </span>
                          <VerificationBadge status={provider.application_status} />
                        </div>
                      </div>

                      {provider.biography && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{provider.biography}</p>}

                      <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-slate-500 dark:text-slate-400">
                        {provider.parish && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{provider.parish}</span>}
                        {provider.experience && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{provider.experience}</span>}
                        {provider.session_cost && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />JMD {provider.session_cost}</span>}
                        {provider.languages.length > 0 && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{provider.languages.join(", ")}</span>}
                        {provider.session_types && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{provider.session_types}</span>}
                      </div>

                      {provider.practice_areas.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {provider.practice_areas.slice(0, 4).map((spec: string) => (
                            <span key={spec} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">{spec}</span>
                          ))}
                          {provider.practice_areas.length > 4 && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-700">+{provider.practice_areas.length - 4} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                    <button onClick={() => setSelectedProvider(provider)} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors">View Profile</button>
                    <button onClick={() => openChat(provider)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Send Message</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── PROFILE POPUP ── */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSelectedProvider(null)}>
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProvider(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-slate-500 hover:bg-white hover:text-slate-800 dark:bg-slate-700/80 dark:text-slate-300">
              <X className="h-5 w-5" />
            </button>

            {/* Cover photo in modal */}
            {selectedProvider.cover_photo_url ? (
              <div className="h-36 w-full overflow-hidden rounded-t-2xl">
                <img src={selectedProvider.cover_photo_url} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-28 w-full rounded-t-2xl bg-gradient-to-r from-sky-500 to-cyan-600" />
            )}

            <div className="px-6 pb-6">
              <div className="-mt-12 mb-4 flex items-end justify-between">
                {selectedProvider.profile_photo_url ? (
                  <img src={selectedProvider.profile_photo_url} alt="" className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg dark:border-slate-800" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-sky-600 text-2xl font-bold text-white shadow-lg dark:border-slate-800">
                    {(selectedProvider.first_name?.[0] || "").toUpperCase()}{(selectedProvider.last_name?.[0] || "").toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${selectedProvider.is_accepting_clients ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {selectedProvider.is_accepting_clients ? "Accepting Clients" : "Not Accepting"}
                  </span>
                  <VerificationBadge status={selectedProvider.application_status} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedProvider.first_name} {selectedProvider.last_name}</h2>
              {selectedProvider.professional_title && <p className="font-medium text-sky-600 dark:text-sky-400">{selectedProvider.professional_title}</p>}
              {selectedProvider.organization && <p className="text-sm text-slate-500 dark:text-slate-400">{selectedProvider.organization}</p>}

              {selectedProvider.biography && (
                <div className="mt-4">
                  <h4 className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200">About</h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedProvider.biography}</p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                {selectedProvider.parish && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Location</p><p className="text-sm font-medium text-slate-800 dark:text-white flex items-center gap-1"><MapPin className="h-3 w-3 text-sky-600" />{selectedProvider.parish}</p></div>}
                {selectedProvider.experience && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Experience</p><p className="text-sm font-medium text-slate-800 dark:text-white">{selectedProvider.experience}</p></div>}
                {selectedProvider.session_cost && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Session Rate</p><p className="text-sm font-medium text-slate-800 dark:text-white">JMD {selectedProvider.session_cost}</p></div>}
                {selectedProvider.payment_options && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Payment</p><p className="text-sm font-medium text-slate-800 dark:text-white">{selectedProvider.payment_options}</p></div>}
                {selectedProvider.session_types && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Session Types</p><p className="text-sm font-medium text-slate-800 dark:text-white">{selectedProvider.session_types}</p></div>}
                {selectedProvider.languages.length > 0 && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Languages</p><p className="text-sm font-medium text-slate-800 dark:text-white">{selectedProvider.languages.join(", ")}</p></div>}
              </div>

              {selectedProvider.practice_areas.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Areas of Practice</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.practice_areas.map((spec: string) => (
                      <span key={spec} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">{spec}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Contact</h4>
                {selectedProvider.professional_email && <a href={`mailto:${selectedProvider.professional_email}`} className="flex items-center gap-2 text-sm text-sky-600 hover:underline dark:text-sky-400"><Mail className="h-4 w-4" />{selectedProvider.professional_email}</a>}
                {selectedProvider.phone_number && <a href={`tel:${selectedProvider.phone_number}`} className="flex items-center gap-2 text-sm text-sky-600 hover:underline dark:text-sky-400"><Phone className="h-4 w-4" />{selectedProvider.phone_number}</a>}
                {selectedProvider.website && <a href={selectedProvider.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-sky-600 hover:underline dark:text-sky-400"><Globe className="h-4 w-4" />{selectedProvider.website}</a>}
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => openChat(selectedProvider)} className="flex-1 rounded-lg bg-sky-600 py-3 text-sm font-medium text-white hover:bg-sky-700 transition-colors">Send Message</button>
                <button onClick={() => setSelectedProvider(null)} className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAT PANEL ── */}
      {chatOpen && chatProvider && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setChatOpen(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-800">

            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800">
              <button onClick={() => setChatOpen(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {chatProvider.profile_photo_url ? (
                <img src={chatProvider.profile_photo_url} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                  {(chatProvider.first_name?.[0] || "").toUpperCase()}{(chatProvider.last_name?.[0] || "").toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-slate-800 dark:text-white">{chatProvider.first_name} {chatProvider.last_name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{chatProvider.professional_title}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {/* Empty state — no chat created yet, just opened */}
              {messages.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30 overflow-hidden">
                      {chatProvider.profile_photo_url ? (
                        <img src={chatProvider.profile_photo_url} alt="" className="h-16 w-16 rounded-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-sky-600">{(chatProvider.first_name?.[0] || "").toUpperCase()}</span>
                      )}
                    </div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">{chatProvider.first_name} {chatProvider.last_name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Send a message to start the conversation</p>
                  </div>
                </div>
              )}

              {messages.map((message) => {
                const isMe = message.senderId === uid;
                return (
                  <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? "rounded-tr-none bg-sky-600 text-white" : "rounded-tl-none bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100"}`}>
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
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={`Message ${chatProvider.first_name}...`}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                <button onClick={sendMessage} disabled={!messageInput.trim() || sendingMessage}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
