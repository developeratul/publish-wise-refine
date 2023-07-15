"use client";
import { badgeStyles } from "@/app/dashboard/components/Blogs";
import DevToLogoSrc from "@/assets/logos/dev-to.png";
import HashNodeLogoSrc from "@/assets/logos/hashnode.png";
import Icon, { IconNames } from "@/components/Icon";
import useMediaQuery from "@/hooks/useMediaQuery";
import { formatDate } from "@/lib/utils";
import { AppProps } from "@/types";
import {
  Badge,
  CloseButton,
  Flex,
  Group,
  MultiSelect,
  MultiSelectValueProps,
  Stack,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import Image from "next/image";
import React from "react";
import { useBlogContext } from "../BlogProvider";

export default function BlogPrimaryDetails() {
  const [hydrated, setHydrated] = React.useState(false);
  const { form, isEditingMode, blog } = useBlogContext();
  const { isOverSm } = useMediaQuery();
  const badgeStyle = badgeStyles[blog.status];

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <></>;
  }

  return (
    <Stack mb={50}>
      <Stack spacing="xs">
        <Textarea
          {...form.getInputProps("title")}
          autosize
          readOnly={!isEditingMode}
          spellCheck={!isEditingMode}
          styles={{
            input: {
              fontSize: isOverSm ? 40 : 30,
              padding: "0 0",
              background: "transparent",
              border: "none",
            },
          }}
        />
      </Stack>
      <Stack>
        <KeyValuePairDisplay title="Status" iconName="IconInfoCircle">
          <div className="flex-1">
            <Badge size="lg" color={badgeStyle.color}>
              {badgeStyle.label}
            </Badge>
          </div>
        </KeyValuePairDisplay>
        <KeyValuePairDisplay title="Tags" iconName="IconTags">
          <BlogTags />
        </KeyValuePairDisplay>
        {blog.status === "PUBLISHED" && (
          <React.Fragment>
            <KeyValuePairDisplay title="Published on" iconName="IconBookUpload">
              <div className="flex w-full gap-2">
                {blog.devToBlogUrl && (
                  <a href={blog.devToBlogUrl} target="_blank" rel="noopener noreferrer">
                    <Image width={25} src={DevToLogoSrc} alt="Dev.to logo" />
                  </a>
                )}
                {blog.hashNodeBlogUrl && (
                  <a href={blog.hashNodeBlogUrl} target="_blank" rel="noopener noreferrer">
                    <Image width={25} src={HashNodeLogoSrc} alt="HashNode logo" />
                  </a>
                )}
              </div>
            </KeyValuePairDisplay>
            <KeyValuePairDisplay title="Last published" iconName="IconCalendarEvent">
              <div className="flex-1 w-full gap-2">
                {formatDate(blog.last_published_at as string)}
              </div>
            </KeyValuePairDisplay>
          </React.Fragment>
        )}
      </Stack>
    </Stack>
  );
}

function KeyValuePairDisplay(
  props: {
    title: string;
    iconName: IconNames;
  } & AppProps
) {
  const { title, children, iconName } = props;
  const theme = useMantineTheme();
  const { isOverXs } = useMediaQuery();
  return (
    <Flex
      align={isOverXs ? "center" : "start"}
      gap={isOverXs ? undefined : 16}
      direction={isOverXs ? "row" : "column"}
      w="100%"
    >
      <Group noWrap className="w-full max-w-[250px]" align="center">
        <Icon color={theme.colors.gray[6]} name={iconName} size={22} />
        <Text size="md" className="font-medium">
          {title}
        </Text>
      </Group>
      {children}
    </Flex>
  );
}

function BlogTags() {
  const { isEditingMode, form } = useBlogContext();
  const { tags } = form.values;
  const tagsFormatted = tags.map((tag) => ({ label: tag, value: tag }));
  return (
    <MultiSelect
      styles={{
        input: { border: "none", background: "transparent", paddingTop: 0, paddingBottom: 0 },
        values: { gap: 8 },
      }}
      readOnly={!isEditingMode}
      valueComponent={MultiSelectValue}
      searchable
      creatable
      w="100%"
      rightSection={<></>}
      data={tagsFormatted}
      value={tags}
      onChange={(tags) => form.setFieldValue("tags", tags)}
      placeholder="Enter tags"
      getCreateLabel={(query) => `+ Add ${query}`}
      onCreate={(tag) => {
        form.setFieldValue("tags", [...(tags as string[]), tag]);
        return tag;
      }}
    />
  );
}

function MultiSelectValue(props: MultiSelectValueProps & { value: string }) {
  const { value, onRemove } = props;
  return (
    <Badge
      pr={3}
      radius="md"
      size="lg"
      variant="filled"
      rightSection={
        <CloseButton
          onClick={onRemove}
          variant="transparent"
          size={22}
          iconSize={14}
          tabIndex={-1}
        />
      }
    >
      {value}
    </Badge>
  );
}
