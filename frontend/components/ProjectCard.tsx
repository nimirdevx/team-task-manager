import Link from "next/link";

import { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="ui-panel block p-5 transition-colors hover:border-hairline-strong hover:bg-surface-2"
    >
      <h3 className="font-display text-card-title text-ink">{project.name}</h3>
      <p className="mt-2 text-body-sm text-ink-subtle">{project.description || "No description"}</p>
    </Link>
  );
}
