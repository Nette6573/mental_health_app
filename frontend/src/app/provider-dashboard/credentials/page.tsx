"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  ChangeEvent, DragEvent, KeyboardEvent,
  useEffect, useMemo, useRef, useState,
} from "react";
import {
  AlertCircle, BarChart3, BookOpen, Briefcase, Calendar,
  CheckCircle, Clock, FileCheck, FileText, History,
  LayoutDashboard, Loader2, LogOut, Menu, MessageSquare,
  Moon, Settings, ShieldCheck, Sun, Trash2, UploadCloud,
  User, Eye,
} from "lucide-react";

// One uploaded document — stored in Firebase as part of provider's record
type UploadedDoc = {
  url: string;          // Cloudinary direct URL
  publicId: string;     // Cloudinary public ID
  documentType: string; // e.g. "Professional License"
  fileName: string;
  uploadedAt: string;
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

const navItems = [
  { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/provider-dashboard/profile", label: "Profile", icon: User },
  { href: "/provider-dashboard/services", label: "Services", icon: Briefcase },
  { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar },
  { href: "/provider-dashboard/credentials", label: "Verification", icon: ShieldCheck, active: true },
  { href: "/provider-dashboard/messaging", label: "Messages", icon: MessageSquare, badge: "3" },
  { href: "/provider-dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/provider-dashboard/resources", label: "Resources", icon: BookOpen },
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

  // Documents loaded from Firebase (which stores the Cloudinary URLs)
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDoc[]>([]);

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    { id: 1, title: "Professional License Verified", date: "Jan 15, 2026 at 2:34 PM", status: "Approved" },
    { id: 2, title: "Academic Credentials Verified", date: "Jan 15, 2026 at 2:35 PM", status: "Approved" },
    { id: 3, title: "Government ID Submitted", date: "Mar 7, 2026 at 9:15 AM", status: "Pending" },
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── Dark mode ──
  useEffect(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // ── Load existing documents from Firebase on login ──
  // Firebase stores the Cloudinary URLs so the provider sees their files every login
  useEffect(() => {
    if (!user) return;

    const loadDocuments = async () => {
      try {
        setLoadingFiles(true);
        const uid = user.uid ?? user.id;
        const providerRef = doc(db, "providers", uid);
        const providerSnap = await getDoc(providerRef);

        if (providerSnap.exists()) {
          const data = providerSnap.data();
          // credentials_documents is an array of UploadedDoc objects saved in Firebase
          setUploadedDocuments(data.credentials_documents || []);
        }
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setLoadingFiles(false);
      }
    };

    loadDocuments();
  }, [user]);

  // ── Save updated documents list back to Firebase ──
  const saveToFirebase = async (docs: UploadedDoc[]) => {
    if (!user) return;
    const uid = user.uid ?? user.id;
    const providerRef = doc(db, "providers", uid);
    await setDoc(providerRef, { credentials_documents: docs }, { merge: true });
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

  // ── Upload file to Cloudinary then save URL to Firebase ──
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

      // 1. Send file to our API route which uploads to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);

      const res = await fetch("/api/credentials/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // 2. Build the new document record
      const newDoc: UploadedDoc = {
        url: data.url,               // Cloudinary URL
        publicId: data.publicId,
        documentType,
        fileName: file.name,
        uploadedAt: formatNow(),
      };

      // 3. Add to list and save the updated list to Firebase
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
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragActive(false); };
  const openFilePicker = () => fileInputRef.current?.click();

  const onDropZoneKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFilePicker(); }
  };

  // ── View — just open the Cloudinary URL directly in a new tab ──
  const viewDocument = (doc: UploadedDoc) => {
    window.open(doc.url, "_blank");
  };

  // ── Remove document from list and update Firebase ──
  const removeDocument = async (publicId: string, fileName: string) => {
    const confirmed = window.confirm(`Are you sure you want to remove "${fileName}"?`);
    if (!confirmed) return;

    const updatedDocs = uploadedDocuments.filter((d) => d.publicId !== publicId);
    setUploadedDocuments(updatedDocs);
    await saveToFirebase(updatedDocs);
  };

  const submitForReview = () => {
    if (uploadedDocuments.length === 0) {
      alert("Please upload at least one document before submitting.");
      return;
    }
    setIsSubmitting(true);
    window.setTimeout(() => {
      setHistoryItems((prev) => [
        { id: Date.now(), title: `${uploadedDocuments.length} Document(s) Submitted for Review`, date: formatNow(), status: "Pending Review" },
        ...prev,
      ]);
      setIsSubmitting(false);
      alert("Documents submitted successfully for review! You will be notified once the review is complete.");
    }, 1500);
  };

  const uploadStatusText = useMemo(() => {
    if (documentType === "Select document type...") return "Select a document type above to enable upload";
    return `Ready to upload ${documentType}`;
  }, [documentType]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-100">
      {mobileSidebarOpen && (
        <button className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileSidebarOpen(false)} aria-label="Close sidebar overlay" />
      )}

      {/* SIDEBAR */}
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

          {/* STATUS BANNER */}
          <div className="flex items-center gap-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Verification Pending</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-500/80">Your documents are under review. This usually takes 2-3 business days.</p>
            </div>
            <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">Pending</span>
          </div>

          {/* UPLOAD SECTION */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <UploadCloud className="h-5 w-5 text-sky-600" />
              Upload New Document
            </h3>

            {/* Document type selector */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                {DOC_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </div>

            {/* Drop zone */}
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
                {isUploading ? "Uploading to Cloudinary..." : "Click to upload or drag and drop"}
              </p>
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">PDF, JPG, PNG, DOC up to 10MB</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{uploadStatusText}</p>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Files are securely stored in Cloudinary and linked to your account
            </p>
          </div>

          {/* DOCUMENTS LIST */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <FileCheck className="h-5 w-5 text-sky-600" />
              Your Uploaded Documents
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
                {uploadedDocuments.map((doc) => (
                  <div key={doc.publicId} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/30">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="shrink-0 rounded-lg bg-sky-600/10 p-2">
                        <FileText className="h-5 w-5 text-sky-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800 dark:text-white">{doc.fileName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {doc.documentType} • Uploaded {doc.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {/* View — opens Cloudinary URL directly, no extra API needed */}
                      <button
                        onClick={() => viewDocument(doc)}
                        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-white hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeDocument(doc.publicId, doc.fileName)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                        title="Remove"
                      >
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
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</>
                  : <><UploadCloud className="h-4 w-4" />Submit for Review</>
                }
              </button>
            )}
          </div>

          {/* VERIFICATION HISTORY */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
              <History className="h-5 w-5 text-sky-600" />
              Verification History
            </h3>
            <div className="space-y-3">
              {historyItems.map((item) => {
                const isApproved = item.status === "Approved";
                return (
                  <div key={item.id} className={isApproved ? "flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700/30" : "flex items-center justify-between rounded-lg border border-yellow-100 bg-yellow-50 p-3 dark:border-yellow-900/30 dark:bg-yellow-900/10"}>
                    <div className="flex items-center gap-3">
                      {isApproved ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-yellow-500" />}
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${isApproved ? "text-green-600" : "text-yellow-600"}`}>{item.status}</span>
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
