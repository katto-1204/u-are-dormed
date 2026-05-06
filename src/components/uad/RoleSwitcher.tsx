import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewRole = "tenant" | "landlord";

interface Props {
  role: ViewRole;
  onChange: (r: ViewRole) => void;
}

export const RoleSwitcher = ({ role, onChange }: Props) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 rounded-full border border-border bg-background/90 p-1 shadow-soft backdrop-blur">
      <button
        onClick={() => onChange("tenant")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
          role === "tenant"
            ? "bg-gradient-green text-primary-foreground shadow-glow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Smartphone className="h-4 w-4" />
        Tenant
      </button>
      <button
        onClick={() => onChange("landlord")}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
          role === "landlord"
            ? "bg-gradient-green text-primary-foreground shadow-glow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Monitor className="h-4 w-4" />
        Landlord
      </button>
    </div>
  );
};