import type { ReactNode } from "react";

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
    <a
      className="rounded-md bg-neutral-950 px-5 py-3 text-sm font-medium text-white"
      href={href}
    >
      {children}
    </a>
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
    <a
      className="rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800"
      href={href}
    >
      {children}
    </a>
  );
}
