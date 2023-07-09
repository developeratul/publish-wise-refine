"use client";
import { DevToArticleInput } from "@/api/dev.to/types";
import { HashNodeArticleInput, HashNodeTag } from "@/api/hashnode/types";
import { useGetIntegratedBlogsQuery, useLocalApiKeys } from "@/app/dashboard/settings/Integrations";
import DevToLogoSrc from "@/assets/logos/dev-to.png";
import HashNodeLogoSrc from "@/assets/logos/hashnode.png";
import MediumLogoSrc from "@/assets/logos/medium.png";
import Icon from "@/components/Icon";
import { FullPageRelativeLoader } from "@/components/Loader";
import { generateSlug, htmlToMarkdown } from "@/helpers/blog";
import { supabaseClient } from "@/lib/supabase";
import { BlogProviders, PublishBlogResponse } from "@/types";
import {
  Button,
  Drawer,
  Group,
  Loader,
  MultiSelect,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { UseFormReturnType, hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image, { StaticImageData } from "next/image";
import React, { forwardRef } from "react";
import { toast } from "react-hot-toast";
import { useBlogContext } from "../BlogProvider";

export interface PublishBlogForm {
  selectedBlogs: BlogProviders[];
  primaryBlog?: BlogProviders;
  hashNode: {
    slug: string;
    subtitle?: string;
    tags: string[];
  };
  devTo: {
    tags: string[];
  };
}

interface InitialValue {
  form: UseFormReturnType<PublishBlogForm>;
}

const PublishBlogContext = React.createContext<InitialValue | undefined>(undefined);

function usePublishBlog() {
  const publishBlog = React.useContext(PublishBlogContext);

  if (publishBlog === undefined) {
    throw new Error("This hook must be used within specified context");
  }

  return publishBlog;
}

export default function PublishBlog() {
  const [opened, { open, close }] = useDisclosure(false);
  const { blog } = useBlogContext();
  const form = useForm<PublishBlogForm>({
    initialValues: {
      selectedBlogs: [],
      hashNode: { slug: generateSlug(blog.title), tags: [] },
      devTo: { tags: [] },
    },
    validate: {
      selectedBlogs: hasLength({ min: 1 }, "Please select at least select one blog for publishing"),
      primaryBlog: (value, values) =>
        value && values.selectedBlogs.includes(value)
          ? null
          : "Your primary blog was not selected for publishing",

      hashNode: {
        tags: hasLength({ min: 1 }, "Please select at least one tag"),
      },
      devTo: {
        tags: hasLength({ min: 1 }, "Please select at least one tag"),
      },
    },
  });
  return (
    <React.Fragment>
      <Button onClick={open} rightIcon={<Icon name="IconBookUpload" />}>
        Publish
      </Button>
      <PublishBlogContext.Provider value={{ form }}>
        <Drawer
          scrollAreaComponent={ScrollArea.Autosize}
          position="right"
          size="lg"
          opened={opened}
          onClose={close}
          withinPortal
          title="Publish blog"
        >
          <DrawerContent />
        </Drawer>
      </PublishBlogContext.Provider>
    </React.Fragment>
  );
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: StaticImageData;
  label: string;
  description: string;
  disabled: boolean;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, disabled, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group opacity={disabled ? 0.3 : 1} noWrap>
        <Image width={50} height={50} src={image} alt={label} />
        <Stack spacing="xs">
          <Text size="md" color="white">
            {label}
          </Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </Stack>
      </Group>
    </div>
  )
);

SelectItem.displayName = "SelectItem";

function DrawerContent() {
  const { isLoading, isError, data } = useGetIntegratedBlogsQuery();
  const [isProcessing, setProcessing] = React.useState(false);
  const { blog } = useBlogContext();
  const { form } = usePublishBlog();
  const { apiKeys } = useLocalApiKeys();

  if (isLoading) return <FullPageRelativeLoader />;
  if (isError) return <></>;

  const selectData = [
    {
      label: "Dev.to",
      value: "dev.to",
      description: "Dev.to is a place where coders share, stay up-to-date and grow their careers.",
      image: DevToLogoSrc,
      disabled: !data.accounts["dev.to"],
    },
    {
      label: "HashNode",
      value: "hashNode",
      description: "Everything you need to start blogging as a developer!",
      image: HashNodeLogoSrc,
      disabled: !data.accounts["hashNode"],
    },
    {
      label: "Medium",
      value: "medium",
      description: "Medium is a place to write, read, and connect.",
      image: MediumLogoSrc,
      disabled: !data.accounts["medium"],
    },
  ];

  const handlePublishBlog = async (values: PublishBlogForm) => {
    const { primaryBlog, devTo, hashNode, selectedBlogs } = values;

    const devToPayload: DevToArticleInput & { apiKey: string } = {
      title: blog.title,
      body_markdown: htmlToMarkdown(blog.content || ""),
      tags: devTo.tags,
      apiKey: apiKeys.devToAPIKey as string,
    };

    const hashNodePayload: HashNodeArticleInput & { apiKey: string; username: string } = {
      title: blog.title,
      contentMarkdown: htmlToMarkdown(blog.content || ""),
      tags: hashNode.tags.map((tagId) => ({ _id: tagId })),
      slug: hashNode.slug,
      subtitle: hashNode.subtitle,
      apiKey: apiKeys.hashNodeAPIKey as string,
      username: apiKeys.hashNodeUsername as string,
    };

    const publishBlogPayloads: Record<BlogProviders, object> = {
      "dev.to": devToPayload,
      hashNode: hashNodePayload,
      medium: {},
    };

    const databaseUrlFieldNames: Record<BlogProviders, string> = {
      "dev.to": "devToBlogUrl",
      hashNode: "hashNodeBlogUrl",
      medium: "mediumBlogUrl",
    };

    try {
      setProcessing(true);

      // First publish into the primary blog
      const {
        data: { url },
      } = await toast.promise(
        axios.post<PublishBlogResponse>(
          `/api/${primaryBlog}/publish`,
          publishBlogPayloads[primaryBlog as BlogProviders]
        ),
        {
          loading: `Publishing to ${primaryBlog}`,
          error: (err) => err.response?.data?.message,
          success: `Successfully published to ${primaryBlog}`,
        }
      );

      await supabaseClient
        .from("blogs")
        .update({ [databaseUrlFieldNames[primaryBlog as BlogProviders]]: url })
        .eq("id", blog.id);

      // Then publish into the remaining other blogs
      const remainingBlogs = selectedBlogs.filter((blogProvider) => blogProvider !== primaryBlog);
      const canonicals: Record<BlogProviders, object> = {
        "dev.to": {
          canonical_url: url,
        },
        hashNode: {
          isRepublished: {
            originalArticleURL: url,
          },
        },
        medium: {},
      };

      for (const blogProvider of remainingBlogs) {
        const payload = publishBlogPayloads[blogProvider];
        const canonical = canonicals[blogProvider];
        const databaseUrlFieldName = databaseUrlFieldNames[blogProvider];

        const {
          data: { url },
        } = await toast.promise(
          axios.post<PublishBlogResponse>(`/api/${blogProvider}/publish`, {
            ...payload,
            ...canonical,
          }),
          {
            loading: `Publishing to ${blogProvider}`,
            error: (err) => err.response?.data?.message,
            success: `Successfully published to ${blogProvider}`,
          }
        );

        await supabaseClient
          .from("blogs")
          .update({ [databaseUrlFieldName]: url })
          .eq("id", blog.id);
      }

      await supabaseClient
        .from("blogs")
        .update({ publishingDetails: JSON.stringify(values) })
        .eq("id", blog.id);

      toast.success("Blog publishing successful");
    } catch (err) {
      //
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Stack spacing={50}>
      <form
        className="flex flex-col gap-4 items-end"
        id="publish-form"
        onSubmit={form.onSubmit(handlePublishBlog)}
      >
        <MultiSelect
          required
          w="100%"
          {...form.getInputProps("selectedBlogs")}
          label="Select blogs"
          placeholder="Select"
          description="You can only select the blogs that are connected to your PublishWise account"
          itemComponent={SelectItem}
          withinPortal
          data={selectData}
        />
        <Select
          required
          w="100%"
          {...form.getInputProps("primaryBlog")}
          disabled={!form.values.selectedBlogs.length}
          data={selectData}
          label="Primary blog"
          placeholder="Select"
          withinPortal
          itemComponent={SelectItem}
          description="Where should the blog be primarily uploaded?"
        />
        <HashNodeDetails />
        <DevToDetails />
        <Button
          loading={isProcessing}
          rightIcon={<Icon name="IconBookUpload" />}
          form="publish-form"
          type="submit"
        >
          Publish
        </Button>
      </form>
    </Stack>
  );
}

function HashNodeDetails() {
  const {
    form: {
      getInputProps,
      values: { selectedBlogs },
    },
  } = usePublishBlog();
  const isHashNodeSelected = selectedBlogs.includes("hashNode");

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
    enabled: isHashNodeSelected,
  });

  if (!isHashNodeSelected) return <></>;

  return (
    <Stack w="100%">
      <Title order={4}>HashNode details</Title>
      <Stack spacing="xs">
        <TextInput
          required
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

function DevToDetails() {
  const {
    form: {
      getInputProps,
      values: { selectedBlogs },
    },
  } = usePublishBlog();
  const isBlogSelected = selectedBlogs.includes("dev.to");

  if (!isBlogSelected) return <></>;

  return (
    <Stack w="100%">
      <Title order={4}>Dev.to details</Title>
      <Stack spacing="xs">
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
