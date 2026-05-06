import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Logo } from "../shared/Logo";

/**
 * Cinematic splash — animated logo reveal, particle field,
 * progress bar, then auto-advance to onboarding.
 */
export const SplashScreen = () => {
  const { setStage } = useAuth();
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const dur = 2400;
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / dur) * 100);
      setProgress(p);
      if (p >= 100) clearInterval(id);
    }, 40);
    const exit = setTimeout(() => setExiting(true), dur);
    const go = setTimeout(() => setStage("onboarding"), dur + 550);
    return () => {
      clearInterval(id);
      clearTimeout(exit);
      clearTimeout(go);
    };
  }, [setStage]);

  // pseudo-random particle positions
  const particles = Array.from({ length: 22 }, (_, i) => ({
    left: `${(i * 53) % 100}%`,
    top: `${(i * 37) % 100}%`,
    delay: `${(i % 8) * 0.25}s`,
    size: 4 + (i % 5) * 2,
  }));

  return (
    <div
      className={`relative grid min-h-screen place-items-center overflow-hidden bg-gradient-ink text-white transition-all duration-500 ${
        exiting ? "scale-110 opacity-0" : "scale-100 opacity-100"
      }`}
      onClick={() => setStage("onboarding")}
    >
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/25 blur-3xl animate-pulse" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-brand-glow/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-brand-deep/30 blur-3xl" />

      {/* Grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 1) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-brand-glow/60 blur-[1px] animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: "2.6s",
            }}
          />
        ))}
      </div>

      {/* Center logo */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative">
          {/* expanding rings */}
          <span className="absolute inset-0 -m-6 rounded-full border border-brand-glow/40 animate-ping" />
          <span className="absolute inset-0 -m-12 rounded-full border border-brand-glow/20 animate-ping [animation-delay:0.4s]" />
          <div className="relative grid h-28 w-28 place-items-center rounded-3xl bg-white/5 p-3 shadow-glow backdrop-blur animate-scale-in">
            <Logo size={84} />
          </div>
        </div>

        <h1 className="mt-8 text-4xl font-bold tracking-tight animate-fade-in">
          U Are <span className="bg-gradient-green bg-clip-text text-transparent">Dormed</span>
        </h1>
        <p className="mt-2 text-sm text-white/55 animate-fade-in [animation-delay:0.2s]">
          Live smarter. Rent easier.
        </p>

        {/* Progress */}
        <div className="mt-10 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-green transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
          Loading{".".repeat(1 + Math.floor(progress / 33))}
        </p>
      </div>

      {/* Bottom credit */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] text-white/30 animate-fade-in [animation-delay:0.6s]">
        Tap anywhere to continue
      </div>
    </div>
  );
};