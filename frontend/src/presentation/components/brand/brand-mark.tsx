type BrandMarkProps = {
  className?: string;
};

/**
 * Vector mark — renders crisply at any size (16px favicon through a 512px
 * splash), unlike the old single raster PNG scaled up/down for every use.
 * Two overlapping rings stand for the "connections" at the heart of the app.
 */
export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brand-mark-bg" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#3866e6" />
          <stop offset="100%" stopColor="#17389e" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#brand-mark-bg)" />
      <circle cx="38" cy="50" r="22" fill="#ffffff" fillOpacity="0.95" />
      <circle cx="62" cy="50" r="22" fill="#ffffff" fillOpacity="0.55" />
    </svg>
  );
}
