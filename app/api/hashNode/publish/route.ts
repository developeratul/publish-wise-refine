import { HashNodeApiClient } from "@/api/hashnode";
import { HashNodeArticleInput } from "@/api/hashnode/types";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      apiKey,
      username,
      ...articleInput
    }: HashNodeArticleInput & { apiKey: string; username: string } = await req.json();

    const client = new HashNodeApiClient(apiKey);

    const { id, url } = await client.publish(username, {
      ...articleInput,
    });

    return NextResponse.json({ id, url });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return NextResponse.json(
          { message: "Your HashNode account is not connected with PublishWise" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { message: err.response?.data?.errors[0]?.message || err.message },
        { status: err.response?.status || 500 }
      );
    } else if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
}
