import { BlogUser, PublishBlogResponse } from "@/types";
import Axios, { AxiosInstance } from "axios";
import { MediumUser } from "./types";

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

  public async publish(): Promise<PublishBlogResponse> {
    return { url: "", id: "" };
  }

  public async getAuthUser(): Promise<BlogUser> {
    const {
      data: { id, name, username, imageUrl },
    } = await this.axios.get<MediumUser>("/me");
    return { id, name, username, avatarUrl: imageUrl };
  }
}
