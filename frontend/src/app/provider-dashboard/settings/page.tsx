"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Settings,
  Shield,
  ShieldCheck,
  Sun,
  User,
  UserCog,
} from "lucide-react";
import { onAuthStateChanged, sendPasswordResetEmail, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type TabKey = "general" | "notifications" | "security" | "billing";

const PLANS = [
  { id: "free",       name: "Free",        price: 0,     description: "Basic access for individuals" },
  { id: "individual", name: "Individual",  price: 9.99,  description: "Everything in Free + priority support" },
  { id: "pro",        name: "Pro",         price: 29.99, description: "Advanced features for professionals" },
  { id: "enterprise", name: "Enterprise",  price: 99.99, description: "Full suite for teams & organisations" },
  { id: "custom",     name: "Custom",      price: null,  description: "Contact us for tailored pricing" },
];

export default function ProviderSettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  // Authenticated user
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Account — seeded from auth once user is known
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // mirrors email
  const [timezone, setTimezone] = useState("(UTC-05:00) Eastern Time (Jamaica)");
  const [language, setLanguage] = useState("English");

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  // Security – fetched from Firestore provider_security collection
  const [lastLogin, setLastLogin] = useState<Date | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<string>("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ text: string; ok: boolean } | null>(null);

  // Billing
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" });

  // Toast
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  // Refs for scroll-to-section
  const sectionRefs = useRef<Record<TabKey, HTMLDivElement | null>>({
    general: null,
    notifications: null,
    security: null,
    billing: null,
  });
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // ── Dark mode init ──────────────────────────────────────────────────────
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

  // ── Auth listener + load all Firestore settings ─────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) return;

      // Seed email & username from the authenticated user immediately
      setEmail(user.email ?? "");
      setUsername(user.email ?? "");

      try {
        // Load from provider_settings (general / display fields)
        const settingsSnap = await getDoc(doc(db, "provider_settings", user.uid));
        if (settingsSnap.exists()) {
          const d = settingsSnap.data();
          if (d.timezone)          setTimezone(d.timezone);
          if (d.settings_language) setLanguage(d.settings_language);
          if (d.plan)              setSelectedPlan(d.plan);
        }

        // Load from provider_security (notifications + login history)
        const securitySnap = await getDoc(doc(db, "provider_security", user.uid));
        if (securitySnap.exists()) {
          const d = securitySnap.data();
          setEmailNotifications(d.email_notification === "true" || d.email_notification === true);
          setSmsNotifications(d.sms_notification === "true" || d.sms_notification === true);
          setMarketingEmails(d.marketing_emails === "true" || d.marketing_emails === true);
          setAppointmentReminders(d.appointment_reminders === "true" || d.appointment_reminders === true);
          setLastLogin(d.last_login?.toDate ? (d.last_login.toDate() as Date) : null);
          setDeviceInfo(d.device_info || "");
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
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

  const showToast = (text: string, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    if (!currentUser) {
      showToast("Not signed in — please log in again.", false);
      return;
    }
    try {
      // Write general / display fields to provider_settings
      await setDoc(
        doc(db, "provider_settings", currentUser.uid),
        {
          timezone,
          settings_language: language,
          plan: selectedPlan,
          updated_at: serverTimestamp(),
        },
        { merge: true }
      );

      // Write notification prefs to provider_security
      await setDoc(
        doc(db, "provider_security", currentUser.uid),
        {
          email_notification:    String(emailNotifications),
          sms_notification:      String(smsNotifications),
          marketing_emails:      String(marketingEmails),
          appointment_reminders: String(appointmentReminders),
        },
        { merge: true }
      );

      showToast("Settings saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Failed to save settings. Please try again.", false);
    }
  };
  const handleCancel = () => window.location.reload();

  // Scroll-to-section when tab is clicked
  const handleTabClick = (key: TabKey) => {
    setActiveTab(key);
    const el = sectionRefs.current[key];
    if (el && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const offsetTop = el.offsetTop - container.offsetTop;
      container.scrollTo({ top: offsetTop - 16, behavior: "smooth" });
    }
  };

  // Update active tab based on scroll position
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    const keys: TabKey[] = ["general", "notifications", "security", "billing"];
    let current: TabKey = "general";
    for (const key of keys) {
      const el = sectionRefs.current[key];
      if (el && el.offsetTop - container.offsetTop - 80 <= scrollTop) {
        current = key;
      }
    }
    setActiveTab(current);
  };

  // Firebase password reset
  const handlePasswordReset = async () => {
    const userEmail = currentUser?.email || email;
    if (!userEmail) return;
    setResetLoading(true);
    setResetMessage(null);
    try {
      await sendPasswordResetEmail(auth, userEmail);
      setResetMessage({
        text: `Password reset email sent to ${userEmail}.`,
        ok: true,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset email.";
      setResetMessage({ text: message, ok: false });
    } finally {
      setResetLoading(false);
    }
  };

  // Card number formatter  →  "1234 5678 9012 3456"
  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  // Expiry formatter  →  "MM/YY"
  const formatExpiry = (v: string) => {
    const clean = v.replace(/\D/g, "").slice(0, 4);
    return clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  const formatDate = (d: Date | null) => {
    if (!d) return "Not available";
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const currentPlan = PLANS.find((p) => p.id === selectedPlan);

  // ── Nav ───────────────────────────────────────────────────────────────────
  const navItems = [
    { href: "/provider-dashboard",              label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider-dashboard/profile",      label: "Profile",   icon: User },
    { href: "/provider-dashboard/services",     label: "Services",  icon: Briefcase },
    { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar },
    { href: "/provider-dashboard/credentials",  label: "Verification", icon: ShieldCheck },
    { href: "/provider-dashboard/messaging",    label: "Messages",  icon: MessageSquare, badge: "3" },
    { href: "/provider-dashboard/analytics",    label: "Analytics", icon: BarChart3 },
    { href: "/provider-dashboard/resources",    label: "Resources", icon: BookOpen },
  ];

  const tabs: { key: TabKey; label: string }[] = [
    { key: "general",       label: "General" },
    { key: "notifications", label: "Notifications" },
    { key: "security",      label: "Security" },
    { key: "billing",       label: "Billing" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
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
              <p className="text-xs text-slate-600 dark:text-slate-400">Provider Portal</p>
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
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
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
            className="flex items-center gap-3 rounded-lg bg-sky-600/10 px-4 py-3 text-sm font-medium text-sky-600"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <button
            onClick={() => (window.location.href = "/provider-dashboard/login")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="flex flex-col flex-1 overflow-hidden md:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Settings</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account preferences</p>
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
                className="relative rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
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
        </header>

        {/* Scrollable content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-8"
        >
          <div className="max-w-4xl">

            {/* ── Tab bar ─────────────────────────────────────────────── */}
            <div className="mb-8 flex w-fit gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabClick(tab.key)}
                  className={
                    activeTab === tab.key
                      ? "rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white"
                      : "px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ══════════════════════════════════════════════════════════
                GENERAL — Account Settings
            ══════════════════════════════════════════════════════════ */}
            <div
              ref={(el) => { sectionRefs.current.general = el; }}
              id="section-general"
              className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <UserCog className="h-5 w-5 text-sky-600" />
                Account Settings
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        // Username mirrors email
                        setUsername(e.target.value);
                      }}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      disabled
                      title="Username matches your email address"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none bg-slate-50 text-slate-400 cursor-not-allowed dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400"
                    />
                    <p className="mt-1 text-xs text-slate-400">Same as your email address — updated automatically.</p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option>(UTC-05:00) Eastern Time (Jamaica)</option>
                    <option>(UTC-04:00) Atlantic Time</option>
                    <option>(UTC+00:00) London</option>
                    <option>(UTC+01:00) Central European Time</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                NOTIFICATIONS
            ══════════════════════════════════════════════════════════ */}
            <div
              ref={(el) => { sectionRefs.current.notifications = el; }}
              id="section-notifications"
              className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <Bell className="h-5 w-5 text-cyan-700" />
                Notification Preferences
              </h3>

              <div className="space-y-4">
                {[
                  {
                    label: "Email Notifications",
                    desc: "Receive updates about appointments and messages",
                    checked: emailNotifications,
                    setChecked: setEmailNotifications,
                  },
                  {
                    label: "SMS Notifications",
                    desc: "Get text alerts for urgent updates",
                    checked: smsNotifications,
                    setChecked: setSmsNotifications,
                  },
                  {
                    label: "Marketing Emails",
                    desc: "Receive updates about new features and resources",
                    checked: marketingEmails,
                    setChecked: setMarketingEmails,
                  },
                  {
                    label: "Appointment Reminders",
                    desc: "Send automatic reminders to clients",
                    checked: appointmentReminders,
                    setChecked: setAppointmentReminders,
                  },
                ].map(({ label, desc, checked, setChecked }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">{label}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                SECURITY
            ══════════════════════════════════════════════════════════ */}
            <div
              ref={(el) => { sectionRefs.current.security = el; }}
              id="section-security"
              className="mb-6 space-y-6"
            >
              {/* Password & 2FA */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                  <Shield className="h-5 w-5 text-amber-600" />
                  Security
                </h3>

                <div className="space-y-4">
                  {/* 2FA */}
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Two-factor authentication setup coming soon.")}
                      className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
                    >
                      Enable
                    </button>
                  </div>

                  {/* Change Password → Firebase reset */}
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Change Password</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        A reset link will be sent to{" "}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {currentUser?.email || email}
                        </span>
                      </p>
                      {resetMessage && (
                        <p
                          className={`mt-1 text-xs font-medium ${
                            resetMessage.ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {resetMessage.ok ? "✅ " : "❌ "}
                          {resetMessage.text}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={resetLoading}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {resetLoading ? "Sending…" : "Update"}
                    </button>
                  </div>

                  {/* Login History */}
                  <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div className="mb-3">
                      <p className="font-medium text-slate-800 dark:text-white">Login History</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Recent account activity from Firestore</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                        <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Last Login</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          {formatDate(lastLogin)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                        <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Device</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-white break-all">
                          {deviceInfo || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-950/20">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-red-800 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Danger Zone
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-400">Deactivate Account</p>
                      <p className="text-sm text-red-600/70 dark:text-red-400/70">Temporarily hide your profile from search</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Account deactivation flow coming soon.")}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/20"
                    >
                      Deactivate
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-400">Delete Account</p>
                      <p className="text-sm text-red-600/70 dark:text-red-400/70">Permanently delete your account and all data</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Account deletion flow coming soon.")}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                BILLING
            ══════════════════════════════════════════════════════════ */}
            <div
              ref={(el) => { sectionRefs.current.billing = el; }}
              id="section-billing"
              className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <CreditCard className="h-5 w-5 text-sky-600" />
                Billing &amp; Subscription
              </h3>

              {/* Current plan badge */}
              <div className="mb-6 flex items-center gap-4 rounded-xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-800 dark:bg-sky-900/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white text-xl shadow">
                  💳
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-sky-500">Current Plan</p>
                  <p className="text-xl font-bold text-sky-700 dark:text-sky-300">{currentPlan?.name}</p>
                  <p className="text-sm text-sky-600 dark:text-sky-400">
                    {currentPlan?.price === null
                      ? "Contact us for pricing"
                      : currentPlan?.price === 0
                      ? "Free forever"
                      : `$${currentPlan?.price}/month`}
                  </p>
                </div>
              </div>

              {/* Plan grid */}
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Choose a Plan
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`text-left rounded-xl border-2 p-4 transition-all duration-150 ${
                        selectedPlan === plan.id
                          ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                          : "border-slate-200 dark:border-slate-600 hover:border-sky-300 dark:hover:border-sky-700"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-semibold text-slate-800 dark:text-white">{plan.name}</span>
                        {selectedPlan === plan.id && (
                          <span className="text-xs font-medium text-sky-600">✓ Selected</span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{plan.description}</p>
                      <p className="mt-2 text-sm font-bold text-sky-600 dark:text-sky-400">
                        {plan.price === null ? "Custom" : plan.price === 0 ? "Free" : `$${plan.price}/mo`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card form — hidden for Free plan */}
              {selectedPlan !== "free" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-700/30">
                  <p className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Payment Details
                  </p>
                  <p className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
                    🔒 Your card details are encrypted. We never store raw card data.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        value={card.name}
                        onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={card.number}
                        onChange={(e) =>
                          setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))
                        }
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 font-mono outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                          Expiry
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={card.expiry}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                          CVC
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={card.cvc}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer actions ───────────────────────────────────────── */}
            <div className="mt-2 flex justify-end gap-4 pb-8">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-200 px-6 py-2 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-sky-600 px-6 py-2 font-medium text-white transition-colors hover:bg-sky-700"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* ── Global Toast ─────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-3 shadow-lg text-sm font-medium transition-all ${
            toast.ok
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          <span>{toast.ok ? "✅" : "❌"}</span>
          {toast.text}
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}
    </div>
  );
}
