"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import StatsCard from "@/components/StatsCard";
import { api } from "@/lib/api";
import { Task } from "@/lib/types";

type DashboardData = {
  total_tasks: number;
  completed: number;
  in_progress: number;
  overdue: number;
  recent_tasks: Task[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const hasTasks = (data?.total_tasks ?? 0) > 0;

  return (
    <AppShell>
      <p className="font-mono text-caption uppercase tracking-[0.4px] text-ink-subtle">Overview</p>
      <h1 className="ui-page-title mt-1">Dashboard</h1>
      <p className="mt-2 max-w-xl text-body-sm text-ink-subtle">Tasks assigned to you — status and overdue counts.</p>
      {error && <p className="ui-error mt-6">{error}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total tasks" value={data?.total_tasks || 0} />
        <StatsCard label="Completed" value={data?.completed || 0} />
        <StatsCard label="In progress" value={data?.in_progress || 0} />
        <StatsCard label="Overdue" value={data?.overdue || 0} />
      </div>

      {!hasTasks && data !== null && (
        <div className="mt-10">
          <EmptyState
            label="Your queue"
            title="No tasks assigned to you yet"
            description="When an admin adds you to a project and assigns work, it will show up here and on My tasks."
          >
            <Link href="/projects" className="btn-secondary">
              View projects
            </Link>
            <Link href="/tasks" className="btn-primary">
              Open My tasks
            </Link>
          </EmptyState>
        </div>
      )}

      {hasTasks && (
        <div className="ui-panel mt-10 overflow-hidden">
          <div className="border-b border-hairline px-5 py-4">
            <h2 className="ui-section-title text-lg">Recent</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="border-b border-hairline bg-cream-warm">
                  <th className="px-5 py-3 font-medium text-ink-tertiary">Title</th>
                  <th className="px-5 py-3 font-medium text-ink-tertiary">Status</th>
                  <th className="px-5 py-3 font-medium text-ink-tertiary">Due</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recent_tasks || []).map((task) => (
                  <tr key={task.id} className="border-b border-hairline last:border-0">
                    <td className="px-5 py-3 text-ink">{task.title}</td>
                    <td className="px-5 py-3 text-ink-muted">{task.is_overdue ? "overdue" : task.status}</td>
                    <td className="px-5 py-3 font-mono text-caption text-ink-subtle">
                      {new Date(task.due_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
