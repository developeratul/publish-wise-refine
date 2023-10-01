import { MediumApiClient } from "@/api/medium";
import { MediumArticleInput } from "@/api/medium/types";
import { mediumPostPayloadSchema } from "@/app/dashboard/blog/[blogId]/constants";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "@/lib/exceptions";
import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsedBody = mediumPostPayloadSchema.safeParse(body);

    if (!parsedBody.success) {
      return BAD_REQUEST("Invalid request body");
    }

    const { blogId, tags, apiKey, coverImagePath, type } = parsedBody.data;

    if (!apiKey) {
      return UNAUTHORIZED("Your Medium account is not connected with PublishWise");
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

    const client = new MediumApiClient(apiKey);

    const articleInput: MediumArticleInput = {
      title: blogQuery.data.title,
      contentFormat: "html",
      content: blogQuery.data.content || "",
      canonicalUrl: blogQuery.data.canonicalUrl || undefined,
      tags,
      publishStatus: "public",
    };

    let postId, postUrl;

    if (type === "PUBLISH") {
      const { id, url } = await client.publish(articleInput);
      postId = id;
      postUrl = url;
    } else {
      return NextResponse.json(
        { message: "Republishing is not supported with Medium" },
        { status: 403 }
      );
    }

    const publishingDetailsUpdate = await supabase.from("blog_publishing_details").upsert(
      {
        blogId: blogQuery.data.id,
        mediumTags: tags,
        mediumCoverImagePath: coverImagePath,
      },
      { onConflict: "blogId" }
    );

    if (publishingDetailsUpdate.error) {
      return NextResponse.json({ message: publishingDetailsUpdate.error.message }, { status: 500 });
    }

    const blogUpdate = await supabase
      .from("blogs")
      .update({
        mediumPostId: postId,
        mediumPostUrl: postUrl,
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
      message: `Successfully ${type === "PUBLISH" ? "published" : "republished"} on Medium`,
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return NextResponse.json(
          { message: "Your Medium account is not connected with PublishWise" },
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
