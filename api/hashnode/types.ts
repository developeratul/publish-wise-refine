export interface HashNodeTag {
  _id: string;
  slug: string;
  name: string;
}

export interface HashnodeUser {
  _id: string;
  username: string;
  name: string;
  photo: string;
  publication: {
    _id: string;
    domain: string | null;
  };
}

export interface HashNodeArticleInput {
  title: string;
  contentMarkdown: string;
  subtitle?: string;
  slug: string;
  tags: Omit<HashNodeTag, "slug" | "name">[];
  isRepublished?: { originalArticleURL: string };
}

export type RepublishHashNodeArticleInput = Omit<HashNodeArticleInput, "isRepublished">;
