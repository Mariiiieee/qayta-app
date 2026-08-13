import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        card: "var(--card)",
        ink: {
          900: "var(--ink-900)",
          600: "var(--ink-600)",
          500: "var(--ink-500)",
        },
        rule: {
          DEFAULT: "var(--rule)",
          soft: "var(--rule-soft)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          text: "var(--amber-text)",
        },
        verified: "var(--verified)",
        short: "var(--short)",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "6px",
        md: "6px",
        lg: "6px",
        pill: "9999px",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "16": "64px",
      },
    },
  },
};

export default config;
