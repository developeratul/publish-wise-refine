import { BlogUser, PublishBlogResponse } from "@/types";
import Axios, { AxiosInstance } from "axios";
import { MediumArticleInput, MediumPublishResponse, MediumUser } from "./types";

export class MediumApiClient {
  private _apiKey: string;
  public axios: AxiosInstance;

  constructor(_apiKey: string) {
    this._apiKey = _apiKey;
    this.axios = Axios.create({
      baseURL: "https://api.medium.com/v1",
      headers: {
        Authorization: `Bearer ${this._apiKey}`,
        accept: "application/json",
      },
    });
  }

  public async publish(input: MediumArticleInput): Promise<PublishBlogResponse> {
    const user = await this.getAuthUser();
    const {
      data: { data },
    } = await this.axios.post<{ data: MediumPublishResponse }>(`/users/${user.id}/posts`, input);
    const { id, url } = data;
    return { id, url };
  }

  public async getAuthUser(): Promise<BlogUser> {
    const { data } = await this.axios.get<{ data: MediumUser }>("/me");
    const { id, name, username, imageUrl } = data.data;
    return { id, name, username, avatarUrl: imageUrl };
  }
}
