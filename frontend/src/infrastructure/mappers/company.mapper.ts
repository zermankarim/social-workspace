import { Company } from "@/core/domain/entities/company.entity";
import { CompanyEmployee } from "@/core/domain/entities/company-employee.entity";
import type {
  CompanyEmployeeResponseDto,
  CompanyResponseDto,
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

  static fromApi(dto: CompanyResponseDto): Company {
    return new Company(
      dto.name,
      dto.employeesCount,
      dto.currentEmployeesCount,
      dto.employees.map((employee) => this.employeeFromApi(employee)),
    );
  }
}
