"use client";

import { useCallback, useEffect, useState } from "react";

import AppShell from "@/components/AppShell";
import { getToken, getUser, setAuth, subscribeAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { User } from "@/lib/types";

export default function TeamPage() {
  const [self, setSelf] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    setSelf(getUser());
    return subscribeAuth(() => setSelf(getUser()));
  }, []);

  const load = useCallback(() => {
    setError("");
    api
      .get("/users")
      .then((data) => setUsers(data as User[]))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load team"));
  }, []);

  useEffect(() => {
    if (self?.role !== "admin") return;
    load();
  }, [self?.role, load]);

  const syncSessionUser = async () => {
    const token = getToken();
    const me = (await api.get("/auth/me")) as User;
    if (token) setAuth(token, me);
  };

  const setRole = async (userId: string, role: "admin" | "member") => {
    setError("");
    setPendingId(userId);
    try {
      await api.patch(`/users/${userId}/role`, { role });
      await load();
      if (userId === self?.id) await syncSessionUser();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setPendingId(null);
    }
  };

  const adminCount = users.filter((u) => u.role === "admin").length;

  if (!self) {
    return (
      <AppShell>
        <p className="text-gray-600">Loading…</p>
      </AppShell>
    );
  }

  if (self.role !== "admin") {
    return (
      <AppShell>
        <h1 className="mb-2 text-2xl font-bold">Team &amp; roles</h1>
        <p className="text-gray-600">
          Only organization admins can manage roles. If you need admin access, ask an existing admin to promote you on this page.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="mb-2 text-2xl font-bold">Team &amp; roles</h1>
      <p className="mb-6 max-w-2xl text-gray-600">
        The first person to sign up is the initial admin. Here admins can promote teammates to admin or set them back to member. At least one admin is always required.
      </p>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === self?.id;
              const busy = pendingId === u.id;
              const soleAdmin = u.role === "admin" && adminCount <= 1;
              return (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    {u.name}
                    {isSelf ? <span className="ml-2 text-xs text-gray-500">(you)</span> : null}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {u.role === "member" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setRole(u.id, "admin")}
                        className="rounded bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                      >
                        {busy ? "…" : "Make admin"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busy || soleAdmin}
                        title={soleAdmin ? "Cannot remove the last admin" : undefined}
                        onClick={() => setRole(u.id, "member")}
                        className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {busy ? "…" : "Make member"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
