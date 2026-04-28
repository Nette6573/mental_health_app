"use client";
import { useAuth } from "@/context/AuthContext"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseClient";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  FileText,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Phone,
  Settings,
  ShieldCheck,
  Sun,
  Target,
  User,
  X,
  Loader2,
} from "lucide-react";

const specializationOptions = [
  "Depression","Anxiety","Marriage Counseling","Youth Counseling",
  "Trauma","Addiction","Grief Support","Spiritual Counseling","Family Therapy",
];

const parishOptions = [
  "Kingston","St. Andrew","St. Catherine","Clarendon","Manchester",
  "St. Ann","St. James (Montego Bay)","Westmoreland","Hanover",
  "St. Elizabeth","St. Mary","Portland","St. Thomas","Trelawny",
];

const categoryOptions = [
  { value: "psychologist", label: "Psychologist" },
  { value: "therapist", label: "Therapist" },
  { value: "counselor", label: "Counselor" },
  { value: "pastor", label: "Pastor / Faith Leader" },
  { value: "support", label: "Support Group" },
  { value: "organization", label: "Mental Health Organization" },
];

const experienceOptions = [
  "Less than 1 year","1-3 years","4-5 years","6-7 years",
  "8-9 years","10-15 years","16-20 years","20+ years",
];

const slidingScaleOptions = [
  "Yes - I offer sliding scale fees","No - Fixed fee",
  "Pro-bono slots available monthly","Free initial consultation",
];

type SessionTypes = { inPerson: boolean; virtual: boolean; phone: boolean; };

export default function ProviderProfilePage() {
  const { user } = useAuth() as any;
  const router = useRouter();

  useEffect(() => {
    if (user === null) router.replace("/provider-dashboard/login");
  }, [user, router]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const blockBack = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  const [darkMode, setDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [fullName, setFullName] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [category, setCategory] = useState("psychologist");
  const [parish, setParish] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [sessionTypes, setSessionTypes] = useState<SessionTypes>({ inPerson: true, virtual: true, phone: false });
  const [sessionCost, setSessionCost] = useState("15000");
  const [slidingScale, setSlidingScale] = useState("No - Fixed fee");

  // Photo URLs — loaded from Firebase, updated after Cloudinary upload
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  // Local previews before upload
  const [profilePreview, setProfilePreview] = useState("https://ui-avatars.com/api/?name=Provider&background=0ea5e9&color=fff&size=200");

  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);

  // ── Dark mode ──
  useEffect(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // ── Fetch provider data from Firebase ──
  useEffect(() => {
    const fetchProviderData = async () => {
      if (!user) return;
      try {
        const uid = user.uid ?? user.id;
        const docRef = doc(db, "providers", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setFullName(`${data.first_name ?? ""} ${data.last_name ?? ""}`.trim());
          setProfessionalTitle(data.professional_title ?? "");
          setOrganization(data.organization ?? "");
          setCategory(data.category ?? "psychologist");
          setParish(data.parish ?? "");
          setEmail(data.professional_email ?? "");
          setPhone(data.phone_number ?? "");
          setWebsite(data.website ?? "");
          setBio(data.biography ?? "");
          setExperience(data.experience ?? "");

          if (Array.isArray(data.practice_areas)) {
            setSelectedSpecializations(data.practice_areas.filter((a: string) =>
              specializationOptions.some((o) => o.toLowerCase() === a.toLowerCase())
            ));
          }

          if (Array.isArray(data.languages)) {
            setLanguages(data.languages.filter(Boolean));
          } else if (typeof data.languages === "string" && data.languages) {
            setLanguages(data.languages.split(",").map((s: string) => s.trim()).filter(Boolean));
          }

          if (typeof data.session_types === "string" && data.session_types) {
            const types = data.session_types.toLowerCase();
            setSessionTypes({
              inPerson: types.includes("in person") || types.includes("in-person"),
              virtual: types.includes("virtual") || types.includes("online"),
              phone: types.includes("phone"),
            });
          }

          if (data.session_cost) setSessionCost(String(data.session_cost));
          if (data.payment_options) setSlidingScale(data.payment_options);

          // ── Load profile photo from Firebase ──
          if (data.profile_photo_url) {
            setProfilePhotoUrl(data.profile_photo_url);
            setProfilePreview(data.profile_photo_url);
          }

        }
      } catch (error) {
        console.error("Error fetching provider:", error);
      }
    };
    fetchProviderData();
  }, [user]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const logout = () => router.replace("/provider-dashboard/login");

  // ── Upload photo to Cloudinary then save URL to Firebase immediately ──
  const uploadPhotoToCloudinary = async (
    file: File,
    type: "profile" | "cover"
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("photoType", type);

    const res = await fetch("/api/profile/upload-photo", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Photo upload failed");
    return data.url;
  };

  // ── Handle profile photo selection — upload immediately on selection ──
  const handleProfilePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Profile photo must be 2MB or less.");
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setProfilePreview(localPreview);

    try {
      setIsUploadingPhoto(true);
      const uid = user.uid ?? user.id;

      // 1. Upload to Cloudinary
      const url = await uploadPhotoToCloudinary(file, "profile");

      // 2. Save URL to Firebase immediately
      const docRef = doc(db, "providers", uid);
      await setDoc(docRef, { profile_photo_url: url }, { merge: true });

      // 3. Update state with the real Cloudinary URL
      setProfilePhotoUrl(url);
      setProfilePreview(url);
      URL.revokeObjectURL(localPreview);

      alert("Profile photo updated successfully!");
    } catch (err: any) {
      console.error("Profile photo upload error:", err);
      alert("Failed to upload photo: " + err.message);
      setProfilePreview(profilePhotoUrl || "");
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
    }
  };



  // ── Save all other profile fields ──
  const handleSave = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!user) return;

    const nameParts = fullName.trim().split(/\s+/);
    const first_name = nameParts[0] ?? "";
    const last_name = nameParts.slice(1).join(" ");

    const sessionTypeParts: string[] = [];
    if (sessionTypes.inPerson) sessionTypeParts.push("In Person");
    if (sessionTypes.virtual) sessionTypeParts.push("Virtual");
    if (sessionTypes.phone) sessionTypeParts.push("Phone");

    setIsSaving(true);
    setSaveError(null);

    try {
      const uid = user.uid ?? user.id;
      const docRef = doc(db, "providers", uid);

      await setDoc(docRef, {
        first_name,
        last_name,
        professional_title: professionalTitle,
        organization,
        category,
        parish,
        professional_email: email,
        phone_number: phone,
        website,
        biography: bio,
        experience,
        practice_areas: selectedSpecializations,
        specialization: selectedSpecializations,
        languages: languages.filter(Boolean),
        session_types: sessionTypeParts.join(", "),
        session_cost: sessionCost,
        payment_options: slidingScale,
        // Photo already saved immediately on upload
        profile_photo_url: profilePhotoUrl,
      }, { merge: true });

      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setSaveError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => window.location.reload();

  const toggleSpecialization = (item: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const addLanguage = () => {
    const value = languageInput.trim();
    if (!value) return;
    const exists = languages.some((lang) => lang.toLowerCase() === value.toLowerCase());
    if (!exists) setLanguages((prev) => [...prev, value]);
    setLanguageInput("");
  };

  const removeLanguage = (language: string) => {
    setLanguages((prev) => prev.filter((lang) => lang !== language));
  };

  const onLanguageKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addLanguage(); }
  };

  const navItems = [
    { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider-dashboard/profile", label: "Profile", icon: User, active: true },
    { href: "/provider-dashboard/services", label: "Services", icon: Briefcase },
    { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar },
    { href: "/provider-dashboard/credentials", label: "Verification", icon: ShieldCheck },
    { href: "/provider-dashboard/messaging", label: "Messages", icon: MessageSquare, badge: "3" },
    { href: "/provider-dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/provider-dashboard/resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
      {mobileSidebarOpen && (
        <button className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileSidebarOpen(false)} aria-label="Close sidebar overlay" />
      )}

      <aside className={`fixed z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800 md:translate-x-0 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:flex`}>
        <div className="border-b border-slate-100 p-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img src="https://huggingface.co/spaces/brennanlondon/deepsite-project-q0z6c/resolve/main/images/hopepath.png" alt="HopePath Logo" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
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
                className={item.active ? "flex items-center gap-3 rounded-lg bg-sky-600/10 px-4 py-3 text-sm font-medium text-sky-600" : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.badge && <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-slate-200 p-4 dark:border-slate-700">
          <Link href="/provider-dashboard/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto md:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Profile Information</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage your professional details</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileSidebarOpen((p) => !p)} className="rounded-lg p-2 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 md:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <button onClick={toggleDarkMode} className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
              </button>
              <button onClick={() => handleSave()} disabled={isSaving} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed">
                {isSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-5xl p-4 sm:p-8">
          <form onSubmit={handleSave} className="space-y-8">

            {/* BASIC INFO */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <User className="h-5 w-5 text-sky-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Professional Title</label>
                  <input type="text" value={professionalTitle} onChange={(e) => setProfessionalTitle(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Organization/Church</label>
                  <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Professional Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                    {categoryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Parish</label>
                  <select value={parish} onChange={(e) => setParish(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                    {parishOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* CONTACT */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <Phone className="h-5 w-5 text-sky-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Website</label>
                  <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                </div>
              </div>
            </div>

            {/* BIO */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <FileText className="h-5 w-5 text-sky-600" />
                About / Bio
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Biography</label>
                  <textarea rows={5} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell potential clients about your approach, experience, and faith integration..." className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Years of Experience</label>
                  <select value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                    <option value="">Select experience range…</option>
                    {experienceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* SPECIALIZATIONS */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <Target className="h-5 w-5 text-sky-600" />
                Areas of Specialization
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {specializationOptions.map((item) => (
                  <label key={item} className="cursor-pointer rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={selectedSpecializations.includes(item)} onChange={() => toggleSpecialization(item)} className="h-4 w-4 rounded text-sky-600 focus:ring-sky-600" />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* LANGUAGES & SESSION */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <Globe className="h-5 w-5 text-sky-600" />
                Languages & Session Details
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Languages Spoken</label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <span key={language} className="flex items-center gap-2 rounded-full bg-sky-600/10 px-3 py-1 text-sm text-sky-600">
                        {language}
                        <button type="button" onClick={() => removeLanguage(language)} className="rounded-full p-0.5 hover:bg-sky-600/20"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={onLanguageKeyDown} placeholder="Add language..." className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                    <button type="button" onClick={addLanguage} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700">Add</button>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Session Types</label>
                  <div className="space-y-3">
                    {[
                      { key: "inPerson", label: "In Person" },
                      { key: "virtual", label: "Virtual (Online)" },
                      { key: "phone", label: "Phone Consultation" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-3">
                        <input type="checkbox" checked={sessionTypes[key as keyof SessionTypes]} onChange={(e) => setSessionTypes((prev) => ({ ...prev, [key]: e.target.checked }))} className="h-4 w-4 rounded text-sky-600 focus:ring-sky-600" />
                        <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Session Cost (JMD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 dark:text-slate-400">$</span>
                    <input type="number" value={sessionCost} onChange={(e) => setSessionCost(e.target.value)} className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-4 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Leave blank or enter 0 for free services</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Sliding Scale / Free Options</label>
                  <select value={slidingScale} onChange={(e) => setSlidingScale(e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                    {slidingScaleOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* PHOTOS — uploads to Cloudinary immediately on selection */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <ImageIcon className="h-5 w-5 text-sky-600" />
                Profile Photos
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Profile Photo */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Profile Photo</label>
                  <button type="button" onClick={() => profilePhotoInputRef.current?.click()} disabled={isUploadingPhoto} className="relative w-full rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-sky-600 dark:border-slate-600 disabled:opacity-60">
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 dark:bg-slate-800/80">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                      </div>
                    )}
                    <img src={profilePreview} alt="Profile" className="mx-auto mb-3 h-24 w-24 rounded-full object-cover" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {isUploadingPhoto ? "Uploading..." : "Click to upload new photo"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">JPG, PNG up to 2MB</p>
                  </button>
                  <input ref={profilePhotoInputRef} type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleProfilePhotoChange} />
                </div>


              </div>
            </div>

            {/* SAVE */}
            <div className="flex flex-col items-end gap-2 pb-8">
              {saveError && <p className="text-sm text-red-500">{saveError}</p>}
              <div className="flex gap-4">
                <button type="button" onClick={handleCancel} className="rounded-lg border border-slate-200 px-6 py-2 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" disabled={isSaving} className="rounded-lg bg-sky-600 px-6 py-2 font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed">
                  {isSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
