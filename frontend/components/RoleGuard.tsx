"use client";

import { UserRole } from "@/lib/types";

export default function RoleGuard({
  role,
  allowed,
  children,
}: {
  role: UserRole | undefined;
  allowed: UserRole[];
  children: React.ReactNode;
}) {
  if (!role || !allowed.includes(role)) return null;
  return <>{children}</>;
}
