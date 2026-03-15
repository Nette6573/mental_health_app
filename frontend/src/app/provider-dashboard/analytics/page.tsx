"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  CalendarCheck,
  DollarSign,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Settings,
  ShieldCheck,
  Star,
  Sun,
  User,
  Users,
  Video,
} from "lucide-react";

export default function ProviderAnalyticsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const appointmentsChartRef = useRef<HTMLCanvasElement | null>(null);
  const servicesChartRef = useRef<HTMLCanvasElement | null>(null);

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

  useEffect(() => {
    if (!appointmentsChartRef.current || !servicesChartRef.current) return;

    const textColor = darkMode ? "#cbd5e1" : "#475569";
    const gridColor = darkMode
      ? "rgba(148, 163, 184, 0.15)"
      : "rgba(0, 0, 0, 0.05)";

    const appointmentsChart = new Chart(appointmentsChartRef.current, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Appointments",
            data: [12, 19, 15, 25],
            borderColor: "#2596be",
            backgroundColor: "rgba(37, 150, 190, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });

    const servicesChart = new Chart(servicesChartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Individual", "Marriage", "Family", "Group"],
        datasets: [
          {
            data: [45, 30, 15, 10],
            backgroundColor: ["#2596be", "#1e7fa3", "#d97706", "#f59e0b"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: textColor,
            },
          },
        },
      },
    });

    return () => {
      appointmentsChart.destroy();
      servicesChart.destroy();
    };
  }, [darkMode]);

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
      active: true,
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
                Analytics Dashboard
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Track your practice performance
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

              <select className="rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                <option>Last 7 days</option>
                <option defaultValue="selected">Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>This year</option>
              </select>
            </div>
          </div>
        </header>

        <div className="space-y-8 p-4 sm:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-sky-600/10 p-2">
                  <CalendarCheck className="h-5 w-5 text-sky-600" />
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                  +18%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                48
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Sessions
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-cyan-700/10 p-2">
                  <Users className="h-5 w-5 text-cyan-700" />
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                  +12%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                32
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Unique Clients
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-amber-600/10 p-2">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
                <span className="rounded-full bg-amber-600/10 px-2 py-1 text-xs font-medium text-amber-600">
                  4.9
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                28
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                New Reviews
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                  +24%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                $720K
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Revenue (JMD)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 font-semibold text-slate-800 dark:text-white">
                Appointment Trends
              </h3>
              <div className="relative h-[250px]">
                <canvas ref={appointmentsChartRef} />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 font-semibold text-slate-800 dark:text-white">
                Services Breakdown
              </h3>
              <div className="relative h-[250px]">
                <canvas ref={servicesChartRef} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 font-semibold text-slate-800 dark:text-white">
                Client Demographics
              </h3>

              <div className="space-y-4">
                {[
                  { label: "Age 18-25", value: "15%", width: "15%", color: "bg-sky-600" },
                  { label: "Age 26-35", value: "32%", width: "32%", color: "bg-cyan-700" },
                  { label: "Age 36-50", value: "38%", width: "38%", color: "bg-amber-600" },
                  { label: "Age 51+", value: "15%", width: "15%", color: "bg-amber-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        {item.label}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-white">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 font-semibold text-slate-800 dark:text-white">
                Session Types
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-sky-600/10 p-2">
                      <User className="h-4 w-4 text-sky-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      Individual Therapy
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    24
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-700/10 p-2">
                      <Heart className="h-4 w-4 text-cyan-700" />
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      Marriage Counseling
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    16
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-600/10 p-2">
                      <Users className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      Family Therapy
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    8
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-500/10 p-2">
                      <Video className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      Virtual Sessions
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    32
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 font-semibold text-slate-800 dark:text-white">
                Top Performing Days
              </h3>

              <div className="space-y-4">
                {[
                  {
                    short: "Mon",
                    label: "Monday",
                    sessions: "12 sessions",
                    bg: "bg-sky-600/10",
                    text: "text-sky-600",
                  },
                  {
                    short: "Tue",
                    label: "Tuesday",
                    sessions: "10 sessions",
                    bg: "bg-cyan-700/10",
                    text: "text-cyan-700",
                  },
                  {
                    short: "Wed",
                    label: "Wednesday",
                    sessions: "9 sessions",
                    bg: "bg-amber-600/10",
                    text: "text-amber-600",
                  },
                  {
                    short: "Thu",
                    label: "Thursday",
                    sessions: "11 sessions",
                    bg: "bg-amber-500/10",
                    text: "text-amber-500",
                  },
                  {
                    short: "Fri",
                    label: "Friday",
                    sessions: "6 sessions",
                    bg: "bg-slate-100 dark:bg-slate-700",
                    text: "text-slate-600 dark:text-slate-400",
                  },
                ].map((day) => (
                  <div key={day.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${day.bg} ${day.text}`}
                      >
                        {day.short}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {day.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {day.sessions}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}