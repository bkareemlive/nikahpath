import Link from "next/link";
import { site } from "@/data/site";

export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight ${
        light ? "text-white" : "text-ink"
      } ${className}`}
      aria-label={`${site.name} home`}
    >
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 29S3.5 21.7 3.5 12.6A7.1 7.1 0 0 1 16 8.2a7.1 7.1 0 0 1 12.5 4.4C28.5 21.7 16 29 16 29Z"
          fill={light ? "#ffffff" : "#0b5d42"}
        />
        <path
          d="M20.7 12.2a5 5 0 1 0 0 7.6 6 6 0 1 1 0-7.6Z"
          fill={light ? "#0b5d42" : "#ffffff"}
        />
        <circle cx="22.2" cy="16" r="1.5" fill={light ? "#0b5d42" : "#ffffff"} />
      </svg>
      <span>{site.name}</span>
    </Link>
  );
}
