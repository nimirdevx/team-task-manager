"use client";

import { clearAuth, getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    clearAuth();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const d = err.detail;
    const message =
      typeof d === "string"
        ? d
        : Array.isArray(d)
          ? d.map((x: { msg?: string }) => x.msg).filter(Boolean).join("; ")
          : "Request failed";
    throw new Error(message || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body: object) => request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path: string, body: object) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
};
