import type { Company } from "@/core/domain/entities/company.entity";
import type { CompanyRepository } from "@/core/domain/repositories/company.repository";

export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  getByName(name: string): Promise<Company> {
    return this.companyRepository.findByName(name);
  }
}
