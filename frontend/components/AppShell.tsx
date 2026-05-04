"use client";

import { useMemo } from "react";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getUser } from "@/lib/auth";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const user = useMemo(() => getUser(), []);
  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 md:flex">
        <Navbar user={user} />
        <main className="flex-1 bg-white p-4 md:p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
