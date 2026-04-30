"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/firebaseClient";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import {
  ChangeEvent, DragEvent, KeyboardEvent,
  useEffect, useMemo, useRef, useState,
} from "react";
import {
  AlertCircle, Briefcase, Calendar,
  CheckCircle, FileCheck, FileText,
  LayoutDashboard, Loader2, LogOut, Menu, MessageSquare,
  Moon, Settings, ShieldCheck, Sun, Trash2, UploadCloud,
  User, Eye, XCircle,
} from "lucide-react";

type UploadedDoc = {
  url: string;
  viewUrl: string;
  publicId: string;
  documentType: string;
  fileName: string;
  uploadedAt: string;
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

const navItems = [
  { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/provider-dashboard/profile", label: "Profile", icon: User },
  { href: "/provider-dashboard/services", label: "Services", icon: Briefcase },
  { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar },
  { href: "/provider-dashboard/credentials", label: "Verification", icon: ShieldCheck, active: true },
  { href: "/provider-dashboard/messaging", label: "Messages", icon: MessageSquare },
];

export default function ProviderCredentialsPage() {
  const { user } = useAuth() as any;

  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [documentType, setDocumentType] = useState("Select document type...");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDoc[]>([]);

  // ── Live application status from Firestore ──
  const [applicationStatus, setApplicationStatus] = useState<string>("pending");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── Dark mode ──
  useEffect(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // ── Subscribe to provider doc in real-time so status updates live ──
  useEffect(() => {
    if (!user) return;
    const uid = user.uid ?? user.id;
    const providerRef = doc(db, "providers", uid);

    const unsub = onSnapshot(providerRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUploadedDocuments(data.credentials || []);
        setApplicationStatus(data.application_status || "pending");
      }
      setLoadingFiles(false);
    }, (err) => {
      console.error("Snapshot error:", err);
      setLoadingFiles(false);
    });

    return () => unsub();
  }, [user]);

  const saveToFirebase = async (docs: UploadedDoc[]) => {
    if (!user) return;
    const uid = user.uid ?? user.id;
    await setDoc(doc(db, "providers", uid), { credentials: docs }, { merge: true });
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const logout = () => { window.location.href = "/provider-dashboard/login"; };

  const formatNow = () =>
    new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const uploadFile = async (file: File) => {
    if (documentType === "Select document type...") {
      alert("Please select a document type first.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name} is too large. Maximum size is 10MB.`);
      return;
    }
    try {
      setIsUploading(true);
      const uid = user.uid ?? user.id;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);
      formData.append("providerId", uid);

      const res = await fetch("/api/credentials/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const newDoc: UploadedDoc = {
        url: data.url,
        viewUrl: data.viewUrl,
        publicId: data.publicId,
        documentType,
        fileName: file.name,
        uploadedAt: formatNow(),
      };

      const updatedDocs = [newDoc, ...uploadedDocuments];
      setUploadedDocuments(updatedDocs);
      await saveToFirebase(updatedDocs);
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => uploadFile(file));
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragActive(false); };
  const openFilePicker = () => fileInputRef.current?.click();

  const onDropZoneKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFilePicker(); }
  };

  const viewDocument = (d: UploadedDoc) => window.open(d.viewUrl || d.url, "_blank");

  const removeDocument = async (publicId: string, fileName: string) => {
    const confirmed = window.confirm(`Are you sure you want to remove "${fileName}"?`);
    if (!confirmed) return;
    const updatedDocs = uploadedDocuments.filter((d) => d.publicId !== publicId);
    setUploadedDocuments(updatedDocs);
    await saveToFirebase(updatedDocs);
  };

  const submitForReview = async () => {
    if (uploadedDocuments.length === 0) {
      alert("Please upload at least one document before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      const uid = user.uid ?? user.id;
      // Set application_status to pending so admin can review
      await setDoc(doc(db, "providers", uid), {
        application_status: "pending",
      }, { merge: true });
      alert("Documents submitted successfully for review! You will be notified once the review is complete.");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadStatusText = useMemo(() => {
    if (documentType === "Select document type...") return "Select a document type above to enable upload";
    return `Ready to upload ${documentType}`;
  }, [documentType]);

  // ── Status banner config ──────────────────────────────────────────────────
  const statusBanner = (() => {
    switch (applicationStatus) {
      case "approved":
        return {
          bg: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20",
          iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
          icon: <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
          title: "Verification Approved",
          message: "Your credentials have been verified. Your profile is now visible to clients.",
          badgeBg: "bg-emerald-200 dark:bg-emerald-900/40",
          badgeText: "text-emerald-800 dark:text-emerald-300",
          badge: "Approved",
        };
      case "rejected":
        return {
          bg: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
          iconBg: "bg-red-100 dark:bg-red-900/30",
          icon: <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />,
          title: "Verification Rejected",
          message: "Your credentials were not approved. Please re-upload the correct documents and resubmit.",
          badgeBg: "bg-red-200 dark:bg-red-900/40",
          badgeText: "text-red-800 dark:text-red-300",
          badge: "Rejected",
        };
      default:
        return {
          bg: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
          iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
          icon: <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />,
          title: "Verification Pending",
          message: "Your documents are under review. This usually takes 2–3 business days.",
          badgeBg: "bg-yellow-200 dark:bg-yellow-900/40",
          badgeText: "text-yellow-800 dark:text-yellow-300",
          badge: "Pending",
        };
    }
  })();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
      {mobileSidebarOpen && (
        <button className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800 md:translate-x-0 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="border-b border-slate-100 p-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img src="/provider-dashboard/images/hopepath.png" alt="HopePath Logo" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
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
                className={item.active
                  ? "flex items-center gap-3 rounded-lg bg-sky-600/10 px-4 py-3 text-sm font-medium text-sky-600"
                  : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                }
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />{item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-slate-200 p-4 dark:border-slate-700">
          <Link href="/provider-dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Settings className="h-5 w-5" />Settings
          </Link>
          <button onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto md:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Professional Verification</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Upload credentials to verify your practice</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileSidebarOpen((p) => !p)} className="rounded-lg p-2 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 md:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <button onClick={toggleDarkMode} className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl p-4 sm:p-8 space-y-8">

          {/* ── LIVE STATUS BANNER ── */}
          <div className={`flex items-center gap-4 rounded-xl border p-4 ${statusBanner.bg}`}>
            <div className={`rounded-lg p-2 ${statusBanner.iconBg}`}>
              {statusBanner.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-800 dark:text-white">{statusBanner.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{statusBanner.message}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBanner.badgeBg} ${statusBanner.badgeText}`}>
              {statusBanner.badge}
            </span>
          </div>

          {/* ── UPLOAD SECTION ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <UploadCloud className="h-5 w-5 text-sky-600" />Upload New Document
            </h3>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                {DOC_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </div>

            <div
              role="button" tabIndex={0}
              onClick={openFilePicker}
              onKeyDown={onDropZoneKeyDown}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${dragActive ? "border-sky-600 bg-sky-600/5" : "border-slate-300 hover:border-sky-600 hover:bg-sky-600/5"}`}
            >
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple onChange={onFileInputChange} />
              <div className="mx-auto mb-4 w-fit rounded-full bg-sky-600/10 p-4 transition-transform group-hover:scale-110">
                {isUploading ? <Loader2 className="h-8 w-8 animate-spin text-sky-600" /> : <UploadCloud className="h-8 w-8 text-sky-600" />}
              </div>
              <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
              </p>
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">PDF, JPG, PNG, DOC up to 10MB</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{uploadStatusText}</p>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Files are securely stored in Cloudinary and linked to your account
            </p>
          </div>

          {/* ── DOCUMENTS LIST ── */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <FileCheck className="h-5 w-5 text-sky-600" />Your Uploaded Documents
            </h3>

            {loadingFiles ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                <span className="ml-2 text-sm text-slate-500">Loading your documents...</span>
              </div>
            ) : uploadedDocuments.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No documents uploaded yet. Upload your first document above.
              </p>
            ) : (
              <div className="space-y-3">
                {uploadedDocuments.map((d) => (
                  <div key={d.publicId} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/30">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="shrink-0 rounded-lg bg-sky-600/10 p-2">
                        <FileText className="h-5 w-5 text-sky-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800 dark:text-white">{d.fileName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {d.documentType} · Uploaded {d.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button onClick={() => viewDocument(d)} className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-white hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-600" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => removeDocument(d.publicId, d.fileName)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20" title="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {uploadedDocuments.length > 0 && (
              <button
                type="button"
                onClick={submitForReview}
                disabled={isSubmitting || applicationStatus === "approved"}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</>
                  : applicationStatus === "approved"
                  ? <><CheckCircle className="h-4 w-4" />Already Approved</>
                  : <><UploadCloud className="h-4 w-4" />Submit for Review</>
                }
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
