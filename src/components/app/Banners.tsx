import { Check, X } from "lucide-react";

export function SuccessBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b-2 border-success bg-success-soft px-6 py-3 lg:px-10">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium text-foreground">{message}</p>
      </div>
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="rounded-full border border-foreground/20 p-1 text-foreground/70 transition-colors hover:bg-foreground/5"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ErrorBanner({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b-2 border-destructive bg-danger-soft px-6 py-3 lg:px-10">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
          <X className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium text-foreground">{message}</p>
      </div>
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className="rounded-full border border-foreground/20 p-1 text-foreground/70 transition-colors hover:bg-foreground/5"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
