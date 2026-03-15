"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  Award,
  BarChart3,
  BookMarked,
  BookOpen,
  Briefcase,
  Calendar,
  Church,
  ClipboardList,
  GraduationCap,
  Heart,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Quote,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  Video,
} from "lucide-react";

type ResourceCategory = {
  id: number;
  title: string;
  count: string;
  icon: React.ComponentType<{ className?: string }>;
  borderHover: string;
  bg: string;
  text: string;
};

type FeaturedResource = {
  id: number;
  title: string;
  description: string;
  meta: string;
  action: string;
  actionColor: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
};

type Devotional = {
  id: number;
  verse: string;
  text: string;
  recommendedFor: string;
  themeBg: string;
  themeBorder: string;
  themeText: string;
};

export default function ProviderResourcesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
      active: true,
    },
  ];

  const categories: ResourceCategory[] = [
    {
      id: 1,
      title: "Biblical Counseling",
      count: "12 resources",
      icon: BookOpen,
      borderHover: "hover:border-sky-600",
      bg: "bg-sky-600/10",
      text: "text-sky-600",
    },
    {
      id: 2,
      title: "Self-Care",
      count: "8 resources",
      icon: Heart,
      borderHover: "hover:border-cyan-700",
      bg: "bg-cyan-700/10",
      text: "text-cyan-700",
    },
    {
      id: 3,
      title: "Faith Integration",
      count: "15 resources",
      icon: Church,
      borderHover: "hover:border-amber-600",
      bg: "bg-amber-600/10",
      text: "text-amber-600",
    },
    {
      id: 4,
      title: "Assessment Tools",
      count: "6 resources",
      icon: ClipboardList,
      borderHover: "hover:border-amber-500",
      bg: "bg-amber-500/10",
      text: "text-amber-500",
    },
  ];

  const featuredResources: FeaturedResource[] = [
    {
      id: 1,
      title: "Faith-Based CBT Workbook",
      description:
        "Integrating cognitive behavioral therapy with biblical principles for anxiety and depression.",
      meta: "PDF • 2.4 MB",
      action: "Download",
      actionColor: "text-sky-600",
      icon: BookMarked,
      iconBg: "bg-gradient-to-br from-sky-600/20 to-cyan-700/20",
      iconColor: "text-sky-600",
    },
    {
      id: 2,
      title: "Grief Support Video Series",
      description:
        "Christian perspective on processing loss and finding hope through faith.",
      meta: "Video • 45 min",
      action: "Watch",
      actionColor: "text-amber-600",
      icon: Video,
      iconBg: "bg-gradient-to-br from-amber-600/20 to-amber-500/20",
      iconColor: "text-amber-600",
    },
    {
      id: 3,
      title: "Marriage Counseling Guide",
      description:
        "Scriptural foundations for couples therapy and conflict resolution.",
      meta: "PDF • 1.8 MB",
      action: "Download",
      actionColor: "text-cyan-700",
      icon: BookOpen,
      iconBg: "bg-gradient-to-br from-cyan-700/20 to-sky-600/20",
      iconColor: "text-cyan-700",
    },
    {
      id: 4,
      title: "Depression Screening Tool",
      description:
        "Faith-sensitive assessment questionnaire for initial consultations.",
      meta: "Interactive",
      action: "Open",
      actionColor: "text-amber-500",
      icon: Activity,
      iconBg: "bg-gradient-to-br from-amber-500/20 to-amber-600/20",
      iconColor: "text-amber-500",
    },
  ];

  const devotionals: Devotional[] = [
    {
      id: 1,
      verse: "Psalm 34:18",
      text: `"The Lord is close to the brokenhearted and saves those who are crushed in spirit."`,
      recommendedFor: "Grief counseling, depression support",
      themeBg: "bg-amber-600/5 dark:bg-amber-600/10",
      themeBorder: "border-amber-600/20 dark:border-amber-600/30",
      themeText: "text-amber-600",
    },
    {
      id: 2,
      verse: "Philippians 4:6-7",
      text: `"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."`,
      recommendedFor: "Anxiety management, stress relief",
      themeBg: "bg-sky-600/5 dark:bg-sky-600/10",
      themeBorder: "border-sky-600/20 dark:border-sky-600/30",
      themeText: "text-sky-600",
    },
    {
      id: 3,
      verse: "1 Corinthians 13:4-8",
      text: `"Love is patient, love is kind. It does not envy, it does not boast, it is not proud."`,
      recommendedFor: "Marriage counseling, relationship issues",
      themeBg: "bg-cyan-700/5 dark:bg-cyan-700/10",
      themeBorder: "border-cyan-700/20 dark:border-cyan-700/30",
      themeText: "text-cyan-700",
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
                onClick={() => setMobileSidebarOpen(false)}
                className={
                  item.active
                    ? "flex items-center gap-3 rounded-lg bg-sky-600/10 px-4 py-3 text-sm font-medium text-sky-600"
                    : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                }
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
                Faith & Professional Resources
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tools and materials for your practice
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

        <div className="p-4 sm:p-8">
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={`rounded-xl border border-slate-200 bg-white p-4 text-center transition-colors dark:border-slate-700 dark:bg-slate-800 ${category.borderHover}`}
                >
                  <div className={`mx-auto mb-2 w-fit rounded-full p-3 ${category.bg}`}>
                    <Icon className={`h-6 w-6 ${category.text}`} />
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">
                    {category.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {category.count}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  Featured Resources
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {featuredResources.map((resource) => {
                    const Icon = resource.icon;

                    return (
                      <div
                        key={resource.id}
                        className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-colors hover:border-sky-600 dark:border-slate-700 dark:hover:border-sky-600"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`rounded-lg p-3 ${resource.iconBg}`}>
                            <Icon className={`h-6 w-6 ${resource.iconColor}`} />
                          </div>

                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800 transition-colors group-hover:text-sky-600 dark:text-white">
                              {resource.title}
                            </h4>
                            <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                              {resource.description}
                            </p>
                            <div className="mt-3 flex items-center gap-3">
                              <span className="text-xs text-slate-500 dark:text-slate-500">
                                {resource.meta}
                              </span>
                              <button
                                type="button"
                                className={`text-xs hover:underline ${resource.actionColor}`}
                              >
                                {resource.action}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                  <Church className="h-5 w-5 text-amber-600" />
                  Daily Devotionals for Clients
                </h3>

                <div className="space-y-4">
                  {devotionals.map((devotional) => (
                    <div
                      key={devotional.id}
                      className={`rounded-lg border p-4 ${devotional.themeBg} ${devotional.themeBorder}`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Quote className={`h-4 w-4 ${devotional.themeText}`} />
                        <span className={`text-sm font-medium ${devotional.themeText}`}>
                          {devotional.verse}
                        </span>
                      </div>
                      <p className="text-sm italic text-slate-700 dark:text-slate-300">
                        {devotional.text}
                      </p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Recommended for: {devotional.recommendedFor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-sky-600/20 bg-gradient-to-br from-sky-600/10 to-cyan-700/10 p-6 dark:border-sky-600/30 dark:from-sky-600/20 dark:to-cyan-700/20">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                  <HeartPulse className="h-5 w-5 text-sky-600" />
                  Provider Self-Care
                </h3>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                  Remember to care for yourself as you care for others.
                </p>

                <div className="space-y-3">
                  <a
                    href="#"
                    className="block rounded-lg bg-white/70 p-3 transition-colors hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-700"
                  >
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      Burnout Prevention Guide
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      5 min read
                    </p>
                  </a>

                  <a
                    href="#"
                    className="block rounded-lg bg-white/70 p-3 transition-colors hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-700"
                  >
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      Spiritual Renewal Exercises
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Meditation audio
                    </p>
                  </a>

                  <a
                    href="#"
                    className="block rounded-lg bg-white/70 p-3 transition-colors hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-700"
                  >
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      Peer Support Network
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Join community
                    </p>
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                  <GraduationCap className="h-5 w-5 text-cyan-700" />
                  Continuing Education
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-cyan-700/10 p-2">
                      <Calendar className="h-4 w-4 text-cyan-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        Faith & Therapy Workshop
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        March 20, 2026 • Virtual
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-sky-600/10 p-2">
                      <Award className="h-4 w-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        Certification: Christian Counseling
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        6-week course • Self-paced
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-4 font-semibold text-slate-800 dark:text-white">
                  Provider Community
                </h3>
                <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                  Connect with other faith-based mental health professionals in Jamaica.
                </p>
                <button
                  type="button"
                  className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
                >
                  Join Discussion Forum
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}