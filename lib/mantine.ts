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
  colors: {},
  white: "#F8F8F2",
  black: "#151320",
  // primaryColor: "violet",
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
