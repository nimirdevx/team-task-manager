"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import RoleGuard from "@/components/RoleGuard";
import TaskCard from "@/components/TaskCard";
import { getUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { Project, Task, User } from "@/lib/types";

type Detail = {
  project: Project;
  tasks: Task[];
  members: User[];
};

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const user = useMemo(() => getUser(), []);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [showTask, setShowTask] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("todo");
  const [memberId, setMemberId] = useState("");

  const loadDetail = () => {
    api
      .get(`/projects/${params.id}`)
      .then((data) => {
        setDetail(data);
        if (data.members.length > 0) setAssignedTo(data.members[0].id);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    if (params.id) loadDetail();
  }, [params.id]);

  const createTask = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tasks", {
        title,
        description,
        project_id: params.id,
        assigned_to: assignedTo,
        status,
        due_date: new Date(dueDate).toISOString(),
      });
      setShowTask(false);
      setTitle("");
      setDescription("");
      setDueDate("");
      loadDetail();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create task failed");
    }
  };

  const addMember = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${params.id}/members`, { user_id: memberId });
      setShowMember(false);
      setMemberId("");
      loadDetail();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Add member failed");
    }
  };

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.4px] text-ink-subtle">Project</p>
          <h1 className="ui-page-title mt-1">{detail?.project.name || "…"}</h1>
        </div>
        <RoleGuard role={user?.role} allowed={["admin"]}>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowMember(true)} className="btn-secondary">
              Add member
            </button>
            <button type="button" onClick={() => setShowTask(true)} className="btn-primary">
              Create task
            </button>
          </div>
        </RoleGuard>
      </div>

      {error && <p className="ui-error mb-6">{error}</p>}

      <section className="ui-panel mb-8 p-5 md:p-6">
        <h2 className="ui-section-title text-lg">Members</h2>
        {(detail?.members || []).length === 0 ? (
          <div className="mt-4">
            <EmptyState
              label="Members"
              title="No members listed"
              description="This is unusual for an active project — try refreshing. Admins can add people with their user ID."
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {(detail?.members || []).map((member) => (
              <div key={member.id} className="rounded-md border border-hairline bg-cream-warm px-3 py-2 text-body-sm text-ink-muted">
                <span className="text-ink">{member.name}</span>{" "}
                <span className="font-mono text-caption text-ink-subtle">({member.role})</span> — {member.email}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="ui-section-title mb-4 text-lg">Tasks</h2>
        {(detail?.tasks || []).length === 0 ? (
          <EmptyState
            label="Tasks"
            title="No tasks in this project"
            description="Tasks created for this project show up here. Assignees can update status from My tasks."
          >
            <RoleGuard role={user?.role} allowed={["admin"]}>
              <button type="button" onClick={() => setShowTask(true)} className="btn-primary">
                Create task
              </button>
            </RoleGuard>
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {(detail?.tasks || []).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      {showTask && (
        <Modal title="Create task" onClose={() => setShowTask(false)}>
          <form onSubmit={createTask} className="space-y-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="ui-input" placeholder="Title" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="ui-input min-h-[80px] resize-y"
              placeholder="Description"
            />
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="ui-select">
              {(detail?.members || []).map((member) => (
                <option key={member.id} value={member.id} className="bg-surface-1 text-ink">
                  {member.name}
                </option>
              ))}
            </select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="ui-input" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="ui-select">
              <option value="todo" className="bg-surface-1">
                todo
              </option>
              <option value="in-progress" className="bg-surface-1">
                in-progress
              </option>
              <option value="done" className="bg-surface-1">
                done
              </option>
            </select>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </form>
        </Modal>
      )}

      {showMember && (
        <Modal title="Add member by user ID" onClose={() => setShowMember(false)}>
          <form onSubmit={addMember} className="space-y-4">
            <input value={memberId} onChange={(e) => setMemberId(e.target.value)} required className="ui-input font-mono" placeholder="User ID" />
            <button type="submit" className="btn-primary">
              Add member
            </button>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
