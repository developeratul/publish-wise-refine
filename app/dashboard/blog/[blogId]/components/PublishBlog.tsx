"use client";
import { useGetIntegratedBlogsQuery } from "@/app/dashboard/settings/Integrations";
import DevToLogoSrc from "@/assets/logos/dev-to.png";
import HashNodeLogoSrc from "@/assets/logos/hashnode.png";
import MediumLogoSrc from "@/assets/logos/medium.png";
import Icon from "@/components/Icon";
import { FullPageRelativeLoader } from "@/components/Loader";
import { Button, Drawer, Group, MultiSelect, ScrollArea, Select, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image, { StaticImageData } from "next/image";
import React, { forwardRef } from "react";

export default function PublishBlog() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <React.Fragment>
      <Button onClick={open} rightIcon={<Icon name="IconBookUpload" />}>
        Publish
      </Button>
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

  if (isLoading) return <FullPageRelativeLoader />;
  if (isError) return <></>;

  const selectData = [
    {
      label: "Dev.to",
      value: "devTo",
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

  return (
    <Stack spacing="xl">
      <MultiSelect
        label="Select blogs"
        placeholder="Select"
        description="You can only select the blogs that are connected to your PublishWise account"
        itemComponent={SelectItem}
        withinPortal
        data={selectData}
      />
      <Select
        data={selectData}
        label="Primary blog"
        withinPortal
        itemComponent={SelectItem}
        description="Where should the blog be primarily uploaded?"
      />
    </Stack>
  );
}
