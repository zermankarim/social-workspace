import { Injectable } from '@nestjs/common';
import { ProfileViewsRepository } from '../repositories/profile-views.repository';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class ProfileViewsService {
  constructor(
    private readonly profileViewsRepository: ProfileViewsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async recordView(viewerId: string, profileId: string): Promise<void> {
    if (viewerId === profileId) return;

    const { created } = await this.profileViewsRepository.recordView(
      viewerId,
      profileId,
    );

    if (created) {
      await this.notificationsService.notifyProfileView(viewerId, profileId);
    }
  }

  getViewersCount(profileId: string): Promise<number> {
    return this.profileViewsRepository.countViewers(profileId);
  }
}
