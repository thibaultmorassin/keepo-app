import { Platform, type ViewStyle } from "react-native";

const shadowBase = "rgb(31, 26, 16)";

function shadow(
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number,
): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: shadowBase,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {
      shadowColor: shadowBase,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation,
    },
  }) as ViewStyle;
}

export const color = {
  paper0: "#FCFAF6",
  paper1: "#FFFFFF",
  paper2: "#F2EEE5",
  paper3: "#E8E3D7",

  ink900: "#1B1A17",
  ink700: "#45423B",
  ink500: "#706B60",
  ink300: "#A8A296",
  ink100: "#D9D4C8",
  line: "#E6E1D5",

  green700: "#0A5C41",
  green600: "#0E7A56",
  green500: "#14996B",
  green200: "#C4E9D6",
  green100: "#E5F5EC",

  amber700: "#8F5207",
  amber600: "#B4680A",
  amber500: "#E08A12",
  amber200: "#FAE0B4",
  amber100: "#FDF2DE",

  coral700: "#A62F1F",
  coral600: "#D0402C",
  coral200: "#F9D6CD",
  coral100: "#FCEBE6",

  ultra600: "#4B49C8",
  ultra200: "#D9D8FA",
  ultra100: "#EDECFD",

  bgApp: "#FCFAF6",
  bgCard: "#FFFFFF",
  bgSunken: "#F2EEE5",
  bgInverse: "#1B1A17",

  textPrimary: "#1B1A17",
  textSecondary: "#706B60",
  textMuted: "#A8A296",
  textOnDark: "#FCFAF6",
  textLink: "#0E7A56",
  textLinkHover: "#0A5C41",

  borderSubtle: "#E6E1D5",
  borderStrong: "#D9D4C8",

  brand: "#0E7A56",
  brandStrong: "#0A5C41",
  brandTint: "#E5F5EC",

  statusCoveredFg: "#0A5C41",
  statusCoveredBg: "#E5F5EC",
  statusCoveredBar: "#14996B",

  statusExpiringFg: "#8F5207",
  statusExpiringBg: "#FDF2DE",
  statusExpiringBar: "#E08A12",

  statusExpiredFg: "#706B60",
  statusExpiredBg: "#F2EEE5",
  statusExpiredBar: "#A8A296",

  actionClaimFg: "#A62F1F",
  actionClaimBg: "#FCEBE6",
  actionClaimSolid: "#D0402C",

  accentProFg: "#4B49C8",
  accentProBg: "#EDECFD",

  focusRing: "#C4E9D6",
  heroCircle: "rgba(252,250,246,0.12)",
} as const;

export const space = {
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 12,
  6: 16,
  7: 20,
  8: 24,
  9: 32,
  10: 40,
  11: 56,
  gutterScreen: 18,
  gapList: 9,
  gapSection: 18,
  padCard: 16,
  padCardLg: 20,
  tapMin: 44,
} as const;

export const radius = {
  pill: 999,
  hero: 28,
  card: 22,
  tile: 16,
  input: 14,
  chip: 999,
} as const;

export const shadowStyle = {
  sm: shadow(1, 2, 0.05, 2),
  card: {
    ...shadow(1, 2, 0.05, 3),
    ...shadow(8, 20, 0.16, 6),
  },
  lift: {
    ...shadow(2, 4, 0.06, 8),
    ...shadow(18, 34, 0.24, 12),
  },
} as const;

export const duration = {
  instant: 90,
  fast: 140,
  base: 220,
  slow: 340,
} as const;

export const motion = {
  pressScale: 0.97,
} as const;
