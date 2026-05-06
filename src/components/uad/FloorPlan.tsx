import { Room } from "@/data/dorms";
import { cn } from "@/lib/utils";

interface Props {
  rooms: Room[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export const FloorPlan = ({ rooms, selectedId, onSelect }: Props) => {
  if (rooms.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Floor plan coming soon
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-4">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
        <span>Floor 2 – 3</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-foreground" /> Full
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50" /> Partial
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-foreground bg-background" /> Vacant
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {rooms.map((r) => {
          const ratio = r.occupied / r.capacity;
          const status = ratio === 1 ? "full" : ratio === 0 ? "vacant" : "partial";
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className={cn(
                "group relative flex aspect-square flex-col justify-between rounded-xl border p-3 text-left transition-all",
                selectedId === r.id
                  ? "border-foreground ring-2 ring-foreground ring-offset-2"
                  : "border-border hover:border-foreground",
                status === "full" && "bg-foreground text-background",
                status === "partial" && "bg-muted",
                status === "vacant" && "bg-background",
              )}
            >
              <div className="text-xs font-medium opacity-70">{r.name}</div>
              <div>
                <div className="text-lg font-bold leading-none">
                  {r.occupied}/{r.capacity}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider opacity-60">
                  {r.type}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};