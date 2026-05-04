"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { setAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      setAuth(data.access_token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="auth-page flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="auth-card max-w-[400px]">
        <p className="font-mono text-caption font-medium uppercase tracking-[0.4px] text-cream-muted">Alpha</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-oncream md:text-[28px]">Sign in</h1>
        <p className="mt-2 text-body-sm text-oncream-muted">Team Task Manager</p>
        {error && <p className="mt-6 rounded-md border border-red-200/80 bg-red-50/90 px-3 py-2 text-body-sm text-red-800">{error}</p>}
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="ui-input-light"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="ui-input-light"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" className="btn-primary mt-2 w-full">
            Continue
          </button>
        </form>
        <p className="mt-8 text-center text-body-sm text-oncream-muted">
          New user?{" "}
          <Link
            className="font-medium text-oncream underline decoration-rail-border underline-offset-4 transition-colors hover:text-primary"
            href="/signup"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
