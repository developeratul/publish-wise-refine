import { HashNodeApiClient } from "@/api/hashnode";
import { HashNodeArticleInput } from "@/api/hashnode/types";
import { hashNodePostPayloadSchema } from "@/app/dashboard/blog/[blogId]/constants";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "@/lib/exceptions";
import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsedBody = hashNodePostPayloadSchema.safeParse(body);

    if (!parsedBody.success) {
      return BAD_REQUEST("Invalid request body");
    }

    const { blogId, tags, apiKey, coverImagePath, type, slug, subtitle, username } =
      parsedBody.data;

    if (!apiKey || !username) {
      return UNAUTHORIZED("Your HashNode account is not connected with PublishWise");
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

    const client = new HashNodeApiClient(apiKey);

    const articleInput: HashNodeArticleInput = {
      title: blogQuery.data.title,
      coverImageURL: coverImagePath
        ? supabase.storage.from("blog-covers").getPublicUrl(coverImagePath).data.publicUrl
        : null,
      contentMarkdown: blogQuery.data.contentMarkdown || "",
      isRepublished: blogQuery.data.canonicalUrl
        ? { originalArticleURL: blogQuery.data.canonicalUrl }
        : undefined,
      tags,
      slug,
      subtitle,
    };

    let postId, postUrl;

    console.log({ type });

    if (type === "PUBLISH") {
      const { id, url } = await client.publish(username, articleInput);
      postId = id;
      postUrl = url;
    } else {
      if (!blogQuery.data.devToPostId || blogQuery.data.status !== "PUBLISHED") {
        return NextResponse.json(
          { message: "Your blog has not been posted on HashNode yet" },
          { status: 403 }
        );
      }
      const { id, url } = await client.republish(
        blogQuery.data.devToPostId,
        username,
        articleInput
      );
      postId = id;
      postUrl = url;
    }

    const publishingDetailsUpdate = await supabase.from("blog_publishing_details").upsert(
      {
        blogId: blogQuery.data.id,
        hashNodeCoverImagePath: coverImagePath,
        hashNodeSlug: slug,
        hashNodeSubtitle: subtitle,
        hashNodeTags: tags,
      },
      { onConflict: "blogId" }
    );

    if (publishingDetailsUpdate.error) {
      return NextResponse.json({ message: publishingDetailsUpdate.error.message }, { status: 500 });
    }

    const blogUpdate = await supabase
      .from("blogs")
      .update({
        hashNodePostId: postId,
        hashNodePostUrl: postUrl,
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
      message: `Successfully ${type === "PUBLISH" ? "published" : "republished"} on HashNode`,
    });
  } catch (err: any) {
    if (err.status === 404) {
      return NextResponse.json(
        {
          message: "Your HashNode account is not connected with PublishWise",
        },
        { status: 401 }
      );
    } else {
      return NextResponse.json({ message: err.message || err.toString() }, { status: 500 });
    }
  }
}
