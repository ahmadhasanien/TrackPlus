export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        aria-hidden="true"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="9" cy="9" r="5" className="fill-success/70" />
        <circle cx="9" cy="22" r="4" className="fill-success" />
        <circle cx="21" cy="14" r="6" className="fill-success/40" />
      </svg>
      <span className="text-xl font-bold tracking-tight" dir="ltr">
        track<span className="text-success">+</span>
      </span>
    </div>
  );
}
