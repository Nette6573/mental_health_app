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
  ChevronRight, ShieldCheck, AlertCircle, XCircle, Clock3,
} from "lucide-react";

function VerificationBadge({ status }: { status: string }) {
  switch (status) {
    case "approved":
      return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><ShieldCheck className="h-3 w-3" />Verified</span>;
    case "rejected":
      return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="h-3 w-3" />Do Not Book</span>;
    case "pending":
      return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Clock3 className="h-3 w-3" />Pending Review</span>;
    default:
      return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400"><AlertCircle className="h-3 w-3" />Unverified</span>;
  }
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function TherapistsPage() {
  const { user, isLoading: authLoading } = useAuth() as any;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [layoutUser, setLayoutUser] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  // Booking state
  const [bookingProvider, setBookingProvider] = useState<any>(null);
  const [providerServices, setProviderServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [providerAvailability, setProviderAvailability] = useState<any>(null);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatProvider, setChatProvider] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const uid = user?.uid ?? user?.id;

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setFetchError("");

        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setLayoutUser({
            firstName: userData.first_name || userData.firstName || "",
            lastName: userData.last_name || userData.lastName || "",
            email: userData.email || user.email || "",
          });
        } else {
          setLayoutUser({ firstName: user.displayName?.split(" ")[0] || "", lastName: user.displayName?.split(" ")[1] || "", email: user.email || "" });
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
            practice_areas: Array.isArray(data.practice_areas) ? data.practice_areas : data.specialization ? [data.specialization] : [],
            session_types: data.session_types || "",
            session_cost: data.session_cost || "",
            payment_options: data.payment_options || "",
            languages: Array.isArray(data.languages) ? data.languages : [],
            profile_photo_url: data.profile_photo_url || "",
            cover_photo_url: data.cover_photo_url || "",
            is_accepting_clients: data.is_accepting_clients ?? true,
            application_status: data.application_status || "",
          });
        });
        setProviders(providerList);
      } catch (error: any) {
        setFetchError(error.message || "Failed to load therapists");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Open booking popup — fetch services + availability ──
  const openBooking = async (provider: any) => {
    setBookingProvider(provider);
    setSelectedProvider(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime("");
    setBookingNotes("");
    setBookingSuccess(false);
    setCalendarDate(new Date());
    setProviderServices([]);
    setProviderAvailability(null);
    setBlockedDates([]);

    // Fetch provider services from provider_services collection
    try {
      const servicesSnap = await getDocs(
        query(collection(db, "provider_services"), where("provider_id", "==", provider.id))
      );
      const services = servicesSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((s: any) => s.service_status === "active" || !s.service_status);
      setProviderServices(services);
    } catch (e) {
      console.error("Error fetching services:", e);
    }

    // Fetch provider availability
    try {
      const availSnap = await getDoc(doc(db, "provider_availability", provider.id));
      if (availSnap.exists()) {
        const data = availSnap.data();
        setProviderAvailability(data);
        setBlockedDates(data.blocked_dates ? JSON.parse(data.blocked_dates) : []);
      }
    } catch (e) {
      console.error("Error fetching availability:", e);
    }
  };

  // ── Calendar helpers ──
  const parseBlockedDate = (dateStr: string) => {
    if (!dateStr) return [];
    const rangeMatch = dateStr.trim().match(/^(\w+)\s+(\d+)-(\d+),\s*(\d{4})$/);
    if (rangeMatch) {
      const [, month, startDay, endDay, year] = rangeMatch;
      const dates = [];
      for (let d = parseInt(startDay); d <= parseInt(endDay); d++) {
        const parsed = new Date(`${month} ${d}, ${year}`);
        if (!isNaN(parsed.getTime())) dates.push(parsed);
      }
      return dates;
    }
    const parsed = new Date(dateStr.trim());
    return isNaN(parsed.getTime()) ? [] : [parsed];
  };

  const isDayAvailable = (date: Date) => {
    if (!providerAvailability) return true;
    const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const encoded = providerAvailability[dayNames[date.getDay()]];
    if (!encoded) return false;
    const [avail] = encoded.split('|');
    if (avail !== '1') return false;
    const dateKey = date.toDateString();
    return !blockedDates.some((b: any) => parseBlockedDate(b.date).some(pd => pd.toDateString() === dateKey));
  };

  const generateSlots = (start: string, end: string) => {
    const slots: string[] = [];
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let current = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    // Use session duration from selected service if available
    const duration = selectedService?.duration
      ? parseInt(selectedService.duration) || 60
      : 60;
    while (current + duration <= endMin) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      slots.push(`${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`);
      current += duration;
    }
    return slots;
  };

  const getTimeSlots = (date: Date) => {
    if (!providerAvailability) return generateSlots('09:00', '17:00');
    const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const encoded = providerAvailability[dayNames[date.getDay()]];
    if (!encoded) return generateSlots('09:00', '17:00');
    const [, start, end] = encoded.split('|');
    return generateSlots(start || '09:00', end || '17:00');
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  };

  const isPast = (date: Date) => {
    const today = new Date(); today.setHours(0,0,0,0);
    return date < today;
  };

  // ── Submit booking ──
  const submitBooking = async () => {
    if (!selectedDate || !selectedTime) { alert('Please select a date and time.'); return; }
    if (!user || !uid) { alert('You must be logged in to book.'); return; }
    setIsSubmitting(true);
    try {
      let userName = user.email || 'User';
      try {
        const userSnap = await getDoc(doc(db, 'users', uid));
        if (userSnap.exists()) {
          const ud = userSnap.data();
          const fullName = `${ud.firstName || ''} ${ud.lastName || ''}`.trim();
          if (fullName) userName = fullName;
        }
      } catch (e) {}

      await addDoc(collection(db, 'providers', bookingProvider.id, 'bookings'), {
        providerId: bookingProvider.id,
        providerName: `${bookingProvider.first_name} ${bookingProvider.last_name}`,
        providerTitle: bookingProvider.professional_title || '',
        userId: uid,
        userName,
        userEmail: user.email || '',
        date: selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: selectedTime,
        notes: bookingNotes || '',
        status: 'pending',
        // Service details
        serviceId: selectedService?.id || null,
        serviceName: selectedService?.service_title || null,
        servicePrice: selectedService?.price || null,
        serviceDuration: selectedService?.duration || null,
        serviceMode: selectedService?.delivery_mode || null,
        createdAt: serverTimestamp(),
      });
      setBookingSuccess(true);
    } catch (error: any) {
      alert(`Failed to submit booking: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Chat ──
  const openChat = async (provider: any) => {
    if (!user) return;
    setChatProvider(provider);
    setChatOpen(true);
    setSelectedProvider(null);
    setMessages([]);
    setChatId(null);
    try {
      const existingSnap = await getDocs(query(collection(db, "chats"), where("participants", "array-contains", uid)));
      let foundChatId: string | null = null;
      existingSnap.forEach((chatDoc) => {
        if (chatDoc.data().participants.includes(provider.id)) foundChatId = chatDoc.id;
      });
      if (foundChatId) setChatId(foundChatId);
    } catch (e) {}
  };

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc")),
      (snapshot) => setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !chatProvider || !user) return;
    setSendingMessage(true);
    try {
      let activeChatId = chatId;
      if (!activeChatId) {
        const newChatRef = await addDoc(collection(db, "chats"), {
          participants: [uid, chatProvider.id],
          participantNames: {
            [uid]: layoutUser?.firstName ? `${layoutUser.firstName} ${layoutUser.lastName || ""}`.trim() : user.email || "User",
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
        text: trimmed, senderId: uid,
        senderName: layoutUser?.firstName ? `${layoutUser.firstName} ${layoutUser.lastName || ""}`.trim() : user.email || "User",
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "chats", activeChatId), { lastMessage: trimmed, lastMessageAt: serverTimestamp() }, { merge: true });
      setMessageInput("");
    } catch (e) { console.error(e); }
    finally { setSendingMessage(false); }
  };

  const filteredProviders = providers.filter((provider) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return `${provider.first_name} ${provider.last_name}`.toLowerCase().includes(q) ||
      (provider.biography || "").toLowerCase().includes(q) ||
      (provider.professional_title || "").toLowerCase().includes(q) ||
      (provider.parish || "").toLowerCase().includes(q);
  });

  if (authLoading) return <div className="flex h-screen items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  if (!user) return null;

  return (
    <DashboardLayout user={layoutUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Find Your Therapist</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Browse licensed providers and connect with the right fit for you</p>
        </div>

        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, title, or parish..."
          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />

        {!isLoading && !fetchError && <p className="text-sm text-gray-500">{filteredProviders.length} {filteredProviders.length === 1 ? "therapist" : "therapists"} found</p>}

        {isLoading && <div className="space-y-4">{[1,2,3].map(n => <div key={n} className="h-40 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />)}</div>}

        {!isLoading && fetchError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-700">Failed to load therapists</p>
            <button onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Try Again</button>
          </div>
        )}

        {!isLoading && !fetchError && filteredProviders.length === 0 && (
          <div className="rounded-xl border border-slate-200 p-10 text-center text-gray-500">
            <p className="text-lg font-medium">No therapists found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        )}

        {/* ── PROVIDER CARDS ── */}
        {!isLoading && !fetchError && filteredProviders.length > 0 && (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                {provider.cover_photo_url ? (
                  <div className="h-28 w-full overflow-hidden"><img src={provider.cover_photo_url} alt="" className="h-full w-full object-cover" /></div>
                ) : (
                  <div className="h-16 w-full bg-gradient-to-r from-sky-500 to-cyan-600" />
                )}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="-mt-10 shrink-0">
                      {provider.profile_photo_url ? (
                        <img src={provider.profile_photo_url} alt="" className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md dark:border-slate-800" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-sky-600 text-lg font-bold text-white shadow-md dark:border-slate-800">
                          {(provider.first_name?.[0] || "").toUpperCase()}{(provider.last_name?.[0] || "").toUpperCase()}
                        </div>
                      )}
                    </div>
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
                          {provider.practice_areas.length > 4 && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-700">+{provider.practice_areas.length - 4} more</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                    <button onClick={() => setSelectedProvider(provider)} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors">View Profile</button>
                    <button onClick={() => openBooking(provider)} disabled={!provider.is_accepting_clients}
                      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Book Session
                    </button>
                    <button onClick={() => openChat(provider)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Emergency */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-1">Need Immediate Help?</h3>
              <p className="text-red-700 dark:text-red-400 text-sm mb-3">If you&apos;re experiencing a mental health crisis, don&apos;t wait for an appointment.</p>
              <a href="tel:+18765554321" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors inline-block text-sm">Call Crisis Line</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROFILE POPUP ── */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSelectedProvider(null)}>
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProvider(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-slate-500 hover:bg-white dark:bg-slate-700/80 dark:text-slate-300"><X className="h-5 w-5" /></button>
            {selectedProvider.cover_photo_url ? (
              <div className="h-36 w-full overflow-hidden rounded-t-2xl"><img src={selectedProvider.cover_photo_url} alt="" className="h-full w-full object-cover" /></div>
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
                <div className="mt-4"><h4 className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200">About</h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedProvider.biography}</p>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {selectedProvider.parish && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Location</p><p className="text-sm font-medium text-slate-800 dark:text-white">{selectedProvider.parish}</p></div>}
                {selectedProvider.experience && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Experience</p><p className="text-sm font-medium text-slate-800 dark:text-white">{selectedProvider.experience}</p></div>}
                {selectedProvider.session_cost && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Session Rate</p><p className="text-sm font-medium text-slate-800 dark:text-white">JMD {selectedProvider.session_cost}</p></div>}
                {selectedProvider.payment_options && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Payment</p><p className="text-sm font-medium text-slate-800 dark:text-white">{selectedProvider.payment_options}</p></div>}
                {selectedProvider.session_types && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Session Types</p><p className="text-sm font-medium text-slate-800 dark:text-white">{selectedProvider.session_types}</p></div>}
                {selectedProvider.languages.length > 0 && <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"><p className="text-xs text-slate-500">Languages</p><p className="text-sm font-medium text-slate-800 dark:text-white">{selectedProvider.languages.join(", ")}</p></div>}
              </div>
              {selectedProvider.practice_areas.length > 0 && (
                <div className="mt-4"><h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Areas of Practice</h4>
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
                <button onClick={() => openBooking(selectedProvider)} disabled={!selectedProvider.is_accepting_clients}
                  className="flex-1 rounded-lg bg-emerald-500 py-3 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50">Book Session</button>
                <button onClick={() => openChat(selectedProvider)}
                  className="flex-1 rounded-lg bg-sky-600 py-3 text-sm font-medium text-white hover:bg-sky-700 transition-colors">Send Message</button>
                <button onClick={() => setSelectedProvider(null)}
                  className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BOOKING POPUP ── */}
      {bookingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
            <button onClick={() => setBookingProvider(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/80 dark:bg-slate-700/80 p-2 text-slate-500 hover:text-slate-800"><X className="h-5 w-5" /></button>
            <div className="p-6">
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><span className="text-3xl">✅</span></div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Booking Submitted!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Request sent to <strong>{bookingProvider.first_name} {bookingProvider.last_name}</strong>.</p>
                  {selectedService && <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Service: <strong>{selectedService.service_title}</strong></p>}
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2"><strong>{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong> at <strong>{selectedTime}</strong></p>
                  <p className="text-xs text-gray-400 mb-6">The provider will confirm your appointment shortly.</p>
                  <button onClick={() => setBookingProvider(null)} className="rounded-lg bg-sky-600 px-6 py-2 text-sm font-medium text-white hover:bg-sky-700">Done</button>
                </div>
              ) : (
                <>
                  {/* Provider header */}
                  <div className="mb-5 flex items-center gap-3">
                    {bookingProvider.profile_photo_url ? (
                      <img src={bookingProvider.profile_photo_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                        {(bookingProvider.first_name?.[0] || "").toUpperCase()}{(bookingProvider.last_name?.[0] || "").toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Book a Session</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{bookingProvider.first_name} {bookingProvider.last_name} · {bookingProvider.professional_title}</p>
                    </div>
                  </div>

                  {/* ── SERVICE SELECTION ── */}
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Select Service <span className="text-red-500">*</span>
                    </h4>
                    {providerServices.length === 0 ? (
                      <div className="rounded-lg border border-gray-200 dark:border-slate-600 p-3 text-sm text-gray-500 dark:text-gray-400">
                        No specific services listed — booking for general consultation.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {providerServices.map((service: any) => (
                          <button key={service.id} onClick={() => { setSelectedService(service); setSelectedTime(""); }}
                            className={`w-full text-left rounded-xl border p-3 transition-all ${
                              selectedService?.id === service.id
                                ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                                : 'border-gray-200 dark:border-slate-600 hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-sky-900/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">{service.service_title}</p>
                                {service.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{service.description}</p>}
                                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                                  {service.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{service.duration}</span>}
                                  {service.delivery_mode && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{service.delivery_mode}</span>}
                                </div>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                                  {service.price === 'Free' ? 'Free' : service.price ? `JMD ${service.price}` : '—'}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── CALENDAR ── */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Select Date <span className="text-red-500">*</span></h4>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCalendarDate(prev => { const d = new Date(prev); d.setMonth(d.getMonth() - 1); return d; })} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronLeft className="h-4 w-4" /></button>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{MONTH_NAMES[calendarDate.getMonth()]} {calendarDate.getFullYear()}</span>
                        <button onClick={() => setCalendarDate(prev => { const d = new Date(prev); d.setMonth(d.getMonth() + 1); return d; })} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronRight className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {DAY_LABELS.map(d => <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(calendarDate).map((date, i) => {
                        if (!date) return <div key={i} />;
                        const past = isPast(date);
                        const unavailable = !isDayAvailable(date);
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        const disabled = past || unavailable;
                        return (
                          <button key={i} onClick={() => { if (!disabled) { setSelectedDate(date); setSelectedTime(""); } }} disabled={disabled}
                            className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                              isSelected ? 'bg-sky-500 text-white' :
                              isToday && !disabled ? 'border-2 border-sky-500 text-sky-600 dark:text-sky-400' :
                              disabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' :
                              'hover:bg-sky-50 dark:hover:bg-sky-900/20 text-gray-700 dark:text-gray-300'
                            }`}>
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── TIME SLOTS ── */}
                  {selectedDate && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Select Time <span className="text-red-500">*</span></h4>
                      {getTimeSlots(selectedDate).length === 0 ? (
                        <p className="text-sm text-gray-500">No available slots for this day.</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {getTimeSlots(selectedDate).map((slot) => (
                            <button key={slot} onClick={() => setSelectedTime(slot)}
                              className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                                selectedTime === slot ? 'border-sky-500 bg-sky-500 text-white' :
                                'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20'
                              }`}>
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── NOTES ── */}
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Notes (optional)</h4>
                    <textarea value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Describe what you'd like to discuss..." rows={3}
                      className="w-full rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:border-sky-500 dark:bg-slate-700 dark:text-white resize-none"
                    />
                  </div>

                  {/* ── BOOKING SUMMARY ── */}
                  {selectedDate && selectedTime && (
                    <div className="mb-5 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 p-4">
                      <p className="font-semibold text-sky-800 dark:text-sky-300 text-sm mb-2">Booking Summary</p>
                      {selectedService && <p className="text-sky-700 dark:text-sky-400 text-xs"><span className="font-medium">Service:</span> {selectedService.service_title}</p>}
                      <p className="text-sky-700 dark:text-sky-400 text-xs mt-1">
                        <span className="font-medium">Date:</span> {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {selectedTime}
                      </p>
                      {selectedService?.price && <p className="text-sky-700 dark:text-sky-400 text-xs mt-1"><span className="font-medium">Rate:</span> {selectedService.price === 'Free' ? 'Free' : `JMD ${selectedService.price}`}</p>}
                      {selectedService?.duration && <p className="text-sky-700 dark:text-sky-400 text-xs mt-1"><span className="font-medium">Duration:</span> {selectedService.duration}</p>}
                    </div>
                  )}

                  <button onClick={submitBooking}
                    disabled={!selectedDate || !selectedTime || isSubmitting || (providerServices.length > 0 && !selectedService)}
                    className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                  </button>
                  {providerServices.length > 0 && !selectedService && (
                    <p className="text-center text-xs text-red-500 mt-2">Please select a service to continue</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CHAT PANEL ── */}
      {chatOpen && chatProvider && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setChatOpen(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800">
              <button onClick={() => setChatOpen(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeft className="h-5 w-5" /></button>
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
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30 overflow-hidden">
                      {chatProvider.profile_photo_url ? <img src={chatProvider.profile_photo_url} alt="" className="h-16 w-16 rounded-full object-cover" /> : <span className="text-2xl font-bold text-sky-600">{(chatProvider.first_name?.[0] || "").toUpperCase()}</span>}
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
                      {message.createdAt && <p className={`mt-1 text-right text-xs ${isMe ? "text-sky-200" : "text-slate-400"}`}>{message.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || ""}</p>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={`Message ${chatProvider.first_name}...`}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
