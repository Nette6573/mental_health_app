"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "../../components/layout/AdminSidebar";
import AdminHeader from "../../components/layout/AdminHeader";
import SessionTimeout from "../../components/auth/SessionTimeout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { state } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push("/admin/login");
    }
  }, [state.isLoading, state.isAuthenticated, router]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!state.isAuthenticated) return null;

  return (
    <>
      <SessionTimeout />
      <div className="min-h-screen flex">
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1">
          <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </>
  );
}