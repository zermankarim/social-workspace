import type { JobExperienceLevel } from "@/core/domain/entities/job.entity";
import type { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import type { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";

export class CreateJobDto {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly companyId?: string,
    public readonly companyName?: string,
    public readonly location?: string,
    public readonly applyUrl?: string,
    public readonly employmentType?: EmploymentType,
    public readonly workplaceType?: WorkplaceType,
    public readonly experienceLevel?: JobExperienceLevel,
  ) {}
}
