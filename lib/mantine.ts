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
  colorScheme: "dark",
  colors: {
    // violet: [
    //   "#DED9F7",
    //   "#BBAFF6",
    //   "#9580FF", // Base [3]
    //   "#806AEE",
    //   "#9580FF", // Link
    //   "#6451C7",
    //   "#5B4AB1",
    //   "#584C96",
    //   "#544B80",
    // ],
    // dark: [
    //   "#f2eff9",
    //   "#d4d3de",
    //   "#b8b6c6",
    //   "#9b99b0",
    //   "#454158",
    //   "65637f",
    //   "#151320", // Darker bg
    //   "#22212c", // Base bg
    //   "#383747", // Applied in buttons
    //   "#2B2640",
    // ],
  },
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
