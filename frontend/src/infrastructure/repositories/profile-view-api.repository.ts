import { ProfileViewRepository } from "@/core/domain/repositories/profile-view.repository";
import type { HttpClient } from "@/infrastructure/http/http-client";

export class ProfileViewApiRepository extends ProfileViewRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async recordView(profileId: string): Promise<void> {
    await this.httpClient.request<void>(`/profile-views/${profileId}`, {
      method: "POST",
    });
  }

  async getMyViewersCount(): Promise<number> {
    const response = await this.httpClient.request<{ count: number }>(
      `/profile-views/count`,
    );
    return response.count;
  }
}
