export function Logo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-label="VeriScope logo"
    >
      <circle cx="50" cy="50" r="20" stroke="#22d3ee" strokeWidth="3" fill="none" opacity="0.9" />
      <ellipse
        cx="50"
        cy="50"
        rx="42"
        ry="18"
        stroke="#4f6df5"
        strokeWidth="2.5"
        fill="none"
        transform="rotate(-25 50 50)"
        opacity="0.7"
      />
      <circle cx="50" cy="50" r="6" fill="#22d3ee" />
      <circle cx="85" cy="38" r="3" fill="#6b8aff" />
      <circle cx="18" cy="62" r="2" fill="#22d3ee" opacity="0.6" />
      <circle cx="72" cy="78" r="1.5" fill="#8aa3ff" opacity="0.5" />
    </svg>
  );
}
