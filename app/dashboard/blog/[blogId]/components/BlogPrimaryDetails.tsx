"use client";
import { badgeStyles } from "@/app/dashboard/components/Blogs";
import DevToLogoSrc from "@/assets/logos/dev-to.png";
import HashNodeLogoSrc from "@/assets/logos/hashnode.png";
import Icon from "@/components/Icon";
import useMediaQuery from "@/hooks/useMediaQuery";
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
} from "@mantine/core";
import Image from "next/image";
import { useBlogContext } from "../BlogProvider";

export default function BlogPrimaryDetails() {
  const { form, isEditingMode, blog } = useBlogContext();
  const { isOverSm } = useMediaQuery();
  const badgeStyle = badgeStyles[blog.status];
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
        <Flex align="center">
          <Group noWrap className="w-full max-w-[250px]" align="center">
            <Icon size={22} name="IconInfoCircle" />
            <Text size="md" className="font-medium">
              Status
            </Text>
          </Group>
          <div className="flex-1">
            <Badge size="lg" color={badgeStyle.color}>
              {badgeStyle.label}
            </Badge>
          </div>
        </Flex>
        <Flex align="center">
          <Group noWrap className="w-full max-w-[250px]" align="center">
            <Icon name="IconTags" size={22} />
            <Text size="md" className="font-medium">
              Tags
            </Text>
          </Group>
          <BlogTags />
        </Flex>
        {blog.status === "PUBLISHED" && (
          <Flex align="center">
            <Group noWrap className="w-full max-w-[250px]" align="center">
              <Icon size={22} name="IconBookUpload" />
              <Text size="md" className="font-medium">
                Published on
              </Text>
            </Group>
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
          </Flex>
        )}
      </Stack>
    </Stack>
  );
}

function BlogTags() {
  const { isEditingMode, form } = useBlogContext();
  const { tags } = form.values;
  const tagsFormatted = tags.map((tag) => ({ label: tag, value: tag }));
  return (
    <MultiSelect
      styles={{
        input: { border: "none", background: "transparent" },
        values: { gap: 8 },
      }}
      readOnly={!isEditingMode}
      valueComponent={MultiSelectValue}
      searchable
      creatable
      w="100%"
      rightSection={<></>}
      size="md"
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
