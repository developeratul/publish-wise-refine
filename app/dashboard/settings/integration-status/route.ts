import { DevToApiClient } from "@/api/dev.to";
import { HashNodeApiClient } from "@/api/hashnode";
import { MediumApiClient } from "@/api/medium";
import { BlogProviders } from "@/types";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { apiKey, provider, hashNodeUsername } = (await req.json()) as {
      apiKey: string;
      provider: BlogProviders;
      hashNodeUsername?: string;
    };

    const clients = {
      "dev.to": new DevToApiClient(apiKey),
      medium: new MediumApiClient(apiKey),
      hashNode: new HashNodeApiClient(apiKey),
    };

    const client = clients[provider];

    const user = await client.getAuthUser(hashNodeUsername as string);

    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status) {
        return NextResponse.json({ message: "Your token is invalid or expired" }, { status: 401 });
      }
      return NextResponse.json({ message: err.message }, { status: err.response?.status });
    } else if (err instanceof Error) {
      console.log(err);
      return NextResponse.json({ message: err.message || err }, { status: 500 });
    }
  }
}
