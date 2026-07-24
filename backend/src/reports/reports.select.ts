import { Prisma } from '@prisma/client';

export const reportSelect = {
  id: true,
  reporterId: true,
  targetType: true,
  targetId: true,
  reason: true,
  status: true,
  createdAt: true,
  resolvedAt: true,
} as const satisfies Prisma.ReportSelect;

export type ReportSelected = Prisma.ReportGetPayload<{
  select: typeof reportSelect;
}>;
