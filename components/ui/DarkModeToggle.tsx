"use client";

import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(window.localStorage.getItem("qayta-theme") === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    window.localStorage.setItem("qayta-theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Light mode" : "Dark mode"}
      aria-pressed={dark}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded text-ink-600 hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-text"
    >
      {dark ? (
        <svg key="moon" className="theme-icon-rotate" width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="4.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M10 2 V4 M10 16 V18 M2 10 H4 M16 10 H18 M4.5 4.5 L6 6 M14 14 L15.5 15.5 M4.5 15.5 L6 14 M14 6 L15.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg key="sun" className="theme-icon-rotate" width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M16.5 12.5 A7 7 0 1 1 7.5 3.5 A5.5 5.5 0 0 0 16.5 12.5 Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
