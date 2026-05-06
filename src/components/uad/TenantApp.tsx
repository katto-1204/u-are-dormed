import { useState } from "react";
import {
  Bell,
  Bed,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Edit3,
  HelpCircle,
  Home,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Receipt,
  Search,
  Settings,
  Star,
  User,
  Wallet,
  X,
  Wifi,
  Zap,
  Droplets,
  Snowflake,
  ShieldCheck,
  Shirt,
  BookOpen,
  ChefHat,
  Bath,
  Briefcase,
  Library,
  Coffee,
  ChevronRight,
} from "lucide-react";
import { Banknote, Building2, ArrowUpRight } from "lucide-react";
import { Dorm, Room, dorms } from "@/data/dorms";
import { FloorPlan } from "./FloorPlan";
import { Inbox } from "./shared/Inbox";
import { WalletCard } from "./shared/WalletCard";
import { tenantThreads } from "@/data/messages";
import { useAuth } from "./auth/AuthContext";
import { useSync } from "@/data/syncStore";
import { TenantHub } from "./features/TenantHub";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Screen =
  | "home"
  | "details"
  | "room"
  | "billing"
  | "consumption"
  | "myroom"
  | "messages"
  | "profile"
  | "slots"
  | "hub"
  | "receipt";

const amenityIcon: Record<string, JSX.Element> = {
  WiFi: <Wifi className="h-4 w-4" />,
  "WiFi 500Mbps": <Wifi className="h-4 w-4" />,
  "WiFi 1Gbps": <Wifi className="h-4 w-4" />,
  Aircon: <Snowflake className="h-4 w-4" />,
  "Hot Shower": <Bath className="h-4 w-4" />,
  "Private Bath": <Bath className="h-4 w-4" />,
  "24/7 CCTV": <ShieldCheck className="h-4 w-4" />,
  CCTV: <ShieldCheck className="h-4 w-4" />,
  Laundry: <Shirt className="h-4 w-4" />,
  "Study Lounge": <BookOpen className="h-4 w-4" />,
  Lounge: <Coffee className="h-4 w-4" />,
  Library: <Library className="h-4 w-4" />,
  Kitchen: <ChefHat className="h-4 w-4" />,
  Cafeteria: <ChefHat className="h-4 w-4" />,
  Workspace: <Briefcase className="h-4 w-4" />,
};

const peso = (n: number) => `₱${n.toLocaleString()}`;

export const TenantApp = () => {
  const [screen, setScreen] = useState<Screen>("myroom");
  const [activeDorm, setActiveDorm] = useState<Dorm>(dorms[0]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [pickedBed, setPickedBed] = useState<{ roomId: string; bed: number } | null>(null);
  return (
    <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col bg-background">
      <div className="flex-1 pb-32 sm:pb-28">
        {screen === "home" && (
          <HomeScreen
            onOpen={(d) => {
              setActiveDorm(d);
              setScreen("details");
            }}
            onTab={setScreen}
          />
        )}
        {screen === "details" && (
          <DetailsScreen
            dorm={activeDorm}
            onBack={() => setScreen("home")}
            onSelectRoom={(r) => {
              setActiveRoom(r);
              setScreen("room");
            }}
          />
        )}
        {screen === "room" && activeRoom && (
          <RoomScreen
            room={activeRoom}
            dorm={activeDorm}
            onBack={() => setScreen("details")}
          />
        )}
        {screen === "billing" && (
          <BillingScreen
            onBack={() => setScreen("home")}
            onPay={() => setScreen("slots")}
            onReceipt={() => setScreen("receipt")}
          />
        )}
        {screen === "consumption" && (
          <ConsumptionScreen onBack={() => setScreen("home")} />
        )}
        {screen === "myroom" && (
          <MyRoomScreen
            onBack={() => setScreen("home")}
            onPay={() => setScreen("billing")}
            onMessage={() => setScreen("messages")}
            onHub={() => setScreen("hub")}
          />
        )}
        {screen === "messages" && <MessagesScreen onBack={() => setScreen("home")} />}
        {screen === "profile" && <ProfileScreen onBack={() => setScreen("home")} />}
        {screen === "hub" && <TenantHub />}
        {screen === "receipt" && <ReceiptScreen onBack={() => setScreen("billing")} />}
        {screen === "slots" && (
          <SlotPickerScreen
            dorm={activeDorm}
            picked={pickedBed}
            onPick={(roomId, bed) => setPickedBed({ roomId, bed })}
            onBack={() => setScreen("billing")}
            onContinue={() => setCheckoutOpen(true)}
          />
        )}
      </div>
      <BottomNav screen={screen} onChange={setScreen} />
      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => {
            setCheckoutOpen(false);
            setScreen("receipt");
          }}
        />
      )}
    </div>
  );
};

/* ---------- HOME ---------- */
const HomeScreen = ({
  onOpen,
  onTab,
}: {
  onOpen: (d: Dorm) => void;
  onTab: (s: Screen) => void;
}) => {
  const [filter, setFilter] = useState("All");
  const featured = dorms.slice(0, 3);
  const list = dorms;

  return (
    <div className="animate-fade-in">
      {/* Dark hero */}
      <div className="relative overflow-hidden bg-gradient-ink px-5 pb-10 pt-8 text-white">
        <div aria-hidden className="pointer-events-none absolute -top-20 right-0 h-60 w-60 rounded-full bg-brand/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 left-0 h-52 w-52 rounded-full bg-brand-glow/20 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Welcome back</p>
            <h1 className="mt-1 text-2xl font-bold">Find your next home.</h1>
          </div>
          <button
            onClick={() => onTab("billing")}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-glow" />
          </button>
        </div>

        <div className="relative mt-5 flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 backdrop-blur">
          <Search className="h-4 w-4 text-white/60" />
          <input
            placeholder="Search by city or dorm name…"
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
          <span className="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">PH</span>
        </div>

        <div className="relative mt-4 flex gap-2 overflow-x-auto pb-1">
          {["All", "Shared", "Private", "Under ₱5k", "Near UP", "Pet-friendly"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
                filter === f
                  ? "border-transparent bg-brand text-primary-foreground shadow-glow-sm"
                  : "border-white/15 bg-white/5 text-white/70 hover:border-brand/60 hover:text-white",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Featured carousel */}
      <div className="relative z-10 -mt-6 px-5">
        <div className="rounded-3xl border border-border bg-background p-4 shadow-soft">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Featured this week</h2>
            <span className="text-[10px] text-muted-foreground">Hand-picked</span>
          </div>
          <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
            {featured.map((d) => (
              <button
                key={d.id}
                onClick={() => onOpen(d)}
                className="group relative shrink-0 overflow-hidden rounded-2xl"
                style={{ width: 220 }}
              >
                <img src={d.image} alt={d.name} className="aspect-[4/5] w-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10" />
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-ink">
                  <Star className="h-2.5 w-2.5 fill-ink" />
                  {d.rating}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[10px] uppercase tracking-wider opacity-70">{d.location.split(",")[1]?.trim() ?? "PH"}</p>
                  <p className="truncate text-sm font-bold">{d.name}</p>
                  <p className="text-[11px] font-semibold text-brand-glow">{peso(d.pricePerBed)}<span className="text-white/60">/bed</span></p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* All listings */}
      <div className="mt-8 space-y-4 px-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider">All dorms</h2>
          <span className="text-[10px] text-muted-foreground">{list.length} properties</span>
        </div>
        {list.map((d) => (
          <button
            key={d.id}
            onClick={() => onOpen(d)}
            className="block w-full overflow-hidden rounded-3xl border border-border bg-background text-left transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-soft"
          >
            <div className="flex gap-3 p-3">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-muted">
                <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute left-1 top-1 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-bold text-ink">
                  {d.available} left
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{d.location}</span>
                </div>
                <h3 className="mt-0.5 truncate text-base font-bold">{d.name}</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {d.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                      {a}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-end justify-between pt-2">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Star className="h-3 w-3 fill-foreground" />
                    <span className="font-semibold">{d.rating}</span>
                    <span className="text-muted-foreground">({d.reviews})</span>
                  </div>
                  <p className="text-base font-bold">
                    {peso(d.pricePerBed)}
                    <span className="text-[10px] font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
        <div className="h-4" />
      </div>
    </div>
  );
};

/* ---------- DETAILS ---------- */
const DetailsScreen = ({
  dorm,
  onBack,
  onSelectRoom,
}: {
  dorm: Dorm;
  onBack: () => void;
  onSelectRoom: (r: Room) => void;
}) => {
  const [selected, setSelected] = useState<string | undefined>();
  return (
    <div className="animate-fade-in">
      <div className="relative">
        <img
          src={dorm.image}
          alt={dorm.name}
          loading="lazy"
          width={1024}
          height={768}
          className="aspect-[4/3] w-full object-cover"
        />
        <button
          onClick={onBack}
          className="absolute left-4 top-12 grid h-10 w-10 place-items-center rounded-full bg-background/90 backdrop-blur"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-6 p-5">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-foreground" />
              <span className="font-semibold">{dorm.rating}</span>
              <span className="text-muted-foreground">({dorm.reviews} reviews)</span>
            </div>
          </div>
          <h2 className="mt-1 text-xl font-bold">{dorm.name}</h2>
          <p className="text-sm text-muted-foreground">{dorm.location}</p>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {dorm.description}
        </p>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
            Amenities
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {dorm.amenities.map((a) => (
              <div
                key={a}
                className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs"
              >
                {amenityIcon[a] ?? <ShieldCheck className="h-4 w-4" />}
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Floor plan
            </h3>
            <span className="text-xs text-muted-foreground">Tap a room</span>
          </div>
          <FloorPlan
            rooms={dorm.rooms}
            selectedId={selected}
            onSelect={(id) => {
              setSelected(id);
              const r = dorm.rooms.find((x) => x.id === id);
              if (r) onSelectRoom(r);
            }}
          />
        </div>

        <div className="sticky bottom-24 -mx-5 flex items-center justify-between border-t border-border bg-background/95 px-5 py-4 backdrop-blur sm:bottom-20">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-lg font-bold">{peso(dorm.pricePerBed)}<span className="text-xs font-normal text-muted-foreground">/bed</span></p>
          </div>
          <button
            onClick={() => dorm.rooms[0] && onSelectRoom(dorm.rooms.find((r) => r.occupied < r.capacity) || dorm.rooms[0])}
            className="rounded-full bg-gradient-green px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
          >
            Reserve a slot
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- ROOM ---------- */
const RoomScreen = ({
  room,
  dorm,
  onBack,
}: {
  room: Room;
  dorm: Dorm;
  onBack: () => void;
}) => {
  const slots = Array.from({ length: room.capacity });
  const utilities = Math.round(room.pricePerBed * 0.18);
  const total = room.pricePerBed + utilities;

  return (
    <div className="animate-fade-in p-5 pt-8">
      <button
        onClick={onBack}
        className="mb-4 grid h-10 w-10 place-items-center rounded-full border border-border"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {dorm.name}
        </p>
        <h2 className="text-2xl font-bold">{room.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {room.type === "shared" ? "Shared room" : "Private room"} ·{" "}
          {room.capacity} beds
        </p>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
          Beds
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {slots.map((_, i) => {
            const tenant = room.tenants[i];
            const taken = !!tenant;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-2xl border p-4",
                  taken
                    ? "border-border bg-secondary/40"
                    : "border-foreground bg-background",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Bed {i + 1}
                  </span>
                  {!taken && (
                    <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold text-background">
                      Available
                    </span>
                  )}
                </div>
                {taken ? (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background">
                      {tenant.initials}
                    </div>
                    <span className="text-sm">{tenant.name}</span>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Tap “Reserve” to claim this bed.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          Cost breakdown
        </h3>
        <div className="mt-3 space-y-2 text-sm">
          <Row label="Monthly rent" value={peso(room.pricePerBed)} />
          <Row
            label={`Utilities (split ${room.capacity} ways)`}
            value={peso(utilities)}
          />
          <div className="my-2 h-px bg-border" />
          <Row label="Your share" value={peso(total)} bold />
        </div>
      </div>

      <button
        onClick={() =>
          toast.success("Reservation requested", {
            description: `${room.name} held for 24h · ${peso(total)}/mo`,
          })
        }
        className="mt-6 w-full rounded-full bg-gradient-green py-4 text-sm font-semibold text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5"
      >
        Confirm reservation · {peso(total)}/mo
      </button>
    </div>
  );
};

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={cn(bold ? "font-semibold" : "text-muted-foreground")}>
      {label}
    </span>
    <span className={cn(bold ? "text-base font-bold" : "")}>{value}</span>
  </div>
);

/* ---------- BILLING ---------- */
const BillingScreen = ({
  onBack,
  onPay,
  onReceipt,
}: {
  onBack: () => void;
  onPay: () => void;
  onReceipt: () => void;
}) => {
  const { wallet } = useSync();
  return (
    <div className="animate-fade-in p-5 pt-8">
      <button
        onClick={onBack}
        className="mb-4 grid h-10 w-10 place-items-center rounded-full border border-border"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <h2 className="text-2xl font-bold">Billing</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        November 2025 · Room 201, Northgate
      </p>

      <div className="mt-6">
        <WalletCard
          tagline="EASE AROUND YOUR FINANCE"
          pocketLabel="Wallet"
          pocketAmount={`₱${wallet.toLocaleString()}.00`}
          totalAmount="₱4,956.00"
          totalLabel="Amount Due"
          caption="Due Nov 30, 2025"
          ctaLabel="Pay now"
          onCta={onPay}
        />
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
          This month’s breakdown
        </h3>
        <div className="overflow-hidden rounded-2xl border border-border">
          {[
            { label: "Monthly rent", val: 4200, icon: <Home className="h-4 w-4" /> },
            { label: "Electricity (split ¼)", val: 412, icon: <Zap className="h-4 w-4" /> },
            { label: "Water (split ¼)", val: 144, icon: <Droplets className="h-4 w-4" /> },
            { label: "Internet (split ¼)", val: 200, icon: <Wifi className="h-4 w-4" /> },
          ].map((r, i) => (
            <div
              key={r.label}
              className={cn(
                "flex items-center justify-between p-4",
                i !== 0 && "border-t border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
                  {r.icon}
                </div>
                <span className="text-sm">{r.label}</span>
              </div>
              <span className="text-sm font-semibold">{peso(r.val)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
          History
        </h3>
        <div className="space-y-2">
          {[
            { m: "October 2025", val: 4720, status: "Paid" },
            { m: "September 2025", val: 4680, status: "Paid" },
            { m: "August 2025", val: 4810, status: "Paid" },
          ].map((h) => (
            <button
              key={h.m}
              onClick={onReceipt}
              className="flex w-full items-center justify-between rounded-xl border border-border p-3.5 text-left"
            >
              <div>
                <p className="text-sm font-medium">{h.m}</p>
                <p className="text-xs text-muted-foreground">{peso(h.val)}</p>
              </div>
              <span className="rounded-full border border-foreground px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                {h.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- CONSUMPTION ---------- */
const ConsumptionScreen = ({ onBack }: { onBack: () => void }) => {
  const elec = [38, 45, 42, 50, 48, 55, 52, 60, 58, 62, 65, 70];
  const water = [22, 24, 21, 26, 25, 28, 27, 30, 29, 31, 30, 33];
  return (
    <div className="animate-fade-in p-5 pt-8">
      <button
        onClick={onBack}
        className="mb-4 grid h-10 w-10 place-items-center rounded-full border border-border"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <h2 className="text-2xl font-bold">Consumption</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Live shared usage · Room 201
      </p>

      <Chart title="Electricity" unit="kWh" data={elec} icon={<Zap className="h-4 w-4" />} />
      <Chart title="Water" unit="m³" data={water} icon={<Droplets className="h-4 w-4" />} />

      <div className="mt-6 rounded-2xl border border-border p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          Your share this month
        </h3>
        <div className="mt-4 space-y-3">
          {[
            { name: "Maria R.", pct: 28 },
            { name: "Jose L.", pct: 25 },
            { name: "Ana P.", pct: 24 },
            { name: "You", pct: 23 },
          ].map((p) => (
            <div key={p.name}>
              <div className="flex items-center justify-between text-xs">
                <span className={p.name === "You" ? "font-semibold" : "text-muted-foreground"}>
                  {p.name}
                </span>
                <span className="font-medium">{p.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-foreground"
                  style={{ width: `${p.pct * 3.5}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Chart = ({
  title,
  unit,
  data,
  icon,
}: {
  title: string;
  unit: string;
  data: number[];
  icon: JSX.Element;
}) => {
  const max = Math.max(...data);
  return (
    <div className="mt-5 rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">Last 12 days</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-bold">
            {data[data.length - 1]} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 flex h-24 items-end gap-1.5">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm bg-foreground/80"
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};

/* ---------- BOTTOM NAV ---------- */
const BottomNav = ({
  screen,
  onChange,
}: {
  screen: Screen;
  onChange: (s: Screen) => void;
}) => {
  const tabs: { id: Screen; label: string; icon: JSX.Element }[] = [
    { id: "myroom", label: "My Room", icon: <Bed className="h-5 w-5" /> },
    { id: "home", label: "Browse", icon: <Search className="h-5 w-5" /> },
    { id: "hub", label: "Hub", icon: <Star className="h-5 w-5" /> },
    { id: "billing", label: "Billing", icon: <Receipt className="h-5 w-5" /> },
    { id: "messages", label: "Inbox", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-3 pb-4 pt-2">
      <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-between gap-0.5 overflow-x-auto rounded-full border border-border/70 bg-ink/95 px-2 py-2 text-white shadow-elevated backdrop-blur supports-[backdrop-filter]:bg-ink/80 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => {
          const active = screen === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              aria-label={t.label}
              className={cn(
                "relative flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold transition-all",
                active
                  ? "bg-brand text-primary-foreground shadow-glow-sm"
                  : "text-white/60 hover:text-white",
              )}
            >
              {t.icon}
              {active && <span className="hidden sm:inline">{t.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- MY ROOM ---------- */
const MyRoomScreen = ({
  onBack,
  onPay,
  onMessage,
  onHub,
}: {
  onBack: () => void;
  onPay: () => void;
  onMessage: () => void;
  onHub: () => void;
}) => {
  const dorm = dorms[0];
  const room = dorm.rooms[0];
  const { wallet, announcements, maintenance } = useSync();
  const annUnread = announcements.filter((a) => a.unreadFor.includes("me")).length;
  const openMaint = maintenance.filter((m) => m.status !== "resolved").length;
  return (
    <div className="animate-fade-in p-5 pt-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Your booking</p>
          <h2 className="text-3xl font-bold">{room.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{dorm.name} · Bed 4</p>
        </div>
        <button
          onClick={onMessage}
          className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-background hover:border-brand"
          title="Message landlord"
        >
          <MessageSquare className="h-4 w-4" />
          {annUnread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-primary-foreground">
              {annUnread}
            </span>
          )}
        </button>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-3xl">
        <img
          src={dorm.image}
          alt={dorm.name}
          className="aspect-[16/10] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Active lease
            </span>
            <p className="mt-2 text-sm font-medium">Move-in Aug 1, 2025</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider opacity-70">Next due</p>
            <p className="text-base font-bold">Nov 30</p>
          </div>
        </div>
      </div>

      {/* The "To Pay" wallet card */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          To pay
        </p>
        <div className="mt-3">
          <WalletCard
            tagline="EASE AROUND YOUR FINANCE"
            pocketLabel="Wallet"
            pocketAmount={`₱${wallet.toLocaleString()}.00`}
            totalAmount="₱4,956.00"
            totalLabel="Amount Due"
            caption="Due Nov 30, 2025 · Room 201"
            ctaLabel="Pay now"
            onCta={onPay}
          />
          <p className="mt-2 px-2 text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Wallet</span> shows your pre-loaded balance ·{" "}
            <span className="font-semibold text-foreground">Amount Due</span> is what you owe this month.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {[
          { label: "SOS", icon: <ShieldCheck className="h-4 w-4" />, tone: "destructive", onClick: () => toast.error("Emergency alert sent", { description: "Landlord & building security notified." }) },
          { label: "Check-in", icon: <CheckCircle2 className="h-4 w-4" />, tone: "brand", onClick: () => toast.success("Checked in", { description: "Curfew tracker updated · " + new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }) }) },
          { label: "WiFi", icon: <Wifi className="h-4 w-4" />, tone: "muted", onClick: onHub },
          { label: "Help", icon: <HelpCircle className="h-4 w-4" />, tone: "muted", onClick: () => toast("Need help?", { description: "Reach support 24/7 at support@uaredormed.com" }) },
        ].map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className={cn(
              "group flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all hover:-translate-y-0.5",
              a.tone === "destructive" && "border-destructive/30 bg-destructive/5 text-destructive hover:border-destructive",
              a.tone === "brand" && "border-brand/30 bg-brand/5 text-brand hover:border-brand",
              a.tone === "muted" && "border-border bg-secondary/30 hover:border-brand/40 hover:text-brand",
            )}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-background">
              {a.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { label: "Move-in", value: "Aug 1" },
          { label: "Lease", value: "12 mo" },
          { label: "Days", value: "117" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-secondary/30 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 text-sm font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Amenities */}
      <div className="mt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider">Amenities</h3>
          <span className="text-xs text-muted-foreground">Included with your room</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {dorm.amenities.map((a) => (
            <div
              key={a}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-xs"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand/10 text-brand">
                {amenityIcon[a] ?? <ShieldCheck className="h-3.5 w-3.5" />}
              </span>
              <span className="font-medium">{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick features link */}
      <button
        onClick={onHub}
        className="mt-5 flex w-full items-center justify-between rounded-2xl border border-border bg-gradient-green-soft p-4 text-left transition-transform hover:-translate-y-0.5"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-deep">Tenant hub</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">10 features at your fingertips</p>
          <p className="text-xs text-muted-foreground">Maintenance · Visitors · WiFi · Wallet · more</p>
        </div>
        <ArrowUpRight className="h-5 w-5 text-brand-deep" />
      </button>

      {/* Floor plan */}
      <div className="mt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider">Floor plan</h3>
          <span className="text-xs text-muted-foreground">You're in <span className="font-semibold text-foreground">{room.name}</span></span>
        </div>
        <FloorPlan rooms={dorm.rooms} selectedId={room.id} onSelect={() => {}} />
      </div>

      <div className="mt-6 rounded-2xl border border-border p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider">Activity summary</h3>
        <div className="mt-4 space-y-3">
          <Row label="Total paid to date" value="₱14,156" bold />
          <Row label="Days stayed" value="117" />
          <Row label="On-time rate" value="100%" />
          <Row label="Avg. monthly" value="₱4,718" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider">Roommates</h3>
        <div className="mt-3 space-y-2">
          {room.tenants.map((t) => (
            <div key={t.id} className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background">
                {t.initials}
              </div>
              <span className="text-sm">{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      {openMaint > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-400/40 bg-amber-400/10 p-3.5">
          <p className="text-xs font-medium text-amber-800">
            {openMaint} maintenance request{openMaint > 1 ? "s" : ""} in progress
          </p>
          <span className="text-[10px] uppercase tracking-wider text-amber-700">Tracked</span>
        </div>
      )}

      <button
        onClick={() =>
          toast.success("Maintenance requested", {
            description: "We've notified your landlord. They'll respond shortly.",
          })
        }
        className="mt-6 w-full rounded-full border border-border bg-background py-3.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
      >
        Request maintenance
      </button>
    </div>
  );
};

/* ---------- MESSAGES ---------- */
const MessagesScreen = ({ onBack }: { onBack: () => void }) => (
  <div className="animate-fade-in flex h-full flex-col">
    <div className="flex items-center gap-3 px-5 pb-3 pt-8">
      <button
        onClick={onBack}
        className="grid h-10 w-10 place-items-center rounded-full border border-border"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <h2 className="text-2xl font-bold">Messages</h2>
    </div>
    <div className="flex-1 min-h-[640px]">
      <Inbox threads={tenantThreads} variant="stacked" />
    </div>
  </div>
);

/* ---------- PROFILE ---------- */
const ProfileScreen = ({ onBack }: { onBack: () => void }) => {
  const { user, signOut } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    location: user?.location ?? "",
  });

  return (
    <div className="animate-fade-in">
      {/* Dark header */}
      <div className="relative overflow-hidden bg-gradient-ink px-5 pb-20 pt-8 text-white">
        <div aria-hidden className="pointer-events-none absolute -top-20 right-0 h-60 w-60 rounded-full bg-brand/30 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <button
            onClick={onBack}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-glow/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-glow">
            Tenant
          </span>
        </div>
        <div className="relative mt-6 flex items-center gap-4">
          <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-brand text-2xl font-bold text-primary-foreground shadow-glow-sm">
            {user?.initials ?? "U"}
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-white">
              <Edit3 className="h-3 w-3 text-ink" />
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{form.name || "Your name"}</h2>
            <p className="text-xs text-white/60">Tenant · {form.location || "Northgate"}</p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/60">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-glow" />
              Active lease · since Aug 2025
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-12 px-5 pb-8">
        {/* Stats card */}
        <div className="relative z-10 grid grid-cols-3 overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
          {[
            { k: "₱14,156", v: "Paid" },
            { k: "117", v: "Days" },
            { k: "100%", v: "On-time" },
          ].map((s, i) => (
            <div key={s.v} className={cn("p-4 text-center", i !== 0 && "border-l border-border")}>
              <p className="text-base font-bold">{s.k}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>

      <div className="mt-6 rounded-2xl border border-border">
        {[
          { icon: <Mail className="h-4 w-4" />, label: "Email", key: "email" as const },
          { icon: <Phone className="h-4 w-4" />, label: "Phone", key: "phone" as const },
          { icon: <MapPin className="h-4 w-4" />, label: "Location", key: "location" as const },
        ].map((f, i) => (
          <div
            key={f.key}
            className={cn(
              "flex items-center gap-3 p-4",
              i !== 0 && "border-t border-border",
            )}
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
              {f.icon}
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {f.label}
              </p>
              {edit ? (
                <input
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="mt-0.5 w-full bg-transparent text-sm outline-none"
                />
              ) : (
                <p className="mt-0.5 text-sm">{form[f.key]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setEdit((e) => !e)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background py-3 text-sm font-semibold"
      >
        <Edit3 className="h-4 w-4" />
        {edit ? "Save changes" : "Edit profile"}
      </button>

      <div className="mt-6 space-y-2">
        {[
          {
            icon: <Settings className="h-4 w-4" />,
            label: "Account settings",
            onClick: () => toast("Account settings", { description: "Coming soon." }),
          },
          {
            icon: <HelpCircle className="h-4 w-4" />,
            label: "Help & support",
            onClick: () => toast("Support", { description: "support@uaredormed.com" }),
          },
        ].map((it) => (
          <button
            key={it.label}
            onClick={it.onClick}
            className="flex w-full items-center gap-3 rounded-xl border border-border p-3.5 text-left text-sm transition-colors hover:border-brand hover:text-brand"
          >
            {it.icon}
            <span className="flex-1">{it.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl border border-destructive/30 p-3.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/5"
        >
          <LogOut className="h-4 w-4" />
          <span className="flex-1">Sign out</span>
        </button>
      </div>
      </div>
    </div>
  );
};

/* ---------- RECEIPT ---------- */
/* ---------- SLOT PICKER ---------- */
const SlotPickerScreen = ({
  dorm,
  picked,
  onPick,
  onBack,
  onContinue,
}: {
  dorm: Dorm;
  picked: { roomId: string; bed: number } | null;
  onPick: (roomId: string, bed: number) => void;
  onBack: () => void;
  onContinue: () => void;
}) => {
  const availableRooms = dorm.rooms.filter((r) => r.occupied < r.capacity);
  const [activeRoomId, setActiveRoomId] = useState<string>(
    picked?.roomId ?? availableRooms[0]?.id ?? dorm.rooms[0]?.id ?? "",
  );
  const room = dorm.rooms.find((r) => r.id === activeRoomId);

  return (
    <div className="animate-fade-in p-5 pt-8">
      <button
        onClick={onBack}
        className="mb-4 grid h-10 w-10 place-items-center rounded-full border border-border"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Step 1 of 2 · Pick your slot
      </p>
      <h2 className="text-2xl font-bold">Choose a room & bed</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Live availability across {dorm.name}.
      </p>

      <div className="mt-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Floor plan
        </h3>
        <FloorPlan
          rooms={dorm.rooms}
          selectedId={activeRoomId}
          onSelect={(id) => setActiveRoomId(id)}
        />
      </div>

      {room && (
        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold">{room.name}</h3>
            <p className="text-xs text-muted-foreground">
              {room.capacity - room.occupied} of {room.capacity} beds available
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: room.capacity }).map((_, i) => {
              const tenant = room.tenants[i];
              const taken = !!tenant;
              const isPicked = picked?.roomId === room.id && picked?.bed === i;
              return (
                <button
                  key={i}
                  disabled={taken}
                  onClick={() => onPick(room.id, i)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    taken && "border-border bg-secondary/40 opacity-60",
                    !taken && !isPicked && "border-border hover:border-foreground",
                    isPicked && "border-foreground bg-foreground text-background shadow-elevated",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Bed className="h-4 w-4" />
                    {isPicked && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider">
                    Bed {i + 1}
                  </p>
                  <p className="mt-0.5 text-[11px] opacity-70">
                    {taken ? tenant.name : "Available now"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {availableRooms.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No vacant beds in this property right now.
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-border p-4">
        <Row label="Selected room" value={room?.name ?? "—"} />
        <Row
          label="Bed"
          value={picked ? `Bed ${picked.bed + 1}` : "—"}
        />
        <Row label="Monthly" value={room ? peso(room.pricePerBed) : "—"} />
      </div>

      <button
        disabled={!picked}
        onClick={onContinue}
        className="mt-5 w-full rounded-full bg-gradient-green py-4 text-sm font-semibold text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none"
      >
        Continue to checkout
      </button>
    </div>
  );
};

const ReceiptScreen = ({ onBack }: { onBack: () => void }) => (
  <div className="animate-fade-in p-5 pt-8">
    <button
      onClick={onBack}
      className="mb-4 grid h-10 w-10 place-items-center rounded-full border border-border"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
    <div className="flex flex-col items-center text-center">
      <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-green text-primary-foreground shadow-glow animate-pulse-glow">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
        Payment successful
      </p>
      <h2 className="mt-1 text-2xl font-bold">₱4,956.00</h2>
      <p className="mt-1 text-xs text-muted-foreground">Receipt #UAD-241124-0042</p>
    </div>

    <div className="mt-6 rounded-2xl border border-dashed border-border p-5">
      <div className="space-y-3 text-sm">
        <Row label="Tenant" value="Maria R." />
        <Row label="Room" value="201 · Northgate" />
        <Row label="Period" value="Nov 2025" />
        <Row label="Method" value="GCash" />
        <Row label="Date" value="Nov 24, 2025 · 10:42" />
        <div className="my-2 h-px bg-border" />
        <Row label="Rent" value="₱4,200" />
        <Row label="Utilities (split)" value="₱756" />
        <div className="my-2 h-px bg-border" />
        <Row label="Total" value="₱4,956" bold />
      </div>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3">
      <button
        onClick={() => toast.success("Receipt downloaded", { description: "UAD-241124-0042.pdf" })}
        className="rounded-full border border-border py-3 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
      >
        Download PDF
      </button>
      <button
        onClick={() => toast.success("Receipt shared", { description: "Sent to your email." })}
        className="rounded-full bg-gradient-green py-3 text-sm font-semibold text-primary-foreground shadow-glow-sm"
      >
        Share receipt
      </button>
    </div>
  </div>
);

/* ---------- CHECKOUT MODAL ---------- */
const CheckoutModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [method, setMethod] = useState<"card" | "gcash" | "maya" | "cash">("gcash");
  const [processing, setProcessing] = useState(false);
  const [amount, setAmount] = useState("4956");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(onSuccess, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm animate-fade-in sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl bg-background p-5 shadow-elevated sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Checkout</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">November rent · Room 201</p>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Amount (PHP)
            </label>
            <div className="mt-1 flex h-12 items-center gap-1 rounded-xl border border-border px-3">
              <span className="text-base font-semibold text-muted-foreground">₱</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                className="flex-1 bg-transparent text-base font-semibold outline-none"
              />
            </div>
            <div className="mt-2 flex gap-1.5 text-[10px]">
              {[
                { l: "Pay full · ₱4,956", v: "4956" },
                { l: "Pay half · ₱2,478", v: "2478" },
              ].map((p) => (
                <button
                  type="button"
                  key={p.v}
                  onClick={() => setAmount(p.v)}
                  className="rounded-full border border-border px-2.5 py-1 font-medium"
                >
                  {p.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Payment method
            </label>
            <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  { id: "gcash", label: "GCash", icon: <Wallet className="h-4 w-4" /> },
                  { id: "maya", label: "Maya", icon: <Wallet className="h-4 w-4" /> },
                  { id: "card", label: "Card", icon: <CreditCard className="h-4 w-4" /> },
                  { id: "cash", label: "Cash", icon: <Banknote className="h-4 w-4" /> },
                ] as const
              ).map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "rounded-xl border p-3 text-xs font-semibold transition-all",
                    method === m.id
                      ? "border-brand bg-brand text-primary-foreground shadow-glow-sm"
                      : "border-border hover:border-brand/50",
                  )}
                >
                  <span className="mx-auto mb-1 grid h-5 place-items-center">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {method === "cash" && (
            <div className="rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-4 text-xs">
              <p className="font-semibold text-foreground">Pay in cash at the office</p>
              <p className="mt-1 text-muted-foreground">
                Visit the landlord's desk between 9 AM – 6 PM. We'll mark your payment as <span className="font-semibold text-amber-700">Pending</span> until verified.
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-background p-2.5">
                <Building2 className="h-4 w-4 text-brand" />
                <span className="font-medium">Northgate · Unit G/F · Mon – Sun</span>
              </div>
            </div>
          )}

          {method === "card" && (
            <div className="space-y-2">
              <input
                placeholder="Card number"
                className="h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-foreground"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="MM/YY"
                  className="h-11 rounded-xl border border-border px-3 text-sm outline-none focus:border-foreground"
                />
                <input
                  placeholder="CVV"
                  className="h-11 rounded-xl border border-border px-3 text-sm outline-none focus:border-foreground"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className="h-12 w-full rounded-full bg-gradient-green text-sm font-semibold text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:shadow-none"
          >
            {processing ? "Processing…" : `Pay ₱${Number(amount).toLocaleString()}`}
          </button>
          <p className="text-center text-[10px] text-muted-foreground">
            Your payment is processed securely. No real charge in this prototype.
          </p>
        </form>
      </div>
    </div>
  );
};