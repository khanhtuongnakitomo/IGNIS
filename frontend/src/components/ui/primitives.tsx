import type { ReactNode } from "react";
import { Reveal } from "./motion";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-[1120px] px-4 sm:px-6", className)}>{children}</div>;
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative border-t border-line py-16 sm:py-24">
      <Container>
        <Reveal>
          <p className="font-mono text-xs tracking-wide text-fg-3">{eyebrow}</p>
          <h2 className="text-gradient mt-4 max-w-3xl text-[32px] leading-[1.1] font-semibold tracking-[-0.025em] sm:text-[44px]">
            {title}
          </h2>
          {intro && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-2 sm:text-base">{intro}</p>}
        </Reveal>
        <div className="mt-10 sm:mt-14">{children}</div>
      </Container>
    </section>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", external, className }: ButtonProps) {
  const styles = {
    primary:
      "bg-accent text-white hover:bg-accent-hover shadow-[0_0_0_1px_rgb(255_255_255/0.08)_inset,0_8px_24px_-8px_rgb(242_100_58/0.6)]",
    secondary: "border border-line-strong text-fg hover:bg-hover",
    ghost: "text-fg-2 hover:text-fg",
  }[variant];
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cx(
        "group inline-flex h-9 items-center gap-1.5 rounded-[var(--radius)] px-4 text-[13px] font-medium transition-colors duration-200",
        styles,
        className,
      )}
    >
      {children}
    </a>
  );
}

const tone = {
  ok: "text-ok bg-ok/12",
  warn: "text-warn bg-warn/12",
  danger: "text-danger bg-danger/12",
  info: "text-info bg-info/12",
  neutral: "text-fg-3 bg-white/6",
  synthetic: "text-synthetic bg-synthetic/12",
  accent: "text-accent bg-accent-soft",
  plain: "text-fg-2 bg-white/6",
} as const;

export type Tone = keyof typeof tone;

export function Badge({ children, t = "plain", dot = true, mono }: { children: ReactNode; t?: Tone; dot?: boolean; mono?: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full px-2 text-[11px] font-medium tracking-[0.01em] whitespace-nowrap",
        mono && "font-mono",
        tone[t],
      )}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <span aria-hidden className="size-4 rounded-[4px] bg-accent shadow-[0_0_16px_rgb(242_100_58/0.5)]" />
      <span className="text-[13px] font-semibold tracking-[0.08em]">IGNIS</span>
    </span>
  );
}
