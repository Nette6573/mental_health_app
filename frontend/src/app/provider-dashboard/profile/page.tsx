"use client";
import { useAuth } from "@/context/AuthContext"; 
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseClient";

//import Link from "next/link";
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
  UploadCloud,
  User,
  X,
} from "lucide-react";

const specializationOptions = [
  "Depression",
  "Anxiety",
  "Marriage Counseling",
  "Youth Counseling",
  "Trauma",
  "Addiction",
  "Grief Support",
  "Spiritual Counseling",
  "Family Therapy",
];

const parishOptions = [
  "Kingston",
  "St. Andrew",
  "St. Catherine",
  "Clarendon",
  "Manchester",
  "St. Ann",
  "St. James (Montego Bay)",
  "Westmoreland",
  "Hanover",
  "St. Elizabeth",
  "St. Mary",
  "Portland",
  "St. Thomas",
  "Trelawny",
];

const categoryOptions = [
  { value: "psychologist", label: "Psychologist" },
  { value: "therapist", label: "Therapist" },
  { value: "counselor", label: "Counselor" },
  { value: "pastor", label: "Pastor / Faith Leader" },
  { value: "support", label: "Support Group" },
  { value: "organization", label: "Mental Health Organization" },
];

const slidingScaleOptions = [
  "Yes - I offer sliding scale fees",
  "No - Fixed fee",
  "Pro-bono slots available monthly",
  "Free initial consultation",
];

type SessionTypes = {
  inPerson: boolean;
  virtual: boolean;
  phone: boolean;
};

type PhotoState = {
  file: File | null;
  preview: string;
};

export default function ProviderProfilePage() {
  //This is to get the logged in user
  const { user } = useAuth() as any;
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [category, setCategory] = useState("");
  const [parish, setParish] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  const [bio, setBio] = useState(
    ""
  );

  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const [languages, setLanguages] = useState<string[]>(["", ""]);
  const [languageInput, setLanguageInput] = useState("");

  const [sessionTypes, setSessionTypes] = useState<SessionTypes>({
    inPerson: true,
    virtual: true,
    phone: false,
  });

  const [sessionCost, setSessionCost] = useState("15000");
  const [slidingScale, setSlidingScale] = useState("No - Fixed fee");

  const [profilePhoto, setProfilePhoto] = useState<PhotoState>({
    file: null,
    preview: "http://static.photos/people/200x200/42",
  });

  const [coverPhoto, setCoverPhoto] = useState<PhotoState>({
    file: null,
    preview: "",
  });

  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement | null>(null);

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
    return () => {
      if (profilePhoto.file && profilePhoto.preview.startsWith("blob:")) {
        URL.revokeObjectURL(profilePhoto.preview);
      }
      if (coverPhoto.file && coverPhoto.preview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPhoto.preview);
      }
    };
  }, [profilePhoto, coverPhoto]);

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
  useEffect(() => {
  const fetchProviderData = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, "providers", user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Populate fields (SAFE — no UI change)
        setFullName(`${data.first_name ?? ""} ${data.last_name ?? ""}`.trim());
        setProfessionalTitle(data.professional_title ?? "");
        setOrganization(data.organization ?? "");
        setCategory(data.category ?? "psychologist");
        setParish(data.parish ?? "");

        setEmail(data.professional_email ?? "");
        setPhone(data.phone_number ?? "");
        setWebsite(data.website ?? "");

        setBio(data.bio ?? "");

        // Specializations (handle string or array)
        if (Array.isArray(data.practice_areas)) {
          setSelectedSpecializations(data.practice_areas);
        } else if (data.practice_areas) {
          setSelectedSpecializations([data.practice_areas]);
        }

      } else {
        console.log("No provider document found");
      }
    } catch (error) {
      console.error("Error fetching provider:", error);
    }
  };

  fetchProviderData();
}, [user]);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const logout = () => {
    window.location.href = "/provider-dashboard/login";
  };

  const handleSave = (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    window.location.reload();
  };

  const toggleSpecialization = (item: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const addLanguage = () => {
    const value = languageInput.trim();
    if (!value) return;

    const exists = languages.some(
      (lang) => lang.toLowerCase() === value.toLowerCase()
    );
    if (!exists) {
      setLanguages((prev) => [...prev, value]);
    }
    setLanguageInput("");
  };

  const removeLanguage = (language: string) => {
    setLanguages((prev) => prev.filter((lang) => lang !== language));
  };

  const onLanguageKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLanguage();
    }
  };

  const handlePhotoUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      alert("Please upload an image file.");
      return;
    }

    const maxSize = type === "profile" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(
        type === "profile"
          ? "Profile photo must be 2MB or less."
          : "Cover image must be 5MB or less."
      );
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === "profile") {
      if (profilePhoto.file && profilePhoto.preview.startsWith("blob:")) {
        URL.revokeObjectURL(profilePhoto.preview);
      }
      setProfilePhoto({ file, preview: previewUrl });
    } else {
      if (coverPhoto.file && coverPhoto.preview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPhoto.preview);
      }
      setCoverPhoto({ file, preview: previewUrl });
    }

    e.target.value = "";
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
      active: true,
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
                Profile Information
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your professional details
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

              <button
                onClick={() => handleSave()}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-5xl p-4 sm:p-8">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <User className="h-5 w-5 text-sky-600" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Organization/Church
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Professional Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Parish
                  </label>
                  <select
                    value={parish}
                    onChange={(e) => setParish(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    {parishOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <Phone className="h-5 w-5 text-sky-600" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <FileText className="h-5 w-5 text-sky-600" />
                About / Bio
              </h3>

              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell potential clients about your approach, experience, and faith integration..."
                className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <Target className="h-5 w-5 text-sky-600" />
                Areas of Specialization
              </h3>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {specializationOptions.map((item) => {
                  const checked = selectedSpecializations.includes(item);

                  return (
                    <label
                      key={item}
                      className="cursor-pointer rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSpecialization(item)}
                          className="h-4 w-4 rounded text-sky-600 focus:ring-sky-600"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          {item}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <Globe className="h-5 w-5 text-sky-600" />
                Languages & Session Details
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Languages Spoken
                  </label>

                  <div className="mb-2 flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <span
                        key={language}
                        className="flex items-center gap-2 rounded-full bg-sky-600/10 px-3 py-1 text-sm text-sky-600"
                      >
                        {language}
                        <button
                          type="button"
                          onClick={() => removeLanguage(language)}
                          className="rounded-full p-0.5 hover:bg-sky-600/20"
                          aria-label={`Remove ${language}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyDown={onLanguageKeyDown}
                      placeholder="Add language..."
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Session Types
                  </label>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={sessionTypes.inPerson}
                        onChange={(e) =>
                          setSessionTypes((prev) => ({
                            ...prev,
                            inPerson: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded text-sky-600 focus:ring-sky-600"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        In Person
                      </span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={sessionTypes.virtual}
                        onChange={(e) =>
                          setSessionTypes((prev) => ({
                            ...prev,
                            virtual: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded text-sky-600 focus:ring-sky-600"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        Virtual (Online)
                      </span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={sessionTypes.phone}
                        onChange={(e) =>
                          setSessionTypes((prev) => ({
                            ...prev,
                            phone: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded text-sky-600 focus:ring-sky-600"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        Phone Consultation
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Session Cost (JMD)
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 dark:text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      value={sessionCost}
                      onChange={(e) => setSessionCost(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-4 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Leave blank or enter 0 for free services
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Sliding Scale / Free Options
                  </label>

                  <select
                    value={slidingScale}
                    onChange={(e) => setSlidingScale(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    {slidingScaleOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                <ImageIcon className="h-5 w-5 text-sky-600" />
                Profile Photos
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Profile Photo
                  </label>

                  <button
                    type="button"
                    onClick={() => profilePhotoInputRef.current?.click()}
                    className="w-full rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-sky-600 dark:border-slate-600"
                  >
                    <img
                      src={profilePhoto.preview}
                      alt="Current profile"
                      className="mx-auto mb-3 h-24 w-24 rounded-full object-cover"
                    />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Click to upload new photo
                    </p>
                    <p className="mt-1 text-xs text-slate-400">JPG, PNG up to 2MB</p>
                  </button>

                  <input
                    ref={profilePhotoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, "profile")}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Cover Image
                  </label>

                  <button
                    type="button"
                    onClick={() => coverPhotoInputRef.current?.click()}
                    className="flex h-full min-h-[220px] w-full flex-col justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-sky-600 dark:border-slate-600"
                  >
                    {coverPhoto.preview ? (
                      <img
                        src={coverPhoto.preview}
                        alt="Cover preview"
                        className="mb-3 h-32 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <UploadCloud className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                    )}

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Upload cover image
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Recommended: 1200x400px
                    </p>
                  </button>

                  <input
                    ref={coverPhotoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, "cover")}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pb-8">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-200 px-6 py-2 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-sky-600 px-6 py-2 font-medium text-white transition-colors hover:bg-sky-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
