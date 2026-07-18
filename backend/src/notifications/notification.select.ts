import { Prisma } from '@prisma/client';

export const notificationSelect = {
  id: true,
  type: true,
  read: true,
  createdAt: true,
  actor: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      headline: true,
      role: true,
    },
  },
  post: {
    select: {
      id: true,
      textContent: true,
    },
  },
} as const satisfies Prisma.NotificationSelect;

export type NotificationSelected = Prisma.NotificationGetPayload<{
  select: typeof notificationSelect;
}>;
