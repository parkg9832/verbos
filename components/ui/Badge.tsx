import type { ReactNode } from "react";

const badgeStyles = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
  red: "bg-gochujang/10 text-gochujang ring-gochujang/20",
  yellow: "bg-ssamjang/25 text-soy-sauce ring-ssamjang/40",
  brown: "bg-soy-sauce text-white ring-soy-sauce/20",
  neutral: "bg-soy-sauce/5 text-soy-sauce/70 ring-soy-sauce/10",
};

type BadgeTone = keyof typeof badgeStyles;

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${badgeStyles[tone]}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}
