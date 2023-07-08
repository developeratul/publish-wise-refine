"use client";
import { HashNodeTag } from "@/api/hashnode/types";
import { useGetIntegratedBlogsQuery, useLocalApiKeys } from "@/app/dashboard/settings/Integrations";
import DevToLogoSrc from "@/assets/logos/dev-to.png";
import HashNodeLogoSrc from "@/assets/logos/hashnode.png";
import MediumLogoSrc from "@/assets/logos/medium.png";
import Icon from "@/components/Icon";
import { FullPageRelativeLoader } from "@/components/Loader";
import { generateSlug } from "@/helpers/blog";
import { BlogProviders } from "@/types";
import {
  Button,
  Drawer,
  Group,
  Loader,
  MultiSelect,
  ScrollArea,
  Select,
  SelectItem,
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
import { useBlogContext } from "../BlogProvider";

interface PublishBlogForm {
  selectedBlogs: BlogProviders[];
  primaryBlog?: BlogProviders;
  hashNode: {
    slug: string;
    subtitle?: string;
    tags: SelectItem[];
  };
  "dev.to": {};
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
      "dev.to": {},
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
  const { form } = usePublishBlog();

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
    try {
    } catch (err) {
      //
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
        <Button rightIcon={<Icon name="IconBookUpload" />} form="publish-form" type="submit">
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
  const isHashNodeSelected = selectedBlogs.includes("dev.to");

  if (!isHashNodeSelected) return <></>;

  // * Dev.to does not require any additional details so blank!
  return <></>;
}
