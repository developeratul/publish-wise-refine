"use client";
import { Card, Center, Loader } from "@mantine/core";

export default function FullPageLoader() {
  return (
    <Center w="100vw" h="100vh">
      <Loader />
    </Center>
  );
}

export function FullPageRelativeLoader() {
  return (
    <Center py={100} w="100%" h="100%">
      <Loader />
    </Center>
  );
}

export function SectionLoader() {
  return (
    <Card w="100%" withBorder p={50}>
      <Center>
        <Loader />
      </Center>
    </Card>
  );
}

export function BlockLoader() {
  return (
    <Center w="100%" py={20}>
      <Loader />
    </Center>
  );
}
