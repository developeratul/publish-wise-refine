import { HashNodeApiClient } from "@/api/hashnode";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { apiKey } = await req.json();

  const client = new HashNodeApiClient(apiKey);

  const { tags } = await client.getAvailableTags();

  return NextResponse.json({ tags });
}
