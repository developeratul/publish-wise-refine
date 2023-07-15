"use client";
import Logo from "@/components/Logo";
import { Anchor, Text, useMantineTheme } from "@mantine/core";

export default function Footer() {
  const theme = useMantineTheme();
  return (
    <footer
      style={{ background: theme.colors.dark[8] }}
      className="px-[100px] flex justify-between items-center py-6"
    >
      <Logo className="text-white" order={3} size={18} />
      <Text color="white">
        Designed and Developed by{" "}
        <Anchor href="http://developeratul.com" target="_blank">
          @developeratul
        </Anchor>
      </Text>
    </footer>
  );
}
