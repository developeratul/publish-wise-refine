import { DevToApiClient } from "@/api/dev.to";
import { DevToArticleInput } from "@/api/dev.to/types";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "@/lib/exceptions";
import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsedBody = z
      .object({
        blogId: z.string().nonempty(),
        apiKey: z.string().nonempty(),
        tags: z.array(z.string()),
        coverImagePath: z.string().optional(),
        type: z.enum(["PUBLISH", "REPUBLISH"]),
      })
      .safeParse(body);

    if (!parsedBody.success) {
      return BAD_REQUEST("Invalid request body");
    }

    const { blogId, tags, apiKey, coverImagePath, type } = parsedBody.data;

    if (!apiKey) {
      return UNAUTHORIZED("Your Dev.to account is not connected with PublishWise");
    }

    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      return NOT_FOUND();
    }

    const blogQuery = await supabase
      .from("blogs")
      .select("*")
      .eq("id", blogId)
      .eq("user_id", userData.user.id)
      .single();

    if (blogQuery.error) {
      return NOT_FOUND();
    }

    const client = new DevToApiClient(apiKey);

    const articleInput: DevToArticleInput = {
      title: blogQuery.data.title,
      main_image: coverImagePath
        ? supabase.storage.from("blog-covers").getPublicUrl(coverImagePath).data.publicUrl
        : null,
      body_markdown: blogQuery.data.contentMarkdown || "",
      canonical_url: blogQuery.data.canonicalUrl || undefined,
      tags,
      published: true,
    };

    let postId, postUrl;

    if (type === "PUBLISH") {
      const { id, url } = await client.publish(articleInput);
      postId = id;
      postUrl = url;
    } else {
      if (!blogQuery.data.devToPostId || blogQuery.data.status !== "PUBLISHED") {
        return NextResponse.json(
          { message: "Your blog has not been posted on Dev.to yet" },
          { status: 403 }
        );
      }
      const { id, url } = await client.republish(blogQuery.data.devToPostId, articleInput);
      postId = id;
      postUrl = url;
    }

    const publishingDetailsUpdate = await supabase.from("blog_publishing_details").upsert(
      {
        blogId: blogQuery.data.id,
        devToTags: tags,
        devToCoverImagePath: coverImagePath,
      },
      { onConflict: "blogId" }
    );

    if (publishingDetailsUpdate.error) {
      return NextResponse.json({ message: publishingDetailsUpdate.error.message }, { status: 500 });
    }

    const blogUpdate = await supabase
      .from("blogs")
      .update({
        devToPostId: postId,
        devToPostUrl: postUrl,
        status: "PUBLISHED",
        last_published_at: new Date().toISOString(),
      })
      .eq("id", blogQuery.data.id)
      .eq("user_id", userData.user.id)
      .single();

    if (blogUpdate.error) {
      return NextResponse.json({ message: blogUpdate.error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Successfully ${type === "PUBLISH" ? "published" : "republished"} on Dev.to`,
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return NextResponse.json(
          { message: "Your Dev.to account is not connected with PublishWise" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { message: err.response?.data.error },
        { status: err.response?.status || 500 }
      );
    }
  }
}
