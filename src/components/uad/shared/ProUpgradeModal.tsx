import { X, Crown, Sparkles, Zap, ShieldCheck, Headphones, Tag, Gift, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const ProUpgradeModal = ({
  open,
  onClose,
  monthlyPrice = 169,
  yearlyPrice = 1690,
  features,
  tagline = "Members get the full UAD experience.",
}: {
  open: boolean;
  onClose: () => void;
  monthlyPrice?: number;
  yearlyPrice?: number;
  features?: { icon: JSX.Element; title: string; sub: string }[];
  tagline?: string;
}) => {
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  if (!open) return null;

  const defaultFeatures = [
    { icon: <Tag className="h-5 w-5" />, title: "0% platform fees", sub: "Keep 100% of every rent payment." },
    { icon: <Zap className="h-5 w-5" />, title: "Boosted listings", sub: "Top placement in tenant search." },
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Verified landlord badge", sub: "Stand out with a trust mark." },
    { icon: <Headphones className="h-5 w-5" />, title: "24/7 priority support", sub: "Real humans, anytime you need." },
    { icon: <Gift className="h-5 w-5" />, title: "Advanced analytics", sub: "Occupancy, revenue and IoT insights." },
  ];
  const list = features ?? defaultFeatures;

  const confirm = () => {
    toast.success("Welcome to Dormed Pro ✨", {
      description: plan === "yearly" ? "Yearly plan activated · 2 months free" : "7-day free trial started",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in sm:items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-gradient-to-b from-[hsl(160_30%_10%)] via-[hsl(160_35%_6%)] to-[hsl(155_40%_8%)] text-white shadow-elevated sm:rounded-3xl">
        {/* ambient glow */}
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 translate-x-1/3 translate-y-1/3 rounded-full bg-brand-glow/30 blur-3xl" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative px-6 pb-6 pt-10">
          {/* hero icon */}
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand to-brand-glow text-primary-foreground shadow-glow animate-pulse-glow">
            <Crown className="h-9 w-9" />
          </div>
          <h2 className="mt-5 text-center text-3xl font-bold tracking-tight">Dormed Pro</h2>
          <p className="mt-1 text-center text-sm text-white/60">{tagline}</p>

          {/* feature stack */}
          <div className="mt-6 max-h-[42vh] space-y-2.5 overflow-y-auto pr-1">
            {list.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand-glow">
                  {f.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-[11px] text-white/55">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* plan toggle */}
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
            {(["monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-xs font-semibold capitalize transition-all",
                  plan === p
                    ? "bg-gradient-to-r from-brand to-brand-glow text-primary-foreground shadow-glow-sm"
                    : "text-white/60",
                )}
              >
                {p === "monthly"
                  ? `₱${monthlyPrice.toLocaleString()} / month`
                  : `₱${yearlyPrice.toLocaleString()} / year`}
                {p === "yearly" && (
                  <span className="ml-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[9px]">2 mo free</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={confirm}
            className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-glow py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
          >
            Upgrade your dorm <Lock className="h-4 w-4" />
          </button>

          <button
            onClick={onClose}
            className="mt-2 w-full py-2 text-center text-xs text-white/50 hover:text-white/80"
          >
            No thanks!
          </button>
          <p className="mt-1 text-center text-[10px] text-white/30">
            <Sparkles className="mr-1 inline h-2.5 w-2.5" />
            7-day free trial · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};
