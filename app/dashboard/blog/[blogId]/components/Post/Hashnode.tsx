"use client";
import { HashNodeTag } from "@/api/hashnode/types";
import { useLocalApiKeys } from "@/app/dashboard/settings/Integrations";
import Icon from "@/components/Icon";
import { generateSlug } from "@/helpers/blog";
import { ActionIcon, Button, Loader, MultiSelect, Stack, TextInput, Tooltip } from "@mantine/core";
import { isNotEmpty, matches, useForm } from "@mantine/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useBlogContext } from "../../BlogProvider";
import { hashNodePostPayloadSchema } from "../../constants";
import CoverImage from "./CoverImage";
import PublishModalWrapper, { ModalProps } from "./modal-wrapper";

export interface HashNodePostForm {
  coverImagePath: string | null;
  tags: string[];
  subtitle: string;
  slug: string;
}

type HashNodePublishPayload = z.infer<typeof hashNodePostPayloadSchema>;

export default function HashNodePostModal(props: ModalProps) {
  const { opened, close } = props;
  const { blog, publishingDetails } = useBlogContext();
  const form = useForm<HashNodePostForm>({
    initialValues: {
      coverImagePath: publishingDetails.hashNodeCoverImagePath,
      tags: ((publishingDetails.hashNodeTags as []) || []).map((tag: HashNodeTag) => tag._id),
      slug: publishingDetails.hashNodeSlug || generateSlug(blog.title),
      subtitle: publishingDetails.hashNodeSubtitle || "",
    },
    validate: {
      slug: isNotEmpty("Required") && matches(/^[a-z0-9-]+$/, "Invalid slug"),
    },
  });
  const { apiKeys } = useLocalApiKeys();
  const router = useRouter();

  const { data, isLoading: isTagsLoading } = useQuery({
    queryKey: ["fetch-hashNode-tags"],
    queryFn: async () => {
      const {
        data: { tags },
      } = await axios.post<{ tags: HashNodeTag[] }>("/api/hashNode/get-tags", {
        apiKey: apiKeys["hashNodeAPIKey"],
      });
      return { tags };
    },
  });

  const publishMutation = useMutation({
    mutationKey: ["publish-on-hashNode", blog.id],
    mutationFn: async (data: Omit<HashNodePublishPayload, "type">) =>
      axios.post("/api/hashNode", { ...data, type: "PUBLISH" }),
  });
  const republishMutation = useMutation({
    mutationKey: ["republish-on-hashNode", blog.id],
    mutationFn: async (data: Omit<HashNodePublishPayload, "type">) =>
      axios.post("/api/hashNode", { ...data, type: "REPUBLISH" }),
  });
  const isPublishing = !Boolean(blog.hashNodePostId);
  const { mutateAsync, isLoading } = isPublishing ? publishMutation : republishMutation;

  const handlePost = async (values: HashNodePostForm) => {
    await toast.promise(
      mutateAsync({
        ...values,
        tags: values.tags.map((_id) => ({ _id })),
        apiKey: apiKeys.hashNodeAPIKey,
        blogId: blog.id,
        username: apiKeys.hashNodeUsername,
      }),
      {
        loading: isPublishing ? "Publishing on HashNode" : "Republishing on HashNode",
        error: (error: AxiosError<{ message: string }>) =>
          error.response?.data.message || error.message,
        success: (res: AxiosResponse) => res.data.message,
      }
    );
    close();
    router.refresh();
  };

  const handleGenerateSlug = () => {
    const slug = generateSlug(blog.title);
    form.setFieldValue("slug", slug);
  };

  return (
    <PublishModalWrapper isPublishing={isPublishing} opened={opened} close={close} title="HashNode">
      <form onSubmit={form.onSubmit(handlePost)}>
        <Stack align="end" w="100%">
          <CoverImage
            coverImagePath={form.values.coverImagePath}
            onImageRemove={() => form.setFieldValue("coverImagePath", null)}
            onImageUpload={(filePath) => form.setFieldValue("coverImagePath", filePath)}
          />
          <TextInput
            w="100%"
            icon={<Icon name="IconSlash" />}
            label="Slug"
            {...form.getInputProps("slug")}
            rightSection={
              <Tooltip label="Generate">
                <ActionIcon onClick={handleGenerateSlug}>
                  <Icon name="IconReload" size={16} />
                </ActionIcon>
              </Tooltip>
            }
          />
          <MultiSelect
            {...form.getInputProps("tags")}
            label="Tags"
            w="100%"
            clearable
            placeholder="Select"
            rightSection={isTagsLoading && <Loader size="xs" />}
            data={data?.tags.map((tag) => ({ label: tag.name, value: tag._id })) || []}
          />
          <TextInput w="100%" label="Subtitle" {...form.getInputProps("subtitle")} />
          <Button loading={isLoading} type="submit" rightIcon={<Icon name="IconBookUpload" />}>
            {isPublishing ? "Publish" : "Republish"}
          </Button>
        </Stack>
      </form>
    </PublishModalWrapper>
  );
}
