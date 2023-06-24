"use client";
import Icon from "@/components/Icon";
import { inter } from "@/fonts";
import { cn } from "@/lib/utils";
import { Button, Stack } from "@mantine/core";
import { useBlogContext } from "../BlogProvider";

export default function BlogPrimaryDetails() {
  const { form } = useBlogContext();
  return (
    <Stack mb={20}>
      <Stack spacing="xs" className="group">
        <Button
          w="fit-content"
          className="opacity-0 group-hover:opacity-100 duration-200"
          leftIcon={<Icon name="IconPhotoPlus" size={16} />}
          size="xs"
          variant="subtle"
        >
          Add cover
        </Button>
        <textarea
          className={cn(
            "bg-transparent border-none outline-none text-[40px] resize-none break-words overflow-y-auto h-auto",
            inter.className
          )}
          {...form.getInputProps("title")}
        />
      </Stack>
    </Stack>
  );
}
