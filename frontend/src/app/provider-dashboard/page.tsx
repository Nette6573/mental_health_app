"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseClient";
import { getAuth } from "firebase/auth";
import Link from 'next/link'
import {
  LayoutDashboard,
  User,
  Briefcase,
  Calendar,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  Bell,
  Eye,
  CalendarCheck,
  Star,
  MessageCircle,
  AlertCircle,
  Edit3,
  Plus,
  Clock,
  Church,
  CheckCircle,
  Circle,
} from 'lucide-react'

export default function ProviderDashboardPage() {
  const [userName, setUserName] = useState("");
 useEffect(() => {
  const auth = getAuth();

  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();               // ✅ get the data first
        const fullName = `${data.professional_title || ""} ${data.first_name || ""} ${data.last_name || ""}`.trim();
        setUserName(fullName || "User");
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No user logged in");
    }
  });

  return () => unsubscribe();
}, []);
  
  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 fixed h-full z-20 dark:bg-slate-800 dark:border-slate-700">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img
              src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png"
              alt="HopePath Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-lg"
            />
            <div>
              <h1 className="font-bold text-xl text-sky-600">HopePath</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">Provider Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link
            href="/provider-dashboard"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-sky-100 text-sky-600"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            href="/provider-dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <User className="w-5 h-5" />
            Profile
          </Link>

          <Link
            href="/provider-dashboard/services"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Briefcase className="w-5 h-5" />
            Services
          </Link>

          <Link
            href="/provider-dashboard/availability"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Calendar className="w-5 h-5" />
            Availability
          </Link>

          <Link
            href="/provider-dashboard/credentials"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <ShieldCheck className="w-5 h-5" />
            Verification
          </Link>

          <Link
            href="/provider-dashboard/messaging"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <MessageSquare className="w-5 h-5" />
            Messages
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">3</span>
          </Link>

          <Link
            href="/provider-dashboard/analytics"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Link>

          <Link
            href="/provider-dashboard/resources"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <BookOpen className="w-5 h-5" />
            Resources
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-1 dark:border-slate-700">
          <Link
            href="/provider-dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>

          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-8 py-4 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                   Welcome back, {userName || "Loading..."}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Here&apos;s your practice overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors dark:hover:bg-slate-700"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">
                    Dr. {userName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Clinical Psychologist
                  </p>
                </div>
                <img
                  src="http://static.photos/people/200x200/42"
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-sky-100"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8">
          {/* Verification Banner */}
          <div className="bg-gradient-to-r from-sky-100 to-cyan-100 border border-sky-200 rounded-xl p-4 flex items-center justify-between dark:from-sky-900/20 dark:to-cyan-900/20 dark:border-sky-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-200 rounded-lg dark:bg-sky-900/30">
                <AlertCircle className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="font-medium text-sky-700 dark:text-sky-300">Verification Pending</p>
                <p className="text-sm text-sky-600 dark:text-sky-400">
                  Please upload your credentials to complete verification
                </p>
              </div>
            </div>

            <Link
              href="/provider-dashboard/credentials"
              className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
            >
              Complete Now
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-sky-100 rounded-lg dark:bg-sky-900/20">
                  <Eye className="w-5 h-5 text-sky-600" />
                </div>
                <span className="text-xs font-medium text-sky-600 bg-sky-100 px-2 py-1 rounded-full dark:bg-sky-900/20">
                  +12%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">1,284</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Profile Views</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-cyan-100 rounded-lg dark:bg-cyan-900/20">
                  <CalendarCheck className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="text-xs font-medium text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full dark:bg-cyan-900/20">
                  +5%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">24</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Appointments</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 rounded-lg dark:bg-amber-900/20">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full dark:bg-amber-900/20">
                  4.9
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">4.9</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Rating</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/20">
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full dark:bg-orange-900/20">
                  3 new
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">8</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Messages</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Appointments */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Upcoming Appointments</h3>
                  <Link
                    href="/provider-dashboard/availability"
                    className="text-sm text-sky-600 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors dark:hover:bg-slate-700/50">
                    <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center dark:bg-sky-900/20">
                      <span className="font-semibold text-sky-600">10:00</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-white">Marcus Thompson</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Individual Therapy • Virtual
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-sky-100 text-sky-600 text-xs rounded-full dark:bg-sky-900/20">
                      Confirmed
                    </span>
                  </div>

                  <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors dark:hover:bg-slate-700/50">
                    <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center dark:bg-sky-900/20">
                      <span className="font-semibold text-sky-600">14:00</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-white">Jennifer Brown</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Marriage Counseling • In Person
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full dark:bg-orange-900/20">
                      Pending
                    </span>
                  </div>

                  <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors dark:hover:bg-slate-700/50">
                    <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center dark:bg-sky-900/20">
                      <span className="font-semibold text-sky-600">16:30</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-white">David Williams</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Grief Support • Virtual
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Recent Messages</h3>
                  <Link
                    href="/provider-dashboard/messaging"
                    className="text-sm text-sky-600 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  <div className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer dark:hover:bg-slate-700/50">
                    <img
                      src="http://static.photos/people/200x200/15"
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-slate-800 dark:text-white">Emily Clarke</p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">2h ago</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 dark:text-slate-300">
                        Hello Dr. Thomas, I&apos;m interested in scheduling a session for my daughter.
                        She&apos;s been dealing with anxiety...
                      </p>
                    </div>
                    <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2" />
                  </div>

                  <div className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer dark:hover:bg-slate-700/50">
                    <img
                      src="http://static.photos/people/200x200/22"
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-slate-800 dark:text-white">Robert Taylor</p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">5h ago</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 dark:text-slate-300">
                        Thank you for yesterday&apos;s session. I wanted to ask about the homework
                        exercises you mentioned...
                      </p>
                    </div>
                    <span className="w-2 h-2 bg-sky-500 rounded-full mt-2" />
                  </div>
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
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-sky-600 bg-sky-100 dark:bg-sky-900/20">
                        In Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-sky-600 dark:text-sky-300">
                        75%
                      </span>
                    </div>
                  </div>

                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100 dark:bg-slate-700">
                    <div
                      style={{ width: '75%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-sky-500 to-cyan-500"
                    />
                  </div>

                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-green-600 dark:text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      Basic Information
                    </li>
                    <li className="flex items-center gap-2 text-green-600 dark:text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      Services Added
                    </li>
                    <li className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                      <Circle className="w-4 h-4" />
                      Verification Documents
                    </li>
                    <li className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                      <Circle className="w-4 h-4" />
                      Availability Calendar
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 dark:bg-slate-800 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h3>

                <div className="space-y-3">
                  <Link
                    href="/provider-dashboard/profile"
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 transition-colors group dark:border-slate-700 dark:hover:border-sky-500 dark:hover:bg-sky-900/10"
                  >
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white dark:bg-slate-700 dark:group-hover:bg-slate-600">
                      <Edit3 className="w-4 h-4 text-slate-600 group-hover:text-sky-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">Edit Profile</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Update your information</p>
                    </div>
                  </Link>

                  <Link
                    href="/provider-dashboard/services"
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 transition-colors group dark:border-slate-700 dark:hover:border-sky-500 dark:hover:bg-sky-900/10"
                  >
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white dark:bg-slate-700 dark:group-hover:bg-slate-600">
                      <Plus className="w-4 h-4 text-slate-600 group-hover:text-sky-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">Add Service</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Create new offering</p>
                    </div>
                  </Link>

                  <Link
                    href="/provider-dashboard/availability"
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 transition-colors group dark:border-slate-700 dark:hover:border-sky-500 dark:hover:bg-sky-900/10"
                  >
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white dark:bg-slate-700 dark:group-hover:bg-slate-600">
                      <Clock className="w-4 h-4 text-slate-600 group-hover:text-sky-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">Set Hours</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage availability</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Faith Integration */}
              <div className="bg-gradient-to-br from-amber-100 to-sky-100 rounded-xl p-6 border border-amber-200 dark:from-amber-900/20 dark:to-sky-900/20 dark:border-amber-800">
                <div className="flex items-center gap-3 mb-3">
                  <Church className="w-6 h-6 text-amber-600" />
                  <h3 className="font-semibold text-slate-800 dark:text-white">Faith Resources</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4 dark:text-slate-300">
                  Access biblical counseling resources and faith-based intervention guides.
                </p>
                <Link
                  href="/provider-dashboard/resources"
                  className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
                >
                  Browse Library →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
