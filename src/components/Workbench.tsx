import Link from "next/link";
import type { ReactNode } from "react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f2]";

export function PageShell({
  children,
  wide = false
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <main
      className={`mx-auto px-6 py-10 ${wide ? "max-w-6xl" : "max-w-5xl"}`}
    >
      {children}
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="border-b border-neutral-200 pb-8">
      <p className="text-sm font-medium tracking-wide text-neutral-500">
        {eyebrow}
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl leading-8 text-neutral-700">
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export function Surface({
  children,
  className = "",
  tone = "paper"
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "note" | "dark";
}) {
  const toneClass =
    tone === "dark"
      ? "border-neutral-900 bg-neutral-950 text-neutral-100"
      : tone === "note"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-neutral-200 bg-white text-neutral-950";

  return (
    <section className={`rounded-lg border p-5 shadow-sm ${toneClass} ${className}`}>
      {children}
    </section>
  );
}

export function PrimaryLink({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      className={`rounded-md bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 ${focusRing}`}
      href={href}
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      className={`rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-50 ${focusRing}`}
      href={href}
    >
      {children}
    </Link>
  );
}

export function GhostLink({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      className={`inline-flex rounded-md px-2 py-1 text-sm text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 ${focusRing}`}
      href={href}
    >
      {children}
    </Link>
  );
}

export function TextButton({
  children,
  onClick,
  type = "button"
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      className={`rounded-md px-2 py-1 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950 ${focusRing}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-medium tracking-wide text-neutral-500">
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 bg-white/60 p-6 text-sm leading-6 text-neutral-600">
      <p className="font-medium text-neutral-800">{title}</p>
      <p className="mt-2">{children}</p>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  children
}: {
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-xs font-medium tracking-wide text-neutral-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold text-neutral-950">{children}</h2>
    </div>
  );
}
