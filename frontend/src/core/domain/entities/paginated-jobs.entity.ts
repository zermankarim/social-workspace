import type { Job } from "@/core/domain/entities/job.entity";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

export class PaginatedJobs {
  constructor(
    public readonly data: Job[],
    public readonly meta: PaginationMeta,
  ) {}
}
