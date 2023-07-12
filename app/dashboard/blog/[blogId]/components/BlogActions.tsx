"use client";
import { Stack } from "@mantine/core";
import { useBlogContext } from "../BlogProvider";
import PubRepBlog from "./publish-and-republish-blog";

export default function BlogActions() {
  const { blog } = useBlogContext();
  return (
    <Stack align="end">
      <PubRepBlog />
    </Stack>
  );
}
