"use client";
import { AppProps } from "@/types";
import { Container } from "@mantine/core";

export default function SettingsPageLayout(props: AppProps) {
  const { children } = props;
  return (
    <Container p={0} size="md">
      {children}
    </Container>
  );
}
