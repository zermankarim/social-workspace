import type { JobApplication } from "@/core/domain/entities/job-application.entity";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

export class PaginatedJobApplications {
  constructor(
    public readonly data: JobApplication[],
    public readonly meta: PaginationMeta,
  ) {}
}
