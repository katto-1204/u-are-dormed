import { useState } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import { useAuth } from "./AuthContext";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Quezon City, Metro Manila",
  "Manila, NCR",
  "Makati City, Metro Manila",
  "Taguig City, Metro Manila",
  "Pasig City, Metro Manila",
  "Cebu City, Cebu",
  "Davao City, Davao",
  "Baguio City, Benguet",
];

export const LocationStep = () => {
  const { user, updateLocation } = useAuth();
  const [query, setQuery] = useState(user?.location ?? "");
  const [picked, setPicked] = useState<string | null>(user?.location || null);

  const filtered = SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase()),
  );

  const useCurrent = () => {
    setPicked("Quezon City, Metro Manila");
    setQuery("Quezon City, Metro Manila");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-secondary/40 px-4 py-12">
      <div className="grid w-full max-w-5xl animate-fade-in gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Map panel */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
          <MapMock pin={picked} />
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Step 2 of 2
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Where are you based?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We use your location to surface nearby dorms and accurate utility splits.
          </p>

          <div className="mt-6 flex h-12 items-center gap-3 rounded-2xl border border-border bg-background px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPicked(e.target.value);
              }}
              placeholder="Search city, barangay, or address"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <button
            onClick={useCurrent}
            className="mt-3 inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-secondary"
          >
            <Navigation className="h-3.5 w-3.5" />
            Use current location
          </button>

          <div className="mt-5 max-h-56 space-y-1 overflow-y-auto pr-1">
            {filtered.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setPicked(s);
                  setQuery(s);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                  picked === s
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/40",
                )}
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{s}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-2 py-3 text-xs text-muted-foreground">
                No suggestions — we&apos;ll save “{query}”.
              </p>
            )}
          </div>

          <button
            disabled={!picked?.trim()}
            onClick={() => updateLocation(picked!.trim())}
            className="mt-6 h-12 w-full rounded-2xl bg-gradient-green text-sm font-semibold text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

/* Decorative B/W map */
const MapMock = ({ pin }: { pin: string | null }) => (
  <div className="relative aspect-square w-full bg-secondary/60 lg:aspect-auto lg:h-full lg:min-h-[520px]">
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full text-foreground/10"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* grid */}
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="400" stroke="currentColor" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 25} x2="400" y2={i * 25} stroke="currentColor" strokeWidth="0.5" />
      ))}
      {/* roads */}
      <path d="M0,260 C80,250 160,310 240,260 S380,200 400,220" stroke="hsl(var(--muted-foreground))" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M120,0 C140,80 90,160 130,240 S180,360 160,400" stroke="hsl(var(--muted-foreground))" strokeWidth="3" fill="none" opacity="0.5" />
      <path d="M260,0 C280,90 320,140 290,220 S340,340 360,400" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" opacity="0.4" />
      {/* blocks */}
      <rect x="40" y="60" width="60" height="40" fill="hsl(var(--foreground))" opacity="0.06" />
      <rect x="170" y="100" width="50" height="60" fill="hsl(var(--foreground))" opacity="0.06" />
      <rect x="280" y="80" width="70" height="50" fill="hsl(var(--foreground))" opacity="0.06" />
      <rect x="60" y="320" width="80" height="40" fill="hsl(var(--foreground))" opacity="0.06" />
      <rect x="220" y="300" width="90" height="50" fill="hsl(var(--foreground))" opacity="0.06" />
      {/* water */}
      <path d="M0,80 C60,100 100,40 200,60 L200,0 L0,0 Z" fill="hsl(var(--muted))" opacity="0.6" />
    </svg>

    {/* center pin */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="relative flex flex-col items-center">
        <span className="absolute -bottom-1 h-3 w-3 rounded-full bg-foreground/30 blur-sm" />
        <div className="grid h-12 w-12 place-items-center rounded-full bg-foreground text-background shadow-elevated animate-fade-in">
          <MapPin className="h-5 w-5" />
        </div>
        {pin && (
          <div className="mt-2 max-w-[220px] truncate rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold shadow-soft">
            {pin}
          </div>
        )}
        <span className="absolute top-12 h-16 w-16 -translate-y-1/2 animate-ping rounded-full border border-foreground/40" />
      </div>
    </div>

    <div className="absolute bottom-3 right-3 rounded-full border border-border bg-background/90 px-2.5 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur">
      Map preview
    </div>
  </div>
);