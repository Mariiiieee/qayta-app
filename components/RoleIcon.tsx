type RoleIconName = "producer" | "recycler" | "weigher" | "carrier";

export function RoleIcon({ name }: { name: RoleIconName }) {
  const common = {
    width: 32,
    height: 32,
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": true,
  } as const;

  switch (name) {
    case "producer":
      return (
        <svg {...common}>
          <rect x="6" y="12" width="20" height="14" rx="2" stroke="#5E543E" strokeWidth="2" />
          <path d="M6 12 L16 6 L26 12" stroke="#5E543E" strokeWidth="2" strokeLinejoin="round" />
          <path d="M16 6 V26" stroke="#5E543E" strokeWidth="2" />
        </svg>
      );
    case "recycler":
      return (
        <svg {...common}>
          <path
            d="M13 6 L9 13 M9 13 H16 M9 13 L6 10 M19 6 L26 10 L20 14 M26 10 L22 13 M13 26 L19 26 L23 20 M19 26 L22 23"
            stroke="#5E543E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "weigher":
      return (
        <svg {...common}>
          <circle cx="16" cy="17" r="9" stroke="#5E543E" strokeWidth="2" />
          <path d="M16 17 L20 12" stroke="#5E543E" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 6 H20" stroke="#5E543E" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "carrier":
      return (
        <svg {...common}>
          <rect x="4" y="12" width="14" height="10" rx="1" stroke="#5E543E" strokeWidth="2" />
          <path
            d="M18 15 H23 L27 19 V22 H18 Z"
            stroke="#5E543E"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="24" r="2" stroke="#5E543E" strokeWidth="2" />
          <circle cx="23" cy="24" r="2" stroke="#5E543E" strokeWidth="2" />
        </svg>
      );
  }
}
