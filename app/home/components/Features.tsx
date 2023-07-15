"use client";
import NotionLogoSrc from "@/assets/logos/notion.png";
import AllInOneSolutionIcon from "@/assets/svg/all-in-one-solution-icon.svg";
import ConnectWithMultipleIcon from "@/assets/svg/connect-with-multiple-accounts-icon.svg";
import DistractionFreeIconSrc from "@/assets/svg/distraction-free-icon.svg";
import WriteOncePublishTwiceIconSrc from "@/assets/svg/publish-multiple-times-icon.svg";
import UpdateOnceReflectTwiceIcon from "@/assets/svg/update-once-reflect-twice-icon.svg";
import useColorModeValue from "@/hooks/useColorModeValue";
import { AppProps } from "@/types";
import { Box, Center, Container, SimpleGrid, Stack, Title, useMantineTheme } from "@mantine/core";
import Image from "next/image";
import CTA from "./CTA";

const IMAGE_WIDTH = 60;

function IconWrapper(props: AppProps) {
  const { children } = props;
  const theme = useMantineTheme();
  const primaryShade = useColorModeValue("6", "8");
  return (
    <Box
      p={25}
      className="rounded-full"
      bg={theme.colors[theme.primaryColor][parseInt(primaryShade)]}
    >
      {children}
    </Box>
  );
}

function SingleFeature(props: { label: string; icon: React.ReactNode; maw?: number }) {
  const { label, icon, maw } = props;
  return (
    <Stack align="center">
      {icon}
      <Title
        maw={maw}
        order={3}
        size={25}
        weight={500}
        align="center"
        color={useColorModeValue("black", "white")}
      >
        <div className="text-white!">{label}</div>
      </Title>
    </Stack>
  );
}

export default function Features() {
  return (
    <Container size="md">
      <Center py={100}>
        <Stack spacing={36}>
          <SimpleGrid cols={3} spacing={50}>
            <SingleFeature
              label="Notion like experience"
              maw={150}
              icon={
                <IconWrapper>
                  <Image src={NotionLogoSrc} alt="Notion logo" width={IMAGE_WIDTH} />
                </IconWrapper>
              }
            />
            <SingleFeature
              label="Distraction free"
              maw={160}
              icon={
                <IconWrapper>
                  <Image src={DistractionFreeIconSrc} alt="Distraction free" width={IMAGE_WIDTH} />
                </IconWrapper>
              }
            />
            <SingleFeature
              label="Write once publish twice"
              icon={
                <IconWrapper>
                  <Image
                    src={WriteOncePublishTwiceIconSrc}
                    alt="Write once publish multiple times"
                    width={IMAGE_WIDTH}
                  />
                </IconWrapper>
              }
            />
            <SingleFeature
              label="Update once and reflect twice"
              icon={
                <IconWrapper>
                  <Image
                    src={UpdateOnceReflectTwiceIcon}
                    alt="Write once publish multiple times"
                    width={IMAGE_WIDTH}
                  />
                </IconWrapper>
              }
            />
            <SingleFeature
              label="Connect with multiple blog accounts"
              icon={
                <IconWrapper>
                  <Image
                    src={ConnectWithMultipleIcon}
                    alt="Connect with multiple blog accounts"
                    width={IMAGE_WIDTH}
                  />
                </IconWrapper>
              }
            />
            <SingleFeature
              maw={150}
              label="All in one solution"
              icon={
                <IconWrapper>
                  <Image src={AllInOneSolutionIcon} alt="All in one solution" width={IMAGE_WIDTH} />
                </IconWrapper>
              }
            />
          </SimpleGrid>
          <CTA className="self-center" />
        </Stack>
      </Center>
    </Container>
  );
}
