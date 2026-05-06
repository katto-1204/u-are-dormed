import { useState } from "react";
import {
  Activity,
  Bell,
  Building2,
  CircleDot,
  Crown,
  Edit3,
  FileText,
  LogOut,
  Mail,
  Menu,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
  CheckCircle2,
  Trash2,
  Upload,
  User as UserIcon,
  X,
  Download,
  Home,
  LayoutGrid,
  LineChart,
  Plus,
  Receipt,
  Search,
  Settings,
  TrendingUp,
  Users,
  Zap,
  Wifi,
  Droplets,
  Megaphone,
} from "lucide-react";
import { dorms, Room } from "@/data/dorms";
import { landlordThreads } from "@/data/messages";
import { Inbox } from "./shared/Inbox";
import { FloorPlan } from "./FloorPlan";
import { Logo } from "./shared/Logo";
import { useAuth } from "./auth/AuthContext";
import { ProUpgradeModal } from "./shared/ProUpgradeModal";
import {
  LandlordMaintenance,
  LandlordAnnouncements,
  LandlordVisitors,
  LandlordReviews,
  LandlordExtensions,
  LandlordBookings,
} from "./features/LandlordOps";
import { useSync } from "@/data/syncStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type View =
  | "overview"
  | "rooms"
  | "tenants"
  | "billing"
  | "utilities"
  | "iot"
  | "ops"
  | "messages"
  | "notifications"
  | "profile";

const peso = (n: number) => `₱${n.toLocaleString()}`;

export const LandlordDashboard = () => {
  const [view, setView] = useState<View>("overview");
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile nav overlay */}
      {navOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}
      <Sidebar
        view={view}
        onChange={(v) => {
          setView(v);
          setNavOpen(false);
        }}
        open={navOpen}
      />
      <div className="min-w-0 flex-1">
        <TopBar onMenu={() => setNavOpen(true)} />
        <main className="px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          {view === "overview" && <Overview />}
          {view === "rooms" && <Rooms />}
          {view === "tenants" && <Tenants />}
          {view === "billing" && <Billing />}
          {view === "utilities" && <Utilities />}
          {view === "iot" && <IoT />}
          {view === "ops" && <Operations />}
          {view === "messages" && <Messages />}
          {view === "notifications" && <Notifications />}
          {view === "profile" && <Profile />}
        </main>
      </div>
    </div>
  );
};

const Sidebar = ({
  view,
  onChange,
  open,
}: {
  view: View;
  onChange: (v: View) => void;
  open: boolean;
}) => {
  const { user, signOut } = useAuth();
  const items: { id: View; label: string; icon: JSX.Element }[] = [
    { id: "overview", label: "Overview", icon: <LayoutGrid className="h-4 w-4" /> },
    { id: "rooms", label: "Rooms", icon: <Home className="h-4 w-4" /> },
    { id: "tenants", label: "Tenants", icon: <Users className="h-4 w-4" /> },
    { id: "billing", label: "Billing", icon: <Receipt className="h-4 w-4" /> },
    { id: "utilities", label: "Utilities", icon: <Zap className="h-4 w-4" /> },
    { id: "ops", label: "Tenant Ops", icon: <Megaphone className="h-4 w-4" /> },
    { id: "iot", label: "IoT Monitoring", icon: <Activity className="h-4 w-4" /> },
    { id: "messages", label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Megaphone className="h-4 w-4" /> },
    { id: "profile", label: "Profile", icon: <UserIcon className="h-4 w-4" /> },
  ];
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-background px-4 py-6 transition-transform lg:sticky lg:top-0 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className="flex items-center gap-2 px-2 pb-8">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary p-1 shadow-glow-sm">
          <Logo size={32} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold">U Are Dormed</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Landlord Suite
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto pr-1">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
              view === it.id
                ? "bg-gradient-green text-primary-foreground shadow-glow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {it.icon}
            {it.label}
          </button>
        ))}
      </nav>
      <div className="mt-3 rounded-2xl border border-border p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
            {user?.initials ?? "JD"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name ?? "Jose Dela Cruz"}</p>
            <p className="truncate text-xs text-muted-foreground">4 properties</p>
          </div>
          <button
            onClick={signOut}
            className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

const TopBar = ({ onMenu }: { onMenu: () => void }) => (
  <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
    <button
      onClick={onMenu}
      className="grid h-10 w-10 place-items-center rounded-full border border-border lg:hidden"
    >
      <Menu className="h-4 w-4" />
    </button>
    <div className="hidden h-10 flex-1 items-center gap-3 rounded-full border border-border bg-secondary/40 px-4 sm:flex sm:max-w-md">
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        placeholder="Search tenants, rooms, invoices…"
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
        ⌘K
      </kbd>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => toast("3 new notifications", { description: "Maria R. paid · Owen D. uploaded lease · Nov 28 dues" })}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-border hover:border-brand"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand shadow-glow-sm" />
      </button>
      <button
        onClick={() => toast.success("Invoice draft created", { description: "INV-1143 ready to send." })}
        className="hidden items-center gap-2 rounded-full bg-gradient-green px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 sm:flex"
      >
        <Plus className="h-4 w-4" />
        New invoice
      </button>
    </div>
  </div>
);

/* ---------- OVERVIEW ---------- */
const Overview = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Northgate Residences
      </p>
      <h1 className="text-3xl font-bold">Good morning, Jose</h1>
      <p className="text-sm text-muted-foreground">
        Here’s what’s happening across your dorms today.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[
        { label: "Total rooms", value: "24", delta: "+2 this month" },
        { label: "Occupancy", value: "92%", delta: "+4.1% vs Oct" },
        { label: "Active tenants", value: "67", delta: "3 new" },
        { label: "On-time payments", value: "88%", delta: "+6%" },
      ].map((s) => (
        <div key={s.label} className="rounded-2xl border border-border p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {s.label}
          </p>
          <p className="mt-2 text-3xl font-bold">{s.value}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" /> {s.delta}
          </p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-2 rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Monthly revenue
            </p>
            <p className="mt-1 text-2xl font-bold">₱284,500</p>
          </div>
          <div className="flex gap-1 rounded-full border border-border p-1 text-xs">
            {["6M", "1Y", "ALL"].map((p, i) => (
              <button
                key={p}
                className={cn(
                  "rounded-full px-3 py-1",
                  i === 0 ? "bg-foreground text-background" : "text-muted-foreground",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <RevenueChart />
      </div>

      <div className="rounded-2xl border border-border p-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Payment compliance
        </p>
        <div className="mt-4 grid place-items-center">
          <Donut percent={88} />
        </div>
        <div className="mt-4 space-y-2 text-xs">
          <Legend dot="bg-foreground" label="Paid" value="59" />
          <Legend dot="bg-muted-foreground" label="Partial" value="5" />
          <Legend dot="bg-secondary border border-border" label="Overdue" value="3" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h3 className="font-semibold">Recent activity</h3>
          <button className="text-xs text-muted-foreground">View all</button>
        </div>
        <div className="divide-y divide-border">
          {[
            { who: "Maria R.", what: "paid ₱4,956 for Nov", when: "2m ago" },
            { who: "Room 204", what: "marked as vacant", when: "1h ago" },
            { who: "Owen D.", what: "submitted lease", when: "3h ago" },
            { who: "Electric meter", what: "reading uploaded", when: "Yesterday" },
          ].map((a) => (
            <div key={a.who + a.when} className="flex items-center gap-3 p-4">
              <CircleDot className="h-4 w-4 text-muted-foreground" />
              <p className="flex-1 text-sm">
                <span className="font-medium">{a.who}</span>{" "}
                <span className="text-muted-foreground">{a.what}</span>
              </p>
              <span className="text-xs text-muted-foreground">{a.when}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h3 className="font-semibold">Upcoming dues</h3>
          <button className="text-xs text-muted-foreground">Send reminders</button>
        </div>
        <div className="divide-y divide-border">
          {[
            { name: "Kim D.", room: "202", amt: 4956, due: "Nov 28" },
            { name: "Rico V.", room: "202", amt: 4956, due: "Nov 30" },
            { name: "Eli N.", room: "203", amt: 7220, due: "Dec 1" },
            { name: "Bea C.", room: "302", amt: 7220, due: "Dec 3" },
          ].map((u) => (
            <div key={u.name} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-bold">
                  {u.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">Room {u.room} · Due {u.due}</p>
                </div>
              </div>
              <span className="text-sm font-semibold">{peso(u.amt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const RevenueChart = () => {
  const data = [180, 195, 210, 205, 240, 235, 260, 255, 270, 268, 280, 284];
  const max = Math.max(...data);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 80}`)
    .join(" ");
  const area = `0,100 ${points} 100,100`;
  return (
    <div className="mt-6 h-48 w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--brand-green))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--brand-green))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#revArea)" />
        <polyline
          points={points}
          fill="none"
          stroke="hsl(var(--brand-green))"
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        {["Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
};

const Donut = ({ percent }: { percent: number }) => {
  const r = 36;
  const c = 2 * Math.PI * r;
  return (
    <svg width="140" height="140" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="hsl(var(--brand-green))"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${(percent / 100) * c} ${c}`}
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="700" fill="hsl(var(--brand-green))">
        {percent}%
      </text>
    </svg>
  );
};

const Legend = ({ dot, label, value }: { dot: string; label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", dot)} />
      <span className="text-muted-foreground">{label}</span>
    </div>
    <span className="font-semibold">{value}</span>
  </div>
);

/* ---------- ROOMS ---------- */
const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>(() => dorms[0].rooms);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const active = rooms.find((r) => r.id === activeId) ?? null;

  const startAdd = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };
  const startEdit = (r: Room) => {
    setEditingRoom(r);
    setModalOpen(true);
  };
  const removeRoom = (id: string) => {
    setRooms((rs) => rs.filter((r) => r.id !== id));
    if (activeId === id) setActiveId(null);
    toast.success("Room deleted");
  };
  const saveRoom = (r: Room) => {
    setRooms((rs) =>
      rs.some((x) => x.id === r.id) ? rs.map((x) => (x.id === r.id ? r : x)) : [r, ...rs],
    );
    setModalOpen(false);
    toast.success(editingRoom ? "Room updated" : "Room added");
  };
  const assignTenant = (roomId: string) => {
    setRooms((rs) =>
      rs.map((r) => {
        if (r.id !== roomId || r.tenants.length >= r.capacity) return r;
        const id = `t-${Date.now()}`;
        return {
          ...r,
          occupied: r.occupied + 1,
          tenants: [...r.tenants, { id, initials: "NX", name: "New Tenant" }],
        };
      }),
    );
    toast.success("Tenant assigned", { description: "Bed allocated successfully." });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        title="Rooms"
        subtitle={`Northgate Residences · ${rooms.length} rooms`}
        cta="Add room"
        onCta={startAdd}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl border border-border p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Floor plan</h3>
            <span className="text-xs text-muted-foreground">Click a room to manage</span>
          </div>
          <FloorPlan
            rooms={rooms}
            selectedId={activeId ?? undefined}
            onSelect={(id) => setActiveId(id)}
          />
        </div>
        <div className="rounded-3xl border border-border p-5">
          {active ? (
            <RoomManagePanel
              room={active}
              onClose={() => setActiveId(null)}
              onEdit={() => startEdit(active)}
              onAssign={() => assignTenant(active.id)}
              onDelete={() => removeRoom(active.id)}
            />
          ) : (
            <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
              <div>
                <Home className="mx-auto h-6 w-6 opacity-40" />
                <p className="mt-2">Select a room to manage tenants</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          All rooms
        </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rooms.map((r) => {
          const ratio = r.occupied / r.capacity;
          const status = ratio === 1 ? "Full" : ratio === 0 ? "Vacant" : "Partial";
          return (
            <div
              key={r.id}
              className={cn(
                "group relative rounded-2xl border p-5 text-left transition-all",
                activeId === r.id
                  ? "border-brand shadow-glow-sm"
                  : "border-border hover:border-brand/40",
              )}
            >
              <button
                onClick={() => setActiveId(r.id)}
                className="absolute inset-0 z-0 rounded-2xl"
                aria-label={`Select ${r.name}`}
              />
              <div className="relative z-10 flex items-start justify-end gap-1">
                <button
                  onClick={() => startEdit(r)}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-background opacity-0 transition-opacity hover:border-brand hover:text-brand group-hover:opacity-100"
                  title="Edit"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${r.name}?`)) removeRoom(r.id);
                  }}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-background opacity-0 transition-opacity hover:border-destructive hover:text-destructive group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <div className="pointer-events-none relative z-0 -mt-7">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.name}</p>
                <Badge>{status}</Badge>
              </div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {r.type}
              </p>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold">
                  {r.occupied}/{r.capacity}
                </span>
                <span className="text-sm text-muted-foreground">{peso(r.pricePerBed)}/bed</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-gradient-green" style={{ width: `${ratio * 100}%` }} />
              </div>
              <div className="mt-4 flex -space-x-1.5">
                {r.tenants.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="grid h-7 w-7 place-items-center rounded-full border-2 border-background bg-gradient-green text-[10px] font-bold text-primary-foreground"
                  >
                    {t.initials}
                  </div>
                ))}
                {r.tenants.length === 0 && (
                  <span className="text-xs text-muted-foreground">No tenants yet</span>
                )}
              </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
      {modalOpen && (
        <RoomModal
          room={editingRoom}
          onClose={() => setModalOpen(false)}
          onSave={saveRoom}
        />
      )}
    </div>
  );
};

const RoomManagePanel = ({
  room,
  onClose,
  onEdit,
  onAssign,
  onDelete,
}: {
  room: Room;
  onClose: () => void;
  onEdit: () => void;
  onAssign: () => void;
  onDelete: () => void;
}) => {
  const ratio = room.occupied / room.capacity;
  const status = ratio === 1 ? "Full" : ratio === 0 ? "Vacant" : "Partial";
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {room.type === "private" ? "Private room" : "Shared room"}
          </p>
          <h3 className="text-2xl font-bold">{room.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{status}</Badge>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat k={`${room.occupied}/${room.capacity}`} v="Occupied" />
        <Stat k={peso(room.pricePerBed)} v="Per bed" />
        <Stat k={`${Math.round(ratio * 100)}%`} v="Utilization" />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Bed slots
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: room.capacity }).map((_, i) => {
            const t = room.tenants[i];
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-3",
                  t ? "border-border bg-secondary/40" : "border-foreground",
                )}
              >
                {t ? (
                  <>
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background">
                      {t.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">Bed {i + 1}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid h-7 w-7 place-items-center rounded-full border border-foreground">
                      <Plus className="h-3 w-3" />
                    </div>
                    <p className="text-xs font-semibold">Bed {i + 1} · vacant</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 pt-6">
        <button
          onClick={() => {
            if (confirm(`Delete ${room.name}?`)) onDelete();
          }}
          className="rounded-full border border-destructive/40 py-2.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5"
        >
          Delete
        </button>
        <button
          onClick={onEdit}
          className="rounded-full border border-border py-2.5 text-xs font-semibold transition-colors hover:border-brand hover:text-brand"
        >
          Edit room
        </button>
        <button
          onClick={onAssign}
          disabled={room.occupied >= room.capacity}
          className="rounded-full bg-gradient-green py-2.5 text-xs font-semibold text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none"
        >
          Assign tenant
        </button>
      </div>
    </div>
  );
};

/* ---------- TENANTS ---------- */
type TenantRow = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  room: string;
  rent: number;
  status: "Paid" | "Partial" | "Overdue";
  lease: string | null;
};

const seedTenants = (): TenantRow[] =>
  dorms[0].rooms.flatMap((r) =>
    r.tenants.map((t, i) => ({
      id: t.id,
      name: t.name,
      initials: t.initials,
      email: `${t.name.split(" ")[0].toLowerCase()}@uad.app`,
      phone: `+63 9${(17 + i).toString().padStart(2, "0")} 555 0${(100 + i).toString().slice(-3)}`,
      room: r.name,
      rent: r.pricePerBed,
      status: (["Paid", "Paid", "Partial", "Overdue", "Paid"][parseInt(t.id.slice(1)) % 5] as TenantRow["status"]),
      lease: parseInt(t.id.slice(1)) % 3 === 0 ? `lease-${t.id}.pdf` : null,
    })),
  );

const Tenants = () => {
  const [rows, setRows] = useState<TenantRow[]>(() => seedTenants());
  const [editing, setEditing] = useState<TenantRow | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<TenantRow | null>(null);

  const allRooms = dorms[0].rooms.map((r) => r.name);
  const filtered = rows.filter((r) =>
    (r.name + r.room + r.email).toLowerCase().includes(search.toLowerCase()),
  );

  const startAdd = () => {
    setEditing(null);
    setOpen(true);
  };
  const startEdit = (t: TenantRow) => {
    setEditing(t);
    setOpen(true);
  };
  const remove = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));
  const save = (t: TenantRow) => {
    setRows((rs) => {
      const exists = rs.some((r) => r.id === t.id);
      return exists ? rs.map((r) => (r.id === t.id ? t : r)) : [t, ...rs];
    });
    setOpen(false);
  };
  const uploadLease = (id: string) => {
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, lease: `lease-${id}.pdf` } : r)),
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        title="Tenants"
        subtitle={`${rows.length} active tenants`}
        cta="Add tenant"
        onCta={startAdd}
      />
      <div className="flex h-10 items-center gap-2 rounded-full border border-border bg-secondary/40 px-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tenants by name, room, or email"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Tenant</th>
              <th className="px-5 py-3 text-left">Room</th>
              <th className="px-5 py-3 text-left">Monthly</th>
              <th className="px-5 py-3 text-left">Lease</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-secondary/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{t.room}</td>
                <td className="px-5 py-3 font-medium">{peso(t.rent)}</td>
                <td className="px-5 py-3">
                  {t.lease ? (
                    <button
                      onClick={() => setViewing(t)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium underline-offset-2 hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {t.lease}
                    </button>
                  ) : (
                    <button
                      onClick={() => uploadLease(t.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground"
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </button>
                  )}
                </td>
                <td className="px-5 py-3">
                  <Badge>{t.status}</Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => startEdit(t)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                      title="Edit"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => remove(t.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No tenants match "{search}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {open && (
        <TenantModal
          tenant={editing}
          rooms={allRooms}
          onClose={() => setOpen(false)}
          onSave={save}
        />
      )}
      {viewing && (
        <DocumentViewer tenant={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
};

const DocumentViewer = ({
  tenant,
  onClose,
}: {
  tenant: TenantRow;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm animate-fade-in">
    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-elevated">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">{tenant.lease}</p>
            <p className="text-xs text-muted-foreground">
              {tenant.name} · {tenant.room} · 12-month lease
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-secondary/30 p-6">
        <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-border bg-background p-8 shadow-soft">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Tenant Lease Agreement
            </p>
            <h2 className="mt-1 text-xl font-bold">U Are Dormed · Northgate Residences</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 border-y border-border py-4 text-xs">
            <Field2 label="Tenant" value={tenant.name} />
            <Field2 label="Room" value={tenant.room} />
            <Field2 label="Email" value={tenant.email} />
            <Field2 label="Phone" value={tenant.phone} />
            <Field2 label="Monthly rent" value={peso(tenant.rent)} />
            <Field2 label="Term" value="12 months" />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            This Agreement is entered into between the Landlord and the Tenant
            named above. The Tenant agrees to pay the monthly rent on or before
            the 5th day of each calendar month. Utilities are split among
            roommates based on the Property&apos;s posted policy.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The Tenant shall keep the premises in clean and sanitary condition,
            comply with all house rules, and provide thirty (30) days notice
            prior to vacating. Security deposit equals one (1) month&apos;s rent
            and shall be returned within fifteen (15) days of move-out, less any
            verified damages.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-6">
            <div>
              <div className="h-10 border-b border-foreground" />
              <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Tenant signature
              </p>
            </div>
            <div>
              <div className="h-10 border-b border-foreground" />
              <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Landlord signature
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Field2 = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-0.5 font-medium">{value}</p>
  </div>
);

const TenantModal = ({
  tenant,
  rooms,
  onClose,
  onSave,
}: {
  tenant: TenantRow | null;
  rooms: string[];
  onClose: () => void;
  onSave: (t: TenantRow) => void;
}) => {
  const [form, setForm] = useState<TenantRow>(
    tenant ?? {
      id: `t-${Date.now()}`,
      name: "",
      initials: "?",
      email: "",
      phone: "",
      room: rooms[0] ?? "Room 201",
      rent: 4200,
      status: "Paid",
      lease: null,
    },
  );

  const set = <K extends keyof TenantRow>(k: K, v: TenantRow[K]) =>
    setForm({
      ...form,
      [k]: v,
      ...(k === "name"
        ? {
            initials:
              String(v)
                .split(" ")
                .map((s) => s[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase() || "?",
          }
        : {}),
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-elevated">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{tenant ? "Edit tenant" : "Add tenant"}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="mt-5 space-y-3"
        >
          <ModalField label="Full name" value={form.name} onChange={(v) => set("name", v)} required />
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required />
            <ModalField label="Phone" value={form.phone} onChange={(v) => set("phone", v)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Room</label>
              <select
                value={form.room}
                onChange={(e) => set("room", e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
              >
                {rooms.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <ModalField
              label="Monthly (₱)"
              type="number"
              value={String(form.rent)}
              onChange={(v) => set("rent", parseInt(v) || 0)}
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Status</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(["Paid", "Partial", "Overdue"] as const).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => set("status", s)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-semibold",
                    form.status === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-full border border-border text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 flex-1 rounded-full bg-foreground text-sm font-semibold text-background"
            >
              {tenant ? "Save changes" : "Add tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ModalField = ({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) => (
  <label className="block">
    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
    />
  </label>
);

/* ---------- ROOM MODAL ---------- */
const RoomModal = ({
  room,
  onClose,
  onSave,
}: {
  room: Room | null;
  onClose: () => void;
  onSave: (r: Room) => void;
}) => {
  const [form, setForm] = useState<Room>(
    room ?? {
      id: `r-${Date.now()}`,
      name: "",
      capacity: 4,
      occupied: 0,
      pricePerBed: 4200,
      type: "shared",
      tenants: [],
    },
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-elevated">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{room ? "Edit room" : "Add room"}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const capped = Math.max(form.capacity, form.tenants.length);
            onSave({ ...form, capacity: capped, occupied: form.tenants.length });
          }}
          className="mt-5 space-y-3"
        >
          <ModalField
            label="Room name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="Room 401"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <ModalField
              label="Capacity (beds)"
              type="number"
              value={String(form.capacity)}
              onChange={(v) => setForm({ ...form, capacity: Math.max(1, parseInt(v) || 1) })}
              required
            />
            <ModalField
              label="Price per bed (₱)"
              type="number"
              value={String(form.pricePerBed)}
              onChange={(v) => setForm({ ...form, pricePerBed: parseInt(v) || 0 })}
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Type
            </label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {(["shared", "private"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-semibold capitalize",
                    form.type === t
                      ? "border-transparent bg-gradient-green text-primary-foreground shadow-glow-sm"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-full border border-border text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 flex-1 rounded-full bg-gradient-green text-sm font-semibold text-primary-foreground shadow-glow-sm"
            >
              {room ? "Save changes" : "Add room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- BILLING ---------- */
const Billing = () => {
  const [tab, setTab] = useState<"All" | "Paid" | "Partial" | "Overdue">("All");
  return (
  <div className="space-y-6 animate-fade-in">
    <Header
      title="Billing"
      subtitle="November 2025 invoices"
      cta="Generate invoices"
      onCta={() =>
        toast.success("Invoices generated", {
          description: "5 invoices created for November.",
        })
      }
    />
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: "Invoiced", v: "₱312,400" },
        { label: "Collected", v: "₱284,500" },
        { label: "Outstanding", v: "₱27,900" },
      ].map((s) => (
        <div key={s.label} className="rounded-2xl border border-border p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
          <p className="mt-2 text-2xl font-bold">{s.v}</p>
        </div>
      ))}
    </div>
    <div className="rounded-2xl border border-border">
      <div className="flex items-center justify-between border-b border-border p-5">
        <h3 className="font-semibold">Invoices</h3>
        <div className="flex gap-1 rounded-full border border-border p-1 text-xs">
          {(["All", "Paid", "Partial", "Overdue"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-3 py-1 transition-colors",
                tab === t
                  ? "bg-gradient-green text-primary-foreground shadow-glow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-5 py-3 text-left">Invoice</th>
            <th className="px-5 py-3 text-left">Tenant</th>
            <th className="px-5 py-3 text-left">Due</th>
            <th className="px-5 py-3 text-left">Amount</th>
            <th className="px-5 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {([
            { id: "INV-1142", n: "Maria R.", d: "Nov 30", a: 4956, s: "Paid" },
            { id: "INV-1141", n: "Kim D.", d: "Nov 28", a: 4956, s: "Partial" },
            { id: "INV-1140", n: "Rico V.", d: "Nov 30", a: 4956, s: "Overdue" },
            { id: "INV-1139", n: "Eli N.", d: "Dec 1", a: 7220, s: "Paid" },
            { id: "INV-1138", n: "Bea C.", d: "Dec 3", a: 7220, s: "Paid" },
          ] as const)
            .filter((i) => tab === "All" || i.s === tab)
            .map((i) => (
            <tr key={i.id} className="hover:bg-secondary/30">
              <td className="px-5 py-3 font-mono text-xs">{i.id}</td>
              <td className="px-5 py-3">{i.n}</td>
              <td className="px-5 py-3 text-muted-foreground">{i.d}</td>
              <td className="px-5 py-3 font-medium">{peso(i.a)}</td>
              <td className="px-5 py-3"><Badge>{i.s}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

/* ---------- UTILITIES ---------- */
const Utilities = () => (
  <div className="space-y-6 animate-fade-in">
    <Header
      title="Utilities"
      subtitle="Readings & split configuration"
      cta="Add reading"
      onCta={() => toast.success("Reading added", { description: "Meter snapshot recorded." })}
    />
    <div className="grid grid-cols-3 gap-4">
      {[
        { icon: <Zap className="h-4 w-4" />, label: "Electricity", v: "1,248 kWh", split: "Equal" },
        { icon: <Droplets className="h-4 w-4" />, label: "Water", v: "32 m³", split: "Proportional" },
        { icon: <Wifi className="h-4 w-4" />, label: "Internet", v: "Flat", split: "Equal" },
      ].map((u) => (
        <div key={u.label} className="rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
              {u.icon}
            </div>
            <Badge>{u.split}</Badge>
          </div>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
            {u.label}
          </p>
          <p className="text-2xl font-bold">{u.v}</p>
        </div>
      ))}
    </div>
    <div className="rounded-2xl border border-border p-6">
      <h3 className="font-semibold">Split per tenant — Electricity (Room 201)</h3>
      <p className="text-xs text-muted-foreground">Configure how this bill is divided</p>
      <div className="mt-5 space-y-4">
        {[
          { name: "Maria R.", pct: 25 },
          { name: "Jose L.", pct: 25 },
          { name: "Ana P.", pct: 25 },
          { name: "You", pct: 25 },
        ].map((p) => (
          <div key={p.name}>
            <div className="flex items-center justify-between text-sm">
              <span>{p.name}</span>
              <span className="font-medium">{p.pct}% · ₱412</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-foreground" style={{ width: `${p.pct * 4}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ---------- REPORTS ---------- */
const Reports = () => (
  <div className="space-y-6 animate-fade-in">
    <Header
      title="Reports"
      subtitle="Income, occupancy, payment trends"
      cta="Export CSV"
      ctaIcon={<Download className="h-4 w-4" />}
      onCta={() => toast.success("Export started", { description: "CSV will download shortly." })}
    />
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-2xl border border-border p-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">YTD income</p>
        <p className="mt-1 text-3xl font-bold">₱2,948,300</p>
        <RevenueChart />
      </div>
      <div className="rounded-2xl border border-border p-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Occupancy trend</p>
        <p className="mt-1 text-3xl font-bold">92%</p>
        <div className="mt-6 flex h-40 items-end gap-2">
          {[60,68,72,75,78,82,85,84,88,90,91,92].map((v, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-foreground" style={{ height: `${v}%` }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ---------- IOT ---------- */
const IoT = () => {
  const [tab, setTab] = useState<"overview" | "devices" | "alerts" | "automations">("overview");
  const [devices, setDevices] = useState(() => [
    { id: "d1", name: "Room 201 — Motion", type: "Motion", room: "201", status: "online", battery: 86, signal: 92, last: "12s ago" },
    { id: "d2", name: "Room 202 — Motion", type: "Motion", room: "202", status: "online", battery: 71, signal: 88, last: "1m ago" },
    { id: "d3", name: "Room 203 — Motion", type: "Motion", room: "203", status: "offline", battery: 12, signal: 0, last: "Yesterday" },
    { id: "d4", name: "Hallway — CCTV", type: "Camera", room: "Hall", status: "online", battery: 100, signal: 98, last: "Live" },
    { id: "d5", name: "Electric meter", type: "Meter", room: "Main", status: "online", battery: 100, signal: 80, last: "5m ago" },
    { id: "d6", name: "Water meter", type: "Meter", room: "Main", status: "online", battery: 100, signal: 76, last: "12m ago" },
    { id: "d7", name: "Door — Main", type: "Lock", room: "Lobby", status: "online", battery: 64, signal: 91, last: "3m ago" },
    { id: "d8", name: "Smoke — Floor 2", type: "Smoke", room: "F2", status: "online", battery: 92, signal: 84, last: "OK" },
    { id: "d9", name: "Thermostat — Lounge", type: "Climate", room: "Lounge", status: "online", battery: 100, signal: 95, last: "Now" },
  ]);
  const [alerts, setAlerts] = useState(() => [
    { id: "a1", level: "critical", title: "Smoke spike detected", where: "Floor 2 sensor", at: "2m ago", ack: false },
    { id: "a2", level: "warning", title: "Door left open >5 min", where: "Main lobby", at: "14m ago", ack: false },
    { id: "a3", level: "warning", title: "Low battery 12%", where: "Room 203 motion", at: "1h ago", ack: false },
    { id: "a4", level: "info", title: "Firmware update available", where: "Hallway CCTV", at: "Today", ack: true },
  ]);
  const [autos, setAutos] = useState([
    { id: "u1", name: "Auto-lock lobby after 10pm", on: true },
    { id: "u2", name: "Aircon off when room vacant 15m", on: true },
    { id: "u3", name: "SMS landlord on smoke alert", on: true },
    { id: "u4", name: "Email weekly energy report", on: false },
  ]);

  const online = devices.filter((d) => d.status === "online").length;
  const openAlerts = alerts.filter((a) => !a.ack).length;

  // mock live time-series
  const power = [42, 48, 51, 47, 55, 62, 58, 64, 70, 68, 72, 75, 71, 78, 74];
  const water = [12, 14, 13, 16, 18, 15, 17, 19, 16, 18, 20, 17, 19, 21, 18];

  const ackAlert = (id: string) => {
    setAlerts((xs) => xs.map((a) => (a.id === id ? { ...a, ack: true } : a)));
    toast.success("Alert acknowledged");
  };
  const reboot = (id: string) => {
    toast(`Rebooting device…`, { description: "Estimated 30s downtime." });
    setDevices((ds) => ds.map((d) => (d.id === id ? { ...d, last: "Rebooting" } : d)));
    setTimeout(() => {
      setDevices((ds) => ds.map((d) => (d.id === id ? { ...d, last: "Just now", status: "online" } : d)));
      toast.success("Device back online");
    }, 1500);
  };
  const toggleAuto = (id: string) => {
    setAutos((xs) => xs.map((a) => (a.id === id ? { ...a, on: !a.on } : a)));
    toast("Automation updated");
  };

  const tabs: { id: typeof tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "devices", label: "Devices", count: devices.length },
    { id: "alerts", label: "Alerts", count: openAlerts },
    { id: "automations", label: "Automations", count: autos.filter((a) => a.on).length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        title="IoT Monitoring"
        subtitle="Live telemetry across all properties"
        cta="Add device"
        onCta={() => toast("Device pairing", { description: "Scan QR on device to pair." })}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Devices online", v: `${online}/${devices.length}`, sub: "All zones" },
          { label: "Open alerts", v: `${openAlerts}`, sub: "Last 24h" },
          { label: "Power load", v: "7.4 kW", sub: "Live" },
          { label: "Water flow", v: "18 L/m", sub: "Live" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <span className="relative h-2 w-2 rounded-full bg-brand shadow-glow-sm">
                <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-brand/40" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{s.v}</p>
            <p className="text-[10px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative -mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              tab === t.id ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-2 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Live power consumption</p>
                <p className="mt-1 text-2xl font-bold">7.4 kW <span className="text-xs font-normal text-brand">▲ 4%</span></p>
              </div>
              <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold text-brand">REAL-TIME</span>
            </div>
            <Sparkline data={power} />
          </div>
          <div className="rounded-2xl border border-border p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Water flow</p>
            <p className="mt-1 text-2xl font-bold">18 L/min</p>
            <Sparkline data={water} />
          </div>

          <div className="rounded-2xl border border-border p-6 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent alerts</h3>
              <button onClick={() => setTab("alerts")} className="text-xs text-brand hover:underline">View all</button>
            </div>
            <div className="divide-y divide-border">
              {alerts.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-3">
                  <span className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    a.level === "critical" && "bg-destructive shadow-[0_0_8px_hsl(var(--destructive))]",
                    a.level === "warning" && "bg-amber-500",
                    a.level === "info" && "bg-muted-foreground",
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.where} · {a.at}</p>
                  </div>
                  {!a.ack && (
                    <button onClick={() => ackAlert(a.id)} className="rounded-full border border-border px-3 py-1 text-xs hover:border-brand hover:text-brand">
                      Ack
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-sm font-semibold">System health</h3>
            <div className="mt-4 space-y-3">
              {[
                { label: "Gateway uptime", v: "99.98%", w: 99 },
                { label: "Mesh signal", v: "Strong", w: 88 },
                { label: "Storage", v: "62% used", w: 62 },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-semibold">{m.v}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-gradient-green" style={{ width: `${m.w}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "devices" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {devices.map((d) => (
            <div key={d.id} className="rounded-2xl border border-border p-5 transition-colors hover:border-brand/40">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">{d.type}</span>
                <span className={cn(
                  "relative h-2 w-2 rounded-full",
                  d.status === "online" ? "bg-brand shadow-glow-sm" : "bg-muted-foreground",
                )}>
                  {d.status === "online" && <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-brand/40" />}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold">{d.name}</p>
              <p className="text-xs text-muted-foreground">Room {d.room} · {d.last}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <p className="text-muted-foreground">Battery</p>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                    <div className={cn("h-full", d.battery < 20 ? "bg-destructive" : "bg-brand")} style={{ width: `${d.battery}%` }} />
                  </div>
                  <p className="mt-0.5 font-semibold">{d.battery}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Signal</p>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-foreground" style={{ width: `${d.signal}%` }} />
                  </div>
                  <p className="mt-0.5 font-semibold">{d.signal}%</p>
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <button onClick={() => reboot(d.id)} className="flex-1 rounded-full border border-border py-1.5 text-[11px] font-medium hover:border-brand hover:text-brand">Reboot</button>
                <button onClick={() => toast(`${d.name}`, { description: "Opening live stream…" })} className="flex-1 rounded-full bg-foreground py-1.5 text-[11px] font-medium text-background">Live</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "alerts" && (
        <div className="overflow-hidden rounded-2xl border border-border">
          {alerts.map((a) => (
            <div key={a.id} className="flex items-center gap-4 border-b border-border p-4 last:border-b-0">
              <span className={cn(
                "grid h-9 w-9 place-items-center rounded-full text-[10px] font-bold uppercase",
                a.level === "critical" && "bg-destructive/10 text-destructive",
                a.level === "warning" && "bg-amber-500/10 text-amber-600",
                a.level === "info" && "bg-secondary text-muted-foreground",
              )}>{a.level[0]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.where} · {a.at}</p>
              </div>
              {a.ack ? (
                <span className="text-xs text-muted-foreground">Acknowledged</span>
              ) : (
                <button onClick={() => ackAlert(a.id)} className="rounded-full bg-gradient-green px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow-sm">Acknowledge</button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "automations" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {autos.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-2xl border border-border p-5">
              <div>
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.on ? "Active" : "Disabled"}</p>
              </div>
              <button
                onClick={() => toggleAuto(a.id)}
                className={cn(
                  "relative h-7 w-12 rounded-full transition-colors",
                  a.on ? "bg-gradient-green shadow-glow-sm" : "bg-secondary",
                )}
              >
                <span className={cn(
                  "absolute top-0.5 h-6 w-6 rounded-full bg-background shadow transition-transform",
                  a.on ? "translate-x-5" : "translate-x-0.5",
                )} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Sparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / (max - min || 1)) * 80 - 10}`)
    .join(" ");
  const area = `0,100 ${points} 100,100`;
  return (
    <div className="mt-4 h-32 w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id={`spark-${data[0]}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--brand-green))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--brand-green))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#spark-${data[0]})`} />
        <polyline points={points} fill="none" stroke="hsl(var(--brand-green))" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
};

/* ---------- NOTIFICATIONS ---------- */
const Notifications = () => {
  const [enabled, setEnabled] = useState(true);
  return (
  <div className="space-y-6 animate-fade-in">
    <Header
      title="Notifications"
      subtitle="Send announcements & alerts"
      cta="New broadcast"
      onCta={() => toast.success("Broadcast composer", { description: "Draft saved to outbox." })}
    />
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 rounded-2xl border border-border">
        {[
          { t: "Water interruption Nov 22", who: "All tenants · 67", when: "Sent 2d ago" },
          { t: "Rent due reminder", who: "Room 202 · 4 tenants", when: "Sent 5d ago" },
          { t: "House rules update", who: "All tenants · 67", when: "Sent 1w ago" },
        ].map((n) => (
          <div key={n.t} className="flex items-center justify-between border-b border-border p-5 last:border-b-0">
            <div>
              <p className="text-sm font-medium">{n.t}</p>
              <p className="text-xs text-muted-foreground">{n.who}</p>
            </div>
            <span className="text-xs text-muted-foreground">{n.when}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border p-5">
        <h3 className="text-sm font-semibold">Auto reminders</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Send payment reminders 3 days before due date.
        </p>
        <button
          onClick={() => {
            setEnabled((v) => !v);
            toast(enabled ? "Auto reminders disabled" : "Auto reminders enabled");
          }}
          className={cn(
            "mt-4 w-full rounded-full py-2.5 text-sm font-medium transition-all",
            enabled
              ? "bg-gradient-green text-primary-foreground shadow-glow-sm"
              : "border border-border text-muted-foreground",
          )}
        >
          {enabled ? "Enabled" : "Disabled"}
        </button>
      </div>
    </div>
  </div>
  );
};

/* ---------- shared ---------- */
const Header = ({
  title,
  subtitle,
  cta,
  ctaIcon,
  onCta,
}: {
  title: string;
  subtitle: string;
  cta: string;
  ctaIcon?: JSX.Element;
  onCta?: () => void;
}) => (
  <div className="flex items-end justify-between">
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
    <button
      onClick={onCta}
      className="flex items-center gap-2 rounded-full bg-gradient-green px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
    >
      {ctaIcon ?? <Plus className="h-4 w-4" />}
      {cta}
    </button>
  </div>
);

const Badge = ({ children }: { children: string }) => {
  const styles: Record<string, string> = {
    Paid: "border-brand/40 bg-brand/10 text-brand",
    Partial: "border-amber-400/40 bg-amber-400/10 text-amber-700",
    Overdue: "border-destructive/40 bg-destructive/10 text-destructive",
    Active: "border-brand/40 bg-brand/10 text-brand",
    Pending: "border-amber-400/40 bg-amber-400/10 text-amber-700",
    Full: "border-transparent bg-gradient-green text-primary-foreground shadow-glow-sm",
    Vacant: "border-border text-muted-foreground",
    Equal: "border-border text-muted-foreground",
    Proportional: "border-brand/40 bg-brand/10 text-brand",
  };
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        styles[children] ?? "border-border text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
};

/* ---------- LEASES ---------- */
const Leases = () => {
  const leases = [
    { id: "L-2042", tenant: "Maria R.", room: "201", start: "Aug 1, 2025", end: "Jul 31, 2026", file: "lease-MR.pdf", status: "Active" },
    { id: "L-2041", tenant: "Jose L.", room: "201", start: "Jun 1, 2025", end: "May 31, 2026", file: "lease-JL.pdf", status: "Active" },
    { id: "L-2040", tenant: "Kim D.", room: "202", start: "Sep 1, 2025", end: "Aug 31, 2026", file: "lease-KD.pdf", status: "Pending" },
    { id: "L-2039", tenant: "Eli N.", room: "203", start: "Jul 15, 2025", end: "Jul 14, 2026", file: "lease-EN.pdf", status: "Active" },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        title="Leases & Contracts"
        subtitle="Upload, review, and renew tenant agreements"
        cta="Upload lease"
        ctaIcon={<Upload className="h-4 w-4" />}
        onCta={() => toast.success("Lease uploaded", { description: "Pending review." })}
      />
      <button
        onClick={() => toast.success("Lease uploaded", { description: "lease-new.pdf · Pending review." })}
        className="flex w-full flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-border bg-gradient-green-soft p-10 text-center transition-all hover:border-brand hover:shadow-glow-sm"
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-background border border-brand/30 text-brand">
          <Upload className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold">Drop a PDF here or click to upload</p>
        <p className="text-xs text-muted-foreground">Max 10 MB · PDF, DOC, DOCX</p>
      </button>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Lease</th>
              <th className="px-5 py-3 text-left">Tenant</th>
              <th className="px-5 py-3 text-left">Room</th>
              <th className="px-5 py-3 text-left">Period</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">File</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leases.map((l) => (
              <tr key={l.id} className="hover:bg-secondary/30">
                <td className="px-5 py-3 font-mono text-xs">{l.id}</td>
                <td className="px-5 py-3 font-medium">{l.tenant}</td>
                <td className="px-5 py-3 text-muted-foreground">{l.room}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {l.start} → {l.end}
                </td>
                <td className="px-5 py-3">
                  <Badge>{l.status}</Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => toast(`${l.file}`, { description: "Opening preview…" })}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-brand underline-offset-2 hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {l.file}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ---------- MESSAGES ---------- */
const Messages = () => (
  <div className="space-y-6 animate-fade-in">
    <Header
      title="Messages"
      subtitle="Conversations with tenants and staff"
      cta="New message"
    />
    <Inbox threads={landlordThreads} />
  </div>
);

/* ---------- PROFILE ---------- */
const Profile = () => {
  const { user, signOut } = useAuth();
  const [edit, setEdit] = useState(false);
  const [proOpen, setProOpen] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "Jose Dela Cruz",
    email: user?.email ?? "jose@uaredormed.com",
    phone: user?.phone ?? "+63 917 555 0142",
    location: user?.location ?? "Quezon City, PH",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        title="Profile"
        subtitle="Account information and preferences"
        cta={edit ? "Save changes" : "Edit profile"}
        ctaIcon={<Edit3 className="h-4 w-4" />}
        onCta={() => setEdit((e) => !e)}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pro upgrade card */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-ink p-6 text-white shadow-elevated">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/40 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-12 left-10 h-36 w-36 rounded-full bg-brand-glow/30 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-glow/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-glow">
                <Crown className="h-3 w-3" /> Dormed Pro for Landlords
              </span>
              <h3 className="mt-3 text-2xl font-bold leading-tight">Grow your property business with Pro.</h3>
              <p className="mt-1 text-xs text-white/60">
                Boosted listings, 0% platform fees, verified landlord badge, advanced analytics, and 24/7 priority support.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-1.5 text-[11px] text-white/80 sm:grid-cols-4">
                {["Boosted listings", "0% platform fees", "Verified badge", "Advanced analytics"].map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-brand-glow" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-end justify-between gap-4 lg:flex-col lg:items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">From</p>
                <p className="text-3xl font-bold">
                  ₱169<span className="text-xs font-normal text-white/50">/mo</span>
                </p>
              </div>
              <button
                onClick={() => setProOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                <Sparkles className="h-3.5 w-3.5" /> Apply for Pro
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border p-6 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-foreground text-lg font-bold text-background">
            {user?.initials ?? "JD"}
          </div>
          <p className="mt-3 text-base font-semibold">{form.name}</p>
          <p className="text-xs text-muted-foreground">Landlord · 4 properties</p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <Stat k="24" v="Rooms" />
            <Stat k="67" v="Tenants" />
            <Stat k="4.9" v="Rating" />
          </div>
          <button
            onClick={signOut}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border">
          <div className="border-b border-border p-5">
            <h3 className="text-sm font-semibold">Personal information</h3>
            <p className="text-xs text-muted-foreground">Used across your dashboard and tenant communications.</p>
          </div>
          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {[
              { icon: <UserIcon className="h-4 w-4" />, label: "Full name", key: "name" as const },
              { icon: <Mail className="h-4 w-4" />, label: "Email", key: "email" as const },
              { icon: <Phone className="h-4 w-4" />, label: "Phone", key: "phone" as const },
              { icon: <MapPin className="h-4 w-4" />, label: "Location", key: "location" as const },
            ].map((f) => (
              <div key={f.key} className="flex items-start gap-3 p-5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
                  {f.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {f.label}
                  </p>
                  {edit ? (
                    <input
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="mt-1 w-full bg-transparent text-sm outline-none"
                    />
                  ) : (
                    <p className="mt-1 truncate text-sm">{form[f.key]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-border p-6">
          <h3 className="text-sm font-semibold">Properties</h3>
          <p className="text-xs text-muted-foreground">Buildings under your management.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {dorms.map((d) => (
              <div key={d.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <p className="text-sm font-semibold">{d.name}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{d.location}</p>
                <p className="mt-3 text-xs">
                  <span className="font-bold">{d.total - d.available}</span>
                  <span className="text-muted-foreground"> / {d.total} occupied</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ProUpgradeModal
        open={proOpen}
        onClose={() => setProOpen(false)}
        monthlyPrice={169}
        yearlyPrice={1690}
        tagline="Built for landlords who want to scale their dorms."
      />
    </div>
  );
};

const Stat = ({ k, v }: { k: string; v: string }) => (
  <div className="rounded-xl border border-border py-2">
    <p className="text-base font-bold">{k}</p>
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{v}</p>
  </div>
);

/* ---------- OPERATIONS (synced tenant features) ---------- */
const Operations = () => {
  const { maintenance, announcements, visitors, leaseExts, bookings, reviews } = useSync();
  const stats = [
    { label: "Open requests", v: maintenance.filter((m) => m.status !== "resolved").length },
    { label: "Pending visitors", v: visitors.filter((v) => v.status === "pending").length },
    { label: "Renewal reqs", v: leaseExts.filter((l) => l.status === "pending").length },
    { label: "Bookings", v: bookings.length },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Live</p>
        <h1 className="text-3xl font-bold">Tenant Operations</h1>
        <p className="text-sm text-muted-foreground">Everything tenants do in their app — synced here in real time.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LandlordMaintenance />
        <LandlordAnnouncements />
        <LandlordVisitors />
        <LandlordExtensions />
        <LandlordBookings />
        <LandlordReviews />
      </div>
    </div>
  );
};