"use client";

import Link from "next/link";
import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  Church,
  Edit,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Plus,
  PlusCircle,
  Save,
  Settings,
  ShieldCheck,
  Sun,
  Trash2,
  UploadCloud,
  User,
  X,
  FileText,
} from "lucide-react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

type ServiceStatus = "active" | "paused";

type Service = {
  id: string; // Firestore document ID
  title: string;
  description: string;
  duration: string;
  price: string;
  mode: string;
  status: ServiceStatus;
  icon: "user" | "heart" | "church";
  iconBg: string;
  iconColor: string;
  tags: string[];
};

const defaultSpecializationOptions = [
  "Depression",
  "Anxiety",
  "Trauma",
  "Grief",
  "Marriage",
  "Youth",
  "Addiction",
  "Spiritual",
];

type UploadedServiceFile = {
  id: number;
  name: string;
  sizeKb: string;
  file: File;
};

// Helper to derive icon meta from tags
function deriveIconMeta(tags: string[]): Pick<Service, "icon" | "iconBg" | "iconColor"> {
  if (tags.includes("Marriage")) {
    return {
      icon: "heart",
      iconBg: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    };
  }
  if (tags.includes("Spiritual")) {
    return {
      icon: "church",
      iconBg: "bg-amber-600/10",
      iconColor: "text-amber-600",
    };
  }
  return {
    icon: "user",
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  };
}

export default function ProviderServicesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceDuration, setServiceDuration] = useState("60 minutes");
  const [servicePrice, setServicePrice] = useState("");
  const [isFreeService, setIsFreeService] = useState(false);
  const [serviceMode, setServiceMode] = useState("Both");
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>("active");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customSpecialization, setCustomSpecialization] = useState("");
  const [specializationOptions, setSpecializationOptions] = useState(
    defaultSpecializationOptions
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedServiceFile[]>([]);

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

  // Fetch services from Firestore for the current provider
  useEffect(() => {
    const fetchServices = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingServices(false);
        return;
      }
      try {
        const q = query(
          collection(db, "provider_services"),
          where("provider_id", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const fetched: Service[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          const tags: string[] = Array.isArray(d.specializations) ? d.specializations : [];
          return {
            id: docSnap.id,
            title: d.service_title ?? "",
            description: d.description ?? "",
            duration: d.duration ?? "60 minutes",
            price: d.price ?? "",
            mode: d.delivery_mode ?? "Both",
            status: (d.service_status as ServiceStatus) ?? "active",
            tags,
            ...deriveIconMeta(tags),
          };
        });
        setServices(fetched);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (deleteModalOpen) {
          closeDeleteModal();
        } else if (serviceModalOpen) {
          closeServiceModal();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [deleteModalOpen, serviceModalOpen]);

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

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceTitle("");
    setServiceDescription("");
    setServiceDuration("60 minutes");
    setServicePrice("");
    setIsFreeService(false);
    setServiceMode("Both");
    setServiceStatus("active");
    setSelectedTags([]);
    setCustomSpecialization("");
    setUploadedFiles([]);
  };

  const openServiceModal = (serviceId?: string) => {
    if (serviceId) {
      const service = services.find((item) => item.id === serviceId);
      if (!service) return;

      setEditingServiceId(service.id);
      setServiceTitle(service.title);
      setServiceDescription(service.description);
      setServiceDuration(service.duration);
      setIsFreeService(service.price === "Free");
      setServicePrice(service.price === "Free" ? "0" : service.price.replace(/[^\d]/g, ""));
      setServiceMode(service.mode);
      setServiceStatus(service.status);
      setSelectedTags(service.tags);
      setUploadedFiles([]);
    } else {
      resetServiceForm();
    }

    setServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setServiceModalOpen(false);
  };

  const toggleSpecialization = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const addCustomSpecialization = () => {
    const value = customSpecialization.trim();
    if (!value) return;

    const exists = specializationOptions.some(
      (option) => option.toLowerCase() === value.toLowerCase()
    );

    if (!exists) {
      setSpecializationOptions((prev) => [...prev, value]);
    }

    setSelectedTags((prev) => {
      const alreadySelected = prev.some((tag) => tag.toLowerCase() === value.toLowerCase());
      return alreadySelected ? prev : [...prev, value];
    });

    setCustomSpecialization("");
  };

  const handleCustomSpecializationKeyDown = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomSpecialization();
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    const validFiles: UploadedServiceFile[] = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      validFiles.push({
        id: Date.now() + Math.floor(Math.random() * 100000),
        name: file.name,
        sizeKb: (file.size / 1024).toFixed(1),
        file,
      });
    }

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    }

    e.target.value = "";
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const servicePriceDisplay = useMemo(() => {
    if (isFreeService) return "Free";
    return servicePrice ? `$${Number(servicePrice).toLocaleString()} JMD` : "$0 JMD";
  }, [isFreeService, servicePrice]);

  const handleSaveService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to save a service.");
      return;
    }

    const trimmedTitle = serviceTitle.trim();
    const trimmedDescription = serviceDescription.trim();

    if (!trimmedTitle || !trimmedDescription) {
      alert("Please complete the required fields.");
      return;
    }

    const priceValue = isFreeService ? "Free" : servicePriceDisplay;
    const iconMeta = deriveIconMeta(selectedTags);

    const firestoreData = {
      service_title: trimmedTitle,
      description: trimmedDescription,
      duration: serviceDuration,
      price: priceValue,
      delivery_mode: serviceMode,
      service_status: serviceStatus,
      specializations: selectedTags,
      service_documents: uploadedFiles.map((f) => f.name).join(", "),
      provider_id: user.uid,
      updated_at: serverTimestamp(),
    };

    setSaving(true);
    try {
      if (editingServiceId) {
        await updateDoc(doc(db, "provider_services", editingServiceId), firestoreData);
        setServices((prev) =>
          prev.map((s) =>
            s.id === editingServiceId
              ? {
                  ...s,
                  title: trimmedTitle,
                  description: trimmedDescription,
                  duration: serviceDuration,
                  price: priceValue,
                  mode: serviceMode,
                  status: serviceStatus,
                  tags: selectedTags,
                  ...iconMeta,
                }
              : s
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "provider_services"), {
          ...firestoreData,
          created_at: serverTimestamp(),
        });
        setServices((prev) => [
          ...prev,
          {
            id: docRef.id,
            title: trimmedTitle,
            description: trimmedDescription,
            duration: serviceDuration,
            price: priceValue,
            mode: serviceMode,
            status: serviceStatus,
            tags: selectedTags,
            ...iconMeta,
          },
        ]);
      }

      closeServiceModal();
      resetServiceForm();
    } catch (err) {
      console.error("Failed to save service:", err);
      alert("Failed to save service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (serviceId: string) => {
    const service = services.find((item) => item.id === serviceId);
    if (!service) return;

    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteDoc(doc(db, "provider_services", serviceToDelete.id));
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      closeDeleteModal();
    } catch (err) {
      console.error("Failed to delete service:", err);
      alert("Failed to delete service. Please try again.");
    }
  };

  const toggleServiceStatus = async (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    const newStatus: ServiceStatus = service.status === "active" ? "paused" : "active";

    // Optimistic update
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, status: newStatus } : s))
    );

    try {
      await updateDoc(doc(db, "provider_services", serviceId), {
        service_status: newStatus,
        updated_at: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      // Revert on failure
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, status: service.status } : s))
      );
    }
  };

  const renderServiceIcon = (service: Service) => {
    const iconClass = `h-6 w-6 ${service.iconColor}`;
    if (service.icon === "heart") return <Heart className={iconClass} />;
    if (service.icon === "church") return <Church className={iconClass} />;
    return <User className={iconClass} />;
  };

  const navItems = [
    { href: "/provider-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider-dashboard/profile", label: "Profile", icon: User },
    {
      href: "/provider-dashboard/services",
      label: "Services",
      icon: Briefcase,
      active: true,
    },
    { href: "/provider-dashboard/availability", label: "Availability", icon: Calendar },
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
    { href: "/provider-dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/provider-dashboard/resources", label: "Resources", icon: BookOpen },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100">
      {mobileSidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleMobileSidebar}
          aria-label="Close mobile sidebar"
        />
      )}

      {serviceModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeServiceModal();
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                {editingServiceId ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                onClick={closeServiceModal}
                className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Close service modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-6 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="e.g., Group Therapy Sessions"
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Describe what clients can expect..."
                  required
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Minimum 50 characters recommended
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                    <option>120 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Price (JMD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 dark:text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={servicePrice}
                      onChange={(e) => setServicePrice(e.target.value)}
                      placeholder="15000"
                      required={!isFreeService}
                      disabled={isFreeService}
                      className={`w-full rounded-lg border border-slate-200 py-2 pl-8 pr-4 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white ${
                        isFreeService ? "bg-slate-100 dark:bg-slate-600" : ""
                      }`}
                    />
                  </div>
                  <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={isFreeService}
                      onChange={(e) => {
                        setIsFreeService(e.target.checked);
                        if (e.target.checked) {
                          setServicePrice("0");
                        } else {
                          setServicePrice("");
                        }
                      }}
                      className="h-4 w-4 rounded text-sky-600 focus:ring-sky-600"
                    />
                    <span>This is a free service</span>
                  </label>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Delivery Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={serviceMode}
                    onChange={(e) => setServiceMode(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option>In Person</option>
                    <option>Virtual (Online)</option>
                    <option>Both</option>
                    <option>Phone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Specializations / Tags
                </label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {specializationOptions.map((tag) => {
                    const selected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleSpecialization(tag)}
                        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                          selected
                            ? "border-sky-600 bg-sky-600 text-white"
                            : "border-slate-200 hover:border-sky-600 hover:text-sky-600 dark:border-slate-600"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSpecialization}
                    onChange={(e) => setCustomSpecialization(e.target.value)}
                    onKeyDown={handleCustomSpecializationKeyDown}
                    placeholder="Add custom tag..."
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition-all focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addCustomSpecialization}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Service Documents
                </label>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-sky-600 dark:border-slate-600"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="mx-auto mb-3 w-fit rounded-full bg-sky-600/10 p-3">
                    <UploadCloud className="h-6 w-6 text-sky-600" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Click to upload documents
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PDF, Word, or Images up to 10MB each
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Service descriptions, intake forms, or promotional materials
                  </p>
                </button>

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                      Uploaded Files:
                    </p>
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-600 dark:bg-slate-700/40"
                      >
                        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                          <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="truncate text-sm text-slate-700 dark:text-slate-200">
                            {file.name}
                          </span>
                          <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                            ({file.sizeKb} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="rounded p-1 text-slate-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Service Status
                </label>
                <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="serviceStatus"
                      value="active"
                      checked={serviceStatus === "active"}
                      onChange={() => setServiceStatus("active")}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-200">
                      Active (Visible to clients)
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="serviceStatus"
                      value="paused"
                      checked={serviceStatus === "paused"}
                      onChange={() => setServiceStatus("paused")}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-200">
                      Paused (Hidden from clients)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                <button
                  type="button"
                  onClick={closeServiceModal}
                  className="rounded-lg border border-slate-200 px-6 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-2 font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Service
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && serviceToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-slate-800 dark:text-white">
                Delete Service?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to delete{" "}
                <span className="font-medium text-slate-800 dark:text-white">
                  "{serviceToDelete.title}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteService}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
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
                Services Management
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your therapeutic offerings
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
                onClick={() => openServiceModal()}
                className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8">
          <div
            id="servicesGrid"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {loadingServices ? (
              <div className="col-span-full py-12 text-center text-slate-400">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
                <p className="text-sm">Loading your services...</p>
              </div>
            ) : services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className={`group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${
                    service.status === "paused" ? "opacity-75" : ""
                  }`}
                >
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`rounded-lg p-3 ${service.iconBg}`}>
                        {renderServiceIcon(service)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openServiceModal(service.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                          aria-label={`Edit ${service.title}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(service.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                          aria-label={`Delete ${service.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-slate-500 dark:text-slate-300">
                      {service.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Duration</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {service.duration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Price</span>
                        <span className="font-medium text-sky-600">{service.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Mode</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {service.mode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3 dark:border-slate-700 dark:bg-slate-700/50">
                    <button
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                        service.status === "active"
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          service.status === "active" ? "bg-green-600" : "bg-yellow-600"
                        }`}
                      />
                      {service.status === "active" ? "Active" : "Paused"}
                    </button>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {service.status === "active" ? "Active" : "Paused"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400">
                <Briefcase className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p className="text-lg font-medium">No services yet</p>
                <p className="text-sm">
                  Click "Add Service" to create your first offering
                </p>
              </div>
            )}

            <button
              onClick={() => openServiceModal()}
              className="group flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-6 text-slate-400 transition-colors hover:border-sky-600 hover:text-sky-600 dark:border-slate-600"
            >
              <PlusCircle className="mb-2 h-12 w-12 transition-transform group-hover:scale-110" />
              <span className="font-medium">Add New Service</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
