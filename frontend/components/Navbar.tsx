"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { clearAuth } from "@/lib/auth";
import { User } from "@/lib/types";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" },
];

export default function Navbar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <aside className="w-full bg-gray-900 p-4 text-white md:h-screen md:w-64">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Team Task Manager</h1>
        <p className="mt-2 text-sm text-gray-300">{user.name}</p>
        <span className="mt-1 inline-block rounded-full bg-gray-700 px-2 py-1 text-xs">{user.role}</span>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded px-3 py-2 text-sm ${pathname === link.href ? "bg-gray-700" : "hover:bg-gray-800"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="mt-6 w-full rounded bg-red-500 px-3 py-2 text-sm font-semibold hover:bg-red-600">
        Logout
      </button>
    </aside>
  );
}
