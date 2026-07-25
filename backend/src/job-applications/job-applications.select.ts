import { Prisma } from '@prisma/client';

const jobApplicantSelect = {
  id: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  headline: true,
} as const satisfies Prisma.UserSelect;

const applicationJobSelect = {
  id: true,
  title: true,
  companyName: true,
  company: { select: { id: true, name: true, logoUrl: true } },
} as const satisfies Prisma.JobSelect;

const applicationResumeSelect = {
  id: true,
  fileName: true,
  fileUrl: true,
} as const satisfies Prisma.ResumeSelect;

export const jobApplicationSelect = {
  id: true,
  jobId: true,
  applicantId: true,
  resumeId: true,
  contactEmail: true,
  contactPhone: true,
  coverNote: true,
  status: true,
  decisionReason: true,
  decidedAt: true,
  decidedByUserId: true,
  createdAt: true,
  updatedAt: true,
  applicant: { select: jobApplicantSelect },
  job: { select: applicationJobSelect },
  resume: { select: applicationResumeSelect },
} as const satisfies Prisma.JobApplicationSelect;

export type JobApplicationSelected = Prisma.JobApplicationGetPayload<{
  select: typeof jobApplicationSelect;
}>;
