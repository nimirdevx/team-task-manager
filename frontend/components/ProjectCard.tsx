import Link from "next/link";

import { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="block rounded-lg border bg-white p-4 hover:shadow">
      <h3 className="font-semibold text-gray-900">{project.name}</h3>
      <p className="mt-1 text-sm text-gray-600">{project.description || "No description"}</p>
    </Link>
  );
}
