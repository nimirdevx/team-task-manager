"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getToken } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    } else {
      setShowLanding(true);
    }
  }, [router]);

  if (!showLanding) {
    return (
      <div className="auth-page flex items-center justify-center px-6">
        <p className="text-body-sm text-oncream-subtle">Opening…</p>
      </div>
    );
  }

  return (
    <div className="auth-page flex flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="auth-card max-w-md text-center">
        <p className="font-mono text-caption font-medium uppercase tracking-[0.4px] text-cream-muted">Team Task Manager</p>
        <h1 className="mt-3 font-display text-headline tracking-tight text-oncream">
          Projects, tasks, and roles in one place
        </h1>
        <p className="mt-4 text-body-sm leading-relaxed text-oncream-subtle">
          Sign in to manage projects, assign work, and track status. Admins bootstrap the team; members collaborate on shared
          projects.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login" className="btn-primary sm:min-w-[140px]">
            Log in
          </Link>
          <Link href="/signup" className="btn-secondary sm:min-w-[140px]">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
