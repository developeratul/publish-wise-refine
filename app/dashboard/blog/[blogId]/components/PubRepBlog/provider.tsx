import Icon from "@/components/Icon";
import { generateSlug } from "@/helpers/blog";
import { AppProps, BlogProviders } from "@/types";
import { UseFormReturnType, hasLength, useForm } from "@mantine/form";
import React from "react";
import { useBlogContext } from "../../BlogProvider";

export type DatabasePublishBlogFields =
  | "hashNodeBlogUrl"
  | "devToBlogUrl"
  | "mediumBlogUrl"
  | "hashNodeArticleId"
  | "devToArticleId"
  | "mediumArticleId";

export type DatabaseBlogUpdates = Partial<Record<DatabasePublishBlogFields, string>>;

export interface PubRepBlogForm {
  selectedBlogs: BlogProviders[];
  primaryBlog?: BlogProviders;
  hashNode: {
    slug: string;
    subtitle?: string;
    tags: string[];
    coverImagePath?: string;
  };
  devTo: {
    tags: string[];
    coverImagePath?: string;
  };
}

interface InitialValue {
  form: UseFormReturnType<PubRepBlogForm>;
  type: "publish" | "republish";
  initialValues: PubRepBlogForm;
  title: string;
  actionButtonText: string;
  actionButtonIcon: React.ReactNode;
}

const PubRepBlogContext = React.createContext<InitialValue | undefined>(undefined);

export function PubRepBlogProvider(props: AppProps) {
  const { children } = props;
  const { blog } = useBlogContext();

  const type: InitialValue["type"] = blog.status === "PUBLISHED" ? "republish" : "publish";
  const initialValues = JSON.parse((blog.publishingDetails as string) || "{}") as PubRepBlogForm;
  const title = type === "publish" ? "Publish Blog" : "Republish Blog";
  const actionButtonText = type === "publish" ? "Publish" : "Republish";
  const actionButtonIcon =
    type === "publish" ? <Icon name="IconBookUpload" /> : <Icon name="IconRefresh" />;

  const form = useForm<PubRepBlogForm>({
    initialValues:
      type === "publish"
        ? {
            selectedBlogs: [],
            hashNode: { slug: generateSlug(blog.title), tags: [] },
            devTo: { tags: [] },
          }
        : initialValues,
    validate: {
      // We only need those validations for publishing
      ...(type === "publish"
        ? {
            selectedBlogs: hasLength(
              { min: 1 },
              "Please select at least select one blog for publishing"
            ),
            primaryBlog: (value, values) =>
              value && values.selectedBlogs.includes(value)
                ? null
                : "Your primary blog was not selected for publishing",
          }
        : {}),
    },
  });

  return (
    <PubRepBlogContext.Provider
      value={{ form, actionButtonText, initialValues, title, type, actionButtonIcon }}
    >
      {children}
    </PubRepBlogContext.Provider>
  );
}

export function usePubRepBlog() {
  const pubRepBlog = React.useContext(PubRepBlogContext);

  if (pubRepBlog === undefined) {
    throw new Error("This hook must be used within specified context");
  }

  return pubRepBlog;
}
