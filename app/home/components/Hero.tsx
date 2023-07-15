"use client";

import AppPreviewSrc from "@/assets/jpg/app-preview.jpg";
import Logo from "@/components/Logo";
import { BackgroundImage, Center, Container, Stack, Title } from "@mantine/core";
import Image from "next/image";
import CTA from "./CTA";

export default function Hero() {
  return (
    <BackgroundImage src="/home-hero-bg.svg">
      <Container size="xl">
        <Center py={125}>
          <Stack spacing={50}>
            <Stack align="center" spacing={30}>
              <Logo order={3} className="font-medium text-white" size={25} />
              <Title
                order={1}
                className="text-6xl text-white font-semibold text-center w-full max-w-[900px] tracking-tight"
              >
                The one place to write and publish your blogs
              </Title>
              <CTA />
            </Stack>
            <Image
              width={900}
              src={AppPreviewSrc}
              alt="PublishWise editor preview"
              className="bg-transparent"
            />
          </Stack>
        </Center>
      </Container>
    </BackgroundImage>
  );
}
