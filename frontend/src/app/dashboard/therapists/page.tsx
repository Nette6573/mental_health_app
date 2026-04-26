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

// These match what your SpecialtyFilters component actually expects
const SPECIALTIES = [
  { value: "all", label: "All Specialties" },
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
  { value: "trauma", label: "Trauma" },
  { value: "couples", label: "Couples Therapy" },
  { value: "addiction", label: "Addiction" },
];

const LOCATIONS = [
  { value: "all", label: "All Locations" },
  { value: "Kingston", label: "Kingston" },
  { value: "Montego Bay", label: "Montego Bay" },
  { value: "Spanish Town", label: "Spanish Town" },
  { value: "Online", label: "Online" },
];

export default function TherapistsPage() {
  const { user, isLoading: authLoading } = useAuth() as any;
  const router = useRouter();

  // ── State ──
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

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

  // ── Filter logic ──
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

  // ── Auth loading ──
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

        {/* FILTERS — passing props that match what SpecialtyFilters actually accepts */}
        <SpecialtyFilters
          specialties={SPECIALTIES}
          locations={LOCATIONS}
          selectedSpecialty={selectedSpecialty}
          selectedLocation={selectedLocation}
          onSpecialtyChange={setSelectedSpecialty}
          onLocationChange={setSelectedLocation}
        />

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
