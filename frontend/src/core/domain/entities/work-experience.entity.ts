import type { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import type { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";

export class WorkExperience {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly employmentType: EmploymentType,
    public readonly companyName: string,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly workplaceType: WorkplaceType,
    public readonly description: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get isCurrent(): boolean {
    return this.endDate === null;
  }
}
