"use client";

import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ChatProvider } from "@/contexts/ChatContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ChatProvider>
        {children}
      </ChatProvider>
    </AdminAuthProvider>
  );
}