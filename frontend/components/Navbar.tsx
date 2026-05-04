"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { clearAuth } from "@/lib/auth";
import { User } from "@/lib/types";

const baseLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" },
];

export default function Navbar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const links =
    user.role === "admin"
      ? [
          baseLinks[0],
          baseLinks[1],
          { href: "/team", label: "Team & roles" },
          baseLinks[2],
        ]
      : baseLinks;

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  const linkBase =
    "shrink-0 rounded-lg px-3 py-2 text-body-sm font-medium tracking-tight transition-colors duration-150 md:py-2.5";

  return (
    <aside className="sticky top-0 z-30 flex w-full shrink-0 flex-col border-b border-rail-border bg-rail md:z-20 md:h-screen md:w-[min(100%,280px)] md:max-w-[280px] md:border-b-0 md:border-r md:shadow-none lg:w-[min(100%,300px)] lg:max-w-[300px]">
      <div className="flex flex-col gap-3 px-4 pb-2 pt-4 sm:px-5 md:gap-0 md:py-5 md:pb-4">
        <div className="min-w-0 md:mb-6">
          <p className="font-mono text-caption font-medium uppercase tracking-[0.4px] text-cream-muted">Alpha</p>
          <h1 className="mt-1 font-display text-base font-semibold tracking-tight text-oncream md:mt-2 md:text-lg">
            Team Task Manager
          </h1>
          <p className="mt-2 truncate text-body-sm font-medium text-oncream-muted md:mt-5">{user.name}</p>
          <span className="mt-1.5 inline-flex rounded-lg border border-rail-border bg-inverse-canvas/70 px-2.5 py-0.5 font-mono text-caption font-medium capitalize text-oncream-subtle md:mt-2">
            {user.role}
          </span>
        </div>
        <p className="hidden text-caption font-medium leading-relaxed text-oncream-subtle md:mt-0 md:block">
          Share your ID so an admin can add you to a project
        </p>
        <p className="text-caption font-medium text-cream-muted md:hidden">Your ID (tap copy)</p>
        <button
          type="button"
          onClick={copyId}
          className="flex w-full max-w-full items-center gap-0 overflow-hidden rounded-lg border border-rail-border bg-inverse-canvas/80 transition-colors duration-150 hover:border-cream-border hover:bg-inverse-canvas md:mt-2"
          title="Click to copy your user ID"
        >
          <code className="min-w-0 flex-1 truncate px-2.5 py-1.5 text-left font-mono text-caption text-oncream-subtle">
            {user.id}
          </code>
          <span className="shrink-0 border-l border-rail-border bg-rail-muted px-2.5 py-1.5 font-mono text-caption font-semibold text-oncream-muted">
            {copied ? "✓" : "Copy"}
          </span>
        </button>
      </div>

      <nav
        className="flex flex-none flex-row flex-nowrap gap-1 overflow-x-auto overscroll-x-contain px-4 pb-3 sm:px-5 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-col md:gap-0.5 md:overflow-visible md:px-5 md:pb-0 [&::-webkit-scrollbar]:hidden"
        aria-label="Primary"
      >
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${linkBase} ${
                active
                  ? "bg-inverse-canvas/90 text-oncream shadow-[inset_3px_0_0_0_rgba(94,106,210,0.5)] ring-1 ring-cream-border"
                  : "text-oncream-subtle hover:bg-black/[0.04] hover:text-oncream"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden flex-1 md:block" aria-hidden />

      <div className="mt-2 px-4 pb-4 sm:px-5 md:mt-0 md:px-5 md:pb-5">
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-lg border border-rail-border bg-inverse-canvas/70 px-[14px] py-2.5 text-body-sm font-medium text-oncream-muted transition-colors duration-150 hover:border-cream-border hover:bg-cream hover:text-oncream focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus focus-visible:ring-offset-2 focus-visible:ring-offset-rail"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
