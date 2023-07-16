"use client";
import RefineLogoSrc from "@/assets/logos/refine.svg";
import SupabaseLogoSrc from "@/assets/logos/supabase.svg";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import { Anchor, Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import Image from "next/image";

export default function Footer() {
  const theme = useMantineTheme();
  return (
    <footer
      style={{ background: theme.colors.dark[8] }}
      className="w-full px-[20px] flex-col flex items-center gap-16 py-6 lg:flex-row lg:px-[100px] lg:justify-between"
    >
      <Logo className="text-white" order={3} size={30} />
      <Stack align="center">
        <Flex justify="center" gap={16} align="center">
          <a href="http://refine.dev" target="_blank" rel="noopener noreferrer">
            <Image src={RefineLogoSrc} alt="Refine logo" />
          </a>
          <Icon name="IconPlus" color="white" />
          <a href="http://supabase.com" target="_blank" rel="noopener noreferrer">
            <Image width={40} src={SupabaseLogoSrc} alt="Supabase logo" />
          </a>
        </Flex>
        <Text color="white">
          Designed and Developed by{" "}
          <Anchor href="http://developeratul.com" target="_blank">
            @developeratul
          </Anchor>
        </Text>
      </Stack>
    </footer>
  );
}
