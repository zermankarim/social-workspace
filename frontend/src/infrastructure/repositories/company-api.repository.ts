import type { Company } from "@/core/domain/entities/company.entity";
import { CompanyRepository } from "@/core/domain/repositories/company.repository";
import type { CompanyResponseDto } from "@/infrastructure/api/dto/company-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { CompanyMapper } from "@/infrastructure/mappers/company.mapper";

export class CompanyApiRepository extends CompanyRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async findByName(name: string): Promise<Company> {
    const response = await this.httpClient.request<CompanyResponseDto>(
      `/companies/${encodeURIComponent(name)}`,
    );
    return CompanyMapper.fromApi(response);
  }
}
