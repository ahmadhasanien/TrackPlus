import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({
  breadcrumb,
  children,
  banner,
  headerActions,
}: {
  breadcrumb: ReactNode;
  children: ReactNode;
  banner?: ReactNode;
  headerActions?: ReactNode;
}) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col"
      style={{
        minHeight: "100%",
        background: "linear-gradient(180deg, #f5f5f6 0%, #d4ebd2 100%)",
      }}
    >
      <header className="flex h-[74px] items-center justify-between gap-4 border-b border-border px-6 lg:px-10">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {breadcrumb}
        </div>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </header>
      {banner}
      <main className="flex-1 px-6 pb-14 pt-6 lg:px-10">{children}</main>
    </div>
  );
}

export function Crumbs({
  items,
  onNavigate,
}: {
  items: { label: string; to?: string }[];
  onNavigate?: () => void;
}) {
  return (
    <>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-muted-foreground">/</span>}
          {item.to ? (
            <button
              type="button"
              onClick={onNavigate}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </button>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
      {items.length > 1 && <ChevronRight className="ms-1 h-4 w-4 text-muted-foreground" />}
    </>
  );
}
