"use client";
import { Conditional } from "@/components/Conditional";
import Icon from "@/components/Icon";
import EmptyMessage from "@/components/Messages";
import useMediaQuery from "@/hooks/useMediaQuery";
import { formatDate } from "@/lib/utils";
import { AppProps, Blog, BlogStatus } from "@/types";
import {
  ActionIcon,
  Badge,
  Card,
  DefaultMantineColor,
  Group,
  Image,
  Menu,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useDashboardContext } from "../providers/dashboard";
import { useDeleteBlogContext } from "../providers/delete-blog";
import { CreateNewBlogButton } from "./Header";

export default function DashboardBlogsSection() {
  const { blogs } = useDashboardContext();
  const { isOverSm, isOverXl, isOverXs } = useMediaQuery();
  return (
    <Stack>
      <Group position="apart">
        <Title order={2}>Your blogs ({blogs.length})</Title>
        <Group></Group>
      </Group>
      {/**
       * Base 1
       * over Xs 2
       * over Sm 3
       * over xl 4
       */}
      <Conditional
        condition={blogs.length > 0}
        fallback={
          <EmptyMessage
            title="Nothing to show"
            description="You currently have no blogs created"
            action={<CreateNewBlogButton />}
          />
        }
        component={
          <SimpleGrid cols={isOverXs ? (isOverSm ? (isOverXl ? 4 : 3) : 2) : 1}>
            {blogs.map((blog) => (
              <BlogItem {...blog} key={blog.id} />
            ))}
          </SimpleGrid>
        }
      />
    </Stack>
  );
}

export const badgeStyles: Record<BlogStatus, { color: DefaultMantineColor; label: string }> = {
  DRAFT: {
    color: "",
    label: "Draft",
  },
  PUBLISHED: {
    color: "green",
    label: "Published",
  },
  SCHEDULED: {
    color: "orange",
    label: "Scheduled",
  },
};

function BlogItem(props: Blog) {
  const { status, title, created_at, id } = props;
  const badgeStyle = badgeStyles[status];
  return (
    <Card withBorder>
      <Card.Section mb="md">
        <Image
          src="https://picsum.photos/seed/picsum/300/160"
          height={160}
          fit="cover"
          alt="Norway"
        />
      </Card.Section>
      <Stack>
        <Stack spacing="xs">
          <Text lineClamp={2} color="white">
            {title}
          </Text>
          <Text size="xs" color="dimmed">
            {formatDate(created_at)}
          </Text>
        </Stack>
        <Group position="apart">
          <Badge color={badgeStyle.color || undefined}>{badgeStyle.label}</Badge>
          <BlogItemMenu blogId={id}>
            <ActionIcon size="md" variant="light">
              <Icon name="IconDotsVertical" />
            </ActionIcon>
          </BlogItemMenu>
        </Group>
      </Stack>
    </Card>
  );
}

function BlogItemMenu(props: AppProps & { blogId: string }) {
  const { children, blogId } = props;
  const { openDeleteBlogModal } = useDeleteBlogContext();

  const handleDelete = () => {
    openDeleteBlogModal(blogId);
  };

  return (
    <Menu withArrow position="bottom" withinPortal>
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown miw={200}>
        <Menu.Item
          component={Link}
          href={`/dashboard/blog/${blogId}`}
          icon={<Icon name="IconEye" />}
        >
          View
        </Menu.Item>
        <Menu.Item
          component={Link}
          href={{ pathname: `/dashboard/blog/${blogId}`, search: "type=edit" }}
          icon={<Icon name="IconEdit" />}
        >
          Edit
        </Menu.Item>
        <Menu.Item color="red" icon={<Icon name="IconTrash" />} onClick={handleDelete}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
