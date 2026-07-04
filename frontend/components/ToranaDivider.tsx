/**
 * ToranaDivider — the page's one recurring signature element.
 *
 * Newari temple doorways are topped by a carved wooden torana: a lintel of
 * repeating strut-and-medallion woodwork. This renders that pattern as a thin
 * horizontal band, reused wherever a section needs a break — never as
 * decoration for its own sake, always marking "one heritage space ends, the
 * next begins."
 */
export function ToranaDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 20"
      preserveAspectRatio="xMidYMid slice"
      className={`h-5 w-full ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <pattern id="torana-motif" width="24" height="20" patternUnits="userSpaceOnUse">
          {/* strut */}
          <rect x="11" y="0" width="2" height="6" fill="currentColor" opacity="0.9" />
          <rect x="11" y="14" width="2" height="6" fill="currentColor" opacity="0.9" />
          {/* medallion (lotus roundel) */}
          <circle cx="12" cy="10" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="10" r="1.6" fill="currentColor" />
          {/* connecting rail */}
          <line x1="0" y1="10" x2="7" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="17" y1="10" x2="24" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="240" height="20" fill="url(#torana-motif)" />
    </svg>
  );
}
