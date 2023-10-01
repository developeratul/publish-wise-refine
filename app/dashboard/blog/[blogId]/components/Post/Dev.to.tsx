"use client";
import { useLocalApiKeys } from "@/app/dashboard/settings/Integrations";
import Icon from "@/components/Icon";
import { Button, MultiSelect, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useBlogContext } from "../../BlogProvider";
import { devToPostPayloadSchema } from "../../constants";
import CoverImage from "./CoverImage";
import PublishModalWrapper, { ModalProps } from "./modal-wrapper";

export interface DevToPublishForm {
  coverImagePath: string | null;
  tags: string[];
}

type DevToPublishPayload = z.infer<typeof devToPostPayloadSchema>;

export default function DevToPostModal(props: ModalProps) {
  const { opened, close } = props;
  const { blog, publishingDetails } = useBlogContext();
  const form = useForm<DevToPublishForm>({
    initialValues: {
      coverImagePath: publishingDetails.devToCoverImagePath,
      tags: (publishingDetails.devToTags as []) || [],
    },
  });
  const { apiKeys } = useLocalApiKeys();
  const router = useRouter();

  const publishMutation = useMutation({
    mutationKey: ["publish-on-dev.to", blog.id],
    mutationFn: async (data: Omit<DevToPublishPayload, "type">) =>
      axios.post("/api/dev.to", { ...data, type: "PUBLISH" }),
  });
  const republishMutation = useMutation({
    mutationKey: ["republish-on-dev.to", blog.id],
    mutationFn: async (data: Omit<DevToPublishPayload, "type">) =>
      axios.post("/api/dev.to", { ...data, type: "REPUBLISH" }),
  });
  const { mutateAsync, isLoading } = blog.devToPostId ? republishMutation : publishMutation;
  const isPublishing = !Boolean(blog.devToPostId);

  const handlePublish = async () => {
    await toast.promise(
      mutateAsync({
        apiKey: apiKeys.devToAPIKey,
        blogId: blog.id,
        tags: form.values.tags,
        coverImagePath: form.values.coverImagePath,
      }),
      {
        loading: isPublishing ? "Publishing on Dev.to" : "Republishing on Dev.to",
        error: (error: AxiosError<{ message: string }>) =>
          error.response?.data.message || error.message,
        success: (res: AxiosResponse) => res.data.message,
      }
    );
    close();
    router.refresh();
  };

  return (
    <PublishModalWrapper isPublishing={isPublishing} opened={opened} close={close} title="Dev.to">
      <Stack align="end" w="100%">
        <CoverImage
          coverImagePath={form.values.coverImagePath}
          onImageRemove={() => form.setFieldValue("coverImagePath", null)}
          onImageUpload={(filePath) => form.setFieldValue("coverImagePath", filePath)}
        />
        <MultiSelect
          {...form.getInputProps("tags")}
          label="Tags"
          clearable
          searchable
          creatable
          getCreateLabel={(query) => `+ Add ${query}`}
          placeholder="Select"
          w="100%"
          data={form.getInputProps("tags").value}
        />
        <Button
          loading={isLoading}
          onClick={handlePublish}
          rightIcon={<Icon name="IconBookUpload" />}
        >
          {isPublishing ? "Publish" : "Republish"}
        </Button>
      </Stack>
    </PublishModalWrapper>
  );
}
