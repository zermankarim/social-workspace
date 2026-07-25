import type { JobPoster } from "@/core/domain/entities/job-poster.entity";
import type { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import type { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";

export type JobExperienceLevel =
  "NO_EXPERIENCE" | "JUNIOR" | "MIDDLE" | "SENIOR" | "LEAD";

export class JobCompany {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly logoUrl: string | null,
  ) {}
}

export class Job {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly companyName: string,
    public readonly company: JobCompany | null,
    public readonly location: string | null,
    public readonly description: string,
    public readonly applyUrl: string | null,
    public readonly employmentType: EmploymentType | null,
    public readonly workplaceType: WorkplaceType | null,
    public readonly experienceLevel: JobExperienceLevel | null,
    public readonly applicationsCount: number,
    public readonly poster: JobPoster,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isPostedBy(userId: string): boolean {
    return this.poster.id === userId;
  }
}
