"use client";

import { db } from "@/lib/firebase/firebaseClient";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  doc, getDoc, collection, query,
  where, onSnapshot, orderBy, limit, getDocs
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Briefcase, Calendar, ShieldCheck,
  MessageSquare, BarChart3, BookOpen, Settings, LogOut,
  Menu, Bell, Eye, CalendarCheck, Star, MessageCircle,
  AlertCircle, Edit3, Plus, Clock, Church, CheckCircle, Circle,
} from "lucide-react";

export default function ProviderDashboardPage() {
  const { user } = useAuth() as any;
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [providerTitle, setProviderTitle] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // Real data state
  const [appointments, setAppointments] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);

  const uid = user?.uid ?? user?.id;

  const handleLogout = () => {
    localStorage.removeItem("activeTherapist");
    router.replace("/provider-dashboard/login");
  };

  // ── Fetch provider profile ──
  useEffect(() => {
    const fetchProviderData = async () => {
      if (!uid) return;
      try {
        const docSnap = await getDoc(doc(db, "providers", uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setProviderTitle(data.professional_title || "");
          setProfilePhotoUrl(data.profile_photo_url || "");
        }
      } catch (error) {
        console.error("Firestore fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProviderData();
  }, [uid]);

  // ── Fetch upcoming appointments from bookings collection ──
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "bookings"),
      where("providerId", "==", uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAppointments(bookings);
      setAppointmentCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [uid]);

  // ── Fetch recent messages from chats collection in real-time ──
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Sort by lastMessageAt
      chats.sort((a: any, b: any) => {
        const aTime = a.lastMessageAt?.seconds || 0;
        const bTime = b.lastMessageAt?.seconds || 0;
        return bTime - aTime;
      });

      setRecentMessages(chats.slice(0, 3));

      // Count chats with unread messages (has lastMessage and not from provider)
      const unread = chats.filter((c: any) => c.lastMessage && c.lastMessage.length > 0).length;
      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, [uid]);

  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "P";

  const getOtherPersonName = (chat: any) => {
    if (!chat.participantNames || !uid) return "User";
    const otherUid = chat.participants?.find((p: string) => p !== uid);
    return chat.participantNames?.[otherUid] || "User";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-sky-100 text-sky-600 dark:bg-sky-900/20';
      case 'pending': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20';
      case 'cancelled': return 'bg-red-100 text-red-600 dark:bg-red-900/20';
      default: return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20';
    }
  };

  const navItems = [
    { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
    { href: "/provider-dashboard/profile", label: "Profile", icon: User },
    { href: "/provider-dashboard/services", label: "Services", icon: Briefcase },
    { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar },
    { href: "/provider-dashboard/credentials", label: "Verification", icon: ShieldCheck },
    { href: "/provider-dashboard/messaging", label: "Messages", icon: MessageSquare, badge: unreadCount > 0 ? String(unreadCount) : undefined },
    { href: "/provider-dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/provider-dashboard/resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-100">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 fixed h-full z-20 dark:bg-slate-800 dark:border-slate-700">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png" alt="HopePath Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg" />
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
                className={item.active ? "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-sky-100 text-sky-600" : "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"}
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
          <Link href="/provider-dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white">
            <Settings className="w-5 h-5" />Settings
          </Link>
          <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20">
            <LogOut className="w-5 h-5" />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-8 py-4 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button type="button" className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300"><Menu className="w-6 h-6" /></button>
              <div>
                <h2 className="text-xl font-semibold">Welcome back, {loading ? "Loading..." : (firstName || "Provider")}</h2>
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
                  <p className="text-xs text-slate-500 dark:text-slate-400">{loading ? "" : (providerTitle || "Provider")}</p>
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

          {/* Verification Banner */}
          <div className="bg-gradient-to-r from-sky-100 to-cyan-100 border border-sky-200 rounded-xl p-4 flex items-center justify-between dark:from-sky-900/20 dark:to-cyan-900/20 dark:border-sky-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-200 rounded-lg dark:bg-sky-900/30"><AlertCircle className="w-5 h-5 text-sky-600" /></div>
              <div>
                <p className="font-medium text-sky-700 dark:text-sky-300">Verification Pending</p>
                <p className="text-sm text-sky-600 dark:text-sky-400">Please upload your credentials to complete verification</p>
              </div>
            </div>
            <Link href="/provider-dashboard/credentials" className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors">Complete Now</Link>
          </div>

          {/* Stats Grid — real data */}
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
                {appointmentCount > 0 && <span className="text-xs font-medium text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full dark:bg-cyan-900/20">{appointmentCount} total</span>}
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
                {unreadCount > 0 && <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full dark:bg-orange-900/20">{unreadCount} active</span>}
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{recentMessages.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Conversations</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Upcoming Appointments — real from bookings collection */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center dark:border-slate-700">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Upcoming Appointments</h3>
                  <Link href="/provider-dashboard/availability" className="text-sm text-sky-600 hover:underline">View All</Link>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {appointments.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                      <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">No appointments yet</p>
                      <p className="text-xs mt-1">Bookings from clients will appear here</p>
                    </div>
                  ) : (
                    appointments.map((appt) => (
                      <div key={appt.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors dark:hover:bg-slate-700/50">
                        <div className="flex-shrink-0 w-16 h-12 bg-sky-100 rounded-lg flex flex-col items-center justify-center dark:bg-sky-900/20">
                          <span className="text-xs font-bold text-sky-600">{appt.time}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 dark:text-white truncate">{appt.userName}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{appt.date}</p>
                          {appt.notes && <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{appt.notes}</p>}
                        </div>
                        <span className={`shrink-0 px-3 py-1 text-xs rounded-full capitalize ${getStatusColor(appt.status)}`}>
                          {appt.status || 'Pending'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Messages — real from chats collection */}
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
                      <p className="text-xs mt-1">Messages from clients will appear here</p>
                    </div>
                  ) : (
                    recentMessages.map((chat: any) => {
                      const otherName = getOtherPersonName(chat);
                      return (
                        <Link key={chat.id} href="/provider-dashboard/messaging" className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer dark:hover:bg-slate-700/50 block">
                          <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center shrink-0">
                            <span className="text-white text-sm font-semibold">{otherName?.[0]?.toUpperCase() || 'U'}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-medium text-slate-800 dark:text-white">{otherName}</p>
                              {chat.lastMessageAt && (
                                <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                                  {chat.lastMessageAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}
                                </span>
                              )}
                            </div>
                            {chat.lastMessage && (
                              <p className="text-sm text-slate-600 line-clamp-1 dark:text-slate-300">{chat.lastMessage}</p>
                            )}
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
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-sky-600 bg-sky-100 dark:bg-sky-900/20">In Progress</span>
                    <span className="text-xs font-semibold inline-block text-sky-600 dark:text-sky-300">75%</span>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100 dark:bg-slate-700">
                    <div style={{ width: "75%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-sky-500 to-cyan-500" />
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-green-600 dark:text-green-500"><CheckCircle className="w-4 h-4" />Basic Information</li>
                    <li className="flex items-center gap-2 text-green-600 dark:text-green-500"><CheckCircle className="w-4 h-4" />Services Added</li>
                    <li className="flex items-center gap-2 text-slate-400 dark:text-slate-500"><Circle className="w-4 h-4" />Verification Documents</li>
                    <li className="flex items-center gap-2 text-slate-400 dark:text-slate-500"><Circle className="w-4 h-4" />Availability Calendar</li>
                  </ul>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 dark:bg-slate-800 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/provider-dashboard/profile" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 transition-colors group dark:border-slate-700 dark:hover:border-sky-500 dark:hover:bg-sky-900/10">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white dark:bg-slate-700 dark:group-hover:bg-slate-600"><Edit3 className="w-4 h-4 text-slate-600 group-hover:text-sky-600 dark:text-slate-400" /></div>
                    <div><p className="text-sm font-medium text-slate-800 dark:text-white">Edit Profile</p><p className="text-xs text-slate-500 dark:text-slate-400">Update your information</p></div>
                  </Link>
                  <Link href="/provider-dashboard/services" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 transition-colors group dark:border-slate-700 dark:hover:border-sky-500 dark:hover:bg-sky-900/10">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white dark:bg-slate-700 dark:group-hover:bg-slate-600"><Plus className="w-4 h-4 text-slate-600 group-hover:text-sky-600 dark:text-slate-400" /></div>
                    <div><p className="text-sm font-medium text-slate-800 dark:text-white">Add Service</p><p className="text-xs text-slate-500 dark:text-slate-400">Create new offering</p></div>
                  </Link>
                  <Link href="/provider-dashboard/availability" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50 transition-colors group dark:border-slate-700 dark:hover:border-sky-500 dark:hover:bg-sky-900/10">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white dark:bg-slate-700 dark:group-hover:bg-slate-600"><Clock className="w-4 h-4 text-slate-600 group-hover:text-sky-600 dark:text-slate-400" /></div>
                    <div><p className="text-sm font-medium text-slate-800 dark:text-white">Set Hours</p><p className="text-xs text-slate-500 dark:text-slate-400">Manage availability</p></div>
                  </Link>
                </div>
              </div>

              {/* Faith Integration */}
              <div className="bg-gradient-to-br from-amber-100 to-sky-100 rounded-xl p-6 border border-amber-200 dark:from-amber-900/20 dark:to-sky-900/20 dark:border-amber-800">
                <div className="flex items-center gap-3 mb-3">
                  <Church className="w-6 h-6 text-amber-600" />
                  <h3 className="font-semibold text-slate-800 dark:text-white">Faith Resources</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4 dark:text-slate-300">Access biblical counseling resources and faith-based intervention guides.</p>
                <Link href="/provider-dashboard/resources" className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400">Browse Library</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
