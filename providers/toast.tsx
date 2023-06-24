"use client";
import { useMantineTheme } from "@mantine/core";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  const theme = useMantineTheme();
  return (
    <Toaster
      toastOptions={{
        style: {
          background: theme.colors.dark[9],
          color: theme.white,
          border: `1px solid ${theme.colors.dark[4]}`,
        },
      }}
    />
  );
}
