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
  };
}

export interface HashNodeArticleInput {
  title: string;
  contentMarkdown: string;
  subtitle?: string;
  tags: HashNodeTag[];
  isRepublished?: { originalArticleURL: string };
  isPartOfPublication: { publicationId: string };
}
