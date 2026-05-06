import { createContext, ReactNode, useContext, useMemo, useState } from "react";

/* ------------------------------------------------------------------
 * Shared in-memory store so changes done on the tenant side appear
 * instantly on the landlord side and vice-versa. Pure prototype.
 * ------------------------------------------------------------------ */

export type Severity = "low" | "medium" | "high";
export type ReqStatus = "open" | "in_progress" | "resolved";

export type MaintenanceReq = {
  id: string;
  tenant: string;
  room: string;
  title: string;
  details: string;
  severity: Severity;
  status: ReqStatus;
  createdAt: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: string;
  createdAt: string;
  unreadFor: string[]; // tenant ids that haven't read
};

export type VisitorPass = {
  id: string;
  tenant: string;
  room: string;
  guest: string;
  date: string;
  status: "pending" | "approved" | "denied";
};

export type Review = {
  id: string;
  by: string;
  room: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type LeaseExt = {
  id: string;
  tenant: string;
  room: string;
  months: number;
  status: "pending" | "approved" | "denied";
};

export type AmenityBooking = {
  id: string;
  tenant: string;
  amenity: string;
  date: string;
  slot: string;
};

export type WalletTxn = {
  id: string;
  type: "topup" | "rent" | "utility" | "deposit";
  amount: number; // positive = added, negative = spent
  label: string;
  at: string;
};

export type DocItem = {
  id: string;
  name: string;
  kind: "lease" | "receipt" | "rules" | "id";
  size: string;
  at: string;
};

interface Store {
  // tenant identity baked in for prototype
  me: { id: string; name: string; room: string };

  maintenance: MaintenanceReq[];
  addMaintenance: (m: Omit<MaintenanceReq, "id" | "createdAt" | "status">) => void;
  setMaintenanceStatus: (id: string, status: ReqStatus) => void;
  updateMaintenance: (id: string, patch: Partial<Omit<MaintenanceReq, "id">>) => void;
  removeMaintenance: (id: string) => void;

  announcements: Announcement[];
  addAnnouncement: (a: Omit<Announcement, "id" | "createdAt" | "unreadFor">) => void;
  markAnnRead: (id: string) => void;
  updateAnnouncement: (id: string, patch: Partial<Omit<Announcement, "id">>) => void;
  removeAnnouncement: (id: string) => void;

  visitors: VisitorPass[];
  addVisitor: (v: Omit<VisitorPass, "id" | "status">) => void;
  setVisitorStatus: (id: string, status: VisitorPass["status"]) => void;
  updateVisitor: (id: string, patch: Partial<Omit<VisitorPass, "id">>) => void;
  removeVisitor: (id: string) => void;

  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "createdAt">) => void;
  updateReview: (id: string, patch: Partial<Omit<Review, "id">>) => void;
  removeReview: (id: string) => void;

  leaseExts: LeaseExt[];
  addLeaseExt: (l: Omit<LeaseExt, "id" | "status">) => void;
  setLeaseExtStatus: (id: string, status: LeaseExt["status"]) => void;
  updateLeaseExt: (id: string, patch: Partial<Omit<LeaseExt, "id">>) => void;
  removeLeaseExt: (id: string) => void;

  bookings: AmenityBooking[];
  addBooking: (b: Omit<AmenityBooking, "id">) => void;
  updateBooking: (id: string, patch: Partial<Omit<AmenityBooking, "id">>) => void;
  removeBooking: (id: string) => void;

  wallet: number;
  txns: WalletTxn[];
  topUp: (amount: number) => void;
  charge: (amount: number, label: string, type?: WalletTxn["type"]) => void;
  removeTxn: (id: string) => void;

  documents: DocItem[];
  addDocument: (d: Omit<DocItem, "id" | "at">) => void;
  removeDocument: (id: string) => void;
  renameDocument: (id: string, name: string) => void;

  wifi: { ssid: string; password: string };
  setWifi: (w: { ssid: string; password: string }) => void;
}

const Ctx = createContext<Store | null>(null);

const id = () => Math.random().toString(36).slice(2, 9);
const now = () =>
  new Date().toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const me = { id: "me", name: "You", room: "Room 201" };

  const [maintenance, setMaintenance] = useState<MaintenanceReq[]>([
    {
      id: id(),
      tenant: "Maria R.",
      room: "Room 201",
      title: "Aircon clicking sound",
      details: "Started last night around 11pm.",
      severity: "medium",
      status: "in_progress",
      createdAt: "Today · 10:02",
    },
    {
      id: id(),
      tenant: "Owen D.",
      room: "Room 302",
      title: "WiFi keeps dropping",
      details: "3rd floor only.",
      severity: "high",
      status: "open",
      createdAt: "Yesterday",
    },
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: id(),
      title: "Water interruption · Nov 30",
      body: "Maintenance from 9 AM – 12 PM. Please store water in advance.",
      audience: "All tenants",
      createdAt: "2d ago",
      unreadFor: ["me"],
    },
    {
      id: id(),
      title: "House rules update",
      body: "Quiet hours now start at 10 PM. Common areas close at 11 PM.",
      audience: "All tenants",
      createdAt: "1w ago",
      unreadFor: [],
    },
  ]);

  const [visitors, setVisitors] = useState<VisitorPass[]>([
    { id: id(), tenant: "You", room: "Room 201", guest: "Andrea L.", date: "Nov 28 · 2 PM", status: "approved" },
    { id: id(), tenant: "Kim D.", room: "Room 202", guest: "Marco T.", date: "Nov 30 · 6 PM", status: "pending" },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    { id: id(), by: "Maria R.", room: "Room 201", rating: 5, text: "Quiet, fast wifi, helpful landlord.", createdAt: "Oct 2025" },
    { id: id(), by: "Eli N.", room: "Room 203", rating: 4, text: "Great location, water pressure could improve.", createdAt: "Sep 2025" },
  ]);

  const [leaseExts, setLeaseExts] = useState<LeaseExt[]>([
    { id: id(), tenant: "Bea C.", room: "Room 302", months: 6, status: "pending" },
  ]);

  const [bookings, setBookings] = useState<AmenityBooking[]>([
    { id: id(), tenant: "You", amenity: "Study Lounge", date: "Tomorrow", slot: "7 PM – 9 PM" },
  ]);

  const [wallet, setWallet] = useState(25000);
  const [txns, setTxns] = useState<WalletTxn[]>([
    { id: id(), type: "topup", amount: 10000, label: "GCash top-up", at: "Nov 20" },
    { id: id(), type: "rent", amount: -4720, label: "October rent", at: "Oct 30" },
    { id: id(), type: "utility", amount: -412, label: "Electricity share", at: "Oct 30" },
  ]);

  const [documents, setDocuments] = useState<DocItem[]>([
    { id: "d1", name: "Lease Agreement 2025.pdf", kind: "lease", size: "428 KB", at: "Aug 1, 2025" },
    { id: "d2", name: "House Rules v3.pdf", kind: "rules", size: "112 KB", at: "Sep 12, 2025" },
    { id: "d3", name: "October Receipt.pdf", kind: "receipt", size: "84 KB", at: "Oct 30, 2025" },
    { id: "d4", name: "Government ID copy.jpg", kind: "id", size: "1.2 MB", at: "Aug 1, 2025" },
  ]);

  const [wifi, setWifi] = useState({ ssid: "UAD_Northgate_5G", password: "DormSafe@2025" });

  const api = useMemo<Store>(() => ({
    me,
    maintenance,
    addMaintenance: (m) =>
      setMaintenance((xs) => [
        { ...m, id: id(), status: "open", createdAt: now() },
        ...xs,
      ]),
    setMaintenanceStatus: (rid, status) =>
      setMaintenance((xs) => xs.map((x) => (x.id === rid ? { ...x, status } : x))),
    updateMaintenance: (rid, patch) =>
      setMaintenance((xs) => xs.map((x) => (x.id === rid ? { ...x, ...patch } : x))),
    removeMaintenance: (rid) => setMaintenance((xs) => xs.filter((x) => x.id !== rid)),

    announcements,
    addAnnouncement: (a) =>
      setAnnouncements((xs) => [
        { ...a, id: id(), createdAt: "Just now", unreadFor: ["me"] },
        ...xs,
      ]),
    markAnnRead: (rid) =>
      setAnnouncements((xs) =>
        xs.map((x) => (x.id === rid ? { ...x, unreadFor: x.unreadFor.filter((u) => u !== "me") } : x)),
      ),
    updateAnnouncement: (rid, patch) =>
      setAnnouncements((xs) => xs.map((x) => (x.id === rid ? { ...x, ...patch } : x))),
    removeAnnouncement: (rid) => setAnnouncements((xs) => xs.filter((x) => x.id !== rid)),

    visitors,
    addVisitor: (v) => setVisitors((xs) => [{ ...v, id: id(), status: "pending" }, ...xs]),
    setVisitorStatus: (rid, status) =>
      setVisitors((xs) => xs.map((x) => (x.id === rid ? { ...x, status } : x))),
    updateVisitor: (rid, patch) =>
      setVisitors((xs) => xs.map((x) => (x.id === rid ? { ...x, ...patch } : x))),
    removeVisitor: (rid) => setVisitors((xs) => xs.filter((x) => x.id !== rid)),

    reviews,
    addReview: (r) => setReviews((xs) => [{ ...r, id: id(), createdAt: "Just now" }, ...xs]),
    updateReview: (rid, patch) =>
      setReviews((xs) => xs.map((x) => (x.id === rid ? { ...x, ...patch } : x))),
    removeReview: (rid) => setReviews((xs) => xs.filter((x) => x.id !== rid)),

    leaseExts,
    addLeaseExt: (l) => setLeaseExts((xs) => [{ ...l, id: id(), status: "pending" }, ...xs]),
    setLeaseExtStatus: (rid, status) =>
      setLeaseExts((xs) => xs.map((x) => (x.id === rid ? { ...x, status } : x))),
    updateLeaseExt: (rid, patch) =>
      setLeaseExts((xs) => xs.map((x) => (x.id === rid ? { ...x, ...patch } : x))),
    removeLeaseExt: (rid) => setLeaseExts((xs) => xs.filter((x) => x.id !== rid)),

    bookings,
    addBooking: (b) => setBookings((xs) => [{ ...b, id: id() }, ...xs]),
    updateBooking: (rid, patch) =>
      setBookings((xs) => xs.map((x) => (x.id === rid ? { ...x, ...patch } : x))),
    removeBooking: (rid) => setBookings((xs) => xs.filter((x) => x.id !== rid)),

    wallet,
    txns,
    topUp: (amount) => {
      setWallet((w) => w + amount);
      setTxns((xs) => [{ id: id(), type: "topup", amount, label: "GCash top-up", at: now() }, ...xs]);
    },
    charge: (amount, label, type = "rent") => {
      setWallet((w) => Math.max(0, w - amount));
      setTxns((xs) => [{ id: id(), type, amount: -amount, label, at: now() }, ...xs]);
    },
    removeTxn: (rid) => setTxns((xs) => xs.filter((x) => x.id !== rid)),

    documents,
    addDocument: (d) =>
      setDocuments((xs) => [{ ...d, id: id(), at: now() }, ...xs]),
    removeDocument: (rid) => setDocuments((xs) => xs.filter((x) => x.id !== rid)),
    renameDocument: (rid, name) =>
      setDocuments((xs) => xs.map((x) => (x.id === rid ? { ...x, name } : x))),

    wifi,
    setWifi: (w) => setWifi(w),
  }), [maintenance, announcements, visitors, reviews, leaseExts, bookings, wallet, txns, documents, wifi]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
};

export const useSync = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSync must be used inside SyncProvider");
  return v;
};