import type { Company } from "@/core/domain/entities/company.entity";
import type { CompanyOffering } from "@/core/domain/entities/company-offering.entity";
import type { PaginatedCompanies } from "@/core/domain/entities/paginated-companies.entity";
import {
  CompanyRepository,
  type CreateCompanyInput,
  type UpdateCompanyInput,
} from "@/core/domain/repositories/company.repository";
import type {
  CompanyResponseDto,
  CompanyServiceResponseDto,
  CreateCompanyRequestDto,
  PaginatedCompaniesResponseDto,
  UpdateCompanyRequestDto,
} from "@/infrastructure/api/dto/company-response.dto";
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

  async findById(id: string): Promise<Company> {
    const response = await this.httpClient.request<CompanyResponseDto>(
      `/companies/${id}`,
    );
    return CompanyMapper.fromApi(response);
  }

  async create(input: CreateCompanyInput): Promise<Company> {
    const body: CreateCompanyRequestDto = input;
    const response = await this.httpClient.request<CompanyResponseDto>(
      "/companies",
      { method: "POST", body },
    );
    return CompanyMapper.fromApi(response);
  }

  async update(id: string, input: UpdateCompanyInput): Promise<Company> {
    const body: UpdateCompanyRequestDto = input;
    const response = await this.httpClient.request<CompanyResponseDto>(
      `/companies/${id}`,
      { method: "PATCH", body },
    );
    return CompanyMapper.fromApi(response);
  }

  async search(q: string, page = 1, limit = 20): Promise<PaginatedCompanies> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (q.trim()) params.set("q", q.trim());
    const response =
      await this.httpClient.request<PaginatedCompaniesResponseDto>(
        `/companies/search?${params.toString()}`,
      );
    return CompanyMapper.paginatedFromApi(response);
  }

  async addService(
    companyId: string,
    name: string,
    description?: string,
  ): Promise<CompanyOffering> {
    const response = await this.httpClient.request<CompanyServiceResponseDto>(
      `/companies/${companyId}/services`,
      { method: "POST", body: { name, description } },
    );
    return CompanyMapper.serviceFromApi(response);
  }

  async removeService(companyId: string, serviceId: string): Promise<void> {
    await this.httpClient.request<void>(
      `/companies/${companyId}/services/${serviceId}`,
      { method: "DELETE" },
    );
  }

  async addAdmin(companyId: string, userId: string): Promise<void> {
    await this.httpClient.request<void>(`/companies/${companyId}/admins`, {
      method: "POST",
      body: { userId },
    });
  }

  async removeAdmin(companyId: string, userId: string): Promise<void> {
    await this.httpClient.request<void>(
      `/companies/${companyId}/admins/${userId}`,
      { method: "DELETE" },
    );
  }

  async follow(companyId: string): Promise<void> {
    await this.httpClient.request<void>(`/companies/${companyId}/follow`, {
      method: "POST",
    });
  }

  async unfollow(companyId: string): Promise<void> {
    await this.httpClient.request<void>(`/companies/${companyId}/follow`, {
      method: "DELETE",
    });
  }
}
