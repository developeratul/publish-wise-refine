import Axios, { AxiosInstance } from "axios";
import { DevToPublishArticleFields, DevToUser } from "./types";

export class DevToApiClient {
  private _apiKey: string;
  public axios: AxiosInstance;

  constructor(_apiKey: string) {
    this._apiKey = _apiKey;
    this.axios = Axios.create({
      baseURL: "http://dev.to/api",
      headers: {
        "api-key": this._apiKey,
        accept: "application/vnd.forem.api-v1+json",
      },
    });
  }

  public async publish(article: DevToPublishArticleFields) {
    const {} = await this.axios.post("/articles", {
      article,
    });
  }

  public async getAuthUser() {
    const { id, name, profile_image, username } = (await this.axios.post<DevToUser>("/users/me"))
      .data;
    return { id, name, profile_image, username };
  }
}
