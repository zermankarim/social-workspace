import type { Company } from "@/core/domain/entities/company.entity";
import type { CompanyOffering } from "@/core/domain/entities/company-offering.entity";
import type { PaginatedCompanies } from "@/core/domain/entities/paginated-companies.entity";
import type {
  CompanyRepository,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "@/core/domain/repositories/company.repository";

export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  getByName(name: string): Promise<Company> {
    return this.companyRepository.findByName(name);
  }

  getById(id: string): Promise<Company> {
    return this.companyRepository.findById(id);
  }

  create(input: CreateCompanyInput): Promise<Company> {
    return this.companyRepository.create(input);
  }

  update(id: string, input: UpdateCompanyInput): Promise<Company> {
    return this.companyRepository.update(id, input);
  }

  search(q: string, page = 1, limit = 20): Promise<PaginatedCompanies> {
    return this.companyRepository.search(q, page, limit);
  }

  addService(
    companyId: string,
    name: string,
    description?: string,
  ): Promise<CompanyOffering> {
    return this.companyRepository.addService(companyId, name, description);
  }

  removeService(companyId: string, serviceId: string): Promise<void> {
    return this.companyRepository.removeService(companyId, serviceId);
  }

  addAdmin(companyId: string, userId: string): Promise<void> {
    return this.companyRepository.addAdmin(companyId, userId);
  }

  removeAdmin(companyId: string, userId: string): Promise<void> {
    return this.companyRepository.removeAdmin(companyId, userId);
  }

  follow(companyId: string): Promise<void> {
    return this.companyRepository.follow(companyId);
  }

  unfollow(companyId: string): Promise<void> {
    return this.companyRepository.unfollow(companyId);
  }
}
