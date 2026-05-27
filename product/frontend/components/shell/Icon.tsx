import React from "react";

/**
 * Helper que centraliza los SVGs inline copiados literalmente del HTML target
 * `ui-ux/lead-trust-dashboard-tokko (3).html`. Evita introducir dependencias
 * (lucide-react, heroicons) por una feature meramente visual.
 *
 * Cubre R15: ninguna paleta hex se introduce en este archivo; los iconos
 * usan `currentColor`/`white` y heredan color del consumidor vía clases
 * Tailwind del namespace Tokko.
 */
export type IconName =
  | "logo-eye"
  | "search"
  | "bell"
  | "plus"
  | "settings"
  | "help"
  | "rail-dashboard"
  | "rail-queue"
  | "rail-check"
  | "rail-sliders"
  | "rail-users"
  | "rail-plug"
  | "rail-report"
  | "rail-gear"
  | "rr-share"
  | "rr-mark"
  | "rr-board"
  | "rr-widget"
  | "bb-export"
  | "bb-filter"
  | "bb-sort"
  | "bb-list"
  | "bb-grid";

interface IconProps {
  name: IconName;
  className?: string;
}

export default function Icon({ name, className }: IconProps) {
  switch (name) {
    case "logo-eye":
      return (
        <svg viewBox="0 0 14 14" className={className} aria-hidden="true">
          <circle cx="7" cy="7" r="5" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="7" cy="7" r="2" fill="white" />
        </svg>
      );
    case "search":
      return (
        <svg
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <circle cx="5" cy="5" r="4" />
          <path d="m8.5 8.5 2 2" strokeLinecap="round" />
        </svg>
      );
    case "bell":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          width="16"
          height="16"
          className={className}
          aria-hidden="true"
        >
          <path d="M8 2a5 5 0 0 1 5 5v2l1 2H2l1-2V7a5 5 0 0 1 5-5Z" />
          <path d="M6 13a2 2 0 0 0 4 0" strokeLinecap="round" />
        </svg>
      );
    case "plus":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          width="16"
          height="16"
          className={className}
          aria-hidden="true"
        >
          <path d="M8 2v12M2 8h12" strokeLinecap="round" />
        </svg>
      );
    case "settings":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          width="16"
          height="16"
          className={className}
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="2.5" />
          <path
            d="M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "help":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          width="16"
          height="16"
          className={className}
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M8 7v4M8 5.5v.5" strokeLinecap="round" />
        </svg>
      );
    case "rail-dashboard":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" rx="1.5" opacity=".7" />
          <rect x="9" y="1" width="6" height="6" rx="1.5" opacity=".7" />
          <rect x="1" y="9" width="6" height="6" rx="1.5" opacity=".7" />
          <rect x="9" y="9" width="6" height="6" rx="1.5" />
        </svg>
      );
    case "rail-queue":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <rect x="2" y="2" width="5" height="5" rx="1" />
          <rect x="9" y="2" width="5" height="5" rx="1" />
          <rect x="2" y="9" width="5" height="5" rx="1" />
          <rect x="9" y="9" width="5" height="5" rx="1" />
        </svg>
      );
    case "rail-check":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M5 8l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "rail-sliders":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <path d="M2 4h12M4 8h8M6 12h4" strokeLinecap="round" />
        </svg>
      );
    case "rail-users":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <circle cx="5" cy="6" r="2.5" />
          <circle cx="11" cy="6" r="2.5" />
          <path d="M1 13c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" strokeLinecap="round" />
          <path d="M11 9.5c2.2 0 4 1.5 4 3.5" strokeLinecap="round" />
        </svg>
      );
    case "rail-plug":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <rect x="2" y="4" width="12" height="9" rx="1.5" />
          <path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" strokeLinecap="round" />
        </svg>
      );
    case "rail-report":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <path d="M3 2h10v12H3z" />
          <path d="M6 6h4M6 9h4M6 12h2" strokeLinecap="round" />
        </svg>
      );
    case "rail-gear":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="2.5" />
          <path
            d="M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "rr-share":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <circle cx="12" cy="4" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <path d="M5.5 7.2l5-2.4M5.5 8.8l5 2.4" strokeLinecap="round" />
        </svg>
      );
    case "rr-mark":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <path d="M4 2h8v10l-4-3-4 3V2z" strokeLinejoin="round" />
        </svg>
      );
    case "rr-board":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <rect x="2" y="2" width="5" height="5" rx="1" />
          <rect x="9" y="2" width="5" height="5" rx="1" />
          <rect x="2" y="9" width="5" height="12" rx="1" />
          <rect x="9" y="9" width="5" height="5" rx="1" />
        </svg>
      );
    case "rr-widget":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M8 5v6M5 8h6" strokeLinecap="round" />
        </svg>
      );
    case "bb-export":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <path d="M8 2v8M5 7l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12h12" strokeLinecap="round" />
        </svg>
      );
    case "bb-filter":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <path d="M2 4h12M5 8h6M7 12h2" strokeLinecap="round" />
        </svg>
      );
    case "bb-sort":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <path d="M3 4h10M5 8h6M7 12h2" strokeLinecap="round" />
        </svg>
      );
    case "bb-list":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <rect x="2" y="3" width="12" height="3" rx="1" />
          <rect x="2" y="8" width="12" height="3" rx="1" />
          <rect x="2" y="13" width="8" height="1" rx=".5" />
        </svg>
      );
    case "bb-grid":
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
          aria-hidden="true"
        >
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      );
    default: {
      // Exhaustividad: si se añade un IconName y no se maneja, TS lo detecta.
      const _exhaustive: never = name;
      return null;
    }
  }
}
