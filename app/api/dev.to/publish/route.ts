import { DevToApiClient } from "@/api/dev.to";
import { DevToArticleInput } from "@/api/dev.to/types";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { apiKey, ...articleInputs }: DevToArticleInput & { apiKey: string } = await req.json();

    const client = new DevToApiClient(apiKey);

    const { id, url } = await client.publish({
      ...articleInputs,
      published: true,
    });

    return NextResponse.json({ id, url });
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
