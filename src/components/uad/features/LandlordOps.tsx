import {
  Wrench,
  Megaphone,
  UserPlus,
  Star,
  CalendarRange,
  CalendarPlus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useSync } from "@/data/syncStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const card = "rounded-2xl border border-border";

/* ---------- Maintenance queue ---------- */
export const LandlordMaintenance = () => {
  const { maintenance, setMaintenanceStatus, updateMaintenance, removeMaintenance } = useSync();
  return (
    <div className="space-y-3">
      <Header icon={<Wrench className="h-4 w-4" />} title="Maintenance queue" sub="Live tenant requests" count={maintenance.length} />
      <div className={cn(card, "divide-y divide-border")}>
        {maintenance.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Pill tone={m.severity === "high" ? "r" : m.severity === "medium" ? "a" : "g"}>{m.severity}</Pill>
                <p className="truncate text-sm font-semibold">{m.title}</p>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.tenant} · {m.room} · {m.createdAt}</p>
            </div>
            <div className="flex items-center gap-1">
              {(["open", "in_progress", "resolved"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setMaintenanceStatus(m.id, s);
                    toast.success("Status updated");
                  }}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize",
                    m.status === s ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground",
                  )}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
              <RowActions
                onEdit={() => {
                  const title = prompt("Update title", m.title);
                  if (title && title.trim()) {
                    updateMaintenance(m.id, { title: title.trim() });
                    toast.success("Updated");
                  }
                }}
                onDelete={() => {
                  if (confirm("Delete this request?")) {
                    removeMaintenance(m.id);
                    toast("Deleted");
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Announcements composer ---------- */
export const LandlordAnnouncements = () => {
  const { announcements, addAnnouncement, updateAnnouncement, removeAnnouncement } = useSync();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <Header icon={<Megaphone className="h-4 w-4" />} title="Send announcement" sub="Tenants get it instantly" count={announcements.length} />
      <div className={cn(card, "p-4")}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder="Message…"
          className="mt-2 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-brand"
        />
        <div className="mt-2 flex gap-2">
          {editId && (
            <button
              onClick={() => { setEditId(null); setTitle(""); setBody(""); }}
              className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              if (!title.trim()) return;
              if (editId) {
                updateAnnouncement(editId, { title, body });
                toast.success("Announcement updated");
              } else {
                addAnnouncement({ title, body, audience: "All tenants" });
                toast.success("Announcement broadcast");
              }
              setTitle(""); setBody(""); setEditId(null);
            }}
            className="flex-1 rounded-full bg-gradient-green py-2 text-xs font-semibold text-primary-foreground shadow-glow-sm"
          >
            {editId ? "Save changes" : "Broadcast"}
          </button>
        </div>
      </div>
      <div className={cn(card, "divide-y divide-border")}>
        {announcements.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{a.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{a.body}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{a.audience} · {a.createdAt}</p>
            </div>
            <RowActions
              onEdit={() => { setEditId(a.id); setTitle(a.title); setBody(a.body); }}
              onDelete={() => { removeAnnouncement(a.id); toast("Announcement deleted"); }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Visitor approvals ---------- */
export const LandlordVisitors = () => {
  const { visitors, setVisitorStatus, removeVisitor } = useSync();
  return (
    <div className="space-y-3">
      <Header icon={<UserPlus className="h-4 w-4" />} title="Visitor passes" sub="Approve guest entries" count={visitors.length} />
      <div className={cn(card, "divide-y divide-border")}>
        {visitors.map((v) => (
          <div key={v.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold">{v.guest}</p>
              <p className="text-xs text-muted-foreground">{v.tenant} · {v.room} · {v.date}</p>
            </div>
            <div className="flex items-center gap-2">
              {v.status === "pending" ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => { setVisitorStatus(v.id, "denied"); toast("Visitor denied"); }}
                    className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold hover:border-destructive hover:text-destructive"
                  >
                    Deny
                  </button>
                  <button
                    onClick={() => { setVisitorStatus(v.id, "approved"); toast.success("Visitor approved"); }}
                    className="rounded-full bg-gradient-green px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-glow-sm"
                  >
                    Approve
                  </button>
                </div>
              ) : (
                <Pill tone={v.status === "approved" ? "g" : "r"}>{v.status}</Pill>
              )}
              <RowActions
                onDelete={() => { removeVisitor(v.id); toast("Visitor removed"); }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Reviews ---------- */
export const LandlordReviews = () => {
  const { reviews, removeReview } = useSync();
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / Math.max(1, reviews.length);
  return (
    <div className="space-y-3">
      <Header icon={<Star className="h-4 w-4" />} title="Tenant reviews" sub={`${avg.toFixed(1)} ★ average`} count={reviews.length} />
      <div className={cn(card, "divide-y divide-border")}>
        {reviews.map((r) => (
          <div key={r.id} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{r.by} · <span className="font-normal text-muted-foreground">{r.room}</span></p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <RowActions
                  onDelete={() => { if (confirm("Hide this review?")) { removeReview(r.id); toast("Review removed"); } }}
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Lease extension requests ---------- */
export const LandlordExtensions = () => {
  const { leaseExts, setLeaseExtStatus, removeLeaseExt } = useSync();
  return (
    <div className="space-y-3">
      <Header icon={<CalendarRange className="h-4 w-4" />} title="Renewal requests" sub="Tenant lease extensions" count={leaseExts.length} />
      <div className={cn(card, "divide-y divide-border")}>
        {leaseExts.map((l) => (
          <div key={l.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold">+{l.months} months · {l.tenant}</p>
              <p className="text-xs text-muted-foreground">{l.room}</p>
            </div>
            <div className="flex items-center gap-2">
              {l.status === "pending" ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => { setLeaseExtStatus(l.id, "denied"); toast("Renewal denied"); }}
                    className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold hover:border-destructive hover:text-destructive"
                  >
                    Deny
                  </button>
                  <button
                    onClick={() => { setLeaseExtStatus(l.id, "approved"); toast.success("Renewal approved"); }}
                    className="rounded-full bg-gradient-green px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-glow-sm"
                  >
                    Approve
                  </button>
                </div>
              ) : (
                <Pill tone={l.status === "approved" ? "g" : "r"}>{l.status}</Pill>
              )}
              <RowActions
                onDelete={() => { removeLeaseExt(l.id); toast("Request removed"); }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Amenity bookings ---------- */
export const LandlordBookings = () => {
  const { bookings, removeBooking } = useSync();
  return (
    <div className="space-y-3">
      <Header icon={<CalendarPlus className="h-4 w-4" />} title="Amenity bookings" sub="Common area reservations" count={bookings.length} />
      <div className={cn(card, "divide-y divide-border")}>
        {bookings.map((b) => (
          <div key={b.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold">{b.amenity}</p>
              <p className="text-xs text-muted-foreground">{b.tenant} · {b.date} · {b.slot}</p>
            </div>
            <RowActions
              onDelete={() => { removeBooking(b.id); toast("Booking cancelled"); }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Header = ({ icon, title, sub, count }: { icon: JSX.Element; title: string; sub: string; count: number }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary">{icon}</div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </div>
    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground">{count}</span>
  </div>
);

const Pill = ({ children, tone }: { children: string; tone: "g" | "a" | "r" }) => (
  <span
    className={cn(
      "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
      tone === "g" && "border-brand/40 bg-brand/10 text-brand",
      tone === "a" && "border-amber-400/40 bg-amber-400/10 text-amber-700",
      tone === "r" && "border-destructive/40 bg-destructive/10 text-destructive",
    )}
  >
    {children}
  </span>
);

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