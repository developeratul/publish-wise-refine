"use client";
import { Center, Loader } from "@mantine/core";

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
