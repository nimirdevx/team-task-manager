"use client";

import { useEffect, useMemo, useState } from "react";

import AppShell from "@/components/AppShell";
import TaskCard from "@/components/TaskCard";
import { api } from "@/lib/api";
import { Task } from "@/lib/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/tasks")
      .then(setTasks)
      .catch((err) => setError(err.message));
  }, []);

  const filtered = useMemo(() => {
    if (status === "all") return tasks;
    if (status === "overdue") return tasks.filter((task) => task.is_overdue);
    return tasks.filter((task) => task.status === status);
  }, [tasks, status]);

  const updateStatus = async (taskId: string, value: string) => {
    try {
      const updated = await api.patch(`/tasks/${taskId}/status`, { status: value });
      setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    }
  };

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded border px-3 py-2 text-sm">
          <option value="all">All</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <div className="space-y-3">
        {filtered.map((task) => (
          <div key={task.id} className="space-y-2">
            <TaskCard task={task} />
            <select
              className="rounded border px-2 py-1 text-sm"
              value={task.status}
              onChange={(e) => updateStatus(task.id, e.target.value)}
            >
              <option value="todo">todo</option>
              <option value="in-progress">in-progress</option>
              <option value="done">done</option>
            </select>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
