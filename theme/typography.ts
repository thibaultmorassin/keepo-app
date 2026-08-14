import { TextStyle } from "react-native";

export const fontFamily = {
  display: "BricolageGrotesque_600SemiBold",
  displayBold: "BricolageGrotesque_700Bold",
  sans: "InstrumentSans_400Regular",
  sansMedium: "InstrumentSans_500Medium",
  sansSemiBold: "InstrumentSans_600SemiBold",
  mono: "DMMono_400Regular",
} as const;

function ls(size: number, em: number): number {
  return size * em;
}

export const type = {
  hero: {
    fontFamily: fontFamily.displayBold,
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: ls(44, -0.03),
    fontWeight: "700",
  } satisfies TextStyle,

  display: {
    fontFamily: fontFamily.displayBold,
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: ls(30, -0.02),
    fontWeight: "700",
  } satisfies TextStyle,

  title: {
    fontFamily: fontFamily.display,
    fontSize: 22,
    lineHeight: 25,
    letterSpacing: ls(22, -0.015),
    fontWeight: "600",
  } satisfies TextStyle,

  heading: {
    fontFamily: fontFamily.display,
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: ls(17, -0.01),
    fontWeight: "600",
  } satisfies TextStyle,

  bodyLg: {
    fontFamily: fontFamily.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  } satisfies TextStyle,

  body: {
    fontFamily: fontFamily.sans,
    fontSize: 14.5,
    lineHeight: 22.5,
    fontWeight: "400",
  } satisfies TextStyle,

  label: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  } satisfies TextStyle,

  caption: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "400",
  } satisfies TextStyle,

  micro: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 10.5,
    lineHeight: 13,
    letterSpacing: ls(10.5, 0.1),
    fontWeight: "700",
    textTransform: "uppercase",
  } satisfies TextStyle,

  mono: {
    fontFamily: fontFamily.mono,
    fontSize: 12.5,
    lineHeight: 18,
    letterSpacing: ls(12.5, -0.01),
    fontWeight: "400",
  } satisfies TextStyle,
} as const;
