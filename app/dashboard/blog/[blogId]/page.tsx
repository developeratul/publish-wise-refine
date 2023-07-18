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

/**
 * // TODO: Image upload and insert in Blog
 * // TODO: Separation between edit and view blog
 */
export default async function BlogDetailsByIdPage(props: PageProps) {
  const {
    params: { blogId },
  } = props;
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data, error } = await supabase.from("blogs").select("*").eq("id", blogId);

  if (error) throw error.message;

  const blog = data[0];

  if (!blog) return notFound();

  return (
    <BlogProvider blog={blog}>
      <BlogHeader />
      <BlogPrimaryDetails />
      <BlogContent />
      <BlogActions />
    </BlogProvider>
  );
}

export const dynamic = "force-dynamic";
