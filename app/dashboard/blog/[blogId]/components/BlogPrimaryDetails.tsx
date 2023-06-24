"use client";
import Icon from "@/components/Icon";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Button, Stack, Textarea } from "@mantine/core";
import { useBlogContext } from "../BlogProvider";

export default function BlogPrimaryDetails() {
  const { form, isEditingMode } = useBlogContext();
  const { isOverSm } = useMediaQuery();
  return (
    <Stack mb={20}>
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
    </Stack>
  );
}
