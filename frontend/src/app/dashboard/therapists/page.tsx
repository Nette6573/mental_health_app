"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import TherapistCard from "@/components/dashboard/therapists/TherapistCard";
import SpecialtyFilters from "@/components/dashboard/therapists/SpecialtyFilters";
import SearchBar from "@/components/dashboard/resources/SearchBar";

export default function TherapistsPage() {
  const { user, isLoading: authLoading } = useAuth() as any;
  const router = useRouter();

  // ── State ──
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [activeFilters, setActiveFilters] = useState(new Set());

  // Each provider is stored exactly as it comes from Firestore
  const [providers, setProviders] = useState<any[]>([]);

  // ── Auth guard ──
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // ── Fetch all providers from Firebase ──
  useEffect(() => {
    if (!user) return;

    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        setFetchError("");

        const providersSnap = await getDocs(collection(db, "providers"));

        // For each document, call .data() to get the fields — same pattern as settings page
        const providerList: any[] = [];
        providersSnap.forEach((providerDoc) => {
          const data = providerDoc.data();
          providerList.push({
            id: providerDoc.id,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            professional_email: data.professional_email || "",
            bio: data.bio || "",
            specialization: data.specialization || [],
            location: data.location || "",
            profile_photo: data.profile_photo || "",
            years_of_experience: data.years_of_experience || "",
            session_rate: data.session_rate || "",
            languages: data.languages || [],
            is_accepting_clients: data.is_accepting_clients ?? true,
          });
        });

        setProviders(providerList);
      } catch (error: any) {
        console.error("Error fetching providers:", error);
        setFetchError(error.message || "Failed to load therapists");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [user]);

  // ── Filter logic — runs against the providers list ──
  const filteredProviders = providers.filter((provider) => {
    const fullName = `${provider.first_name} ${provider.last_name}`.toLowerCase();
    const bio = provider.bio.toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery || fullName.includes(query) || bio.includes(query);

    const matchesSpecialty =
      selectedSpecialty === "all" ||
      provider.specialization.includes(selectedSpecialty);

    const matchesLocation =
      selectedLocation === "all" || provider.location === selectedLocation;

    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  // ── Start chat ──
  const startChat = (providerId: string) => {
    localStorage.setItem("activeTherapist", providerId);
    router.push("/dashboard/chat");
  };

  // ── Loading state ──
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Find Your Therapist
          </h1>
          <p className="text-gray-500">
            Browse licensed providers and connect with the right fit for you
          </p>
        </div>

        {/* SEARCH */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name or specialty..."
        />

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3">
          <SpecialtyFilters
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
          />

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="all">All Locations</option>
            <option value="Kingston">Kingston</option>
            <option value="Montego Bay">Montego Bay</option>
            <option value="Spanish Town">Spanish Town</option>
            <option value="Online">Online</option>
          </select>
        </div>

        {/* RESULTS COUNT */}
        {!isLoading && !fetchError && (
          <p className="text-sm text-gray-500">
            {filteredProviders.length}{" "}
            {filteredProviders.length === 1 ? "therapist" : "therapists"} found
          </p>
        )}

        {/* LOADING SKELETONS */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!isLoading && fetchError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-700">Failed to load therapists</p>
            <p className="mt-1 text-sm text-red-500">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !fetchError && filteredProviders.length === 0 && (
          <div className="rounded-xl border border-slate-200 p-10 text-center text-gray-500">
            <p className="text-lg font-medium">No therapists found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {/* PROVIDER CARDS */}
        {!isLoading && !fetchError && filteredProviders.length > 0 && (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <TherapistCard
                key={provider.id}
                therapist={provider}
                onChat={() => startChat(provider.id)}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
