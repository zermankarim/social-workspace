import type {
  Company,
  CompanySize,
} from "@/core/domain/entities/company.entity";
import type { CompanyOffering } from "@/core/domain/entities/company-offering.entity";
import type { PaginatedCompanies } from "@/core/domain/entities/paginated-companies.entity";

export type CreateCompanyInput = {
  name: string;
  tagline?: string;
  description?: string;
  industry?: string;
  size?: CompanySize;
  foundedYear?: number;
  websiteUrl?: string;
  headquarters?: string;
  logoUrl?: string;
  coverUrl?: string;
};

export type UpdateCompanyInput = Partial<Omit<CreateCompanyInput, "name">>;

export abstract class CompanyRepository {
  abstract findByName(name: string): Promise<Company>;
  abstract findById(id: string): Promise<Company>;
  abstract create(input: CreateCompanyInput): Promise<Company>;
  abstract update(id: string, input: UpdateCompanyInput): Promise<Company>;
  abstract search(
    q: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedCompanies>;
  abstract addService(
    companyId: string,
    name: string,
    description?: string,
  ): Promise<CompanyOffering>;
  abstract removeService(companyId: string, serviceId: string): Promise<void>;
  abstract addAdmin(companyId: string, userId: string): Promise<void>;
  abstract removeAdmin(companyId: string, userId: string): Promise<void>;
  abstract follow(companyId: string): Promise<void>;
  abstract unfollow(companyId: string): Promise<void>;
}
