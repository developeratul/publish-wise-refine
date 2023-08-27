import { MediumApiClient } from "@/api/medium";
import { MediumArticleInput } from "@/api/medium/types";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { apiKey, ...articleInput }: MediumArticleInput & { apiKey: string } = await req.json();
    const client = new MediumApiClient(apiKey);
    const { id, url } = await client.publish({
      ...articleInput,
      contentFormat: "markdown",
      publishStatus: "public",
    });
    return NextResponse.json({ id, url });
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
