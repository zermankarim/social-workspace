/**
 * Emitted by other feature modules (posts/likes/comments/connections/users) and
 * consumed only by GamificationListener. Kept as events rather than direct
 * GamificationService injection because GamificationModule already imports
 * ConnectionsModule/FollowsModule — direct injection back would cycle (see
 * NotificationsService's NOTIFICATION_CREATED_EVENT for the same pattern).
 */
export const POST_PUBLISHED_EVENT = 'gamification.post_published';
export const POST_LIKE_RECEIVED_EVENT = 'gamification.post_like_received';
export const POST_COMMENT_RECEIVED_EVENT = 'gamification.post_comment_received';
export const CONNECTION_ACCEPTED_EVENT = 'gamification.connection_accepted';
export const SKILL_ENDORSEMENT_RECEIVED_EVENT =
  'gamification.skill_endorsement_received';
export const JOB_APPLICATION_SENT_EVENT = 'gamification.job_application_sent';
export const JOB_APPLICATION_ACCEPTED_EVENT =
  'gamification.job_application_accepted';

export type PostPublishedEvent = { authorId: string; postId: string };
export type PostLikeReceivedEvent = {
  recipientId: string;
  actorId: string;
  postId: string;
};
export type PostCommentReceivedEvent = {
  recipientId: string;
  actorId: string;
  postId: string;
};
export type ConnectionAcceptedEvent = { userIds: [string, string] };
export type SkillEndorsementReceivedEvent = {
  recipientId: string;
  endorserId: string;
};
export type JobApplicationSentEvent = { applicantId: string };
export type JobApplicationAcceptedEvent = { applicantId: string };

export const POST_PUBLISHED_POINTS = 10;
export const POST_LIKE_RECEIVED_POINTS = 2;
export const POST_COMMENT_RECEIVED_POINTS = 3;
export const CONNECTION_ACCEPTED_POINTS = 10;
export const SKILL_ENDORSEMENT_RECEIVED_POINTS = 5;
export const JOB_APPLICATION_SENT_POINTS = 5;
export const JOB_APPLICATION_ACCEPTED_POINTS = 100;
