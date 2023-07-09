import { BlogUser, PublishBlogResponse } from "@/types";
import Axios, { AxiosInstance } from "axios";
import { HashNodeArticleInput, HashNodeTag, HashnodeUser } from "./types";

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
    interface Response {
      data: {
        createStory: {
          message: string;
          post: {
            slug: string;
            author: {
              username: string;
            };
            publication: {
              domain: string;
            };
          };
        };
      };
    }
    const { publication } = await this.getAuthUser(username);
    const {
      data: {
        data: { createStory: data },
      },
    } = await this.axios.post<Response>("/", {
      query: `
        mutation PublishBlog($input: CreateStoryInput!) {
          createStory(input: $input) {
            post {
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
    const articleUrl = await this.getArticleUrl(data.post.author.username, data.post.slug);
    return { url: articleUrl };
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
        data: {
          user: { _id, name, username, photo, publication },
        },
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
    return {
      id: _id,
      name,
      username,
      avatarUrl: photo,
      publication,
    };
  }
}
