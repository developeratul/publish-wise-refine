import { DevToApiClient } from "@/api/dev.to";
import { DevToArticleInput } from "@/api/dev.to/types";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      title,
      body_markdown,
      canonical_url,
      tags,
      apiKey,
    }: DevToArticleInput & { apiKey: string } = await req.json();

    const client = new DevToApiClient(apiKey);

    const { url } = await client.publish({
      title,
      body_markdown,
      canonical_url,
      tags,
      published: true,
    });

    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return NextResponse.json(
          { message: "Your Dev.to account is not connected with PublishWise" },
          { status: 401 }
        );
      }
      return NextResponse.json({ message: err.message }, { status: err.response?.status || 500 });
    }
  }
}
