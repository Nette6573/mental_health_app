"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
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

type TabKey = "general" | "notifications" | "security" | "billing";

export default function ProviderSettingsPage() {
  const { user } = useAuth() as any;
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [isSaving, setIsSaving] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [timezone, setTimezone] = useState("");
  const [language, setLanguage] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

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

      try {
        // Fetch from providers collection
        const providerRef = doc(db, "providers", user.id);
        const providerSnap = await getDoc(providerRef);

        if (providerSnap.exists()) {
          const providerData = providerSnap.data();
          setEmail(providerData.professional_email || "");
          // Mapping first and last name to the username field for display
          setUsername(`${providerData.first_name || ""} ${providerData.last_name || ""}`.trim());
        }

        // Fetch from provider_settings collection
        const settingsRef = doc(db, "provider_settings", user.id);
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const settingsData = settingsSnap.data();
          
          setTimezone(settingsData.timezone || "");
          setLanguage(settingsData.settings_language || "");

          // Convert string values back to boolean for UI toggles
          setEmailNotifications(settingsData.email_notification === "true");
          setSmsNotifications(settingsData.sms_notification === "true");
          setMarketingEmails(settingsData.marketing_emails === "true");
          setAppointmentReminders(settingsData.appointment_reminders === "true");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettingsData();
  }, [user]);

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
    router.replace("/provider-dashboard/login");
  };

  // ── Save Data to respective collections ──
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const providerRef = doc(db, "providers", user.id);
      const settingsRef = doc(db, "provider_settings", user.id);

      // We use Promise.all to run both updates concurrently
      await Promise.all([
        setDoc(
          providerRef,
          {
            professional_email: email,
            // Omitting username here so we don't accidentally overwrite first_name/last_name
          },
          { merge: true }
        ),
        setDoc(
          settingsRef,
          {
            timezone: timezone,
            settings_language: language,
            // Storing as strings based on your schema requirements
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
      badge: "3",
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

  const tabs: { key: TabKey; label: string }[] = [
    { key: "general", label: "General" },
    { key: "notifications", label: "Notifications" },
    { key: "security", label: "Security" },
    { key: "billing", label: "Billing" },
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
            <Image
              src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png"
              alt="HopePath Logo"
              width={40}
              height={40}
              className="rounded-xl object-cover shadow-lg"
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

      <main className="flex-1 overflow-y-auto md:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Settings
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your account preferences
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleMobileSidebar}
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

        <div className="max-w-4xl p-4 sm:p-8">
          <div className="mb-8 flex w-fit gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
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

          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <UserCog className="h-5 w-5 text-sky-600" />
              Account Settings
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
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
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="timezone"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select your timezone</option>
                  <option>(UTC-05:00) Eastern Time (Jamaica)</option>
                  <option>(UTC-04:00) Atlantic Time</option>
                  <option>(UTC+00:00) London</option>
                  <option>(UTC+01:00) Central European Time</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="language"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select your language</option>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <Bell className="h-5 w-5 text-cyan-700" />
              Notification Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    Email Notifications
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Receive updates about appointments and messages
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="peer sr-only"
                    aria-label="Email Notifications"
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-600" />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    SMS Notifications
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Get text alerts for urgent updates
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="peer sr-only"
                    aria-label="SMS Notifications"
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-600" />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    Marketing Emails
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Receive updates about new features and resources
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                    className="peer sr-only"
                    aria-label="Marketing Emails"
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-600" />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    Appointment Reminders
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Send automatic reminders to clients
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={appointmentReminders}
                    onChange={(e) => setAppointmentReminders(e.target.checked)}
                    className="peer sr-only"
                    aria-label="Appointment Reminders"
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-600" />
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <Shield className="h-5 w-5 text-amber-600" />
              Security
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Two-factor authentication setup coming soon.")}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
                >
                  Enable
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    Change Password
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Last changed 3 months ago
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Password update flow coming soon.")}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Update
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    Login History
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    View recent account activity
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Login history view coming soon.")}
                  className="text-sm text-sky-600 hover:underline"
                >
                  View History
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-950/20">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-red-800 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Danger Zone
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-red-800 dark:text-red-400">
                    Deactivate Account
                  </p>
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
                  <p className="font-medium text-red-800 dark:text-red-400">
                    Delete Account
                  </p>
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

          <div className="mt-8 flex justify-end gap-4 pb-8">
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
              className="rounded-lg bg-sky-600 px-6 py-2 font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
