"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getUser, subscribeAuth } from "@/lib/auth";
import { User } from "@/lib/types";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
    return subscribeAuth(() => setUser(getUser()));
  }, []);

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-cream md:flex-row">
        <Navbar user={user} />
        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col border-t border-rail-border bg-cream md:border-l md:border-t-0 md:border-rail-border">
          <div className="app-main relative flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
