import { Task, TaskStatus } from "@/lib/types";

function statusBadgeClass(task: Task): string {
  if (task.is_overdue) return "border-hairline-strong text-ink-muted";
  if (task.status === "done") return "border-success/40 bg-surface-2 text-success";
  if (task.status === "in-progress") return "border-hairline text-ink-muted";
  return "border-hairline text-ink-subtle";
}

type TaskCardProps = {
  task: Task;
  editableStatus?: boolean;
  onStatusChange?: (status: TaskStatus) => void;
};

export default function TaskCard({ task, editableStatus = false, onStatusChange }: TaskCardProps) {
  return (
    <div className="ui-panel p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-medium tracking-tight text-ink">{task.title}</h3>
          <p className="mt-1 text-body-sm text-ink-subtle">{task.description || "No description"}</p>
        </div>
        <span
          className={`shrink-0 rounded-pill border px-2.5 py-1 font-mono text-caption capitalize ${statusBadgeClass(task)}`}
        >
          {task.is_overdue ? "overdue" : task.status}
        </span>
      </div>

      <div className="mt-4 border-t border-hairline pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-caption text-ink-tertiary">Due {new Date(task.due_date).toLocaleDateString()}</p>
          {editableStatus && onStatusChange ? (
            <>
              <label className="sr-only" htmlFor={`task-status-${task.id}`}>
                Status
              </label>
              <select
                id={`task-status-${task.id}`}
                className="ui-select w-full sm:max-w-[220px] sm:shrink-0"
                value={task.status}
                onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
              >
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
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
