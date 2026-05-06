import { AlertTriangle, X } from "lucide-react";

interface Props {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
}

export const ErrorModal = ({ open, title = "Something went wrong", message, onClose, onRetry }: Props) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-destructive/30 bg-card p-6 text-card-foreground shadow-elevated">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-destructive/15 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        <div className="mt-5 flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="h-10 flex-1 rounded-full border border-border bg-background text-sm font-semibold hover:bg-muted"
            >
              Try again
            </button>
          )}
          <button
            onClick={onClose}
            className="h-10 flex-1 rounded-full bg-foreground text-sm font-semibold text-background hover:opacity-90"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};