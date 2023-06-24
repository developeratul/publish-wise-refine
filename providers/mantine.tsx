"use client";
import { theme } from "@/lib/mantine";
import { AppProps } from "@/types";
import { CacheProvider } from "@emotion/react";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider as CoreProvider,
  useEmotionCache,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useServerInsertedHTML } from "next/navigation";

export default function MantineProvider(props: AppProps) {
  const { children } = props;
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const cache = useEmotionCache();
  cache.compat = true;

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      {/* The color scheme is hard coded for now because I don't want to add light mode rn */}
      <CoreProvider theme={theme} withCSSVariables withGlobalStyles withNormalizeCSS>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          {children}
        </ColorSchemeProvider>
      </CoreProvider>
    </CacheProvider>
  );
}
