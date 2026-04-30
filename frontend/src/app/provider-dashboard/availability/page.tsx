"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase, Calendar, CalendarX, Clock,
  LayoutDashboard, LogOut, Menu, MessageSquare,
  Moon, Plus, Settings, Settings2, ShieldCheck,
  Sun, User, X, HeadphonesIcon,
} from "lucide-react";
import { db, auth } from "@/lib/firebase/firebaseClient";
import {
  doc, getDoc, setDoc, serverTimestamp,
  collection, query, onSnapshot, orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";

// ─── Types ────────────────────────────────────────────────────────────────────
type DaySchedule = { day: string; available: boolean; start: string; end: string; };
type BlockedDate = { title: string; date: string; };
type UpcomingDay = { short: string; fullDate: string; bookings: any[]; hours: string; isToday: boolean; };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function encodeDay(d: DaySchedule): string {
  return `${d.available ? "1" : "0"}|${d.start}|${d.end}`;
}
function decodeDay(raw: string | undefined, fallback: DaySchedule): DaySchedule {
  if (!raw) return fallback;
  const [avail, start, end] = raw.split("|");
  return { ...fallback, available: avail === "1", start: start ?? fallback.start, end: end ?? fallback.end };
}
function encodeBlockedDates(dates: BlockedDate[]): string { return JSON.stringify(dates); }
function decodeBlockedDates(raw: string | undefined): BlockedDate[] {
  if (!raw) return [];
  try { return JSON.parse(raw) as BlockedDate[]; } catch { return []; }
}

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { day: "Monday", available: true, start: "09:00", end: "17:00" },
  { day: "Tuesday", available: true, start: "09:00", end: "17:00" },
  { day: "Wednesday", available: true, start: "09:00", end: "17:00" },
  { day: "Thursday", available: true, start: "09:00", end: "17:00" },
  { day: "Friday", available: true, start: "09:00", end: "16:00" },
  { day: "Saturday", available: false, start: "10:00", end: "14:00" },
  { day: "Sunday", available: false, start: "14:00", end: "18:00" },
];

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

// ─── Get next 7 days from today ───────────────────────────────────────────────
function getUpcomingDays(): UpcomingDay[] {
  const days: UpcomingDay[] = [];
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      short: dayNames[d.getDay()],
      fullDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      bookings: [],
      hours: "",
      isToday: i === 0,
    });
  }
  return days;
}

// ─── Match booking date string to a calendar day ──────────────────────────────
function matchBookingToDay(bookingDate: string, days: UpcomingDay[]): number {
  // bookingDate may be like "Wednesday, April 29, 2026" or "Apr 29, 2026"
  if (!bookingDate) return -1;
  for (let i = 0; i < days.length; i++) {
    const dayDate = new Date(days[i].fullDate);
    const bookingDateObj = new Date(bookingDate);
    if (
      dayDate.getDate() === bookingDateObj.getDate() &&
      dayDate.getMonth() === bookingDateObj.getMonth() &&
      dayDate.getFullYear() === bookingDateObj.getFullYear()
    ) {
      return i;
    }
  }
  return -1;
}

export default function ProviderAvailabilityPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [sessionDuration, setSessionDuration] = useState("60 minutes");
  const [bufferSessions, setBufferSessions] = useState("15 minutes");
  const [advanceBooking, setAdvanceBooking] = useState("24 hours");
  const [futureBookings, setFutureBookings] = useState("1 month");
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);

  // Upcoming week — built from real bookings
  const [upcomingDays, setUpcomingDays] = useState<UpcomingDay[]>(getUpcomingDays());
  const [allBookings, setAllBookings] = useState<any[]>([]);

  const [showAddBlocked, setShowAddBlocked] = useState(false);
  const [newBlockedTitle, setNewBlockedTitle] = useState("");
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(true);

  const secureSignOut = async () => {
    try { await signOut(auth); } catch {}
    finally { router.replace("/provider-dashboard/login"); }
  };

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => secureSignOut(), SESSION_TIMEOUT_MS);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer));
    resetInactivityTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      if (!auth.currentUser) router.replace("/provider-dashboard/login");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !auth.currentUser)
        router.replace("/provider-dashboard/login");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [router]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.emailVerified) { secureSignOut(); return; }
        setCurrentUser(user);
        setUserId(user.uid);
      } else {
        setCurrentUser(null);
        setUserId(null);
        router.replace("/provider-dashboard/login");
      }
      setAuthChecked(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const isDark = savedTheme === "dark" || (!savedTheme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // ── Load availability from Firestore ──────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "provider_availability", userId));
        if (snap.exists()) {
          const d = snap.data();
          setSchedule([
            decodeDay(d.monday, DEFAULT_SCHEDULE[0]),
            decodeDay(d.tuesday, DEFAULT_SCHEDULE[1]),
            decodeDay(d.wednesday, DEFAULT_SCHEDULE[2]),
            decodeDay(d.thursday, DEFAULT_SCHEDULE[3]),
            decodeDay(d.friday, DEFAULT_SCHEDULE[4]),
            decodeDay(d.saturday, DEFAULT_SCHEDULE[5]),
            decodeDay(d.sunday, DEFAULT_SCHEDULE[6]),
          ]);
          if (d.session_duration) setSessionDuration(d.session_duration);
          if (d.buffer_sessions) setBufferSessions(d.buffer_sessions);
          if (d.advance_booking) setAdvanceBooking(d.advance_booking);
          if (d.future_bookings) setFutureBookings(d.future_bookings);
          setBlockedDates(decodeBlockedDates(d.blocked_dates));
        }
      } catch (err) {
        console.error("Failed to load availability:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  // ── Load real bookings from providers/{uid}/bookings subcollection ────────
  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "providers", userId, "bookings"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllBookings(bookings);
    }, (err) => console.error("Bookings error:", err));
    return () => unsub();
  }, [userId]);

  // ── Build upcoming week from real bookings ────────────────────────────────
  useEffect(() => {
    const days = getUpcomingDays();

    // Match each booking to a day in the upcoming week
    allBookings.forEach((booking: any) => {
      const dayIndex = matchBookingToDay(booking.date || "", days);
      if (dayIndex >= 0) {
        days[dayIndex].bookings.push(booking);
      }
    });

    // Set hours label from schedule
    days.forEach((day) => {
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const fullDayName = dayNames[new Date(day.fullDate).getDay()];
      const scheduleDay = schedule.find(s => s.day === fullDayName);
      if (scheduleDay?.available) {
        day.hours = `${scheduleDay.start} – ${scheduleDay.end}`;
      } else {
        day.hours = "Unavailable";
      }
    });

    setUpcomingDays(days);
  }, [allBookings, schedule]);

  // ── Save to Firestore ──────────────────────────────────────────────────────
  const handleSaveChanges = async () => {
    const live = auth.currentUser;
    if (!live || !userId || live.uid !== userId) { await secureSignOut(); return; }
    if (!live.emailVerified) { await secureSignOut(); return; }

    setSaving(true);
    setSaveStatus("idle");
    try {
      await setDoc(doc(db, "provider_availability", userId), {
        monday: encodeDay(schedule[0]),
        tuesday: encodeDay(schedule[1]),
        wednesday: encodeDay(schedule[2]),
        thursday: encodeDay(schedule[3]),
        friday: encodeDay(schedule[4]),
        saturday: encodeDay(schedule[5]),
        sunday: encodeDay(schedule[6]),
        session_duration: sessionDuration,
        buffer_sessions: bufferSessions,
        advance_booking: advanceBooking,
        future_bookings: futureBookings,
        blocked_dates: encodeBlockedDates(blockedDates),
        updated_at: serverTimestamp(),
      }, { merge: true });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Failed to save:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  const updateDayAvailability = (index: number, available: boolean) =>
    setSchedule((prev) => prev.map((item, i) => (i === index ? { ...item, available } : item)));

  const updateDayTime = (index: number, field: "start" | "end", value: string) =>
    setSchedule((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const removeBlockedDate = (idx: number) =>
    setBlockedDates((prev) => prev.filter((_, i) => i !== idx));

  const addBlockedDate = () => {
    if (!newBlockedTitle.trim() || !newBlockedDate.trim()) return;
    setBlockedDates((prev) => [...prev, { title: newBlockedTitle.trim(), date: newBlockedDate.trim() }]);
    setNewBlockedTitle(""); setNewBlockedDate(""); setShowAddBlocked(false);
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const navItems = [
    { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider-dashboard/profile", label: "Profile", icon: User },
    { href: "/provider-dashboard/services", label: "Services", icon: Briefcase },
    { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar, active: true },
    { href: "/provider-dashboard/credentials", label: "Verification", icon: ShieldCheck },
    { href: "/provider-dashboard/messaging", label: "Messages", icon: MessageSquare },
  ];

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
      </div>
    );
  }
  if (!currentUser) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
      {mobileSidebarOpen && (
        <button className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800 md:translate-x-0 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="border-b border-slate-100 p-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img src="/provider-dashboard/images/hopepath.png" alt="HopePath Logo" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
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
                className={item.active
                  ? "flex items-center gap-3 rounded-lg bg-sky-600/10 px-4 py-3 text-sm font-medium text-sky-600"
                  : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                }
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />{item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-slate-200 p-4 dark:border-slate-700">
          <Link href="/provider-dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Settings className="h-5 w-5" />Settings
          </Link>
          <button onClick={secureSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto md:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Availability Calendar</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage your schedule and booking slots</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileSidebarOpen((p) => !p)} className="rounded-lg p-2 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 md:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <button onClick={toggleDarkMode} className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
              </button>
              <button onClick={handleSaveChanges} disabled={saving || loading}
                className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
          {saveStatus === "success" && <p className="mt-2 text-sm text-green-600 dark:text-green-400">✓ Availability saved successfully.</p>}
          {saveStatus === "error" && <p className="mt-2 text-sm text-red-500">✗ Failed to save. Please try again.</p>}
        </header>

        <div className="p-4 sm:p-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center text-slate-400">Loading availability…</div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

              {/* ── Left column ── */}
              <div className="space-y-6 lg:col-span-2">

                {/* Weekly Schedule */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                    <Clock className="h-5 w-5 text-sky-600" />Weekly Schedule
                  </h3>
                  <div className="space-y-4">
                    {schedule.map((item, index) => {
                      const inactive = !item.available;
                      return (
                        <div key={item.day}
                          className={`flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center ${inactive ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/30" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"}`}
                        >
                          <div className={`w-24 font-medium ${inactive ? "text-slate-500" : "text-slate-700 dark:text-slate-200"}`}>{item.day}</div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={item.available} onChange={(e) => updateDayAvailability(index, e.target.checked)} className="h-4 w-4 rounded text-sky-600 focus:ring-sky-600" />
                            <span className={`text-sm ${inactive ? "text-slate-500" : "text-slate-700 dark:text-slate-200"}`}>Available</span>
                          </label>
                          <div className={`flex flex-1 gap-2 ${inactive ? "opacity-50" : ""}`}>
                            <input type="time" value={item.start} disabled={!item.available} onChange={(e) => updateDayTime(index, "start", e.target.value)} className="rounded border border-slate-200 px-3 py-1 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                            <span className="self-center text-slate-400">to</span>
                            <input type="time" value={item.end} disabled={!item.available} onChange={(e) => updateDayTime(index, "end", e.target.value)} className="rounded border border-slate-200 px-3 py-1 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                          </div>
                          {item.available && (
                            <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                              <Plus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Session Settings */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                    <Settings2 className="h-5 w-5 text-sky-600" />Session Settings
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[
                      { label: "Default Session Duration", value: sessionDuration, setter: setSessionDuration, options: ["30 minutes","45 minutes","60 minutes","90 minutes"] },
                      { label: "Buffer Between Sessions", value: bufferSessions, setter: setBufferSessions, options: ["No buffer","15 minutes","30 minutes"] },
                      { label: "Advance Booking Notice", value: advanceBooking, setter: setAdvanceBooking, options: ["Same day","24 hours","48 hours","1 week"] },
                      { label: "Maximum Future Booking", value: futureBookings, setter: setFutureBookings, options: ["2 weeks","1 month","3 months","6 months"] },
                    ].map(field => (
                      <div key={field.label}>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{field.label}</label>
                        <select value={field.value} onChange={(e) => field.setter(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                          {field.options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right column ── */}
              <div className="space-y-6">

                {/* ── UPCOMING WEEK — real booking data ── */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="mb-4 font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-sky-600" />
                    Upcoming Week
                  </h3>
                  <div className="space-y-2">
                    {upcomingDays.map((day) => {
                      const hasBookings = day.bookings.length > 0;
                      const isUnavailable = day.hours === "Unavailable";
                      return (
                        <div key={day.fullDate}
                          className={`rounded-lg border p-3 transition-colors ${
                            day.isToday
                              ? "border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-900/20"
                              : isUnavailable
                              ? "border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/20 opacity-60"
                              : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                day.isToday
                                  ? "bg-sky-600 text-white"
                                  : isUnavailable
                                  ? "bg-slate-200 dark:bg-slate-600 text-slate-500"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                              }`}>
                                <span className="text-xs font-bold">{day.short}</span>
                              </div>
                              <div>
                                <p className={`text-xs font-medium ${day.isToday ? "text-sky-700 dark:text-sky-300" : "text-slate-700 dark:text-slate-200"}`}>
                                  {day.isToday ? "Today" : day.fullDate}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{day.hours}</p>
                              </div>
                            </div>
                            {!isUnavailable && (
                              <div className="text-right">
                                {hasBookings ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400">
                                    {day.bookings.length} booking{day.bookings.length !== 1 ? "s" : ""}
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-400">No bookings</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Show booking names if any */}
                          {hasBookings && (
                            <div className="mt-2 pl-11 space-y-1">
                              {day.bookings.slice(0, 3).map((b: any, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500 dark:text-slate-400">{b.time || "—"}</span>
                                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{b.userName || b.userEmail || "Client"}</span>
                                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${
                                    b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                                    b.status === "cancelled" ? "bg-red-100 text-red-700" :
                                    "bg-amber-100 text-amber-700"
                                  }`}>{b.status || "pending"}</span>
                                </div>
                              ))}
                              {day.bookings.length > 3 && (
                                <p className="text-xs text-slate-400">+{day.bookings.length - 3} more</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Blocked Dates */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                    <CalendarX className="h-5 w-5 text-red-500" />Blocked Dates
                  </h3>
                  <div className="space-y-2">
                    {blockedDates.length === 0 && <p className="text-sm text-slate-400">No blocked dates yet.</p>}
                    {blockedDates.map((item, idx) => (
                      <div key={`${item.title}-${idx}`} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{item.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.date}</p>
                        </div>
                        <button type="button" onClick={() => removeBlockedDate(idx)} className="text-red-500 transition-colors hover:text-red-700">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {showAddBlocked && (
                    <div className="mt-3 space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                      <input type="text" placeholder="Label (e.g. Vacation)" value={newBlockedTitle} onChange={(e) => setNewBlockedTitle(e.target.value)} className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-sky-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                      <input type="text" placeholder="Date (e.g. Dec 25, 2026)" value={newBlockedDate} onChange={(e) => setNewBlockedDate(e.target.value)} className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-sky-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                      <div className="flex gap-2">
                        <button type="button" onClick={addBlockedDate} className="flex-1 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700">Add</button>
                        <button type="button" onClick={() => setShowAddBlocked(false)} className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
                      </div>
                    </div>
                  )}

                  {!showAddBlocked && (
                    <button type="button" onClick={() => setShowAddBlocked(true)} className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                      + Add Blocked Date
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
