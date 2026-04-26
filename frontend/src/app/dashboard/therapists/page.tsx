"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export default function TherapistsPage() {
  const { user, isLoading: authLoading } = useAuth() as any;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Redirect if not logged in ──
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // ── Fetch providers from Firebase once user is confirmed ──
  useEffect(() => {
    if (!user) return;

    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        setFetchError("");

        const snapshot = await getDocs(collection(db, "providers"));

        const providerList: any[] = [];
        snapshot.forEach((providerDoc) => {
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

  // ── Search filter ──
  const filteredProviders = providers.filter((provider) => {
    if (!searchQuery) return true;
    const fullName = `${provider.first_name} ${provider.last_name}`.toLowerCase();
    const bio = (provider.bio || "").toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      bio.includes(searchQuery.toLowerCase())
    );
  });

  // ── Auth still loading ──
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
      <div className="space-y-6 p-4 sm:p-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Find Your Therapist
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browse licensed providers and connect with the right fit for you
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />

        {/* RESULTS COUNT */}
        {!isLoading && !fetchError && (
          <p className="text-sm text-gray-500">
            {filteredProviders.length}{" "}
            {filteredProviders.length === 1 ? "therapist" : "therapists"} found
          </p>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />
            ))}
          </div>
        )}

        {/* ERROR */}
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

        {/* EMPTY */}
        {!isLoading && !fetchError && filteredProviders.length === 0 && (
          <div className="rounded-xl border border-slate-200 p-10 text-center text-gray-500">
            <p className="text-lg font-medium">No therapists found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        )}

        {/* PROVIDER CARDS — pure Firebase data, no external components */}
        {!isLoading && !fetchError && filteredProviders.length > 0 && (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start gap-4">

                  {/* Avatar / Profile Photo */}
                  {provider.profile_photo ? (
                    <img
                      src={provider.profile_photo}
                      alt={`${provider.first_name} ${provider.last_name}`}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-600 text-lg font-bold text-white">
                      {provider.first_name?.[0] || ""}{provider.last_name?.[0] || ""}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        {provider.first_name} {provider.last_name}
                      </h3>
                      {/* Accepting clients badge */}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          provider.is_accepting_clients
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {provider.is_accepting_clients ? "Accepting Clients" : "Not Accepting"}
                      </span>
                    </div>

                    {/* Bio */}
                    {provider.bio && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {provider.bio}
                      </p>
                    )}

                    {/* Details row */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1 text-sm text-slate-500 dark:text-slate-400">
                      {provider.location && (
                        <span>📍 {provider.location}</span>
                      )}
                      {provider.years_of_experience && (
                        <span>🎓 {provider.years_of_experience} years experience</span>
                      )}
                      {provider.session_rate && (
                        <span>💵 {provider.session_rate}</span>
                      )}
                      {provider.languages.length > 0 && (
                        <span>🗣 {provider.languages.join(", ")}</span>
                      )}
                    </div>

                    {/* Specializations */}
                    {provider.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {provider.specialization.map((spec: string) => (
                          <span
                            key={spec}
                            className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                  <button
                    onClick={() => router.push(`/dashboard/therapists/${provider.id}`)}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/chat?therapist=${provider.id}`)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
