import { BlogUser, PublishBlogResponse } from "@/types";
import Axios, { AxiosInstance } from "axios";
import {
  HashNodeArticleInput,
  HashNodeTag,
  HashnodeUser,
  RepublishHashNodeArticleInput,
} from "./types";

export class HashNodeApiClient {
  private _apiKey: string;
  public axios: AxiosInstance;

  constructor(_apiKey: string) {
    this._apiKey = _apiKey;
    this.axios = Axios.create({
      baseURL: "http://api.hashnode.com",
      headers: {
        Authorization: this._apiKey,
        accept: "application/json",
      },
    });
  }

  public async publish(
    username: string,
    input: HashNodeArticleInput
  ): Promise<PublishBlogResponse> {
    // type Response = {
    //   data: {
    //     createStory: {
    //       message: string;
    //       post: {
    //         slug: string;
    //         author: {
    //           username: string;
    //         };
    //         publication: {
    //           domain: string;
    //         };
    //       };
    //     };
    //   };
    // };

    const { publication } = await this.getAuthUser(username);

    if (!publication) throw new Error("You don't have any blog created on HashNode");

    const { data } = await this.axios.post<any>("/", {
      query: `
        mutation PublishBlog($input: CreateStoryInput!) {
          createStory(input: $input) {
            post {
              _id
         			slug
              author {
                username
              }
              publication {
                domain
              }
            }
          }
        }
      `,
      variables: { input: { ...input, isPartOfPublication: { publicationId: publication._id } } },
    });

    if (data.errors?.length) {
      throw new Error(data.errors[0].message);
    }

    const {
      data: {
        createStory: { post },
      },
    } = data;

    const articleUrl = await this.getArticleUrl(post.author.username, post.slug);

    return { url: articleUrl, id: post._id };
  }

  public async republish(postId: string, username: string, input: RepublishHashNodeArticleInput) {
    const { publication } = await this.getAuthUser(username);

    if (!publication) throw new Error("You don't have any blog created on HashNode");

    const { data } = await this.axios.post<any>("/", {
      query: `
        mutation UpdateStory($postId: String!, $input: UpdateStoryInput!) {
          updateStory(postId: $postId, input: $input) {
            post {
              _id
              slug
              author {
                username
              }
              publication {
                domain
              }
            }
          }
        }
      `,
      variables: {
        postId,
        input: { ...input, isPartOfPublication: { publicationId: publication._id } },
      },
    });

    if (data.errors?.length) {
      throw new Error(data.errors[0].message);
    }

    const {
      data: {
        updateStory: { post },
      },
    } = data;

    const articleUrl = await this.getArticleUrl(post.author.username, post.slug);

    return { url: articleUrl, id: post._id };
  }

  public async getArticleUrl(username: string, slug: string) {
    const {
      publication: { domain },
    } = await this.getAuthUser(username);
    let blogDomain = domain ? domain : `${username}.hashnode.dev`;
    return `http://${blogDomain}/${slug}`;
  }

  public async getAvailableTags(): Promise<{ tags: HashNodeTag[] }> {
    const {
      data: {
        data: { tagCategories },
      },
    } = await this.axios.post<{ data: { tagCategories: HashNodeTag[] } }>("/", {
      query: `
        query Tags {
          tagCategories {
            _id
            name
            slug
          }
        }
      `,
    });

    return { tags: tagCategories };
  }

  public async getAuthUser(hashNodeUsername: string): Promise<
    BlogUser & {
      publication: { _id: string; domain: string | null };
    }
  > {
    const {
      data: {
        data: { user },
      },
    } = await this.axios.post<{ data: { user: HashnodeUser } }>("/", {
      query: `
        query($username: String!) {
          user(username: $username) {
            _id
            username
            name
            photo
            publication {
              _id
              domain
            }
          }
        }
      `,
      variables: { username: hashNodeUsername },
    });

    if (!user) throw { message: "HashNode user not found", status: 404 };

    const { _id, name, username, photo, publication } = user;

    return {
      id: _id,
      name,
      username,
      avatarUrl: photo,
      publication,
    };
  }
}
