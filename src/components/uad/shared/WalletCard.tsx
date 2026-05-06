import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  /** label shown on the green pocket (e.g. "Pesos") */
  pocketLabel?: string;
  /** big amount on the pocket strip */
  pocketAmount: string;
  /** the centered amount inside the wallet */
  totalAmount: string;
  /** small line below total amount */
  totalLabel?: string;
  /** topmost engraving inside the wallet */
  tagline?: string;
  /** small caption under the title (e.g. due date) */
  caption?: string;
  /** primary CTA button below the wallet */
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
}

/**
 * Premium "wallet pocket" card used for the tenant's
 * outstanding balance / "To Pay" surface.
 * Inspired by a leather wallet w/ a green cash strip showing through.
 */
export const WalletCard = ({
  pocketLabel = "Pesos",
  pocketAmount,
  totalAmount,
  totalLabel = "Total Balance",
  tagline = "EASE AROUND YOUR FINANCE",
  caption,
  ctaLabel,
  onCta,
  className,
}: Props) => {
  const [hidden, setHidden] = useState(false);
  return (
    <div className={cn("relative", className)}>
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand/30 blur-3xl"
      />
      <div className="wallet-leather relative overflow-hidden rounded-[2rem] p-1.5 ring-1 ring-white/5">
        {/* outer stitch */}
        <div className="rounded-[1.7rem] border border-white/5 p-5 sm:p-6">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-white/40">
            {tagline}
          </p>

          {/* Green pocket */}
          <div className="relative mt-4">
            <div className="wallet-pocket relative rounded-2xl px-5 pb-10 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-white drop-shadow-sm">
                  {pocketLabel}
                </span>
                <span className="text-xl font-bold tabular-nums text-white drop-shadow-sm">
                  {pocketAmount}
                </span>
              </div>
              {/* fake stitching */}
              <div className="mt-4 stitch opacity-60" />
              {/* curved bottom flap (inverted U) */}
              <svg
                aria-hidden
                viewBox="0 0 400 60"
                preserveAspectRatio="none"
                className="absolute -bottom-px left-0 h-10 w-full text-[hsl(160_18%_12%)]"
              >
                <path
                  d="M0,0 L0,60 L160,60 C180,60 185,30 200,30 C215,30 220,60 240,60 L400,60 L400,0 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Wallet body (covering pocket bottom) */}
          <div className="relative -mt-2 rounded-2xl bg-[hsl(160_20%_10%)] px-5 pb-7 pt-9 ring-1 ring-white/5">
            {/* dashed stitch border */}
            <div className="pointer-events-none absolute inset-2 rounded-2xl border border-dashed border-white/15" />
            <div className="relative flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => setHidden((h) => !h)}
                className="flex items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
              >
                {hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {hidden ? "Show Balance" : "Hide Balance"}
              </button>
              <p className="mt-3 text-4xl font-bold tracking-tight text-white drop-shadow sm:text-5xl">
                {hidden ? "•••••" : totalAmount}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">
                {totalLabel}
              </p>
              {caption && (
                <p className="mt-3 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
                  {caption}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {ctaLabel && (
        <button
          onClick={onCta}
          className="mt-4 h-12 w-full rounded-2xl bg-gradient-green text-sm font-semibold text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
};