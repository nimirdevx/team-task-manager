"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import AppShell from "@/components/AppShell";
import Modal from "@/components/Modal";
import ProjectCard from "@/components/ProjectCard";
import RoleGuard from "@/components/RoleGuard";
import { getUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { Project } from "@/lib/types";

export default function ProjectsPage() {
  const user = useMemo(() => getUser(), []);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const loadProjects = () => {
    api
      .get("/projects")
      .then(setProjects)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/projects", { name, description });
      setShowCreate(false);
      setName("");
      setDescription("");
      loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create project failed");
    }
  };

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <RoleGuard role={user?.role} allowed={["admin"]}>
          <button onClick={() => setShowCreate(true)} className="rounded bg-blue-600 px-4 py-2 text-white">
            Create Project
          </button>
        </RoleGuard>
      </div>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {showCreate && (
        <Modal title="Create Project" onClose={() => setShowCreate(false)}>
          <form onSubmit={createProject} className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded border px-3 py-2"
              placeholder="Project name"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Project description"
            />
            <button className="rounded bg-blue-600 px-4 py-2 text-white">Create</button>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
