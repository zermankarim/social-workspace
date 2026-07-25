import type { CompanySummary } from "@/core/domain/entities/company-summary.entity";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

export class PaginatedCompanies {
  constructor(
    public readonly data: CompanySummary[],
    public readonly meta: PaginationMeta,
  ) {}
}
