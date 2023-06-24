"use client";

import Icon from "@/components/Icon";
import { Box, Button } from "@mantine/core";
import { useBlogContext } from "../BlogProvider";

export default function BlogCover() {
  const { blog } = useBlogContext();

  return (
    <Box>
      <Button leftIcon={<Icon name="IconPhotoPlus" size={16} />} size="xs" variant="subtle">
        Add cover
      </Button>
    </Box>
  );
}
