import { DevToArticleInput } from "@/api/dev.to/types";
import { HashNodeArticleInput } from "@/api/hashnode/types";
import { useGetIntegratedBlogsQuery, useLocalApiKeys } from "@/app/dashboard/settings/Integrations";
import DevToLogoSrc from "@/assets/logos/dev-to.png";
import HashNodeLogoSrc from "@/assets/logos/hashnode.png";
import MediumLogoSrc from "@/assets/logos/medium.png";
import { FullPageRelativeLoader } from "@/components/Loader";
import { htmlToMarkdown } from "@/helpers/blog";
import { getFileUrl } from "@/helpers/file";
import { supabaseClient } from "@/lib/supabase";
import { BlogProviders, PublishBlogResponse } from "@/types";
import { Button, Drawer, Group, MultiSelect, ScrollArea, Select, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { useBlogContext } from "../../BlogProvider";
import DevToDetails from "./DevToDetails";
import HashNodeDetails from "./HashNodeDetails";
import {
  DatabaseBlogUpdates,
  DatabasePublishBlogFields,
  PubRepBlogForm,
  usePubRepBlog,
} from "./provider";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: StaticImageData;
  label: string;
  description: string;
  disabled: boolean;
}

const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, disabled, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group opacity={disabled ? 0.3 : 1} noWrap>
        <Image width={50} height={50} src={image} alt={label} />
        <Stack spacing="xs">
          <Text size="md">{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </Stack>
      </Group>
    </div>
  )
);

SelectItem.displayName = "SelectItem";

export default function PubRepBlogDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const { apiKeys } = useLocalApiKeys();
  const router = useRouter();

  const [isProcessing, setProcessing] = React.useState(false);

  const { isLoading, isError, data } = useGetIntegratedBlogsQuery();
  const { blog, form: blogEditingForm } = useBlogContext();
  const { form, actionButtonIcon, actionButtonText, type, title } = usePubRepBlog();

  const [blogUploadedPlatforms, setBlogUploadedPlatforms] = React.useState<BlogProviders[]>([]);
  const [primaryBlogUrlState, setPrimaryBlogUrlState] = React.useState("");
  const [databaseBlogUpdatesState, setDatabaseBlogUpdateState] =
    React.useState<DatabaseBlogUpdates>({});

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

  const devToCoverImageUrl = form.values.devTo.coverImagePath
    ? getFileUrl("blog-covers", form.values.devTo.coverImagePath)
    : null;
  const hashNodeCoverImageUrl = form.values.hashNode.coverImagePath
    ? getFileUrl("blog-covers", form.values.hashNode.coverImagePath)
    : null;

  const devToPayload: DevToArticleInput & { apiKey: string } = {
    title: blogEditingForm.values.title,
    body_markdown: blogContentMarkdown,
    tags: form.values.devTo.tags,
    apiKey: apiKeys.devToAPIKey as string,
    main_image: devToCoverImageUrl,
  };

  const hashNodePayload: HashNodeArticleInput & { apiKey: string; username: string } = {
    title: blogEditingForm.values.title,
    contentMarkdown: blogContentMarkdown,
    coverImageURL: hashNodeCoverImageUrl || null,
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
      // If there is a primary blog URL, that means it was uploaded successfully
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
      const { error } = await supabaseClient
        .from("blogs")
        .update({
          publishingDetails: JSON.stringify(values),
          status: "PUBLISHED",
          last_published_at: new Date().toLocaleString(),
          devToArticleCoverImagePath: values.devTo.coverImagePath,
          hashNodeArticleCoverImagePath: values.hashNode.coverImagePath,
          ...databaseBlogUpdates,
        })
        .eq("id", blog.id);

      if (error) {
        toast.error(error.message);
      }

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
          last_published_at: new Date().toLocaleString(),
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
    <React.Fragment>
      <Button onClick={open} rightIcon={actionButtonIcon}>
        {actionButtonText}
      </Button>
      <Drawer
        scrollAreaComponent={ScrollArea.Autosize}
        position="right"
        size="lg"
        opened={opened}
        onClose={close}
        withinPortal
        title={title}
      >
        <Stack spacing={50}>
          <form className="flex flex-col gap-12" onSubmit={form.onSubmit(handlePubRepBlog)}>
            {type === "publish" && (
              <Stack>
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
              </Stack>
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
      </Drawer>
    </React.Fragment>
  );
}
