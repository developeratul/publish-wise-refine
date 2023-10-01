"use client";
import Icon from "@/components/Icon";
import useColorModeValue from "@/hooks/useColorModeValue";
import { Blog } from "@/types";
import { Button, Group, Stack, Title, useMantineTheme } from "@mantine/core";
import { useCreate } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUserContext } from "../providers/user";

export default function DashboardHeader() {
  const user = useUserContext();
  const theme = useMantineTheme();

  return (
    <Group spacing="xs" position="apart" align="center">
      <Stack>
        <Title weight={500} color={useColorModeValue(theme.black, theme.white)} order={2}>
          Welcome back, {user.user_metadata.first_name}
        </Title>
      </Stack>
      <CreateNewBlogButton />
    </Group>
  );
}

export function CreateNewBlogButton() {
  const user = useUserContext();
  const { mutateAsync, isLoading } = useCreate<Blog>();
  const router = useRouter();

  const handleCreateNewDraft = async () => {
    try {
      const { data } = await toast.promise(
        mutateAsync({
          resource: "blogs",
          values: { user_id: user.id, title: "Untitled" },
          successNotification: false,
          meta: { select: "id" },
        }),
        {
          loading: "Creating a new draft",
          success: "Draft created, getting you there 🚀",
          error: "Error while creating a draft",
        }
      );
      const { id } = data;
      router.refresh();
      router.push(`/dashboard/blog/${id}?type=edit`);
    } catch (err) {
      //
    }
  };
  return (
    <Button onClick={handleCreateNewDraft} loading={isLoading} leftIcon={<Icon name="IconNotes" />}>
      New draft
    </Button>
  );
}
