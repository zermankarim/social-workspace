export abstract class ProfileViewRepository {
  abstract recordView(profileId: string): Promise<void>;
  abstract getMyViewersCount(): Promise<number>;
}
