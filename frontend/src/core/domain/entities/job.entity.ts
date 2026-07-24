import type { JobPoster } from "@/core/domain/entities/job-poster.entity";

export class Job {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly companyName: string,
    public readonly location: string | null,
    public readonly description: string,
    public readonly applyUrl: string,
    public readonly poster: JobPoster,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isPostedBy(userId: string): boolean {
    return this.poster.id === userId;
  }
}
