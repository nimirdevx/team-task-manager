export type UserRole = "admin" | "member";
export type TaskStatus = "todo" | "in-progress" | "done";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  members: string[];
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  project_id: string;
  assigned_to: string;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  is_overdue?: boolean;
};
