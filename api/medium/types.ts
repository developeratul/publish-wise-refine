export interface MediumUser {
  id: string;
  username: string;
  name: string;
  url: string;
  imageUrl: string;
}

export interface MediumArticleInput {
  title: string;
  contentFormat: "html" | "markdown";
  content: string;
  tags: string[];
  canonicalUrl?: string;
  publishStatus: "public" | "draft" | "unlisted";
}

export interface MediumPublishResponse {
  id: string;
  url: string;
}
