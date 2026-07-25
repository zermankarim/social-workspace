import {
  CompanyAdminDto,
  CompanyEmployeeDto,
  CompanyResponseDto,
  CompanyServiceResponseDto,
  CompanySummaryDto,
} from '../dto/company.dto';
import {
  CompanyAdminSelected,
  CompanyEmployeeSelected,
  CompanySelected,
  CompanyServiceSelected,
  CompanySummarySelected,
} from '../companies.select';

const DISPLAY_LIMIT = 50;

export class CompaniesMapper {
  static toEmployeeDto(employee: CompanyEmployeeSelected): CompanyEmployeeDto {
    return {
      id: employee.user.id,
      firstName: employee.user.firstName,
      lastName: employee.user.lastName,
      avatarUrl: employee.user.avatarUrl,
      headline: employee.user.headline,
      title: employee.title,
      isCurrent: employee.endDate === null,
    };
  }

  static toAdminDto(admin: CompanyAdminSelected): CompanyAdminDto {
    return {
      userId: admin.user.id,
      firstName: admin.user.firstName,
      lastName: admin.user.lastName,
      avatarUrl: admin.user.avatarUrl,
      headline: admin.user.headline,
      role: admin.role,
    };
  }

  static toServiceDto(
    service: CompanyServiceSelected,
  ): CompanyServiceResponseDto {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      createdAt: service.createdAt,
    };
  }

  static toSummaryDto(company: CompanySummarySelected): CompanySummaryDto {
    return {
      id: company.id,
      name: company.name,
      logoUrl: company.logoUrl,
      industry: company.industry,
    };
  }

  static toCompanyResponseDto(
    company: CompanySelected,
    context: {
      employees: CompanyEmployeeSelected[];
      services: CompanyServiceSelected[];
      admins: CompanyAdminSelected[];
      jobsCount: number;
      isViewerAdmin: boolean;
      followersCount: number;
      isViewerFollowing: boolean;
    },
  ): CompanyResponseDto {
    return {
      id: company.id,
      name: company.name,
      tagline: company.tagline,
      description: company.description,
      industry: company.industry,
      size: company.size,
      foundedYear: company.foundedYear,
      websiteUrl: company.websiteUrl,
      headquarters: company.headquarters,
      logoUrl: company.logoUrl,
      coverUrl: company.coverUrl,
      employeesCount: context.employees.length,
      currentEmployeesCount: context.employees.filter(
        (employee) => employee.endDate === null,
      ).length,
      jobsCount: context.jobsCount,
      employees: context.employees
        .slice(0, DISPLAY_LIMIT)
        .map((employee) => this.toEmployeeDto(employee)),
      services: context.services.map((service) => this.toServiceDto(service)),
      admins: context.admins.map((admin) => this.toAdminDto(admin)),
      isViewerAdmin: context.isViewerAdmin,
      followersCount: context.followersCount,
      isViewerFollowing: context.isViewerFollowing,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
