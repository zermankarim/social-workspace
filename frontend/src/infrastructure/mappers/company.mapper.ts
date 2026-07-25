import { Company, CompanySize } from "@/core/domain/entities/company.entity";
import { CompanyAdmin } from "@/core/domain/entities/company-admin.entity";
import { CompanyEmployee } from "@/core/domain/entities/company-employee.entity";
import { CompanyOffering } from "@/core/domain/entities/company-offering.entity";
import { CompanySummary } from "@/core/domain/entities/company-summary.entity";
import { PaginatedCompanies } from "@/core/domain/entities/paginated-companies.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type {
  CompanyAdminResponseDto,
  CompanyEmployeeResponseDto,
  CompanyResponseDto,
  CompanyServiceResponseDto,
  CompanySummaryResponseDto,
  PaginatedCompaniesResponseDto,
} from "@/infrastructure/api/dto/company-response.dto";

export class CompanyMapper {
  static employeeFromApi(dto: CompanyEmployeeResponseDto): CompanyEmployee {
    return new CompanyEmployee(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.avatarUrl,
      dto.headline,
      dto.title,
      dto.isCurrent,
    );
  }

  static adminFromApi(dto: CompanyAdminResponseDto): CompanyAdmin {
    return new CompanyAdmin(
      dto.userId,
      dto.firstName,
      dto.lastName,
      dto.avatarUrl,
      dto.headline,
      dto.role,
    );
  }

  static serviceFromApi(dto: CompanyServiceResponseDto): CompanyOffering {
    return new CompanyOffering(
      dto.id,
      dto.name,
      dto.description,
      new Date(dto.createdAt),
    );
  }

  static summaryFromApi(dto: CompanySummaryResponseDto): CompanySummary {
    return new CompanySummary(dto.id, dto.name, dto.logoUrl, dto.industry);
  }

  static fromApi(dto: CompanyResponseDto): Company {
    return new Company(
      dto.id,
      dto.name,
      dto.tagline,
      dto.description,
      dto.industry,
      (dto.size as CompanySize | null) ?? null,
      dto.foundedYear,
      dto.websiteUrl,
      dto.headquarters,
      dto.logoUrl,
      dto.coverUrl,
      dto.employeesCount,
      dto.currentEmployeesCount,
      dto.jobsCount,
      dto.employees.map((employee) => this.employeeFromApi(employee)),
      dto.services.map((service) => this.serviceFromApi(service)),
      dto.admins.map((admin) => this.adminFromApi(admin)),
      dto.isViewerAdmin,
      dto.followersCount,
      dto.isViewerFollowing,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }

  static paginatedFromApi(
    dto: PaginatedCompaniesResponseDto,
  ): PaginatedCompanies {
    return new PaginatedCompanies(
      dto.data.map((item) => this.summaryFromApi(item)),
      new PaginationMeta(
        dto.meta.page,
        dto.meta.limit,
        dto.meta.total,
        dto.meta.totalPages,
        dto.meta.hasNextPage,
        dto.meta.hasPrevPage,
      ),
    );
  }
}
