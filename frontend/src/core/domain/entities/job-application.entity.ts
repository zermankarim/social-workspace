export type JobApplicationStatus =
  "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export class JobApplicationApplicant {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatarUrl: string | null,
    public readonly headline: string | null,
  ) {}

  get displayName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    return `${this.firstName[0] ?? ""}${this.lastName[0] ?? ""}`.toUpperCase();
  }
}

export class JobApplicationJob {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly companyName: string,
    public readonly companyLogoUrl: string | null,
  ) {}
}

export class JobApplicationResume {
  constructor(
    public readonly id: string,
    public readonly fileName: string,
    public readonly fileUrl: string,
  ) {}
}

export class JobApplication {
  constructor(
    public readonly id: string,
    public readonly status: JobApplicationStatus,
    public readonly contactEmail: string | null,
    public readonly contactPhone: string | null,
    public readonly coverNote: string | null,
    public readonly decisionReason: string | null,
    public readonly decidedAt: Date | null,
    public readonly applicant: JobApplicationApplicant,
    public readonly job: JobApplicationJob,
    public readonly resume: JobApplicationResume | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
