import { Task } from "@/lib/types";

function getStatusClass(task: Task): string {
  if (task.is_overdue) return "bg-red-100 text-red-700";
  if (task.status === "done") return "bg-green-100 text-green-700";
  if (task.status === "in-progress") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
}

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{task.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{task.description || "No description"}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(task)}`}>
          {task.is_overdue ? "overdue" : task.status}
        </span>
      </div>
      <p className="mt-3 text-xs text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
    </div>
  );
}
