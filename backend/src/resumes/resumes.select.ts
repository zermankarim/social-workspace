import { Prisma } from '@prisma/client';

export const resumeSelect = {
  id: true,
  fileName: true,
  fileUrl: true,
  sizeBytes: true,
  uploadedAt: true,
} as const satisfies Prisma.ResumeSelect;

export type ResumeSelected = Prisma.ResumeGetPayload<{
  select: typeof resumeSelect;
}>;
