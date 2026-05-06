import { useState } from "react";
import {
  ChevronLeft,
  Wrench,
  Megaphone,
  UserPlus,
  FileText,
  Wifi,
  Wallet,
  Calculator,
  Star,
  CalendarRange,
  CalendarPlus,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { useSync, Severity } from "@/data/syncStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Panel =
  | "menu"
  | "maintenance"
  | "announcements"
  | "visitors"
  | "documents"
  | "wifi"
  | "wallet"
  | "split"
  | "reviews"
  | "extend"
  | "amenity";

const peso = (n: number) => `₱${n.toLocaleString()}`;

export const TenantHub = () => {
  const [panel, setPanel] = useState<Panel>("menu");
  return (
    <div className="animate-fade-in p-5 pt-8">
      {panel === "menu" ? (
        <Menu onOpen={setPanel} />
      ) : (
        <Wrap onBack={() => setPanel("menu")}>
          {panel === "maintenance" && <Maintenance />}
          {panel === "announcements" && <Announcements />}
          {panel === "visitors" && <Visitors />}
          {panel === "documents" && <Documents />}
          {panel === "wifi" && <WifiPanel />}
          {panel === "wallet" && <WalletPanel />}
          {panel === "split" && <SplitCalc />}
          {panel === "reviews" && <Reviews />}
          {panel === "extend" && <ExtendLease />}
          {panel === "amenity" && <AmenityBooking />}
        </Wrap>
      )}
    </div>
  );
};

const Wrap = ({ onBack, children }: { onBack: () => void; children: React.ReactNode }) => (
  <div className="animate-fade-in">
    <button
      onClick={onBack}
      className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-brand hover:text-brand"
    >
      <ChevronLeft className="h-3.5 w-3.5" /> All features
    </button>
    {children}
  </div>
);

const Menu = ({ onOpen }: { onOpen: (p: Panel) => void }) => {
  const { announcements, maintenance, visitors, leaseExts, wallet } = useSync();
  const annUnread = announcements.filter((a) => a.unreadFor.includes("me")).length;
  const myMaint = maintenance.filter((m) => m.tenant === "Maria R." || m.tenant === "You").length;
  const myVisits = visitors.filter((v) => v.tenant === "You").length;
  const myExt = leaseExts.filter((l) => l.tenant === "You").length;

  const items: { id: Panel; label: string; sub: string; icon: JSX.Element; badge?: string; tone?: "g" | "a" | "p" | "s" }[] = [
    { id: "maintenance", label: "Maintenance", sub: "Report issues", icon: <Wrench className="h-5 w-5" />, badge: myMaint ? String(myMaint) : undefined, tone: "g" },
    { id: "announcements", label: "Announcements", sub: "Building updates", icon: <Megaphone className="h-5 w-5" />, badge: annUnread ? String(annUnread) : undefined, tone: "a" },
    { id: "visitors", label: "Visitor passes", sub: "Approve guests", icon: <UserPlus className="h-5 w-5" />, badge: myVisits ? String(myVisits) : undefined, tone: "p" },
    { id: "documents", label: "Documents", sub: "Lease & receipts", icon: <FileText className="h-5 w-5" />, tone: "s" },
    { id: "wifi", label: "WiFi access", sub: "Get the password", icon: <Wifi className="h-5 w-5" />, tone: "g" },
    { id: "wallet", label: "Wallet", sub: peso(wallet) + " balance", icon: <Wallet className="h-5 w-5" />, tone: "a" },
    { id: "split", label: "Split calculator", sub: "Live utility split", icon: <Calculator className="h-5 w-5" />, tone: "p" },
    { id: "reviews", label: "Reviews", sub: "Rate your stay", icon: <Star className="h-5 w-5" />, tone: "s" },
    { id: "extend", label: "Extend lease", sub: myExt ? "Pending request" : "Renew contract", icon: <CalendarRange className="h-5 w-5" />, badge: myExt ? "•" : undefined, tone: "g" },
    { id: "amenity", label: "Book amenity", sub: "Lounge / study room", icon: <CalendarPlus className="h-5 w-5" />, tone: "a" },
  ];

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">All features</p>
          <h2 className="text-3xl font-bold">Your dorm hub</h2>
          <p className="mt-1 text-sm text-muted-foreground">10 quick actions, all synced with your landlord.</p>
        </div>
        <span className="hidden rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand sm:inline-flex">
          <Sparkles className="mr-1 h-3 w-3" /> Live sync
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onOpen(it.id)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-border bg-background p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-glow-sm",
            )}
          >
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60",
                it.tone === "g" && "bg-brand",
                it.tone === "a" && "bg-amber-400",
                it.tone === "p" && "bg-violet-400",
                it.tone === "s" && "bg-sky-400",
              )}
            />
            <div className="relative flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground">
                {it.icon}
              </div>
              {it.badge && (
                <span className="rounded-full bg-gradient-green px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-glow-sm">
                  {it.badge}
                </span>
              )}
            </div>
            <p className="relative mt-3 text-sm font-semibold">{it.label}</p>
            <p className="relative text-[11px] text-muted-foreground">{it.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 1. Maintenance ---------------- */
const Maintenance = () => {
  const { maintenance, addMaintenance, updateMaintenance, removeMaintenance, me } = useSync();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [sev, setSev] = useState<Severity>("medium");
  const [editId, setEditId] = useState<string | null>(null);

  const submit = () => {
    if (!title.trim()) return;
    if (editId) {
      updateMaintenance(editId, { title, details, severity: sev });
      toast.success("Request updated");
    } else {
      addMaintenance({ title, details, severity: sev, tenant: "You", room: me.room });
      toast.success("Request sent to landlord");
    }
    setTitle("");
    setDetails("");
    setEditId(null);
  };

  return (
    <div className="space-y-4">
      <Title icon={<Wrench className="h-5 w-5" />} title="Maintenance" sub="Report issues — landlord sees this instantly." />
      <div className="rounded-2xl border border-border p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's wrong?"
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
        />
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          placeholder="Add details (optional)"
          className="mt-2 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-brand"
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            {(["low", "medium", "high"] as Severity[]).map((s) => (
              <button
                key={s}
                onClick={() => setSev(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold capitalize",
                  sev === s
                    ? s === "high"
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : s === "medium"
                        ? "border-amber-400 bg-amber-400/10 text-amber-700"
                        : "border-brand bg-brand/10 text-brand"
                    : "border-border text-muted-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {editId && (
              <button
                onClick={() => { setEditId(null); setTitle(""); setDetails(""); }}
                className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground"
              >
                Cancel
              </button>
            )}
            <button
              onClick={submit}
              className="rounded-full bg-gradient-green px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow-sm"
            >
              {editId ? "Save changes" : "Send"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Open requests</p>
        {maintenance.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border p-3.5">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{m.title}</p>
                <p className="text-xs text-muted-foreground">
                  {m.tenant} · {m.room} · {m.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Status s={m.status} />
                {(m.tenant === "You" || m.tenant === me.name) && (
                  <RowActions
                    onEdit={() => { setEditId(m.id); setTitle(m.title); setDetails(m.details); setSev(m.severity); }}
                    onDelete={() => { removeMaintenance(m.id); toast("Request deleted"); }}
                  />
                )}
              </div>
            </div>
            {m.details && <p className="mt-2 text-xs text-muted-foreground">{m.details}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const Status = ({ s }: { s: string }) => {
  const map: Record<string, string> = {
    open: "border-destructive/40 bg-destructive/10 text-destructive",
    in_progress: "border-amber-400/40 bg-amber-400/10 text-amber-700",
    resolved: "border-brand/40 bg-brand/10 text-brand",
    pending: "border-amber-400/40 bg-amber-400/10 text-amber-700",
    approved: "border-brand/40 bg-brand/10 text-brand",
    denied: "border-destructive/40 bg-destructive/10 text-destructive",
  };
  return (
    <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", map[s] ?? "border-border")}>
      {s.replace("_", " ")}
    </span>
  );
};

/* ---------------- 2. Announcements ---------------- */
const Announcements = () => {
  const { announcements, markAnnRead } = useSync();
  return (
    <div className="space-y-4">
      <Title icon={<Megaphone className="h-5 w-5" />} title="Announcements" sub="Posted by your landlord." />
      {announcements.map((a) => {
        const unread = a.unreadFor.includes("me");
        return (
          <button
            key={a.id}
            onClick={() => unread && markAnnRead(a.id)}
            className={cn(
              "block w-full rounded-2xl border p-4 text-left transition-colors",
              unread ? "border-brand/40 bg-brand/5" : "border-border",
            )}
          >
            <div className="flex items-center gap-2">
              {unread && <span className="h-2 w-2 rounded-full bg-brand shadow-glow-sm" />}
              <p className="text-sm font-semibold">{a.title}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{a.body}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              {a.audience} · {a.createdAt}
            </p>
          </button>
        );
      })}
    </div>
  );
};

/* ---------------- 3. Visitors ---------------- */
const Visitors = () => {
  const { visitors, addVisitor, updateVisitor, removeVisitor } = useSync();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const submit = () => {
    if (!name.trim() || !date.trim()) return;
    if (editId) {
      updateVisitor(editId, { guest: name, date });
      toast.success("Visitor updated");
    } else {
      addVisitor({ guest: name, date, tenant: "You", room: "Room 201" });
      toast.success("Visitor pass requested", { description: "Landlord will approve shortly." });
    }
    setName(""); setDate(""); setEditId(null);
  };

  return (
    <div className="space-y-4">
      <Title icon={<UserPlus className="h-5 w-5" />} title="Visitor passes" sub="Request a pass for your guests." />
      <div className="rounded-2xl border border-border p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Guest name"
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
        />
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="When? e.g. Nov 28 · 2 PM"
          className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
        />
        <div className="mt-3 flex gap-2">
          {editId && (
            <button
              onClick={() => { setEditId(null); setName(""); setDate(""); }}
              className="rounded-full border border-border px-3 py-2.5 text-xs font-semibold text-muted-foreground"
            >
              Cancel
            </button>
          )}
          <button
            onClick={submit}
            className="flex-1 rounded-full bg-gradient-green py-2.5 text-xs font-semibold text-primary-foreground shadow-glow-sm"
          >
            {editId ? "Save changes" : "Request pass"}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {visitors.map((v) => (
          <div key={v.id} className="flex items-center justify-between rounded-2xl border border-border p-3.5">
            <div>
              <p className="text-sm font-semibold">{v.guest}</p>
              <p className="text-xs text-muted-foreground">{v.tenant} · {v.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <Status s={v.status} />
              {v.tenant === "You" && (
                <RowActions
                  onEdit={() => { setEditId(v.id); setName(v.guest); setDate(v.date); }}
                  onDelete={() => { removeVisitor(v.id); toast("Visitor removed"); }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 4. Documents ---------------- */
const Documents = () => {
  const { documents, addDocument, removeDocument, renameDocument } = useSync();
  const onUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    addDocument({
      name: file.name,
      kind: "receipt",
      size: sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`,
    });
    toast.success("Document uploaded");
    e.target.value = "";
  };
  return (
    <div className="space-y-4">
      <Title icon={<FileText className="h-5 w-5" />} title="Documents" sub="Lease, receipts, house rules, IDs." />
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-4 text-xs font-semibold text-muted-foreground hover:border-brand hover:text-brand">
        <Upload className="h-4 w-4" /> Upload a document
        <input type="file" className="hidden" onChange={onUpload} />
      </label>
      <div className="space-y-2">
        {documents.map((d) => (
          <div key={d.id} className="flex w-full items-center gap-3 rounded-2xl border border-border p-3.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
              <FileText className="h-4 w-4" />
            </div>
            <button
              onClick={() => toast.success("Opening " + d.name)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-sm font-semibold">{d.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{d.kind} · {d.size} · {d.at}</p>
            </button>
            <RowActions
              onEdit={() => {
                const name = prompt("Rename document", d.name);
                if (name && name.trim()) { renameDocument(d.id, name.trim()); toast.success("Renamed"); }
              }}
              onDelete={() => {
                if (confirm(`Delete "${d.name}"?`)) { removeDocument(d.id); toast("Document deleted"); }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 5. WiFi ---------------- */
const WifiPanel = () => {
  const { wifi } = useSync();
  const [show, setShow] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(wifi.password);
    toast.success("Password copied");
  };
  return (
    <div className="space-y-4">
      <Title icon={<Wifi className="h-5 w-5" />} title="WiFi access" sub="Network info for your floor." />
      <div className="relative overflow-hidden rounded-3xl bg-gradient-ink p-6 text-white shadow-elevated">
        <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/30 blur-3xl" />
        <Wifi className="h-8 w-8 text-brand-glow" />
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/50">Network</p>
        <p className="text-xl font-bold">{wifi.ssid}</p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/50">Password</p>
        <div className="mt-1 flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <span className="font-mono text-base">{show ? wifi.password : "•".repeat(wifi.password.length)}</span>
          <div className="flex gap-1">
            <button onClick={() => setShow((s) => !s)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 hover:bg-white/10">
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
            <button onClick={copy} className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-primary-foreground hover:opacity-90">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-white/50">Speed: 500 Mbps · 2.4 / 5 GHz</p>
      </div>
    </div>
  );
};

/* ---------------- 6. Wallet ---------------- */
const WalletPanel = () => {
  const { wallet, txns, topUp } = useSync();
  const [amt, setAmt] = useState("1000");
  return (
    <div className="space-y-4">
      <Title icon={<Wallet className="h-5 w-5" />} title="Wallet" sub="Pre-load funds for rent & utilities." />
      <div className="rounded-3xl border border-border bg-gradient-green-soft p-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-deep">Available balance</p>
        <p className="mt-1 text-4xl font-bold text-brand-deep">{peso(wallet)}</p>
        <div className="mt-4 flex gap-2">
          {[500, 1000, 5000].map((v) => (
            <button
              key={v}
              onClick={() => setAmt(String(v))}
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold",
                amt === String(v) ? "border-brand bg-brand text-primary-foreground" : "border-border bg-background",
              )}
            >
              +{peso(v)}
            </button>
          ))}
          <input
            value={amt}
            onChange={(e) => setAmt(e.target.value.replace(/\D/g, ""))}
            className="ml-auto h-8 w-24 rounded-full border border-border bg-background px-3 text-xs outline-none focus:border-brand"
          />
        </div>
        <button
          onClick={() => {
            const n = parseInt(amt) || 0;
            if (n <= 0) return;
            topUp(n);
            toast.success("Top-up successful", { description: peso(n) + " added." });
          }}
          className="mt-3 w-full rounded-full bg-gradient-green py-2.5 text-xs font-semibold text-primary-foreground shadow-glow-sm"
        >
          Top up via GCash
        </button>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent activity</p>
        <div className="overflow-hidden rounded-2xl border border-border">
          {txns.map((t, i) => (
            <div key={t.id} className={cn("flex items-center justify-between p-3.5", i !== 0 && "border-t border-border")}>
              <div>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{t.type} · {t.at}</p>
              </div>
              <span className={cn("text-sm font-bold tabular-nums", t.amount > 0 ? "text-brand" : "text-foreground")}>
                {t.amount > 0 ? "+" : ""}{peso(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------- 7. Split calculator ---------------- */
const SplitCalc = () => {
  const [total, setTotal] = useState(1648);
  const [people, setPeople] = useState(4);
  const share = Math.round(total / Math.max(1, people));
  return (
    <div className="space-y-4">
      <Title icon={<Calculator className="h-5 w-5" />} title="Split calculator" sub="Divide any utility bill fairly." />
      <div className="rounded-2xl border border-border p-4">
        <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total bill (₱)</label>
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(parseInt(e.target.value) || 0)}
          className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-brand"
        />
        <label className="mt-3 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Split between</label>
        <div className="mt-1 flex items-center gap-3">
          <button onClick={() => setPeople(Math.max(1, people - 1))} className="grid h-10 w-10 place-items-center rounded-full border border-border">−</button>
          <span className="flex-1 text-center text-2xl font-bold tabular-nums">{people}</span>
          <button onClick={() => setPeople(people + 1)} className="grid h-10 w-10 place-items-center rounded-full border border-border">+</button>
        </div>
      </div>
      <div className="rounded-3xl bg-gradient-ink p-6 text-center text-white shadow-elevated">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Each person pays</p>
        <p className="mt-2 text-4xl font-bold text-brand-glow">{peso(share)}</p>
      </div>
    </div>
  );
};

/* ---------------- 8. Reviews ---------------- */
const Reviews = () => {
  const { reviews, addReview, updateReview, removeReview } = useSync();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const submit = () => {
    if (!text.trim()) return;
    if (editId) {
      updateReview(editId, { rating, text });
      toast.success("Review updated");
    } else {
      addReview({ by: "You", room: "Room 201", rating, text });
      toast.success("Review submitted");
    }
    setText(""); setRating(5); setEditId(null);
  };
  return (
    <div className="space-y-4">
      <Title icon={<Star className="h-5 w-5" />} title="Reviews" sub="Help future tenants pick the right room." />
      <div className="rounded-2xl border border-border p-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)}>
              <Star className={cn("h-7 w-7 transition-colors", n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Share your experience…"
          className="mt-3 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-brand"
        />
        <div className="mt-2 flex gap-2">
          {editId && (
            <button
              onClick={() => { setEditId(null); setText(""); setRating(5); }}
              className="rounded-full border border-border px-3 py-2.5 text-xs font-semibold text-muted-foreground"
            >
              Cancel
            </button>
          )}
          <button onClick={submit} className="flex-1 rounded-full bg-gradient-green py-2.5 text-xs font-semibold text-primary-foreground shadow-glow-sm">
            {editId ? "Save changes" : "Post review"}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{r.by} · <span className="font-normal text-muted-foreground">{r.room}</span></p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {r.by === "You" && (
                  <RowActions
                    onEdit={() => { setEditId(r.id); setRating(r.rating); setText(r.text); }}
                    onDelete={() => { removeReview(r.id); toast("Review removed"); }}
                  />
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{r.text}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{r.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 9. Extend Lease ---------------- */
const ExtendLease = () => {
  const { addLeaseExt, leaseExts, removeLeaseExt, updateLeaseExt } = useSync();
  const [months, setMonths] = useState(6);
  const mine = leaseExts.filter((l) => l.tenant === "You");
  return (
    <div className="space-y-4">
      <Title icon={<CalendarRange className="h-5 w-5" />} title="Extend lease" sub="Request a renewal — landlord approves." />
      <div className="rounded-2xl border border-border p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Renewal length</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[3, 6, 12].map((m) => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={cn(
                "rounded-xl border py-3 text-sm font-semibold",
                months === m ? "border-transparent bg-gradient-green text-primary-foreground shadow-glow-sm" : "border-border",
              )}
            >
              +{m} mo
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            addLeaseExt({ tenant: "You", room: "Room 201", months });
            toast.success("Renewal requested");
          }}
          className="mt-3 w-full rounded-full border border-border py-2.5 text-xs font-semibold hover:border-brand hover:text-brand"
        >
          Submit request
        </button>
      </div>
      <div className="space-y-2">
        {mine.map((l) => (
          <div key={l.id} className="flex items-center justify-between rounded-2xl border border-border p-3.5">
            <div>
              <p className="text-sm font-semibold">+{l.months} months</p>
              <p className="text-xs text-muted-foreground">{l.room}</p>
            </div>
            <div className="flex items-center gap-2">
              <Status s={l.status} />
              <RowActions
                onEdit={() => {
                  const v = prompt("Renewal length in months", String(l.months));
                  const n = parseInt(v ?? "", 10);
                  if (n > 0) { updateLeaseExt(l.id, { months: n }); toast.success("Updated"); }
                }}
                onDelete={() => { removeLeaseExt(l.id); toast("Request withdrawn"); }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 10. Amenity booking ---------------- */
const AmenityBooking = () => {
  const { bookings, addBooking, removeBooking, updateBooking } = useSync();
  const [amenity, setAmenity] = useState("Study Lounge");
  const [slot, setSlot] = useState("7 PM – 9 PM");
  const [editId, setEditId] = useState<string | null>(null);
  const amenities = ["Study Lounge", "Game Room", "Rooftop", "Laundry"];
  const slots = ["9 AM – 11 AM", "1 PM – 3 PM", "4 PM – 6 PM", "7 PM – 9 PM"];
  return (
    <div className="space-y-4">
      <Title icon={<CalendarPlus className="h-5 w-5" />} title="Book an amenity" sub="Reserve common areas." />
      <div className="rounded-2xl border border-border p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Amenity</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {amenities.map((a) => (
            <button
              key={a}
              onClick={() => setAmenity(a)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold",
                amenity === a ? "border-transparent bg-gradient-green text-primary-foreground shadow-glow-sm" : "border-border",
              )}
            >
              {a}
            </button>
          ))}
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">Time slot</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {slots.map((s) => (
            <button
              key={s}
              onClick={() => setSlot(s)}
              className={cn(
                "rounded-xl border py-2 text-xs font-semibold",
                slot === s ? "border-foreground bg-foreground text-background" : "border-border",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            if (editId) {
              updateBooking(editId, { amenity, slot });
              toast.success("Booking updated");
              setEditId(null);
            } else {
              addBooking({ tenant: "You", amenity, date: "Tomorrow", slot });
              toast.success("Booked!", { description: `${amenity} · ${slot}` });
            }
          }}
          className="mt-4 w-full rounded-full bg-gradient-green py-2.5 text-xs font-semibold text-primary-foreground shadow-glow-sm"
        >
          {editId ? "Save changes" : "Confirm booking"}
        </button>
      </div>
      <div className="space-y-2">
        {bookings.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-2xl border border-border p-3.5">
            <div>
              <p className="text-sm font-semibold">{b.amenity}</p>
              <p className="text-xs text-muted-foreground">{b.tenant} · {b.date} · {b.slot}</p>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brand" />
              {b.tenant === "You" && (
                <RowActions
                  onEdit={() => { setEditId(b.id); setAmenity(b.amenity); setSlot(b.slot); }}
                  onDelete={() => { removeBooking(b.id); toast("Booking cancelled"); }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Title = ({ icon, title, sub }: { icon: JSX.Element; title: string; sub: string }) => (
  <div className="flex items-start gap-3">
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-green text-primary-foreground shadow-glow-sm">
      {icon}
    </div>
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  </div>
);

/* Inline edit/delete row buttons reused across panels */
const RowActions = ({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) => (
  <div className="flex items-center gap-1">
    {onEdit && (
      <button
        onClick={onEdit}
        title="Edit"
        className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:border-brand hover:text-brand"
      >
        <Pencil className="h-3 w-3" />
      </button>
    )}
    {onDelete && (
      <button
        onClick={onDelete}
        title="Delete"
        className="grid h-7 w-7 place-items-center rounded-lg border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    )}
  </div>
);