"use client";

import { db } from "@/lib/firebase/firebaseClient";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import {
  doc, getDoc, collection, query,
  where, onSnapshot, orderBy, limit,
  getDocs, updateDoc, addDoc, serverTimestamp
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Briefcase, Calendar, ShieldCheck,
  MessageSquare, Settings, LogOut, Menu, Bell,
  Eye, CalendarCheck, Star, MessageCircle,
  Edit3, Plus, Clock, CheckCircle, Circle, X,
  ChevronRight, Send, HeadphonesIcon, Check, XCircle
} from "lucide-react";

export default function ProviderDashboardPage() {
  const { user } = useAuth() as any;
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [providerTitle, setProviderTitle] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [applicationStatus, setApplicationStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Profile completion
  const [hasServices, setHasServices] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [hasAvailability, setHasAvailability] = useState(false);

  // Appointments
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [showAppointmentsDrawer, setShowAppointmentsDrawer] = useState(false);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [bookingActionLoading, setBookingActionLoading] = useState<string>("");

  // Messages
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Support chat
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [supportMessages, setSupportMessages] = useState<any[]>([]);
  const [supportInput, setSupportInput] = useState("");
  const [supportChatId, setSupportChatId] = useState<string | null>(null);
  const supportEndRef = useRef<HTMLDivElement>(null);

  const uid = user?.uid ?? user?.id;

  const handleLogout = () => {
    localStorage.removeItem("activeTherapist");
    router.replace("/provider-dashboard/login");
  };

  // ── Fetch provider profile + completion data ──
  useEffect(() => {
    if (!uid) return;
    const fetchProviderData = async () => {
      try {
        const [provSnap, servicesSnap, availSnap] = await Promise.all([
          getDoc(doc(db, "providers", uid)),
          getDocs(query(collection(db, "provider_services"), where("provider_id", "==", uid))),
          getDoc(doc(db, "provider_availability", uid)),
        ]);

        if (provSnap.exists()) {
          const data = provSnap.data();
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setProviderTitle(data.professional_title || "");
          setProfilePhotoUrl(data.profile_photo_url || "");
          setApplicationStatus(data.application_status || "pending");
          setHasCredentials(Array.isArray(data.credentials) && data.credentials.length > 0);
        }

        setHasServices(servicesSnap.size > 0);

        if (availSnap.exists()) {
          const d = availSnap.data();
          const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
          const hasAnyDay = days.some(day => d[day]?.startsWith("1"));
          setHasAvailability(hasAnyDay);
        }
      } catch (error) {
        console.error("Firestore fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProviderData();
  }, [uid]);

  // ── Fetch appointments from providers/{uid}/bookings subcollection ──
  useEffect(() => {
    if (!uid) return;
    const subcollectionRef = collection(db, "providers", uid, "bookings");
    const q = query(subcollectionRef, orderBy("createdAt", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAppointments(bookings);
      setAppointmentCount(snapshot.size);
    }, (error) => {
      console.error("Bookings error:", error);
    });
    return () => unsubscribe();
  }, [uid]);

  // ── Fetch ALL bookings for drawer ──
  useEffect(() => {
    if (!uid) return;
    const subcollectionRef = collection(db, "providers", uid, "bookings");
    const q = query(subcollectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllBookings(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, () => {});
    return () => unsubscribe();
  }, [uid]);

  // ── Fetch messages ──
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "chats"), where("participants", "array-contains", uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      chats.sort((a: any, b: any) => (b.lastMessageAt?.seconds || 0) - (a.lastMessageAt?.seconds || 0));
      // Exclude support chats from messages count
      const regularChats = chats.filter((c: any) => !c.isSupport);
      setRecentMessages(regularChats.slice(0, 3));
      setUnreadCount(regularChats.filter((c: any) => c.lastMessage?.length > 0).length);
    });
    return () => unsubscribe();
  }, [uid]);

  // ── Support chat ──
  useEffect(() => {
    if (!uid || !showSupportChat) return;
    // Find or create support chat
    const findOrCreateSupportChat = async () => {
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", uid),
        where("isSupport", "==", true)
      );
      const snap = await getDocs(q);
      let chatId: string;
      if (snap.empty) {
        // Create new support chat
        const chatRef = await addDoc(collection(db, "chats"), {
          participants: [uid],
          participantNames: { [uid]: `${firstName} ${lastName}`.trim() || "Provider" },
          isSupport: true,
          lastMessage: "",
          lastMessageAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
        chatId = chatRef.id;
      } else {
        chatId = snap.docs[0].id;
      }
      setSupportChatId(chatId);

      // Subscribe to messages
      const msgQ = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "asc")
      );
      const unsubscribe = onSnapshot(msgQ, (snapshot) => {
        setSupportMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setTimeout(() => supportEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
      return unsubscribe;
    };
    let unsub: any;
    findOrCreateSupportChat().then(u => { unsub = u; });
    return () => { if (unsub) unsub(); };
  }, [uid, showSupportChat, firstName, lastName]);

  const sendSupportMessage = async () => {
    if (!supportInput.trim() || !supportChatId || !uid) return;
    const text = supportInput.trim();
    setSupportInput("");
    await addDoc(collection(db, "chats", supportChatId, "messages"), {
      text,
      senderId: uid,
      senderName: `${firstName} ${lastName}`.trim() || "Provider",
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "chats", supportChatId), {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
    });
  };

  const handleBookingAction = async (bookingId: string, action: "confirmed" | "cancelled") => {
    if (!uid) return;
    setBookingActionLoading(bookingId + action);
    try {
      await updateDoc(doc(db, "providers", uid, "bookings", bookingId), {
        status: action,
      });
    } catch (e) {
      console.error("Booking action error:", e);
    } finally {
      setBookingActionLoading("");
    }
  };

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "P";

  const getOtherPersonName = (chat: any) => {
    if (!chat.participantNames || !uid) return "User";
    const otherUid = chat.participants?.find((p: string) => p !== uid);
    return chat.participantNames?.[otherUid] || "User";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
    }
  };

  const getApplicationBanner = () => {
    switch (applicationStatus) {
      case 'approved':
        return { bg: 'from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-800', icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, iconBg: 'bg-emerald-200 dark:bg-emerald-900/30', title: 'Verification Approved', sub: 'Your profile is verified and visible to clients.', titleColor: 'text-emerald-700 dark:text-emerald-300', subColor: 'text-emerald-600 dark:text-emerald-400', btn: null }
      case 'rejected':
        return { bg: 'from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20', border: 'border-red-200 dark:border-red-800', icon: <XCircle className="w-5 h-5 text-red-600" />, iconBg: 'bg-red-200 dark:bg-red-900/30', title: 'Verification Rejected', sub: 'Your credentials were not approved. Please re-upload.', titleColor: 'text-red-700 dark:text-red-300', subColor: 'text-red-600 dark:text-red-400', btn: { href: '/provider-dashboard/credentials', label: 'Re-upload' } }
      default:
        return { bg: 'from-sky-100 to-cyan-100 dark:from-sky-900/20 dark:to-cyan-900/20', border: 'border-sky-200 dark:border-sky-800', icon: <ShieldCheck className="w-5 h-5 text-sky-600" />, iconBg: 'bg-sky-200 dark:bg-sky-900/30', title: 'Verification Pending', sub: 'Please upload your credentials to complete verification.', titleColor: 'text-sky-700 dark:text-sky-300', subColor: 'text-sky-600 dark:text-sky-400', btn: { href: '/provider-dashboard/credentials', label: 'Complete Now' } }
    }
  };

  // Profile completion
  const hasBasicInfo = !!(firstName && lastName);
  const completionItems = [
    { label: "Basic Information", done: hasBasicInfo },
    { label: "Services Added", done: hasServices },
    { label: "Verification Documents", done: hasCredentials },
    { label: "Availability Set", done: hasAvailability },
  ];
  const completionPct = Math.round((completionItems.filter(i => i.done).length / completionItems.length) * 100);

  const navItems = [
    { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
    { href: "/provider-dashboard/profile", label: "Profile", icon: User },
    { href: "/provider-dashboard/services", label: "Services", icon: Briefcase },
    { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar },
    { href: "/provider-dashboard/credentials", label: "Verification", icon: ShieldCheck },
    { href: "/provider-dashboard/messaging", label: "Messages", icon: MessageSquare, badge: unreadCount > 0 ? String(unreadCount) : undefined },
  ];

  const banner = getApplicationBanner();

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-100">

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed h-full z-40 w-64 flex flex-col bg-white border-r border-slate-200 dark:bg-slate-800 dark:border-slate-700
        transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img src="/provider-dashboard/images/hopepath.png" alt="HopePath Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg" />
            <div>
              <h1 className="font-bold text-xl text-sky-600">HopePath</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">Provider Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href}
                className={item.active
                  ? "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-sky-100 text-sky-600"
                  : "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                }
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-1 dark:border-slate-700">
          {/* Support */}
          <button
            onClick={() => { setShowSupportChat(true); setMobileSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <HeadphonesIcon className="w-5 h-5" />Support
          </button>
          <Link href="/provider-dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <Settings className="w-5 h-5" />Settings
          </Link>
          <button type="button" onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 py-4 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-semibold">Welcome back, {loading ? "..." : (firstName || "Provider")}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Here&apos;s your practice overview</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button type="button" className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors dark:hover:bg-slate-700">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{loading ? "..." : (`${firstName} ${lastName}`.trim() || "Provider")}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{providerTitle || "Provider"}</p>
                </div>
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-sky-100" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center border-2 border-sky-100">
                    <span className="text-white text-sm font-semibold">{initials}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8">

          {/* Dynamic Status Banner */}
          {!loading && (
            <div className={`bg-gradient-to-r ${banner.bg} border ${banner.border} rounded-xl p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 ${banner.iconBg} rounded-lg`}>{banner.icon}</div>
                <div>
                  <p className={`font-medium ${banner.titleColor}`}>{banner.title}</p>
                  <p className={`text-sm ${banner.subColor}`}>{banner.sub}</p>
                </div>
              </div>
              {banner.btn && (
                <Link href={banner.btn.href} className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors whitespace-nowrap">
                  {banner.btn.label}
                </Link>
              )}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-sky-100 rounded-lg dark:bg-sky-900/20"><Eye className="w-5 h-5 text-sky-600" /></div>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">—</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Profile Views</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-cyan-100 rounded-lg dark:bg-cyan-900/20"><CalendarCheck className="w-5 h-5 text-cyan-600" /></div>
                {appointmentCount > 0 && <span className="text-xs font-medium text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">{appointmentCount}</span>}
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{appointmentCount}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Appointments</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 rounded-lg dark:bg-amber-900/20"><Star className="w-5 h-5 text-amber-600" /></div>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">—</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Rating</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/20"><MessageCircle className="w-5 h-5 text-orange-600" /></div>
                {unreadCount > 0 && <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">{unreadCount}</span>}
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{recentMessages.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Conversations</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Upcoming Appointments — clickable to open drawer */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Upcoming Appointments</h3>
                  <button
                    onClick={() => setShowAppointmentsDrawer(true)}
                    className="text-sm text-sky-600 hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {loading ? (
                    <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
                  ) : appointments.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                      <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">No appointments yet</p>
                      <p className="text-xs mt-1">Bookings from clients will appear here</p>
                    </div>
                  ) : (
                    appointments.map((appt) => (
                      <div
                        key={appt.id}
                        className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors dark:hover:bg-slate-700/50 cursor-pointer"
                        onClick={() => setShowAppointmentsDrawer(true)}
                      >
                        <div className="flex-shrink-0 w-16 h-12 bg-sky-100 rounded-lg flex flex-col items-center justify-center dark:bg-sky-900/20">
                          <span className="text-xs font-bold text-sky-600">{appt.time || "—"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 dark:text-white truncate">{appt.userName || appt.userEmail || "Client"}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{appt.date}</p>
                          {appt.notes && <p className="text-xs text-slate-400 truncate">{appt.notes}</p>}
                        </div>
                        <span className={`shrink-0 px-3 py-1 text-xs rounded-full capitalize ${getStatusColor(appt.status)}`}>
                          {appt.status || "pending"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Recent Messages</h3>
                  <Link href="/provider-dashboard/messaging" className="text-sm text-sky-600 hover:underline">View All</Link>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {recentMessages.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                      <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">No messages yet</p>
                    </div>
                  ) : (
                    recentMessages.map((chat: any) => {
                      const otherName = getOtherPersonName(chat);
                      return (
                        <Link key={chat.id} href="/provider-dashboard/messaging"
                          className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer dark:hover:bg-slate-700/50 block"
                        >
                          <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center shrink-0">
                            <span className="text-white text-sm font-semibold">{otherName?.[0]?.toUpperCase() || "U"}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-medium text-slate-800 dark:text-white">{otherName}</p>
                              {chat.lastMessageAt && (
                                <span className="text-xs text-slate-500 shrink-0 ml-2">
                                  {chat.lastMessageAt?.toDate?.()?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || ""}
                                </span>
                              )}
                            </div>
                            {chat.lastMessage && <p className="text-sm text-slate-600 line-clamp-1 dark:text-slate-300">{chat.lastMessage}</p>}
                          </div>
                          {chat.lastMessage && <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 shrink-0" />}
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Profile Completion */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 dark:bg-slate-800 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Profile Completion</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${completionPct === 100 ? "text-emerald-600 bg-emerald-100" : "text-sky-600 bg-sky-100"} dark:bg-sky-900/20`}>
                      {completionPct === 100 ? "Complete" : "In Progress"}
                    </span>
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-300">{completionPct}%</span>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 rounded bg-slate-100 dark:bg-slate-700">
                    <div
                      style={{ width: `${completionPct}%`, transition: "width 0.6s ease" }}
                      className="h-full rounded bg-gradient-to-r from-sky-500 to-cyan-500"
                    />
                  </div>
                  <ul className="space-y-2 text-sm">
                    {completionItems.map(item => (
                      <li key={item.label} className={`flex items-center gap-2 ${item.done ? "text-green-600 dark:text-green-500" : "text-slate-400 dark:text-slate-500"}`}>
                        {item.done ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 dark:bg-slate-800 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { href: "/provider-dashboard/profile", icon: Edit3, label: "Edit Profile", sub: "Update your information" },
                    { href: "/provider-dashboard/services", icon: Plus, label: "Add Service", sub: "Create new offering" },
                    { href: "/provider-dashboard/availability", icon: Clock, label: "Set Hours", sub: "Manage availability" },
                  ].map(item => (
                    <Link key={item.label} href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 transition-colors group dark:border-slate-700 dark:hover:border-sky-500 dark:hover:bg-sky-900/10"
                    >
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white dark:bg-slate-700">
                        <item.icon className="w-4 h-4 text-slate-600 group-hover:text-sky-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{item.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.sub}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── APPOINTMENTS DRAWER ── */}
      {showAppointmentsDrawer && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAppointmentsDrawer(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl flex flex-col" style={{ animation: "slideIn 0.25s ease" }}>
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">All Bookings</h3>
                <p className="text-xs text-slate-500 mt-0.5">{allBookings.length} total</p>
              </div>
              <button onClick={() => setShowAppointmentsDrawer(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
              {allBookings.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No bookings yet</p>
                </div>
              ) : allBookings.map((b: any) => (
                <div key={b.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm dark:bg-sky-900/20 flex-shrink-0">
                        {(b.userName || b.userEmail || "C")?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">{b.userName || b.userEmail || "Client"}</p>
                        <p className="text-xs text-slate-500">{b.date} {b.time && `· ${b.time}`}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 text-xs rounded-full capitalize ${getStatusColor(b.status)}`}>
                      {b.status || "pending"}
                    </span>
                  </div>
                  {b.notes && <p className="text-xs text-slate-500 mb-3 pl-12">{b.notes}</p>}
                  {(b.status === "pending" || !b.status) && (
                    <div className="flex gap-2 pl-12">
                      <button
                        onClick={() => handleBookingAction(b.id, "confirmed")}
                        disabled={!!bookingActionLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {bookingActionLoading === b.id + "confirmed" ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleBookingAction(b.id, "cancelled")}
                        disabled={!!bookingActionLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        {bookingActionLoading === b.id + "cancelled" ? "..." : "Decline"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── SUPPORT CHAT DRAWER ── */}
      {showSupportChat && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSupportChat(false)} />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white dark:bg-slate-800 shadow-2xl flex flex-col" style={{ animation: "slideIn 0.25s ease" }}>
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center dark:bg-sky-900/20">
                  <HeadphonesIcon className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">HopePath Support</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Online
                  </p>
                </div>
              </div>
              <button onClick={() => setShowSupportChat(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {supportMessages.length === 0 && (
                <div className="text-center py-8">
                  <HeadphonesIcon className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm text-slate-500">Send a message to reach our support team</p>
                </div>
              )}
              {supportMessages.map((msg: any) => {
                const isMe = msg.senderId === uid;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${isMe ? "bg-sky-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-white rounded-bl-sm"}`}>
                      {msg.text}
                      <div className={`text-xs mt-1 ${isMe ? "text-sky-200" : "text-slate-400"}`}>
                        {msg.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || ""}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={supportEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={supportInput}
                  onChange={e => setSupportInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendSupportMessage(); } }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-sky-400 transition-colors"
                />
                <button
                  onClick={sendSupportMessage}
                  disabled={!supportInput.trim()}
                  className="p-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
