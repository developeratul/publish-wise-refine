"use client";

import { supabaseClient } from "@/lib/supabase";
import { AppProps } from "@/types";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

interface DeleteBlogInitialState {
  openDeleteBlogModal: (blogId: string) => void;
}

const DeleteBlogContext = React.createContext<DeleteBlogInitialState | undefined>(undefined);

export default function DeleteBlogProvider(props: AppProps) {
  const { children } = props;
  const [blogId, setBlogId] = React.useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: async () => {
      const { error } = await supabaseClient.from("blogs").delete().eq("id", blogId);

      if (error) {
        toast.error(error.message);
        throw error;
      }
    },
  });
  const router = useRouter();

  const openDeleteBlogModal: DeleteBlogInitialState["openDeleteBlogModal"] = (blogId) => {
    setBlogId(blogId);
    open();
  };

  const closeModal = () => {
    setBlogId("");
    close();
  };

  const handleDeleteBlog = async () => {
    try {
      await toast.promise(mutateAsync(), {
        loading: "Deleting blog...",
        success: "The blog has been deleted",
        error: "Unexpected error",
      });
      closeModal();
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      //
    }
  };

  return (
    <DeleteBlogContext.Provider value={{ openDeleteBlogModal }}>
      <Modal
        withCloseButton={false}
        centered
        opened={opened}
        withinPortal
        title="Are you sure?"
        onClose={closeModal}
      >
        <Stack>
          <Text color="dimmed">This action will cost permanent data loss</Text>
          <Group>
            <Button color="red" loading={isLoading} onClick={handleDeleteBlog}>
              Yes
            </Button>
            <Button loading={isLoading} variant="subtle" color="gray" onClick={closeModal}>
              No
            </Button>
          </Group>
        </Stack>
      </Modal>
      {children}
    </DeleteBlogContext.Provider>
  );
}

export function useDeleteBlogContext() {
  const deleteBlogContext = React.useContext(DeleteBlogContext);

  if (deleteBlogContext === undefined) {
    throw new Error("This hook must be used within specified context");
  }

  return deleteBlogContext;
}
