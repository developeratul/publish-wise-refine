"use client";

import AppPreviewSrc from "@/assets/jpg/app-preview.jpg";
import Logo from "@/components/Logo";
import useMediaQuery from "@/hooks/useMediaQuery";
import { BackgroundImage, Card, Center, Container, Stack, Title } from "@mantine/core";
import Image from "next/image";
import CTA from "./CTA";

export default function Hero() {
  const { isOverXs } = useMediaQuery();
  return (
    <BackgroundImage src="/home-hero-bg.svg">
      <Container size="xl">
        <Center py={125}>
          <Stack spacing={50} align="center">
            <Stack align="center" spacing={30}>
              <Logo order={3} className="font-medium text-white" size={isOverXs ? 25 : 20} />
              <Title
                order={1}
                className="text-4xl sm:text-6xl text-white font-semibold text-center w-full max-w-[900px] tracking-tight"
              >
                The one place to write and publish your blogs
              </Title>
              <CTA />
            </Stack>
            <Card className="w-full max-w-3xl" withBorder p={0}>
              <Image
                src={AppPreviewSrc}
                alt="PublishWise editor preview"
                className="w-full h-auto"
              />
            </Card>
          </Stack>
        </Center>
      </Container>
    </BackgroundImage>
  );
}
