"use client";
import useColorModeValue from "@/hooks/useColorModeValue";
import { useMantineTheme } from "@mantine/core";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  const theme = useMantineTheme();
  const borderColor = useColorModeValue(theme.colors.gray[4], theme.colors.dark[4]);

  return (
    <Toaster
      toastOptions={{
        style: {
          background: useColorModeValue(theme.colors.gray[0], theme.colors.dark[6]),
          color: useColorModeValue(theme.black, theme.white),
          border: `1px solid ${borderColor}`,
        },
      }}
    />
  );
}
