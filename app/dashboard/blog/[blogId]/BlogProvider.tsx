"use client";

import { supabaseClient } from "@/lib/supabase";
import { AppProps, Blog } from "@/types";
import { UseFormReturnType, useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

interface BlogContextInitialState {
  blog: Blog;
  form: UseFormReturnType<BlogEditForm>;
  isSaving: boolean;
  isSavingSuccess: boolean;
  isEditingMode: boolean;
}

const BlogContext = React.createContext<BlogContextInitialState | undefined>(undefined);

interface BlogEditForm {
  title: string;
  content: string;
}

export default function BlogProvider(props: AppProps & { blog: Blog }) {
  const { children, blog } = props;
  const form = useForm<BlogEditForm>({
    initialValues: {
      title: blog.title,
      content: blog.content || "",
    },
  });
  const [debouncedValues] = useDebouncedValue(form.values, 1000);
  const [isFirstTime, setFirstTime] = React.useState(true);
  const searchParams = useSearchParams();
  const isEditingMode = searchParams.get("type") === "edit";

  const { mutateAsync, isLoading, isSuccess } = useMutation({
    mutationFn: async (values: BlogEditForm) => {
      const { error, data } = await supabaseClient
        .from("blogs")
        .update({ ...values })
        .eq("id", blog.id);

      if (error) {
        toast.error(error.message);
        throw error;
      }

      return data;
    },
  });
  const router = useRouter();

  const saveBlogChanges = React.useCallback(
    async (values: BlogEditForm) => {
      try {
        await mutateAsync(values);
      } catch (err) {
        //
      }
    },
    [mutateAsync]
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

  return (
    <BlogContext.Provider
      value={{ blog, form, isSaving: isLoading, isSavingSuccess: isSuccess, isEditingMode }}
    >
      {children}
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
