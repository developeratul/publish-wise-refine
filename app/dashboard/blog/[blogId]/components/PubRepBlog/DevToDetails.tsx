import { parseJson } from "@/lib/utils";
import { MultiSelect, Stack, Title } from "@mantine/core";
import { useBlogContext } from "../../BlogProvider";
import BlogCoverImage from "./BlogCoverImageUploadAndPreview";
import { PubRepBlogForm, usePubRepBlog } from "./provider";

export default function DevToDetails() {
  const {
    form: {
      getInputProps,
      values: { selectedBlogs, devTo },
    },
    type,
  } = usePubRepBlog();
  const { blog } = useBlogContext();

  const isBlogSelected =
    type === "publish"
      ? selectedBlogs.includes("dev.to")
      : parseJson<PubRepBlogForm>(blog.publishingDetails).selectedBlogs.includes("dev.to");

  if (!isBlogSelected) return <></>;

  return (
    <Stack w="100%">
      <Title order={4}>Dev.to details</Title>
      <Stack spacing="xs">
        <BlogCoverImage
          coverImagePath={devTo.coverImagePath || null}
          field="devTo.coverImagePath"
          provider="dev.to"
        />
        <MultiSelect
          {...getInputProps("devTo.tags")}
          label="Tags"
          clearable
          searchable
          creatable
          getCreateLabel={(query) => `+ Add ${query}`}
          placeholder="Select"
          data={getInputProps("devTo.tags").value}
        />
      </Stack>
    </Stack>
  );
}
