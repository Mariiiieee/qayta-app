export const colors = {
  light: {
    paper: "#F7F3E8",
    card: "#FFFFFF",
    ink900: "#14120C",
    ink600: "#5E543E",
    ink500: "#6B6149",
    rule: "#8F8468",
    ruleSoft: "#C6BDA9",
    amber: "#F2A81E",
    amberText: "#8A5A06",
    verified: "#2A6E42",
    short: "#A82C25",
  },
  dark: {
    paper: "#14120C",
    card: "#1E1B13",
    ink900: "#EAE3D1",
    ink600: "#B4A98C",
    ink500: "#B4A98C",
    rule: "#5E543E",
    ruleSoft: "#3A3524",
    amber: "#F2A81E",
    amberText: "#F2A81E",
    verified: "#6FCB8E",
    short: "#F08078",
  },
} as const;

export const typography = {
  display: { fontSize: 33, fontWeight: 600, lineHeight: 1.15, font: "mono" },
  headline: { fontSize: 28, fontWeight: 600, lineHeight: 1.2, font: "sans" },
  title: { fontSize: 23, fontWeight: 600, lineHeight: 1.3, font: "sans" },
  titleS: { fontSize: 19, fontWeight: 500, lineHeight: 1.35, font: "sans" },
  body: { fontSize: 16, fontWeight: 400, lineHeight: 1.5, font: "sans" },
  micro: { fontSize: 13, fontWeight: 500, lineHeight: 1.4, font: "sans" },
  caption: { fontSize: 11, fontWeight: 500, lineHeight: 1.35, font: "sans" },
} as const;

export const spacing = [4, 8, 12, 16, 24, 32, 48, 64] as const;

export const radius = {
  default: 6,
  pill: 9999,
} as const;

export const focusRing = {
  width: 2,
  style: "solid",
  color: colors.light.amberText,
  offset: 2,
} as const;

export const touchTarget = {
  minimum: 44,
  primaryButtonHeight: 56,
  primaryButtonMinWidth: 200,
  tableRowHeight: 48,
  filterChipHeight: 40,
  iconButton: 48,
  iconSize: 24,
} as const;

export const maxProseWidth = 70;

// BANNED — do not reintroduce:
// '#6366F1', '#A855F7' (purple gradients)
// '#0F172A' (slate background)
// '#3E9B5F' (green fails 3.47:1)
// '#F2A81E' as focus ring (1.82:1 on --paper — FAILS WCAG)
// '#C6BDA9' as input border (1.68:1 — FAILS)
// fontFamily: 'Inter'
// borderRadius > 6px except pill
