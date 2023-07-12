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
import { parseJson } from "@/lib/utils";
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
import { useRouter } from "next/navigation";
import React, { forwardRef } from "react";
import { toast } from "react-hot-toast";
import { useBlogContext } from "../BlogProvider";

type DatabasePublishBlogFields =
  | "hashNodeBlogUrl"
  | "devToBlogUrl"
  | "mediumBlogUrl"
  | "hashNodeArticleId"
  | "devToArticleId"
  | "mediumArticleId";

type DatabaseBlogUpdates = Partial<Record<DatabasePublishBlogFields, string>>;

export interface PubRepBlogForm {
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
  form: UseFormReturnType<PubRepBlogForm>;
  type: "publish" | "republish";
  initialValues: PubRepBlogForm;
  title: string;
  actionButtonText: string;
  actionButtonIcon: React.ReactNode;
}

const PubRepBlogContext = React.createContext<InitialValue | undefined>(undefined);

function usePubRepBlog() {
  const pubRepBlog = React.useContext(PubRepBlogContext);

  if (pubRepBlog === undefined) {
    throw new Error("This hook must be used within specified context");
  }

  return pubRepBlog;
}

export default function PubRepBlog() {
  const [opened, { open, close }] = useDisclosure(false);
  const { blog } = useBlogContext();

  const type: InitialValue["type"] = blog.status === "PUBLISHED" ? "republish" : "publish";
  const initialValues = JSON.parse((blog.publishingDetails as string) || "{}") as PubRepBlogForm;
  const title = type === "publish" ? "Publish Blog" : "Republish Blog";
  const actionButtonText = type === "publish" ? "Publish" : "Republish";
  const actionButtonIcon =
    type === "publish" ? <Icon name="IconBookUpload" /> : <Icon name="IconRefresh" />;

  const form = useForm<PubRepBlogForm>({
    initialValues:
      type === "publish"
        ? {
            selectedBlogs: [],
            hashNode: { slug: generateSlug(blog.title), tags: [] },
            devTo: { tags: [] },
          }
        : initialValues,
    validate: {
      // We only need those validations for publishing
      ...(type === "publish"
        ? {
            selectedBlogs: hasLength(
              { min: 1 },
              "Please select at least select one blog for publishing"
            ),
            primaryBlog: (value, values) =>
              value && values.selectedBlogs.includes(value)
                ? null
                : "Your primary blog was not selected for publishing",
          }
        : {}),
    },
  });

  return (
    <React.Fragment>
      <Button onClick={open} rightIcon={<Icon name="IconBookUpload" />}>
        {actionButtonText}
      </Button>
      <PubRepBlogContext.Provider
        value={{ form, actionButtonText, initialValues, title, type, actionButtonIcon }}
      >
        <Drawer
          scrollAreaComponent={ScrollArea.Autosize}
          position="right"
          size="lg"
          opened={opened}
          onClose={close}
          withinPortal
          title={title}
        >
          <DrawerContent close={close} />
        </Drawer>
      </PubRepBlogContext.Provider>
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
  const { form, actionButtonIcon, actionButtonText, type } = usePubRepBlog();
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

  const blogContentMarkdown = htmlToMarkdown(blogEditingForm.values.content || "");

  const devToPayload: DevToArticleInput & { apiKey: string } = {
    title: blogEditingForm.values.title,
    body_markdown: blogContentMarkdown,
    tags: form.values.devTo.tags,
    apiKey: apiKeys.devToAPIKey as string,
  };

  const hashNodePayload: HashNodeArticleInput & { apiKey: string; username: string } = {
    title: blogEditingForm.values.title,
    contentMarkdown: blogContentMarkdown,
    tags: form.values.hashNode.tags.map((tagId) => ({ _id: tagId })),
    slug: form.values.hashNode.slug,
    subtitle: form.values.hashNode.subtitle,
    apiKey: apiKeys.hashNodeAPIKey as string,
    username: apiKeys.hashNodeUsername as string,
  };

  const publishBlogPayloads: Record<BlogProviders, object> = {
    "dev.to": devToPayload,
    hashNode: hashNodePayload,
    medium: {},
  };

  type dbBlogUrlFieldNames = "devToBlogUrl" | "hashNodeBlogUrl" | "mediumBlogUrl";
  const dbBlogUrlFieldNamesObject: Record<BlogProviders, dbBlogUrlFieldNames> = {
    "dev.to": "devToBlogUrl",
    hashNode: "hashNodeBlogUrl",
    medium: "mediumBlogUrl",
  };

  type dbBlogIdIdFieldNames = "devToArticleId" | "hashNodeArticleId" | "mediumArticleId";
  const dbBlogIdFieldNamesObject: Record<BlogProviders, dbBlogIdIdFieldNames> = {
    "dev.to": "devToArticleId",
    hashNode: "hashNodeArticleId",
    medium: "mediumArticleId",
  };

  const handlePublishBlog = async (values: PubRepBlogForm) => {
    if (blog.status === "PUBLISHED") {
      return toast.error("Blog already published");
    }

    const { primaryBlog, selectedBlogs } = values;

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
          dbBlogIdFieldNamesObject[primaryBlog as BlogProviders] as DatabasePublishBlogFields
        ] = id as string;
        databaseBlogUpdates[
          dbBlogUrlFieldNamesObject[primaryBlog as BlogProviders] as DatabasePublishBlogFields
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
          const databaseUrlFieldName = dbBlogUrlFieldNamesObject[blogProvider];
          const databaseIdFieldName = dbBlogIdFieldNamesObject[blogProvider];

          // If the blog is already uploaded, we don't want to upload it again
          if (blogUploadedPlatforms.includes(blogProvider)) {
            continue;
          }

          const {
            data: { url, id },
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
          databaseBlogUpdates[databaseIdFieldName as DatabasePublishBlogFields] = id;

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
      router.refresh();
      toast.success("Blog publishing successful");
    } catch (err) {
      //
    } finally {
      setProcessing(false);
    }
  };

  const handleRepublishBlog = async () => {
    try {
      setProcessing(true);

      const databaseBlogUpdates: DatabaseBlogUpdates = databaseBlogUpdatesState;

      for (const blogProvider of form.values.selectedBlogs) {
        const payload = publishBlogPayloads[blogProvider];
        const databaseBlogIdFieldName = dbBlogIdFieldNamesObject[blogProvider];
        const publishedBlogId = blog[databaseBlogIdFieldName];

        const {
          data: { id, url },
        } = await toast.promise(
          axios.post<PublishBlogResponse>(`/api/${blogProvider}/republish`, {
            ...payload,
            publishedBlogId,
          }),
          {
            loading: `Republishing to ${blogProvider}`,
            error: (err) => err.response?.data?.message,
            success: `Successfully republished to ${blogProvider}`,
          }
        );

        databaseBlogUpdates[
          dbBlogIdFieldNamesObject[blogProvider as BlogProviders] as DatabasePublishBlogFields
        ] = id;
        databaseBlogUpdates[
          dbBlogUrlFieldNamesObject[blogProvider as BlogProviders] as DatabasePublishBlogFields
        ] = url;
      }

      await supabaseClient
        .from("blogs")
        .update({
          publishingDetails: JSON.stringify(form.values),
          status: "PUBLISHED",
          last_published_at: new Date().toLocaleDateString(),
          ...databaseBlogUpdates,
        })
        .eq("id", blog.id);

      close();
      router.refresh();
      toast.success("Blog republishing successful");
    } catch (err) {
    } finally {
      setProcessing(false);
    }
  };

  const handlePubRepBlog = type === "publish" ? handlePublishBlog : handleRepublishBlog;

  return (
    <Stack spacing={50}>
      <form className="flex flex-col gap-8" onSubmit={form.onSubmit(handlePubRepBlog)}>
        {type === "publish" && (
          <React.Fragment>
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
          </React.Fragment>
        )}
        <HashNodeDetails />
        <DevToDetails />
        <Button
          className="self-end"
          loading={isProcessing}
          rightIcon={actionButtonIcon}
          type="submit"
        >
          {actionButtonText}
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
