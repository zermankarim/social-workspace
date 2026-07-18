import type { ProfileViewRepository } from "@/core/domain/repositories/profile-view.repository";

export class ProfileViewService {
  constructor(private readonly profileViewRepository: ProfileViewRepository) {}

  recordView(profileId: string): Promise<void> {
    return this.profileViewRepository.recordView(profileId);
  }

  getMyViewersCount(): Promise<number> {
    return this.profileViewRepository.getMyViewersCount();
  }
}
