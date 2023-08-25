import { inter, jetBrainsMono } from "@/fonts";
import { MantineProviderProps } from "@mantine/core";

/**
 * Mantine color shade reference:
 * [0]
 * [1]
 * [2]
 * [3]
 * [4] // Applied in borders
 * [5] // Applied in links
 * [6] // Applied in papers
 * [7] // The base background
 * [8] Applied in buttons
 * [9]
 */
export const theme: MantineProviderProps["theme"] = {
  colors: {
    dark: [
      "#E8E8EE",
      "#CECDDA",
      "#9E9CB5",
      "#6E6B8F",
      "#48465D",
      "#22212C",
      "#1B1A23",
      "#14141A",
      "#0D0D11",
      "#070709",
    ],
    primary: [
      "#F7F5FF",
      "#EEEBFF",
      "#DDD6FF",
      "#C8BDFF",
      "#B3A3FF",
      "#9580FF",
      "#846BFF",
      "#6F52FF",
      "#5938FF",
      "#2600E6",
    ],
  },
  white: "#F8F8F2",
  black: "#151320",
  primaryColor: "primary",
  fontFamily: inter.style.fontFamily,
  fontFamilyMonospace: jetBrainsMono.style.fontFamily,
  activeStyles: {
    opacity: 0.9,
    transform: "none",
  },
  defaultRadius: "md",
  breakpoints: {
    xs: "36rem",
    sm: "48rem",
    lg: "62rem",
    xl: "88rem",
  },
};
