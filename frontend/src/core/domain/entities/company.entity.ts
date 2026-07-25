import type { CompanyAdmin } from "@/core/domain/entities/company-admin.entity";
import type { CompanyEmployee } from "@/core/domain/entities/company-employee.entity";
import type { CompanyOffering } from "@/core/domain/entities/company-offering.entity";

export type CompanySize =
  | "SIZE_1_10"
  | "SIZE_11_50"
  | "SIZE_51_200"
  | "SIZE_201_500"
  | "SIZE_501_1000"
  | "SIZE_1000_PLUS";

export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly tagline: string | null,
    public readonly description: string | null,
    public readonly industry: string | null,
    public readonly size: CompanySize | null,
    public readonly foundedYear: number | null,
    public readonly websiteUrl: string | null,
    public readonly headquarters: string | null,
    public readonly logoUrl: string | null,
    public readonly coverUrl: string | null,
    public readonly employeesCount: number,
    public readonly currentEmployeesCount: number,
    public readonly jobsCount: number,
    public readonly employees: CompanyEmployee[],
    public readonly services: CompanyOffering[],
    public readonly admins: CompanyAdmin[],
    public readonly isViewerAdmin: boolean,
    public readonly followersCount: number,
    public readonly isViewerFollowing: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get initials(): string {
    return this.name.slice(0, 2).toUpperCase();
  }
}
