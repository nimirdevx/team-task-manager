"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import AppShell from "@/components/AppShell";
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{detail?.project.name || "Project"}</h1>
        <RoleGuard role={user?.role} allowed={["admin"]}>
          <div className="flex gap-2">
            <button onClick={() => setShowMember(true)} className="rounded bg-gray-800 px-3 py-2 text-white">
              Add Member
            </button>
            <button onClick={() => setShowTask(true)} className="rounded bg-blue-600 px-3 py-2 text-white">
              Create Task
            </button>
          </div>
        </RoleGuard>
      </div>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <section className="mb-6 rounded border bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">Members</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {(detail?.members || []).map((member) => (
            <div key={member.id} className="rounded border p-2 text-sm">
              {member.name} ({member.role}) - {member.email}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tasks</h2>
        {(detail?.tasks || []).map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </section>

      {showTask && (
        <Modal title="Create Task" onClose={() => setShowTask(false)}>
          <form onSubmit={createTask} className="space-y-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded border px-3 py-2" placeholder="Title" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="Description" />
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full rounded border px-3 py-2">
              {(detail?.members || []).map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full rounded border px-3 py-2" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded border px-3 py-2">
              <option value="todo">todo</option>
              <option value="in-progress">in-progress</option>
              <option value="done">done</option>
            </select>
            <button className="rounded bg-blue-600 px-4 py-2 text-white">Create Task</button>
          </form>
        </Modal>
      )}

      {showMember && (
        <Modal title="Add Member by User ID" onClose={() => setShowMember(false)}>
          <form onSubmit={addMember} className="space-y-3">
            <input
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
              className="w-full rounded border px-3 py-2"
              placeholder="User ID"
            />
            <button className="rounded bg-gray-800 px-4 py-2 text-white">Add Member</button>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
