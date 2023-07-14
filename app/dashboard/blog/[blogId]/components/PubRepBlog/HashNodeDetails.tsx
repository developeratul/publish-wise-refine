import { HashNodeTag } from "@/api/hashnode/types";
import { useLocalApiKeys } from "@/app/dashboard/settings/Integrations";
import Icon from "@/components/Icon";
import { parseJson } from "@/lib/utils";
import { Loader, MultiSelect, Stack, TextInput, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useBlogContext } from "../../BlogProvider";
import BlogCoverImage from "./BlogCoverImageUploadAndPreview";
import { PubRepBlogForm, usePubRepBlog } from "./provider";

export default function HashNodeDetails() {
  const {
    form: {
      getInputProps,
      values: { selectedBlogs, hashNode },
    },
    type,
  } = usePubRepBlog();
  const { blog } = useBlogContext();

  const isBlogSelected =
    type === "publish"
      ? selectedBlogs.includes("hashNode")
      : parseJson<PubRepBlogForm>(blog.publishingDetails).selectedBlogs.includes("hashNode");

  const { apiKeys } = useLocalApiKeys();

  const { isLoading, data } = useQuery({
    queryKey: ["get-hashNode-tags"],
    queryFn: async () => {
      const {
        data: { tags },
      } = await axios.post<{ tags: HashNodeTag[] }>("/api/hashNode/get-tags", {
        apiKey: apiKeys["hashNodeAPIKey"],
      });
      return { tags };
    },
    enabled: isBlogSelected,
  });

  if (!isBlogSelected) return <></>;

  return (
    <Stack w="100%">
      <Title order={4}>HashNode details</Title>
      <Stack spacing="xs">
        <BlogCoverImage
          coverImagePath={hashNode.coverImagePath || null}
          field="hashNode.coverImagePath"
          provider="hashNode"
        />
        <TextInput
          icon={<Icon name="IconSlash" />}
          label="Slug"
          {...getInputProps("hashNode.slug")}
        />
        <MultiSelect
          {...getInputProps("hashNode.tags")}
          label="Tags"
          clearable
          placeholder="Select"
          rightSection={isLoading && <Loader size="xs" />}
          data={data?.tags.map((tag) => ({ label: tag.name, value: tag._id })) || []}
        />
        <TextInput label="Article subtitle" {...getInputProps("hashNode.subtitle")} />
      </Stack>
    </Stack>
  );
}
