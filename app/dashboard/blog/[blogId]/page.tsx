import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import nextDynamic from "next/dynamic";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
const BlogProvider = nextDynamic(() => import("./BlogProvider"));
const BlogActions = nextDynamic(() => import("./components/BlogActions"));
const BlogContent = nextDynamic(() => import("./components/BlogContent"));
const BlogHeader = nextDynamic(() => import("./components/BlogHeader"));
const BlogPrimaryDetails = nextDynamic(() => import("./components/BlogPrimaryDetails"));

interface PageProps {
  params: { blogId: string };
}

export default async function BlogDetailsByIdPage(props: PageProps) {
  const {
    params: { blogId },
  } = props;
  const supabase = createServerComponentClient<Database>({ cookies });
  const blogQuery = await supabase.from("blogs").select("*").eq("id", blogId).single();

  if (blogQuery.error) throw blogQuery.error.message;

  if (!blogQuery.data) return notFound();

  const publishingDetailsQuery = await supabase
    .from("blog_publishing_details")
    .upsert({ blogId: blogQuery.data.id }, { onConflict: "blogId" })
    .select("*")
    .single();

  if (publishingDetailsQuery.error) throw publishingDetailsQuery.error.message;

  return (
    <BlogProvider blog={blogQuery.data} publishingDetails={publishingDetailsQuery.data}>
      <BlogHeader />
      <BlogPrimaryDetails />
      <BlogContent />
      <BlogActions />
    </BlogProvider>
  );
}

export const dynamic = "force-dynamic";
