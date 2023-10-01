"use client";
import { useLocalApiKeys } from "@/app/dashboard/settings/Integrations";
import Icon from "@/components/Icon";
import { Button, MultiSelect, Stack, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useBlogContext } from "../../BlogProvider";
import { mediumPostPayloadSchema } from "../../constants";
import PublishModalWrapper, { ModalProps } from "./modal-wrapper";

export interface MediumPublishForm {
  coverImagePath: string | null;
  tags: string[];
}

type MediumPublishPayload = z.infer<typeof mediumPostPayloadSchema>;

export default function DevToPostModal(props: ModalProps) {
  const { opened, close } = props;
  const { blog, publishingDetails } = useBlogContext();
  const form = useForm<MediumPublishForm>({
    initialValues: {
      coverImagePath: publishingDetails.mediumCoverImagePath,
      tags: (publishingDetails.mediumTags as []) || [],
    },
  });
  const { apiKeys } = useLocalApiKeys();
  const router = useRouter();

  const publishMutation = useMutation({
    mutationKey: ["publish-on-medium", blog.id],
    mutationFn: async (data: Omit<MediumPublishPayload, "type">) =>
      axios.post("/api/medium", { ...data, type: "PUBLISH" }),
  });
  const republishMutation = useMutation({
    mutationKey: ["republish-on-medium", blog.id],
    mutationFn: async (data: Omit<MediumPublishPayload, "type">) =>
      axios.post("/api/medium", { ...data, type: "REPUBLISH" }),
  });
  const isPublishing = !Boolean(blog.mediumPostId);
  const { mutateAsync, isLoading } = !isPublishing ? republishMutation : publishMutation;

  const handlePublish = async () => {
    await toast.promise(
      mutateAsync({
        apiKey: apiKeys.mediumAPIKey,
        blogId: blog.id,
        tags: form.values.tags,
        coverImagePath: form.values.coverImagePath,
      }),
      {
        loading: isPublishing ? "Publishing on Medium" : "Republishing on Medium",
        error: (error: AxiosError<{ message: string }>) =>
          error.response?.data.message || error.message,
        success: (res: AxiosResponse) => res.data.message,
      }
    );
    close();
    router.refresh();
  };

  return (
    <PublishModalWrapper isPublishing={isPublishing} opened={opened} close={close} title="Medium">
      {!isPublishing ? (
        <Stack>
          <Title color="orange" order={3}>
            Unsupported
          </Title>
          <Text>Republishing is not supported with Medium</Text>
        </Stack>
      ) : (
        <Stack align="end" w="100%">
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
      )}
    </PublishModalWrapper>
  );
}
