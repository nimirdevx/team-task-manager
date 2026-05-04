"use client";

import { useEffect, useState } from "react";

import AppShell from "@/components/AppShell";
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

  return (
    <AppShell>
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Tasks" value={data?.total_tasks || 0} />
        <StatsCard label="Completed" value={data?.completed || 0} />
        <StatsCard label="In Progress" value={data?.in_progress || 0} />
        <StatsCard label="Overdue" value={data?.overdue || 0} />
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Overdue / Recent Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Title</th>
                <th className="py-2">Status</th>
                <th className="py-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recent_tasks || []).map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="py-2">{task.title}</td>
                  <td className="py-2">{task.is_overdue ? "overdue" : task.status}</td>
                  <td className="py-2">{new Date(task.due_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
