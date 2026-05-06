import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { Logo } from "../shared/Logo";
import {
  ArrowRight,
  Home,
  Wallet,
  ShieldCheck,
  Sparkles,
  MapPin,
  Star,
  BadgeCheck,
  Wifi,
} from "lucide-react";
import dorm1 from "@/assets/dorm-1.jpg";
import dorm2 from "@/assets/dorm-2.jpg";
import dorm3 from "@/assets/dorm-3.jpg";

type Slide = {
  img: string;
  icon: typeof Home;
  tag: string;
  title: string;
  highlight: string;
  desc: string;
  accent: string;
};

const slides: Slide[] = [
  {
    img: dorm1,
    icon: Home,
    tag: "DISCOVER",
    title: "Find your",
    highlight: "perfect dorm",
    desc: "Browse verified dorms near your campus with crisp photos, fair pricing, and rich amenities — all in one place.",
    accent: "from-brand to-brand-glow",
  },
  {
    img: dorm2,
    icon: Wallet,
    tag: "PAY EASY",
    title: "Settle rent,",
    highlight: "split bills fairly",
    desc: "Pay online or in cash, track every due date, and split water, wifi & power with roommates — automatically.",
    accent: "from-emerald-400 to-brand",
  },
  {
    img: dorm3,
    icon: ShieldCheck,
    tag: "STAY SAFE",
    title: "Live easy,",
    highlight: "stay protected",
    desc: "24/7 maintenance, visitor passes, smart IoT alerts, and direct chat with your landlord — fully covered.",
    accent: "from-brand-glow to-cyan-300",
  },
];

export const OnboardingScreen = () => {
  const { setStage } = useAuth();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const startX = useRef<number | null>(null);

  const isLast = i === slides.length - 1;
  const slide = slides[i];
  const Icon = slide.icon;

  const go = (n: number) => {
    if (n < 0 || n >= slides.length) return;
    setDir(n > i ? 1 : -1);
    setI(n);
  };

  const next = () => (isLast ? setStage("register") : go(i + 1));
  const prev = () => go(i - 1);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
    startX.current = null;
  };

  return (
    <div
      className="relative grid min-h-screen grid-rows-[1fr_auto] overflow-hidden bg-gradient-ink text-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl transition-all duration-700"
        style={{ transform: `translate(-50%, ${i * -20}px)` }}
      />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] translate-x-1/3 translate-y-1/3 rounded-full bg-brand-glow/20 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
        }}
      />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">
          <Logo size={18} />
          <span className="text-[11px] font-semibold tracking-wide">U Are Dormed</span>
        </div>
        <button
          onClick={() => setStage("register")}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur transition hover:bg-white/10 hover:text-white"
        >
          Skip
        </button>
      </div>

      {/* Hero visual */}
      <div className="relative flex items-end justify-center px-5 pt-20">
        <div className="relative h-[52vh] w-full max-w-md">
          {slides.map((s, idx) => {
            const active = idx === i;
            const offset = idx - i;
            return (
              <div
                key={idx}
                aria-hidden={!active}
                className="absolute inset-0 transition-all duration-700 ease-out"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active
                    ? "translateX(0) scale(1) rotate(0deg)"
                    : `translateX(${offset * 60}%) scale(0.9) rotate(${offset * 4}deg)`,
                  pointerEvents: active ? "auto" : "none",
                  zIndex: active ? 2 : 1,
                }}
              >
                <div className="group relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-elevated">
                  <img
                    src={s.img}
                    alt=""
                    className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
                      active ? "scale-110" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-15 mix-blend-overlay`} />

                  {/* floating chips */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold backdrop-blur animate-fade-in">
                    <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${s.accent}`} />
                    {s.tag}
                  </div>

                  <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-2xl bg-white/10 backdrop-blur animate-fade-in">
                    <Sparkles className="h-4 w-4 text-brand-glow" />
                  </div>

                  {/* Floating bottom card */}
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${s.accent}`}>
                          <Icon className="h-4 w-4 text-ink" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-xs font-semibold">
                            Verified Dorm <BadgeCheck className="h-3 w-3 text-brand-glow" />
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-white/60">
                            <MapPin className="h-2.5 w-2.5" /> Near campus
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold">
                        <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" /> 4.9
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-white/60">
                      <span className="flex items-center gap-1"><Wifi className="h-2.5 w-2.5" /> Fast Wi-Fi</span>
                      <span className="flex items-center gap-1"><ShieldCheck className="h-2.5 w-2.5" /> Secure</span>
                      <span className="ml-auto font-semibold text-brand-glow">₱4.2k/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Text + CTA */}
      <div className="relative z-10 mx-auto w-full max-w-md px-6 pb-8 pt-6">
        <div key={i} className="animate-fade-in">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-white/70 backdrop-blur">
            <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${slide.accent}`} />
            STEP {i + 1} / {slides.length}
          </div>
          <h1 className="mt-3 text-[32px] font-bold leading-[1.05]">
            {slide.title}{" "}
            <span className={`bg-gradient-to-br ${slide.accent} bg-clip-text text-transparent`}>
              {slide.highlight}
            </span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{slide.desc}</p>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => go(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="group relative h-1.5 overflow-hidden rounded-full bg-white/15 transition-all"
                style={{ width: idx === i ? 36 : 8 }}
              >
                {idx === i && (
                  <span className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={next}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink shadow-glow-sm transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <span className="relative z-10">{isLast ? "Get Started" : "Next"}</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            <span className={`absolute inset-0 -translate-x-full bg-gradient-to-r ${slide.accent} opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-30`} />
          </button>
        </div>

        <button
          onClick={() => setStage("login")}
          className="mt-4 h-11 w-full rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
};