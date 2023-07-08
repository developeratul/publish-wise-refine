// TODO: Finish this endpoint to publish articles
export async function POST(req: Request) {
  const {
    apiKeys,
  }: {
    apiKeys: {
      "dev.to": string;
      hashNode: string;
      medium: string;
    };
  } = await req.json();
}
