import Icon from "@/components/Icon";
import { Button, Drawer, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

export default function RepublishBlog() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <React.Fragment>
      <Button onClick={open} rightIcon={<Icon name="IconBookUpload" />}>
        Republish
      </Button>
      <Drawer
        scrollAreaComponent={ScrollArea.Autosize}
        position="right"
        size="lg"
        opened={opened}
        onClose={close}
        withinPortal
        title="Republish blog"
      >
        <h1>Drawer content</h1>
      </Drawer>
    </React.Fragment>
  );
}
