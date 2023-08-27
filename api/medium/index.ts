import { BlogUser, PublishBlogResponse } from "@/types";
import Axios, { AxiosInstance } from "axios";
import { MediumArticleInput, MediumPublishResponse, MediumUser } from "./types";

export class MediumApiClient {
  private _apiKey: string;
  public axios: AxiosInstance;

  constructor(_apiKey: string) {
    this._apiKey = _apiKey;
    this.axios = Axios.create({
      baseURL: "http://api.medium.com/v1",
      headers: {
        Authorization: `Bearer ${this._apiKey}`,
        accept: "application/json",
      },
    });
  }

  public async publish(input: MediumArticleInput): Promise<PublishBlogResponse> {
    const { id: userId } = await this.getAuthUser();
    const {
      data: { id, url },
    } = await this.axios.post<MediumPublishResponse>(`/users/${userId}/posts`, input);
    return { id, url };
  }

  public async getAuthUser(): Promise<BlogUser> {
    const {
      data: { id, name, username, imageUrl },
    } = await this.axios.get<MediumUser>("/me");
    return { id, name, username, avatarUrl: imageUrl };
  }
}
