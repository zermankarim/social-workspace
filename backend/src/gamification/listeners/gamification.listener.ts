import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GamificationService } from '../services/gamification.service';
import {
  CONNECTION_ACCEPTED_EVENT,
  CONNECTION_ACCEPTED_POINTS,
  POST_COMMENT_RECEIVED_EVENT,
  POST_COMMENT_RECEIVED_POINTS,
  POST_LIKE_RECEIVED_EVENT,
  POST_LIKE_RECEIVED_POINTS,
  POST_PUBLISHED_EVENT,
  POST_PUBLISHED_POINTS,
  SKILL_ENDORSEMENT_RECEIVED_EVENT,
  SKILL_ENDORSEMENT_RECEIVED_POINTS,
} from '../events/gamification.events';
import type {
  ConnectionAcceptedEvent,
  PostCommentReceivedEvent,
  PostLikeReceivedEvent,
  PostPublishedEvent,
  SkillEndorsementReceivedEvent,
} from '../events/gamification.events';

/** Reacts to activity events emitted by posts/likes/comments/connections/users — kept event-driven to avoid those modules depending back on GamificationModule. */
@Injectable()
export class GamificationListener {
  private readonly logger = new Logger(GamificationListener.name);

  constructor(private readonly gamificationService: GamificationService) {}

  @OnEvent(POST_PUBLISHED_EVENT)
  async onPostPublished(event: PostPublishedEvent): Promise<void> {
    await this.safeAward(
      event.authorId,
      POST_PUBLISHED_POINTS,
      'post-published',
    );
  }

  @OnEvent(POST_LIKE_RECEIVED_EVENT)
  async onPostLikeReceived(event: PostLikeReceivedEvent): Promise<void> {
    if (event.recipientId === event.actorId) return;
    await this.safeAward(
      event.recipientId,
      POST_LIKE_RECEIVED_POINTS,
      'post-like-received',
    );
  }

  @OnEvent(POST_COMMENT_RECEIVED_EVENT)
  async onPostCommentReceived(event: PostCommentReceivedEvent): Promise<void> {
    if (event.recipientId === event.actorId) return;
    await this.safeAward(
      event.recipientId,
      POST_COMMENT_RECEIVED_POINTS,
      'post-comment-received',
    );
  }

  @OnEvent(CONNECTION_ACCEPTED_EVENT)
  async onConnectionAccepted(event: ConnectionAcceptedEvent): Promise<void> {
    await Promise.all(
      event.userIds.map((userId) =>
        this.safeAward(
          userId,
          CONNECTION_ACCEPTED_POINTS,
          'connection-accepted',
        ),
      ),
    );
  }

  @OnEvent(SKILL_ENDORSEMENT_RECEIVED_EVENT)
  async onSkillEndorsementReceived(
    event: SkillEndorsementReceivedEvent,
  ): Promise<void> {
    if (event.recipientId === event.endorserId) return;
    await this.safeAward(
      event.recipientId,
      SKILL_ENDORSEMENT_RECEIVED_POINTS,
      'skill-endorsement-received',
    );
  }

  private async safeAward(
    userId: string,
    amount: number,
    reason: string,
  ): Promise<void> {
    try {
      await this.gamificationService.awardPoints(userId, amount, reason);
    } catch (error) {
      this.logger.warn(
        `Failed to award ${amount}pt (${reason}) to ${userId}: ${String(error)}`,
      );
    }
  }
}
