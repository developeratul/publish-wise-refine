"use client";
import Logo from "@/components/Logo";
import { AppProps } from "@/types";
import { Card, Stack } from "@mantine/core";

export default function AuthLayoutWrapper(props: AppProps) {
  const { children } = props;
  return (
    <Stack py={50} spacing={24} w="100%" justify="center" align="center">
      <Logo />
      <Card w="100%" maw={500} p="xl" radius="lg" withBorder>
        {children}
      </Card>
    </Stack>
  );
}
