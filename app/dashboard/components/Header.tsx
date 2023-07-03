"use client";
import Icon from "@/components/Icon";
import { supabaseClient } from "@/lib/supabase";
import { Button, Group, Stack, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDashboardContext } from "../providers/dashboard";

export default function DashboardHeader() {
  const { user } = useDashboardContext();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabaseClient
        .from("blogs")
        .insert([{ user_id: user?.id as string, title: "Untitled" }])
        .select("id");

      if (error) {
        toast.error(error.message);
        throw error;
      }

      const blogWithId = data[0];

      return blogWithId;
    },
  });
  const router = useRouter();

  const handleCreateNewDraft = async () => {
    try {
      const { id } = await mutateAsync();
      router.refresh();
      router.push(`/dashboard/blog/${id}?type=edit`);
    } catch (err) {
      //
    }
  };

  return (
    <Group spacing="xs" position="apart" align="center">
      <Stack>
        <Title order={2}>Welcome back, {user?.user_metadata.first_name}</Title>
      </Stack>
      <Button
        onClick={handleCreateNewDraft}
        loading={isLoading}
        leftIcon={<Icon name="IconNotes" />}
      >
        New draft
      </Button>
    </Group>
  );
}
