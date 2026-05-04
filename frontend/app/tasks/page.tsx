"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import TaskCard from "@/components/TaskCard";
import { api } from "@/lib/api";
import { Task, TaskStatus } from "@/lib/types";

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

  const updateStatus = async (taskId: string, value: TaskStatus) => {
    try {
      const updated = await api.patch(`/tasks/${taskId}/status`, { status: value });
      setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    }
  };

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.4px] text-ink-subtle">Assigned to you</p>
          <h1 className="ui-page-title mt-1">My tasks</h1>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="ui-select w-auto min-w-[140px]">
          <option value="all" className="bg-surface-1">
            All
          </option>
          <option value="todo" className="bg-surface-1">
            Todo
          </option>
          <option value="in-progress" className="bg-surface-1">
            In progress
          </option>
          <option value="done" className="bg-surface-1">
            Done
          </option>
          <option value="overdue" className="bg-surface-1">
            Overdue
          </option>
        </select>
      </div>
      {error && <p className="ui-error mb-6">{error}</p>}
      {tasks.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            label="Tasks"
            title="Nothing in your inbox"
            description="You do not have any tasks assigned yet. Once a project admin assigns you work, it will appear here."
          >
            <Link href="/projects" className="btn-primary">
              Browse projects
            </Link>
          </EmptyState>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            label="Filter"
            title="No tasks match this view"
            description="Try choosing a different status, or switch back to All to see everything assigned to you."
          >
            <button type="button" className="btn-secondary" onClick={() => setStatus("all")}>
              Show all tasks
            </button>
          </EmptyState>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              editableStatus
              onStatusChange={(status) => updateStatus(task.id, status)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
