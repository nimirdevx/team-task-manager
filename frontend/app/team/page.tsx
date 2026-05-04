"use client";

import { useCallback, useEffect, useState } from "react";

import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
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
        <p className="text-body-sm text-ink-subtle">Loading…</p>
      </AppShell>
    );
  }

  if (self.role !== "admin") {
    return (
      <AppShell>
        <p className="font-mono text-caption uppercase tracking-[0.4px] text-ink-subtle">Access</p>
        <h1 className="ui-page-title mt-1">Team &amp; roles</h1>
        <p className="mt-4 max-w-xl text-body-sm text-ink-subtle">
          Only organization admins can manage roles. Ask an admin to promote you here.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <p className="font-mono text-caption uppercase tracking-[0.4px] text-ink-subtle">Organization</p>
      <h1 className="ui-page-title mt-1">Team &amp; roles</h1>
      <p className="mt-3 max-w-2xl text-body-sm text-ink-subtle">
        The first signup is the initial admin. Promote teammates to admin or set them to member. At least one admin is required.
      </p>
      {error && <p className="ui-error mt-6">{error}</p>}
      {users.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            label="Directory"
            title="No users found"
            description="Sign up another account or refresh — the team list loads from your organization database."
          />
        </div>
      ) : (
      <div className="ui-panel mt-8 overflow-hidden">
        <table className="w-full text-left text-body-sm">
          <thead>
            <tr className="border-b border-hairline bg-surface-2">
              <th className="px-5 py-3 font-medium text-ink-tertiary">Name</th>
              <th className="px-5 py-3 font-medium text-ink-tertiary">Email</th>
              <th className="px-5 py-3 font-medium text-ink-tertiary">Role</th>
              <th className="px-5 py-3 font-medium text-ink-tertiary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === self?.id;
              const busy = pendingId === u.id;
              const soleAdmin = u.role === "admin" && adminCount <= 1;
              return (
                <tr key={u.id} className="border-b border-hairline last:border-0">
                  <td className="px-5 py-3 text-ink">
                    {u.name}
                    {isSelf ? <span className="ml-2 font-mono text-caption text-ink-tertiary">(you)</span> : null}
                  </td>
                  <td className="px-5 py-3 text-ink-muted">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-pill border px-2 py-0.5 font-mono text-caption capitalize ${
                        u.role === "admin" ? "border-primary/50 text-ink" : "border-hairline text-ink-subtle"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {u.role === "member" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setRole(u.id, "admin")}
                        className="btn-primary text-caption"
                      >
                        {busy ? "…" : "Make admin"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busy || soleAdmin}
                        title={soleAdmin ? "Cannot remove the last admin" : undefined}
                        onClick={() => setRole(u.id, "member")}
                        className="btn-secondary text-caption"
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
      )}
    </AppShell>
  );
}
