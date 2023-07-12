"use client";
import { Stack } from "@mantine/core";
import { useBlogContext } from "../BlogProvider";
import PublishBlog from "./PublishBlog";
import RepublishBlog from "./RepublishBlog";

export default function BlogActions() {
  const { blog } = useBlogContext();
  return (
    <Stack align="end">
      {blog.status === "DRAFT" && <PublishBlog />}
      {blog.status === "PUBLISHED" && <RepublishBlog />}
    </Stack>
  );
}
