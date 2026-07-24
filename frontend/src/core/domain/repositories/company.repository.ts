import type { Company } from "@/core/domain/entities/company.entity";

export abstract class CompanyRepository {
  abstract findByName(name: string): Promise<Company>;
}
