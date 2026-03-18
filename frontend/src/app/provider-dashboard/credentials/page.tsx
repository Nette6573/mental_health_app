"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Eye,
  FileCheck,
  FileText,
  History,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  Trash2,
  Upload,
  UploadCloud,
  User,
  X,
  Download,
} from "lucide-react";

type UploadDoc = {
  id: number;
  name: string;
  type: string;
  sizeKb: string;
  file: File;
  date: string;
  previewUrl: string;
};

type HistoryItem = {
  id: number;
  title: string;
  date: string;
  status: "Approved" | "Pending" | "Pending Review";
};

const DOC_TYPES = [
  "Select document type...",
  "Professional License",
  "Academic Degree",
  "Certification",
  "Government ID",
  "Professional Reference",
  "Insurance Certificate",
];

export default function ProviderCredentialsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [documentType, setDocumentType] = useState("Select document type...");
  const [documentNotes, setDocumentNotes] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadDoc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<UploadDoc | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [verificationPendingLabel, setVerificationPendingLabel] = useState("Under review");

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: 1,
      title: "Professional License Verified",
      date: "Jan 15, 2026 at 2:34 PM",
      status: "Approved",
    },
    {
      id: 2,
      title: "Academic Credentials Verified",
      date: "Jan 15, 2026 at 2:35 PM",
      status: "Approved",
    },
    {
      id: 3,
      title: "Government ID Submitted",
      date: "Mar 7, 2026 at 9:15 AM",
      status: "Pending",
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedDoc(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      uploadedDocuments.forEach((doc) => URL.revokeObjectURL(doc.previewUrl));
    };
  }, [uploadedDocuments]);

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

  const formatNow = () =>
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const navItems = [
    { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider-dashboard/profile", label: "Profile", icon: User },
    { href: "/provider-dashboard/services", label: "Services", icon: Briefcase },
    { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar },
    {
      href: "/provider-dashboard/credentials",
      label: "Verification",
      icon: ShieldCheck,
      active: true,
    },
    {
      href: "/provider-dashboard/messaging",
      label: "Messages",
      icon: MessageSquare,
      badge: "3",
    },
    { href: "/provider-dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/provider-dashboard/resources", label: "Resources", icon: BookOpen },
  ];

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    if (documentType === "Select document type...") {
      alert("Please select a document type first.");
      return;
    }

    const nextDocs: UploadDoc[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      nextDocs.push({
        id: Date.now() + Math.floor(Math.random() * 100000),
        name: file.name,
        type: documentType,
        sizeKb: (file.size / 1024).toFixed(1),
        file,
        date: formatNow(),
        previewUrl: URL.createObjectURL(file),
      });
    });

    if (nextDocs.length > 0) {
      setUploadedDocuments((prev) => [...prev, ...nextDocs]);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const quickUpload = (type: string) => {
    setDocumentType(type);
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const removeDocument = (docId: number) => {
    const doc = uploadedDocuments.find((d) => d.id === docId);
    if (!doc) return;

    const confirmed = window.confirm(`Are you sure you want to remove "${doc.name}"?`);
    if (!confirmed) return;

    URL.revokeObjectURL(doc.previewUrl);
    setUploadedDocuments((prev) => prev.filter((d) => d.id !== docId));
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null);
    }
  };

  const submitForReview = () => {
    if (uploadedDocuments.length === 0) {
      alert("Please upload at least one document before submitting.");
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      setHistoryItems((prev) => [
        {
          id: Date.now(),
          title: `${uploadedDocuments.length} Document(s) Submitted`,
          date: formatNow(),
          status: "Pending Review",
        },
        ...prev,
      ]);

      setVerificationPendingLabel("Submitted");

      uploadedDocuments.forEach((doc) => URL.revokeObjectURL(doc.previewUrl));
      setUploadedDocuments([]);
      setDocumentNotes("");
      setSelectedDoc(null);
      setIsSubmitting(false);

      alert(
        "Documents submitted successfully for review! You will be notified once the review is complete."
      );
    }, 1500);
  };

  const uploadStatusText = useMemo(() => {
    if (documentType === "Select document type...") {
      return "Select a document type above to enable upload";
    }
    return `Ready to upload ${documentType}`;
  }, [documentType]);

  const viewExistingDocument = (docType: string) => {
    alert(`Preview for ${docType} document would open here.`);
  };

  const replaceDocument = (docType: string) => {
    const typeMap: Record<string, string> = {
      license: "Professional License",
      degree: "Academic Degree",
      id: "Government ID",
    };
    setDocumentType(typeMap[docType] ?? "Select document type...");
    fileInputRef.current?.click();
  };

  const onDropZoneKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
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

      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedDoc(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-700">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  {selectedDoc.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedDoc.type} • {selectedDoc.sizeKb} KB
                </p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-[300px] items-center justify-center bg-slate-50 p-6 dark:bg-slate-900/40">
              <div className="text-center">
                <FileText className="mx-auto mb-3 h-16 w-16 text-slate-300" />
                <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                  Preview not available for this file type
                </p>
                <a
                  href={selectedDoc.previewUrl}
                  download={selectedDoc.name}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
                >
                  <Download className="h-4 w-4" />
                  Download to View
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-700">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Uploaded on {selectedDoc.date}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
                Professional Verification
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Upload credentials to verify your practice
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
          <div className="mb-8 flex items-center gap-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-400">
                Verification Pending
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-500/80">
                Your documents are under review. This usually takes 2-3 business days.
              </p>
            </div>
            <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
              Pending
            </span>
          </div>

          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <FileCheck className="h-5 w-5 text-sky-600" />
              Required Documents
            </h3>

            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">
                        Professional License
                      </h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Current license to practice in Jamaica
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                        <Check className="h-3 w-3" />
                        Verified on Jan 15, 2026
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => viewExistingDocument("license")}
                    className="text-sm text-sky-600 hover:underline"
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">
                        Academic Credentials
                      </h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Degree certificate(s) in relevant field
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                        <Check className="h-3 w-3" />
                        Verified on Jan 15, 2026
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => viewExistingDocument("degree")}
                    className="text-sm text-sky-600 hover:underline"
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 border-l-4 border-l-sky-600 p-4 dark:border-slate-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900/20">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">
                        Government ID
                      </h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Passport, driver&apos;s license, or national ID
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          verificationPendingLabel === "Submitted"
                            ? "text-sky-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {verificationPendingLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewExistingDocument("id")}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => replaceDocument("id")}
                      className="text-sm text-sky-600 transition-colors hover:text-sky-500"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 dark:border-slate-600">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
                      <Upload className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">
                        Professional Reference
                      </h4>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Letter from supervisor or colleague
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Optional but recommended
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => quickUpload("Professional Reference")}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <UploadCloud className="h-5 w-5 text-sky-600" />
              Upload New Document
            </h3>

            <div
              role="button"
              tabIndex={0}
              onClick={openFilePicker}
              onKeyDown={onDropZoneKeyDown}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                dragActive
                  ? "border-sky-600 bg-sky-600/5"
                  : "border-slate-300 hover:border-sky-600 hover:bg-sky-600/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
                onChange={onFileInputChange}
              />

              <div className="mx-auto mb-4 w-fit rounded-full bg-sky-600/10 p-4 transition-transform group-hover:scale-110">
                <UploadCloud className="h-8 w-8 text-sky-600" />
              </div>
              <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Click to upload or drag and drop
              </p>
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                PDF, JPG, PNG, DOC up to 10MB
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {uploadStatusText}
              </p>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                {DOC_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Add any relevant information about this document..."
                value={documentNotes}
                onChange={(e) => setDocumentNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
            </div>

            {uploadedDocuments.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="mb-3 font-medium text-slate-800 dark:text-white">
                  Documents Ready for Submission ({uploadedDocuments.length})
                </h4>

                <div className="space-y-2">
                  {uploadedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700/30"
                    >
                      <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                        <div className="shrink-0 rounded-lg bg-sky-600/10 p-2">
                          <FileText className="h-4 w-4 text-sky-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                            {doc.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {doc.type} • {doc.sizeKb} KB • {doc.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-white hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-600"
                          title="View"
                          aria-label={`View ${doc.name}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                          title="Remove"
                          aria-label={`Remove ${doc.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={submitForReview}
              disabled={isSubmitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  Submit for Review
                </>
              )}
            </button>

            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Uploads are encrypted and securely stored
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <History className="h-5 w-5 text-sky-600" />
              Verification History
            </h3>

            <div className="space-y-3">
              {historyItems.map((item) => {
                const isApproved = item.status === "Approved";
                const isPending = item.status === "Pending" || item.status === "Pending Review";

                return (
                  <div
                    key={item.id}
                    className={
                      isApproved
                        ? "flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/30"
                        : "flex items-center justify-between rounded-lg border border-yellow-100 bg-yellow-50 p-3 dark:border-yellow-900/30 dark:bg-yellow-900/10"
                    }
                  >
                    <div className="flex items-center gap-3">
                      {isApproved ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}

                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.date}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-medium ${
                        isApproved ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}