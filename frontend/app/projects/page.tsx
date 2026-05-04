"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
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
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-caption uppercase tracking-[0.4px] text-ink-subtle">Workspace</p>
          <h1 className="ui-page-title mt-1">Projects</h1>
        </div>
        <RoleGuard role={user?.role} allowed={["admin"]}>
          <button type="button" onClick={() => setShowCreate(true)} className="btn-primary">
            Create project
          </button>
        </RoleGuard>
      </div>
      {error && <p className="ui-error mb-6">{error}</p>}
      {projects.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            label="Projects"
            title="No projects yet"
            description={
              user?.role === "admin"
                ? "Create a project to organize tasks and invite teammates by user ID from the sidebar."
                : "Ask an admin to add you to a project. You will see it here once you are a member."
            }
          >
            <RoleGuard role={user?.role} allowed={["admin"]}>
              <button type="button" onClick={() => setShowCreate(true)} className="btn-primary">
                Create project
              </button>
            </RoleGuard>
          </EmptyState>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="Create project" onClose={() => setShowCreate(false)}>
          <form onSubmit={createProject} className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="ui-input"
              placeholder="Project name"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="ui-input min-h-[88px] resize-y"
              placeholder="Description"
            />
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Create
            </button>
          </form>
        </Modal>
      )}
    </AppShell>
  );
}
