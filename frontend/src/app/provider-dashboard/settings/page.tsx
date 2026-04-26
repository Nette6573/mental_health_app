"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/firebaseClient";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc, addDoc, collection, query, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
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
  X,
} from "lucide-react";

type TabKey = "general" | "notifications" | "security" | "billing";

interface LoginEntry {
  timestamp: Date;
  device?: string;
}

export default function ProviderSettingsPage() {
  const { user } = useAuth() as any;
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [timezone, setTimezone] = useState("");
  const [language, setLanguage] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  // Section refs for scroll-to behaviour
  const generalRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const securityRef = useRef<HTMLDivElement | null>(null);
  const billingRef = useRef<HTMLDivElement | null>(null);

  const sectionRefs: Record<TabKey, React.RefObject<HTMLDivElement | null>> = {
    general: generalRef,
    notifications: notificationsRef,
    security: securityRef,
    billing: billingRef,
  };

  // ── Security: redirect unauthenticated users ──
  useEffect(() => {
    if (user === null) {
      router.replace("/provider-dashboard/login");
    }
  }, [user, router]);

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

  // ── Fetch Data from providers & provider_settings ──
  useEffect(() => {
    const fetchSettingsData = async () => {
      if (!user) return;
      const uid = user.uid ?? user.id;

      try {
        const providerRef = doc(db, "providers", uid);
        const providerSnap = await getDoc(providerRef);

        if (providerSnap.exists()) {
          const providerData = providerSnap.data();
          setEmail(providerData.professional_email || "");
          setUsername(
            `${providerData.first_name || ""} ${providerData.last_name || ""}`.trim()
          );
        }

        const settingsRef = doc(db, "provider_settings", uid);
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const settingsData = settingsSnap.data();
          setTimezone(settingsData.timezone || "");
          setLanguage(settingsData.settings_language || "");
          setEmailNotifications(settingsData.email_notification === "true");
          setSmsNotifications(settingsData.sms_notification === "true");
          setMarketingEmails(settingsData.marketing_emails === "true");
          setAppointmentReminders(settingsData.appointment_reminders === "true");
        }

        // ── Record this session in login_history subcollection ──
        const historyRef = collection(db, "provider_settings", uid, "login_history");
        await addDoc(historyRef, {
          timestamp: serverTimestamp(),
          device_info:
            typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
        });

        // Also keep last_login field on the settings doc in sync
        await setDoc(
          settingsRef,
          { last_login: serverTimestamp() },
          { merge: true }
        );
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettingsData();
  }, [user]);

  // ── Tab click → smooth scroll to section ──
  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
    const ref = sectionRefs[tab];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ── Update active tab based on scroll position ──
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120; // offset for sticky header + tabs

      const order: TabKey[] = ["general", "notifications", "security", "billing"];
      for (let i = order.length - 1; i >= 0; i--) {
        const ref = sectionRefs[order[i]];
        if (ref.current && ref.current.offsetTop <= scrollY) {
          setActiveTab(order[i]);
          break;
        }
      }
    };

    // Attach to the scrollable main container
    const mainEl = document.getElementById("settings-main");
    if (mainEl) {
      mainEl.addEventListener("scroll", handleScroll);
      return () => mainEl.removeEventListener("scroll", handleScroll);
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

  const logout = () => {
    router.replace("/provider-dashboard/login");
  };

  // ── Save Data ──
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const uid = user.uid ?? user.id;
      const providerRef = doc(db, "providers", uid);
      const settingsRef = doc(db, "provider_settings", uid);

      await Promise.all([
        setDoc(
          providerRef,
          { professional_email: email },
          { merge: true }
        ),
        setDoc(
          settingsRef,
          {
            timezone,
            settings_language: language,
            email_notification: String(emailNotifications),
            sms_notification: String(smsNotifications),
            marketing_emails: String(marketingEmails),
            appointment_reminders: String(appointmentReminders),
          },
          { merge: true }
        ),
      ]);

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  // ── Password reset email ──
  const handlePasswordReset = async () => {
    if (!email) {
      alert("No email address found on your account.");
      return;
    }
    setIsSendingReset(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      alert(
        "Please check your email for a link to reset your password. If not seen in your inbox, please check your spam folder."
      );
    } catch (error: any) {
      console.error("Password reset error:", error);
      alert("Failed to send reset email. Please try again.");
    } finally {
      setIsSendingReset(false);
    }
  };

  // ── Login history ──
  const handleViewHistory = async () => {
    setShowLoginHistory(true);
    setLoadingHistory(true);
    try {
      const uid = user?.uid ?? user?.id;
      if (!uid) return;

      // Attempt to read login_history subcollection under provider_settings
      const historyRef = collection(db, "provider_settings", uid, "login_history");
      const q = query(historyRef, orderBy("timestamp", "desc"), limit(20));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const entries: LoginEntry[] = snap.docs.map((d) => ({
          timestamp: d.data().timestamp?.toDate?.() ?? new Date(d.data().timestamp),
          device: d.data().device_info || undefined,
        }));
        setLoginHistory(entries);
      } else {
        // Fallback: use the last_login field stored in provider_settings
        const settingsRef = doc(db, "provider_settings", uid);
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          const entries: LoginEntry[] = [];
          if (data.last_login) {
            entries.push({
              timestamp: data.last_login?.toDate?.() ?? new Date(data.last_login),
              device: data.device_info || undefined,
            });
          }
          setLoginHistory(entries);
        }
      }
    } catch (error) {
      console.error("Error fetching login history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const navItems = [
    { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider-dashboard/profile", label: "Profile", icon: User },
    { href: "/provider-dashboard/services", label: "Services", icon: Briefcase },
    { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar },
    { href: "/provider-dashboard/credentials", label: "Verification", icon: ShieldCheck },
    { href: "/provider-dashboard/messaging", label: "Messages", icon: MessageSquare, badge: "3" },
    { href: "/provider-dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/provider-dashboard/resources", label: "Resources", icon: BookOpen },
  ];

  const tabs: { key: TabKey; label: string }[] = [
    { key: "general", label: "General" },
    { key: "notifications", label: "Notifications" },
    { key: "security", label: "Security" },
    { key: "billing", label: "Billing" },
  ];

  const formatLoginDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
      {mobileSidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800 md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:flex`}
      >
        <div className="border-b border-slate-100 p-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Image
              src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png"
              alt="HopePath Logo"
              width={40}
              height={40}
              className="rounded-xl object-cover shadow-lg"
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
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main
        id="settings-main"
        className="flex-1 overflow-y-auto md:ml-64"
      >
        {/* Sticky header + tabs */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <header className="px-4 py-4 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Settings</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage your account preferences
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

          {/* Tab bar */}
          <div className="px-4 sm:px-8 pb-0">
            <div className="flex w-fit gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-700/60">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabClick(tab.key)}
                  className={
                    activeTab === tab.key
                      ? "rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm dark:bg-slate-600 dark:text-white"
                      : "px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-6 p-4 sm:p-8">

          {/* ── GENERAL ── */}
          <div
            ref={generalRef}
            id="section-general"
            className="scroll-mt-36 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <UserCog className="h-5 w-5 text-sky-600" />
              Account Settings
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Full Name
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="timezone" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select your timezone</option>
                  <option value="UTC-5">(UTC-05:00) Eastern Time (Jamaica)</option>
                  <option value="UTC-4">(UTC-04:00) Atlantic Time</option>
                  <option value="UTC+0">(UTC+00:00) London</option>
                  <option value="UTC+1">(UTC+01:00) Central European Time</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select your language</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── NOTIFICATIONS ── */}
          <div
            ref={notificationsRef}
            id="section-notifications"
            className="scroll-mt-36 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
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
                  setter: setEmailNotifications,
                },
                {
                  label: "SMS Notifications",
                  desc: "Get text alerts for urgent updates",
                  checked: smsNotifications,
                  setter: setSmsNotifications,
                },
                {
                  label: "Marketing Emails",
                  desc: "Receive updates about new features and resources",
                  checked: marketingEmails,
                  setter: setMarketingEmails,
                },
                {
                  label: "Appointment Reminders",
                  desc: "Send automatic reminders to clients",
                  checked: appointmentReminders,
                  setter: setAppointmentReminders,
                },
              ].map(({ label, desc, checked, setter }) => (
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
                      onChange={(e) => setter(e.target.checked)}
                      className="peer sr-only"
                      aria-label={label}
                    />
                    <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-600" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECURITY ── */}
          <div
            ref={securityRef}
            id="section-security"
            className="scroll-mt-36 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <Shield className="h-5 w-5 text-amber-600" />
              Security
            </h3>

            <div className="space-y-4">
              {/* Change Password */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Change Password</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Send a password reset link to your email
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isSendingReset}
                  onClick={handlePasswordReset}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {isSendingReset ? "Sending…" : "Update"}
                </button>
              </div>

              {/* Login History */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">Login History</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    View recent account activity
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleViewHistory}
                  className="text-sm text-sky-600 hover:underline"
                >
                  View History
                </button>
              </div>
            </div>
          </div>

          {/* ── BILLING ── */}
          <div
            ref={billingRef}
            id="section-billing"
            className="scroll-mt-36 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <Briefcase className="h-5 w-5 text-emerald-600" />
              Billing
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Billing management features are coming soon.
            </p>
          </div>

          {/* ── DANGER ZONE ── */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-950/20">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-red-800 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Danger Zone
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-red-800 dark:text-red-400">Deactivate Account</p>
                  <p className="text-sm text-red-600/70 dark:text-red-400/70">
                    Temporarily hide your profile from search
                  </p>
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
                  <p className="text-sm text-red-600/70 dark:text-red-400/70">
                    Permanently delete your account and all data
                  </p>
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

          {/* ── Save / Cancel ── */}
          <div className="flex justify-end gap-4 pb-8">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-slate-200 px-6 py-2 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="rounded-lg bg-sky-600 px-6 py-2 font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </main>

      {/* ── Login History Modal ── */}
      {showLoginHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
              <h3 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <Clock className="h-5 w-5 text-sky-600" />
                Login History
              </h3>
              <button
                onClick={() => setShowLoginHistory(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-5">
              {loadingHistory ? (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading history…
                </p>
              ) : loginHistory.length === 0 ? (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  No login history found.
                </p>
              ) : (
                <ul className="space-y-3">
                  {loginHistory.map((entry, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-700"
                    >
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          {formatLoginDate(entry.timestamp)}
                        </p>
                        {entry.device && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {entry.device}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-slate-200 p-4 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setShowLoginHistory(false)}
                className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
