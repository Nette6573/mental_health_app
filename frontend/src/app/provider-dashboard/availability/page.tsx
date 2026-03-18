"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

type DaySchedule = {
  day: string;
  available: boolean;
  start: string;
  end: string;
};

export default function ProviderAvailabilityPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: "Monday", available: true, start: "09:00", end: "17:00" },
    { day: "Tuesday", available: true, start: "09:00", end: "17:00" },
    { day: "Wednesday", available: true, start: "09:00", end: "17:00" },
    { day: "Thursday", available: true, start: "09:00", end: "17:00" },
    { day: "Friday", available: true, start: "09:00", end: "16:00" },
    { day: "Saturday", available: false, start: "10:00", end: "14:00" },
    { day: "Sunday", available: false, start: "14:00", end: "18:00" },
  ]);

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

  const handleSaveChanges = () => {
    console.log("Saved availability settings:", schedule);
    alert("Availability changes saved.");
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
    {
      href: "/provider-dashboard/resources",
      label: "Resources",
      icon: BookOpen,
    },
  ];

  const upcomingWeek = [
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

  const blockedDates = [
    {
      title: "Public Holiday",
      date: "Aug 6, 2026",
    },
    {
      title: "Vacation",
      date: "Aug 15-20, 2026",
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

      <main className="flex-1 overflow-y-auto md:ml-64">
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
                onClick={toggleMobileSidebar}
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
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
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
                          <span className="self-center text-slate-400">to</span>
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
                      defaultValue="60 minutes"
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
                      defaultValue="15 minutes"
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
                      defaultValue="24 hours"
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
                      defaultValue="1 month"
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

            <div className="space-y-6">
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

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                  <CalendarX className="h-5 w-5 text-red-500" />
                  Blocked Dates
                </h3>

                <div className="space-y-2">
                  {blockedDates.map((item) => (
                    <div
                      key={`${item.title}-${item.date}`}
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
                        className="text-red-500 transition-colors hover:text-red-700"
                        aria-label={`Remove ${item.title}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  + Add Blocked Date
                </button>
              </div>

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
                      128 hrs
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">
                      Booked
                    </span>
                    <span className="font-medium text-slate-800 dark:text-white">
                      76 hrs
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">
                      Available
                    </span>
                    <span className="font-medium text-sky-600">52 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}