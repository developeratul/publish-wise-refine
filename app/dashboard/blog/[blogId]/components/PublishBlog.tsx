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
import { BlogProviders, DatabasePublishBlogFields, PublishBlogResponse } from "@/types";
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
import { useRouter } from "next/navigation";
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

type DatabaseBlogUpdates = Partial<Record<DatabasePublishBlogFields, string>>;

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
  const { form: blogEditingForm, blog } = useBlogContext();
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
      // hashNode: {
      //   slug: isNotEmpty("Slug is required"),
      //   tags: hasLength({ min: 1 }, "Please select at least one tag"),
      // },
      // devTo: {
      //   tags: hasLength({ min: 1 }, "Please select at least one tag"),
      // },
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
          <DrawerContent close={close} />
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

function DrawerContent(props: { close: () => void }) {
  const { close } = props;
  const { isLoading, isError, data } = useGetIntegratedBlogsQuery();
  const [isProcessing, setProcessing] = React.useState(false);
  const { blog, form: blogEditingForm } = useBlogContext();
  const [blogUploadedPlatforms, setBlogUploadedPlatforms] = React.useState<BlogProviders[]>([]);
  const [primaryBlogUrlState, setPrimaryBlogUrlState] = React.useState("");
  const [databaseBlogUpdatesState, setDatabaseBlogUpdateState] =
    React.useState<DatabaseBlogUpdates>({});
  const { form } = usePublishBlog();
  const { apiKeys } = useLocalApiKeys();
  const router = useRouter();

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
    if (blog.status === "PUBLISHED") {
      return toast.error("Blog already published");
    }

    const { primaryBlog, devTo, hashNode, selectedBlogs } = values;

    const blogContentMarkdown = htmlToMarkdown(blogEditingForm.values.content || "");

    const devToPayload: DevToArticleInput & { apiKey: string } = {
      title: blog.title,
      body_markdown: blogContentMarkdown,
      tags: devTo.tags,
      apiKey: apiKeys.devToAPIKey as string,
    };

    const hashNodePayload: HashNodeArticleInput & { apiKey: string; username: string } = {
      title: blog.title,
      contentMarkdown: blogContentMarkdown,
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

    const databaseIdFieldNames: Record<BlogProviders, string> = {
      "dev.to": "devToArticleId",
      hashNode: "hashNodeArticleId",
      medium: "",
    };

    try {
      setProcessing(true);

      // Contain the updates of in the database regarding uploaded blogs
      const databaseBlogUpdates: DatabaseBlogUpdates = databaseBlogUpdatesState;

      let primaryBlogUrl = primaryBlogUrlState;

      // First publish into the primary blog if in already uploaded
      if (!blogUploadedPlatforms.includes(primaryBlog as BlogProviders)) {
        const {
          data: { url, id },
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

        // Update the database primary blog id and url
        databaseBlogUpdates[
          databaseIdFieldNames[primaryBlog as BlogProviders] as DatabasePublishBlogFields
        ] = id as string;
        databaseBlogUpdates[
          databaseUrlFieldNames[primaryBlog as BlogProviders] as DatabasePublishBlogFields
        ] = url as string;

        primaryBlogUrl = url;

        setBlogUploadedPlatforms((pre) => [...pre, primaryBlog as BlogProviders]);
        setPrimaryBlogUrlState(primaryBlogUrl);
        setDatabaseBlogUpdateState(databaseBlogUpdates);
      }

      // Then publish into the remaining other blogs
      const remainingBlogs = selectedBlogs.filter((blogProvider) => blogProvider !== primaryBlog);
      const canonicals: Record<BlogProviders, object> = {
        "dev.to": { canonical_url: primaryBlogUrl },
        hashNode: { isRepublished: { originalArticleURL: primaryBlogUrl } },
        medium: {},
      };

      // Only if the primary blog was uploaded successfully
      if (primaryBlogUrl) {
        for (const blogProvider of remainingBlogs) {
          const payload = publishBlogPayloads[blogProvider];
          const canonical = canonicals[blogProvider];
          const databaseUrlFieldName = databaseUrlFieldNames[blogProvider];
          const databaseIdFieldName = databaseIdFieldNames[blogProvider];

          // If the blog is already uploaded, we don't want to upload it again
          if (blogUploadedPlatforms.includes(blogProvider)) {
            continue;
          }

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

          // update the url and id of the blog
          databaseBlogUpdates[databaseUrlFieldName as DatabasePublishBlogFields] = url;
          databaseBlogUpdates[databaseIdFieldName as DatabasePublishBlogFields] = url;

          setBlogUploadedPlatforms((pre) => [...pre, blogProvider]);
          setDatabaseBlogUpdateState(databaseBlogUpdates);
        }
      }

      // Finally update the blog status and update some other fields e.g. urls, timestamp
      await supabaseClient
        .from("blogs")
        .update({
          publishingDetails: JSON.stringify(values),
          status: "PUBLISHED",
          last_published_at: new Date().toLocaleDateString(),
          ...databaseBlogUpdates,
        })
        .eq("id", blog.id);

      close();
      form.reset();
      router.refresh();
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
          description="This is where your blog will be uploaded at first"
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
