import { BlogUser } from "@/types";
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

  public async publish(input: HashNodeArticleInput) {
    interface Response {
      message: string;
    }
    const { data } = await this.axios.post<Response>("/", {
      query: `
        mutation PublishBlog($input: CreateStoryInput!) {
          createStory(input: $input) {
            message
          }
        }
      `,
      variables: { input },
    });
    return data;
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
      publication: { _id: string };
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
