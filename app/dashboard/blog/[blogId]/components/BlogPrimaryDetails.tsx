"use client";
import { badgeStyles } from "@/app/dashboard/components/Blogs";
import Icon from "@/components/Icon";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Badge, Button, Flex, Group, MultiSelect, Stack, Text, Textarea } from "@mantine/core";
import { useBlogContext } from "../BlogProvider";

export default function BlogPrimaryDetails() {
  const { form, isEditingMode, blog } = useBlogContext();
  const { isOverSm } = useMediaQuery();
  const badgeStyle = badgeStyles[blog.status];
  return (
    <Stack mb={50}>
      <Stack spacing="xs" className="group">
        {isEditingMode && (
          <Button
            w="fit-content"
            className={cn(
              "group-hover:opacity-100 duration-200",
              isOverSm ? "opacity-0" : "opacity-100"
            )}
            leftIcon={<Icon name="IconPhotoPlus" size={16} />}
            size="xs"
            variant="subtle"
          >
            Add cover
          </Button>
        )}
        <Textarea
          autosize
          readOnly={!isEditingMode}
          spellCheck={!isEditingMode}
          styles={{
            input: { fontSize: isOverSm ? 40 : 30, background: "transparent", border: "none" },
          }}
          {...form.getInputProps("title")}
        />
      </Stack>
      <Stack>
        <Flex align="center">
          <Group noWrap className="w-full max-w-[250px]" align="center">
            <Icon size={22} name="IconInfoCircle" />
            <Text size="lg" className="font-medium">
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
            <Text size="lg" className="font-medium">
              Tags
            </Text>
          </Group>
          <MultiSelect
            w="100%"
            size="md"
            data={["React", "Angular", "Vue", "Tutorial"]}
            value={["React", "Angular", "Vue", "Tutorial"]}
            placeholder="Enter tags"
          />
        </Flex>
      </Stack>
      <Flex w="100%" justify="end">
        <Button leftIcon={<Icon name="IconBookUpload" />}>Publish</Button>
      </Flex>
    </Stack>
  );
}
