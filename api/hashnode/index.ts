import { BlogUser } from "@/types";
import Axios, { AxiosInstance } from "axios";
import { HashnodeUser } from "./types";

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

  // public async publish(article) {
  //   const {} = await this.axios.post("/articles", {
  //     article,
  //   });
  // }

  public async getAuthUser(hashNodeUsername: string): Promise<BlogUser> {
    const {
      data: {
        data: {
          user: { _id, name, username, photo },
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
    };
  }
}
