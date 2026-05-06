import { Building2, Check, User } from "lucide-react";
import { useState } from "react";
import { Role, useAuth } from "./AuthContext";
import { Logo } from "../shared/Logo";
import { cn } from "@/lib/utils";

const options: { id: Role; title: string; desc: string; bullets: string[]; icon: JSX.Element }[] = [
  {
    id: "tenant",
    title: "I'm a Tenant",
    desc: "Find a dorm, track bills, talk to your landlord.",
    bullets: ["Browse listings", "Pay rent", "View consumption"],
    icon: <User className="h-5 w-5" />,
  },
  {
    id: "landlord",
    title: "I'm a Landlord",
    desc: "Manage rooms, tenants, leases, and IoT devices.",
    bullets: ["Tenant CRUD", "Lease uploads", "Real-time IoT"],
    icon: <Building2 className="h-5 w-5" />,
  },
];

export const RoleSelectScreen = () => {
  const { setRole, user } = useAuth();
  const [selected, setSelected] = useState<Role>(user?.role ?? "tenant");

  return (
    <div className="grid min-h-screen place-items-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-3xl animate-fade-in">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-secondary p-1.5 shadow-glow-sm">
            <Logo size={40} />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Welcome, {user?.name?.split(" ")[0]}
          </p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">How will you use U Are Dormed?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You can switch between roles anytime from your profile.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {options.map((o) => {
            const active = selected === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setSelected(o.id)}
                className={cn(
                  "group relative rounded-3xl border bg-background p-6 text-left transition-all",
                  active
                    ? "border-foreground shadow-elevated"
                    : "border-border hover:border-foreground/40 hover:shadow-soft",
                )}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-2xl transition-colors",
                      active ? "bg-foreground text-background" : "bg-secondary",
                    )}
                  >
                    {o.icon}
                  </div>
                  <div
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full border transition-all",
                      active ? "border-foreground bg-foreground text-background" : "border-border",
                    )}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                  </div>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{o.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{o.desc}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  {o.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-foreground" />
                      {b}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setRole(selected)}
          className="mt-8 h-12 w-full rounded-2xl bg-gradient-green text-sm font-semibold text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 sm:mx-auto sm:block sm:max-w-xs"
        >
          Continue as {selected === "tenant" ? "Tenant" : "Landlord"}
        </button>
      </div>
    </div>
  );
};