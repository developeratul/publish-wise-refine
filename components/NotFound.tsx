"use client";
import NotFoundImageSrc from "@/assets/svg/not-found.svg";
import { Button, Center, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export default function NotFound(props: {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}) {
  const {
    title = "404 not found",
    description,
    buttonText = "Back to home",
    buttonLink = "/dashboard",
  } = props;
  return (
    <Center w="100%" h="100%" py={50}>
      <Stack spacing="xl" w="100%" maw={350} align="center">
        <Image src={NotFoundImageSrc} width={150} alt="PublishWise blog not found" />
        <Stack spacing="xs">
          <Title color="orange" align="center">
            {title}
          </Title>
          {description && <Text align="center">{description}</Text>}
        </Stack>
        <Button component={Link} href={buttonLink}>
          {buttonText}
        </Button>
      </Stack>
    </Center>
  );
}
