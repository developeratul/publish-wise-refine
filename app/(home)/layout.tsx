"use client";
import Logo from "@/components/Logo";
import useMediaQuery from "@/hooks/useMediaQuery";
import { AppProps } from "@/types";
import { AppShell, Group, Header } from "@mantine/core";
import CTA from "./components/CTA";

export default function HomeLayout(props: AppProps) {
  const { children } = props;
  const { isOverSm, isOverXs } = useMediaQuery();
  return (
    <AppShell
      header={
        <Header withBorder={false} bg="dark.8" height={70}>
          <Group align="center" position="apart" h="100%" px={isOverSm ? 100 : 20}>
            <Logo className="text-white" order={3} size={isOverXs ? 18 : 16} />
            <CTA />
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
          padding: 0,
        },
      })}
    >
      {children}
    </AppShell>
  );
}
