export function IslamicPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="nikah-geo"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          <g fill="none" stroke="#0b5d42" strokeWidth="1.1">
            <circle cx="30" cy="30" r="20" />
            <circle cx="0" cy="0" r="20" />
            <circle cx="60" cy="0" r="20" />
            <circle cx="0" cy="60" r="20" />
            <circle cx="60" cy="60" r="20" />
            <rect x="16" y="16" width="28" height="28" transform="rotate(45 30 30)" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#nikah-geo)" />
    </svg>
  );
}
