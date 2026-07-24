import type { CompanyEmployee } from "@/core/domain/entities/company-employee.entity";

export class Company {
  constructor(
    public readonly name: string,
    public readonly employeesCount: number,
    public readonly currentEmployeesCount: number,
    public readonly employees: CompanyEmployee[],
  ) {}
}
