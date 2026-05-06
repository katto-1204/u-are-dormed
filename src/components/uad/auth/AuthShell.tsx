import { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Logo } from "../shared/Logo";

export const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) => {
  const { setStage } = useAuth();
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-ink text-white">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[320px] translate-x-1/3 translate-y-1/3 rounded-full bg-brand-glow/20 blur-3xl" />

      <header className="relative z-10 flex items-center justify-between px-6 pt-6">
        <button onClick={() => setStage("splash")} className="flex items-center gap-2 text-left">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 p-1 shadow-glow-sm">
            <Logo size={28} />
          </div>
          <span className="text-sm font-bold tracking-wide">U Are Dormed</span>
        </button>
        <span className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70 backdrop-blur sm:inline-block">
          Prototype
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
        <div className="animate-fade-in">
          <h1 className="text-balance text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-white/60">{subtitle}</p>
          <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md shadow-elevated">
            {children}
          </div>
          {footer && <div className="mt-5 text-center text-sm text-white/60">{footer}</div>}
        </div>
      </main>

      <p className="relative z-10 px-6 pb-5 text-center text-[10px] text-white/30">
        © 2025 U Are Dormed · Crafted in the Philippines
      </p>
    </div>
  );
};

export const Field = ({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block">
    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
      {label}
    </span>
    <input
      {...props}
      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-brand-glow focus:bg-white/[0.07] focus:ring-2 focus:ring-brand/30"
    />
  </label>
);