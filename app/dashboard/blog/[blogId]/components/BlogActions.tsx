"use client";
import { Stack } from "@mantine/core";
import { useBlogContext } from "../BlogProvider";
import PublishBlog from "./PublishBlog";

export default function BlogActions() {
  const { blog } = useBlogContext();
  return <Stack align="end">{blog.status === "DRAFT" && <PublishBlog />}</Stack>;
}
