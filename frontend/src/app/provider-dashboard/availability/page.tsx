"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  CalendarX,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Plus,
  Settings,
  Settings2,
  ShieldCheck,
  Sun,
  User,
  X,
} from "lucide-react";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type DaySchedule = {
  day: string;
  available: boolean;
  start: string;
  end: string;
};

type BlockedDate = {
  title: string;
  date: string;
};

type UpcomingDay = {
  short: string;
  booked: string;
  hours: string;
  featured: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Encode a DaySchedule as a Firestore string: "available|09:00|17:00" */
function encodeDay(d: DaySchedule): string {
  return `${d.available ? "1" : "0"}|${d.start}|${d.end}`;
}

/** Decode a Firestore string back to partial DaySchedule fields */
function decodeDay(
  raw: string | undefined,
  fallback: DaySchedule
): DaySchedule {
  if (!raw) return fallback;
  const [avail, start, end] = raw.split("|");
  return {
    ...fallback,
    available: avail === "1",
    start: start ?? fallback.start,
    end: end ?? fallback.end,
  };
}

/** Encode blocked dates as JSON string */
function encodeBlockedDates(dates: BlockedDate[]): string {
  return JSON.stringify(dates);
}

/** Decode blocked dates from JSON string */
function decodeBlockedDates(raw: string | undefined): BlockedDate[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as BlockedDate[];
  } catch {
    return [];
  }
}

/** Encode upcoming week as JSON string */
function encodeUpcomingWeek(week: UpcomingDay[]): string {
  return JSON.stringify(week);
}

/** Decode upcoming week from JSON string */
function decodeUpcomingWeek(
  raw: string | undefined,
  fallback: UpcomingDay[]
): UpcomingDay[] {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as UpcomingDay[];
  } catch {
    return fallback;
  }
}

// ─── Default values ───────────────────────────────────────────────────────────

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { day: "Monday", available: true, start: "09:00", end: "17:00" },
  { day: "Tuesday", available: true, start: "09:00", end: "17:00" },
  { day: "Wednesday", available: true, start: "09:00", end: "17:00" },
  { day: "Thursday", available: true, start: "09:00", end: "17:00" },
  { day: "Friday", available: true, start: "09:00", end: "16:00" },
  { day: "Saturday", available: false, start: "10:00", end: "14:00" },
  { day: "Sunday", available: false, start: "14:00", end: "18:00" },
];

const DEFAULT_UPCOMING: UpcomingDay[] = [
  {
    short: "MON",
    booked: "3 Slots Booked",
    hours: "9:00 AM - 5:00 PM",
    featured: true,
  },
  {
    short: "TUE",
    booked: "5 Slots Booked",
    hours: "9:00 AM - 5:00 PM",
    featured: false,
  },
  {
    short: "WED",
    booked: "2 Slots Booked",
    hours: "9:00 AM - 5:00 PM",
    featured: false,
  },
];

// ─── Session timeout (ms) ─────────────────────────────────────────────────────
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProviderAvailabilityPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Tracks whether the auth check has resolved — prevents flash of content
  const [authChecked, setAuthChecked] = useState(false);

  // Inactivity timer ref
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form state
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [sessionDuration, setSessionDuration] = useState("60 minutes");
  const [bufferSessions, setBufferSessions] = useState("15 minutes");
  const [advanceBooking, setAdvanceBooking] = useState("24 hours");
  const [futureBookings, setFutureBookings] = useState("1 month");
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    { title: "Public Holiday", date: "Aug 6, 2026" },
    { title: "Vacation", date: "Aug 15-20, 2026" },
  ]);
  const [upcomingWeek, setUpcomingWeek] =
    useState<UpcomingDay[]>(DEFAULT_UPCOMING);
  const [monthlyHours, setMonthlyHours] = useState("128 hrs");
  const [monthlyBooked, setMonthlyBooked] = useState("76 hrs");
  const [monthlyAvailable, setMonthlyAvailable] = useState("52 hrs");

  // Add blocked date form
  const [showAddBlocked, setShowAddBlocked] = useState(false);
  const [newBlockedTitle, setNewBlockedTitle] = useState("");
  const [newBlockedDate, setNewBlockedDate] = useState("");

  // UI feedback
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [loading, setLoading] = useState(true);

  // ── Secure sign-out helper ─────────────────────────────────────────────────
  const secureSignOut = async () => {
    try {
      await signOut(auth);
    } catch {
      // swallow — redirect regardless
    } finally {
      // Replace history so the back button cannot return to this page
      router.replace("/provider-dashboard/login");
    }
  };

  // ── Inactivity timeout ─────────────────────────────────────────────────────
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      secureSignOut();
    }, SESSION_TIMEOUT_MS);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer));
    resetInactivityTimer(); // start on mount

    return () => {
      events.forEach((e) =>
        window.removeEventListener(e, resetInactivityTimer)
      );
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Prevent back-navigation into protected page after sign-out ────────────
  useEffect(() => {
    // Push a duplicate history entry so there is always something to pop to
    // without actually going back to this page when unauthenticated.
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (!auth.currentUser) {
        // User is not authenticated — push them forward again (block back nav)
        window.history.pushState(null, "", window.location.href);
        router.replace("/provider-dashboard/login");
      } else {
        // Authenticated — re-push so the trap stays active
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  // ── Visibility change: re-verify auth when tab regains focus ─────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !auth.currentUser) {
        router.replace("/provider-dashboard/login");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [router]);

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Only allow providers with a verified email
        if (!user.emailVerified) {
          secureSignOut();
          return;
        }
        setCurrentUser(user);
        setUserId(user.uid);
      } else {
        // No session — redirect immediately, replacing history
        setCurrentUser(null);
        setUserId(null);
        router.replace("/provider-dashboard/login");
      }
      setAuthChecked(true);
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Theme ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const savedTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  // ── Load from Firestore ────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "provider_availability", userId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();

          // Schedule days — field names are lowercase day names
          setSchedule([
            decodeDay(d.monday, DEFAULT_SCHEDULE[0]),
            decodeDay(d.tuesday, DEFAULT_SCHEDULE[1]),
            decodeDay(d.wednesday, DEFAULT_SCHEDULE[2]),
            decodeDay(d.thursday, DEFAULT_SCHEDULE[3]),
            decodeDay(d.friday, DEFAULT_SCHEDULE[4]),
            decodeDay(d.saturday, DEFAULT_SCHEDULE[5]),
            decodeDay(d.sunday, DEFAULT_SCHEDULE[6]),
          ]);

          // Session settings
          if (d.session_duration) setSessionDuration(d.session_duration);
          if (d.buffer_sessions) setBufferSessions(d.buffer_sessions);
          if (d.advance_booking) setAdvanceBooking(d.advance_booking);
          if (d.future_bookings) setFutureBookings(d.future_bookings);

          // Blocked dates
          setBlockedDates(decodeBlockedDates(d.blocked_dates));

          // Upcoming week
          setUpcomingWeek(decodeUpcomingWeek(d.upcoming_week, DEFAULT_UPCOMING));

          // Monthly stats
          if (d.monthly_hours) setMonthlyHours(d.monthly_hours);
          if (d.monthly_booked) setMonthlyBooked(d.monthly_booked);
          if (d.monthly_available) setMonthlyAvailable(d.monthly_available);
        }
      } catch (err) {
        console.error("Failed to load availability:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  // ── Save to Firestore ──────────────────────────────────────────────────────
  const handleSaveChanges = async () => {
    // Re-check auth state immediately before writing
    const live = auth.currentUser;
    if (!live || !userId || live.uid !== userId) {
      await secureSignOut();
      return;
    }
    // Require verified email at write time
    if (!live.emailVerified) {
      await secureSignOut();
      return;
    }

    setSaving(true);
    setSaveStatus("idle");

    try {
      const ref = doc(db, "provider_availability", userId);
      await setDoc(
        ref,
        {
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
          upcoming_week: encodeUpcomingWeek(upcomingWeek),
          monthly_hours: monthlyHours,
          monthly_booked: monthlyBooked,
          monthly_available: monthlyAvailable,
          updated_at: serverTimestamp(),
        },
        { merge: true }
      );
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Failed to save availability:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  // ── Schedule helpers ───────────────────────────────────────────────────────
  const updateDayAvailability = (index: number, available: boolean) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, available } : item))
    );
  };

  const updateDayTime = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // ── Blocked date helpers ───────────────────────────────────────────────────
  const removeBlockedDate = (idx: number) => {
    setBlockedDates((prev) => prev.filter((_, i) => i !== idx));
  };

  const addBlockedDate = () => {
    if (!newBlockedTitle.trim() || !newBlockedDate.trim()) return;
    setBlockedDates((prev) => [
      ...prev,
      { title: newBlockedTitle.trim(), date: newBlockedDate.trim() },
    ]);
    setNewBlockedTitle("");
    setNewBlockedDate("");
    setShowAddBlocked(false);
  };

  // ── Dark mode toggle ───────────────────────────────────────────────────────
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const logout = () => secureSignOut();

  // ── Nav items ──────────────────────────────────────────────────────────────
  const navItems = [
    { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider-dashboard/profile", label: "Profile", icon: User },
    { href: "/provider-dashboard/services", label: "Services", icon: Briefcase },
    {
      href: "/provider-dashboard/availability",
      label: "Availability",
      icon: Calendar,
      active: true,
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
      badge: "3",
    },
    {
      href: "/provider-dashboard/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    { href: "/provider-dashboard/resources", label: "Resources", icon: BookOpen },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  // Block render entirely until Firebase auth has resolved.
  // This prevents any flash of protected content for unauthenticated users.
  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  // Redundant guard — router.replace already fired in the auth listener,
  // but this prevents any content flash during the redirect.
  if (!currentUser) return null;
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar */}
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
                onClick={() => setMobileSidebarOpen(false)}
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

      {/* Main */}
      <main className="flex-1 overflow-y-auto md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Availability Calendar
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your schedule and booking slots
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen((p) => !p)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 md:hidden"
                aria-label="Toggle mobile sidebar"
              >
                <Menu className="h-6 w-6" />
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

              <button
                onClick={handleSaveChanges}
                disabled={saving || loading}
                className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Save status banner */}
          {saveStatus === "success" && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              ✓ Availability saved successfully.
            </p>
          )}
          {saveStatus === "error" && (
            <p className="mt-2 text-sm text-red-500">
              ✗ Failed to save. Please try again.
            </p>
          )}
        </header>

        {/* Body */}
        <div className="p-4 sm:p-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center text-slate-400">
              Loading availability…
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* ── Left / main column ─────────────────────────────────── */}
              <div className="space-y-6 lg:col-span-2">
                {/* Weekly Schedule */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                    <Clock className="h-5 w-5 text-sky-600" />
                    Weekly Schedule
                  </h3>

                  <div className="space-y-4">
                    {schedule.map((item, index) => {
                      const inactive = !item.available;
                      return (
                        <div
                          key={item.day}
                          className={`flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center ${
                            inactive
                              ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/30"
                              : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                          }`}
                        >
                          <div
                            className={`w-24 font-medium ${
                              inactive
                                ? "text-slate-500"
                                : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {item.day}
                          </div>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.available}
                              onChange={(e) =>
                                updateDayAvailability(index, e.target.checked)
                              }
                              className="h-4 w-4 rounded text-sky-600 focus:ring-sky-600"
                            />
                            <span
                              className={`text-sm ${
                                inactive
                                  ? "text-slate-500"
                                  : "text-slate-700 dark:text-slate-200"
                              }`}
                            >
                              Available
                            </span>
                          </label>

                          <div
                            className={`flex flex-1 gap-2 ${
                              inactive ? "opacity-50" : ""
                            }`}
                          >
                            <input
                              type="time"
                              value={item.start}
                              disabled={!item.available}
                              onChange={(e) =>
                                updateDayTime(index, "start", e.target.value)
                              }
                              className="rounded border border-slate-200 px-3 py-1 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                            <span className="self-center text-slate-400">
                              to
                            </span>
                            <input
                              type="time"
                              value={item.end}
                              disabled={!item.available}
                              onChange={(e) =>
                                updateDayTime(index, "end", e.target.value)
                              }
                              className="rounded border border-slate-200 px-3 py-1 text-sm outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                          </div>

                          {item.available && (
                            <button
                              type="button"
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                              aria-label={`Add time slot for ${item.day}`}
                            >
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
                    <Settings2 className="h-5 w-5 text-sky-600" />
                    Session Settings
                  </h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Default Session Duration
                      </label>
                      <select
                        value={sessionDuration}
                        onChange={(e) => setSessionDuration(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      >
                        <option>30 minutes</option>
                        <option>45 minutes</option>
                        <option>60 minutes</option>
                        <option>90 minutes</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Buffer Between Sessions
                      </label>
                      <select
                        value={bufferSessions}
                        onChange={(e) => setBufferSessions(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      >
                        <option>No buffer</option>
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Advance Booking Notice
                      </label>
                      <select
                        value={advanceBooking}
                        onChange={(e) => setAdvanceBooking(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      >
                        <option>Same day</option>
                        <option>24 hours</option>
                        <option>48 hours</option>
                        <option>1 week</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Maximum Future Booking
                      </label>
                      <select
                        value={futureBookings}
                        onChange={(e) => setFutureBookings(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      >
                        <option>2 weeks</option>
                        <option>1 month</option>
                        <option>3 months</option>
                        <option>6 months</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right column ───────────────────────────────────────── */}
              <div className="space-y-6">
                {/* Upcoming Week */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">
                    Upcoming Week
                  </h3>

                  <div className="space-y-3">
                    {upcomingWeek.map((item) => (
                      <div
                        key={item.short}
                        className={
                          item.featured
                            ? "flex items-center gap-3 rounded-lg border border-sky-600/10 bg-sky-600/5 p-3"
                            : "flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50"
                        }
                      >
                        <div
                          className={
                            item.featured
                              ? "flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600/10"
                              : "flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-600"
                          }
                        >
                          <span
                            className={
                              item.featured
                                ? "text-xs font-bold text-sky-600"
                                : "text-xs font-bold text-slate-600 dark:text-slate-200"
                            }
                          >
                            {item.short}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {item.booked}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.hours}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blocked Dates */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                    <CalendarX className="h-5 w-5 text-red-500" />
                    Blocked Dates
                  </h3>

                  <div className="space-y-2">
                    {blockedDates.length === 0 && (
                      <p className="text-sm text-slate-400">
                        No blocked dates yet.
                      </p>
                    )}
                    {blockedDates.map((item, idx) => (
                      <div
                        key={`${item.title}-${item.date}-${idx}`}
                        className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.date}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeBlockedDate(idx)}
                          className="text-red-500 transition-colors hover:text-red-700"
                          aria-label={`Remove ${item.title}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add blocked date inline form */}
                  {showAddBlocked && (
                    <div className="mt-3 space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                      <input
                        type="text"
                        placeholder="Label (e.g. Vacation)"
                        value={newBlockedTitle}
                        onChange={(e) => setNewBlockedTitle(e.target.value)}
                        className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-sky-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Date (e.g. Dec 25, 2026)"
                        value={newBlockedDate}
                        onChange={(e) => setNewBlockedDate(e.target.value)}
                        className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-sky-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={addBlockedDate}
                          className="flex-1 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddBlocked(false)}
                          className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {!showAddBlocked && (
                    <button
                      type="button"
                      onClick={() => setShowAddBlocked(true)}
                      className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      + Add Blocked Date
                    </button>
                  )}
                </div>

                {/* This Month */}
                <div className="rounded-xl border border-sky-600/20 bg-gradient-to-br from-sky-600/10 to-cyan-700/10 p-6">
                  <h3 className="mb-3 font-semibold text-slate-800 dark:text-white">
                    This Month
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        Total Hours
                      </span>
                      <span className="font-medium text-slate-800 dark:text-white">
                        {monthlyHours}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        Booked
                      </span>
                      <span className="font-medium text-slate-800 dark:text-white">
                        {monthlyBooked}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        Available
                      </span>
                      <span className="font-medium text-sky-600">
                        {monthlyAvailable}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
