"use client";
import { Stack } from "@mantine/core";
import { useBlogContext } from "../BlogProvider";
import PubRepBlog from "./PubRepBlog";

export default function BlogActions() {
  const { blog } = useBlogContext();
  return (
    <Stack align="end">
      <PubRepBlog />
    </Stack>
  );
}
