import { CompanyEmployeeDto, CompanyResponseDto } from '../dto/company.dto';
import { CompanyEmployeeSelected } from '../companies.select';

const DISPLAY_LIMIT = 50;

export class CompaniesMapper {
  static toCompanyResponseDto(
    name: string,
    employees: CompanyEmployeeSelected[],
  ): CompanyResponseDto {
    const currentEmployeesCount = employees.filter(
      (employee) => employee.endDate === null,
    ).length;

    return {
      name,
      employeesCount: employees.length,
      currentEmployeesCount,
      employees: employees
        .slice(0, DISPLAY_LIMIT)
        .map((employee) => this.toEmployeeDto(employee)),
    };
  }

  private static toEmployeeDto(
    employee: CompanyEmployeeSelected,
  ): CompanyEmployeeDto {
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
}
