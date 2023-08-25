"use client";

import { useBaseEditor } from "@/lib/editor";
import { AppProps, Blog } from "@/types";
import { UseFormReturnType, useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { useUpdate } from "@refinedev/core";
import { Editor } from "@tiptap/react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import ImportBlogModal from "./components/ImportBlogModal";

interface BlogContextInitialState {
  blog: Blog;
  form: UseFormReturnType<BlogEditForm>;
  isSaving: boolean;
  isSavingSuccess: boolean;
  isEditingMode: boolean;
  editor: Editor | null;
}

const BlogContext = React.createContext<BlogContextInitialState | undefined>(undefined);

interface BlogEditForm {
  title: string;
  content: string;
  contentMarkdown: string;
  tags: string[];
}

export default function BlogProvider(props: AppProps & { blog: Blog }) {
  const { children, blog } = props;
  const form = useForm<BlogEditForm>({
    initialValues: {
      title: blog.title,
      content: blog.content || "",
      contentMarkdown: blog.contentMarkdown || "",
      tags: (blog.tags as string[]) || [],
    },
  });
  const [debouncedValues] = useDebouncedValue(form.values, 1000);
  const [isFirstTime, setFirstTime] = React.useState(true);
  const searchParams = useSearchParams();
  const isEditingMode = searchParams.get("type") === "edit";
  const editor = useBaseEditor({
    content: blog.content,
    editable: isEditingMode,
    onUpdate({ editor }) {
      form.setFieldValue("content", editor.getHTML());
      form.setFieldValue("contentMarkdown", editor.storage.markdown.getMarkdown());
    },
    onFocus({ editor, event }) {
      if (event.isTrusted) {
        form.setFieldValue("content", editor.getHTML());
        form.setFieldValue("contentMarkdown", editor.storage.markdown.getMarkdown());
      }
    },
  });
  const { mutateAsync, isLoading, isSuccess } = useUpdate<Blog>();
  const router = useRouter();

  const saveBlogChanges = React.useCallback(
    async (values: BlogEditForm) => {
      try {
        await mutateAsync({
          resource: "blogs",
          id: blog.id,
          values,
          successNotification: false,
        });
      } catch (err) {
        //
      }
    },
    [blog.id, mutateAsync]
  );

  // * Autosave the changes
  React.useEffect(() => {
    // When the page renders for the first time, don't save
    // And only if its in editing mode
    if (!isFirstTime && isEditingMode) {
      saveBlogChanges(debouncedValues);
    }
    setFirstTime(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues, saveBlogChanges]);

  React.useEffect(() => {
    /**
     * Update content of the route before leaving the page
     * So if the user comes back, he sees the updates he made last time
     * Not the old one
     */
    return () => router.refresh();
  }, [router]);

  const contextValue: BlogContextInitialState = {
    blog,
    form,
    isSaving: isLoading,
    isSavingSuccess: isSuccess,
    isEditingMode,
    editor,
  };

  return (
    <BlogContext.Provider value={contextValue}>
      <ImportBlogModal>{children}</ImportBlogModal>
    </BlogContext.Provider>
  );
}

export function useBlogContext() {
  const blogContext = React.useContext(BlogContext);

  if (blogContext === undefined) {
    throw new Error("This hook must be used within specified context");
  }

  return blogContext;
}
