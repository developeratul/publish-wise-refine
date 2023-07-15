"use client";
import Logo from "@/components/Logo";
import { AppProps } from "@/types";
import { AppShell, Card, Stack } from "@mantine/core";

export default function AuthLayoutWrapper(props: AppProps) {
  const { children } = props;
  return (
    <AppShell
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
        },
      })}
    >
      <Stack py={50} spacing={24} w="100%" justify="center" align="center">
        <Logo />
        <Card w="100%" maw={500} p="xl" radius="lg" withBorder>
          {children}
        </Card>
      </Stack>
    </AppShell>
  );
}
