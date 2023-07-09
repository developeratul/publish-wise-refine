import { BlogUser, PublishBlogResponse } from "@/types";
import Axios, { AxiosInstance } from "axios";
import { DevToArticleInput, DevToUser } from "./types";

export class DevToApiClient {
  private _apiKey: string;
  public axios: AxiosInstance;

  constructor(_apiKey: string) {
    this._apiKey = _apiKey;
    this.axios = Axios.create({
      baseURL: "https://dev.to/api",
      headers: {
        "api-key": this._apiKey,
        accept: "application/vnd.forem.api-v1+json",
      },
    });
  }

  public async publish(article: DevToArticleInput): Promise<PublishBlogResponse> {
    interface Response {
      url: string;
    }
    const { data } = await this.axios.post<Response>("/articles", {
      article,
    });
    return { url: data.url };
  }

  public async getAuthUser(): Promise<BlogUser> {
    const { id, name, profile_image, username } = (await this.axios.get<DevToUser>("/users/me"))
      .data;
    return { id: id.toString(), username, name, avatarUrl: profile_image };
  }
}
