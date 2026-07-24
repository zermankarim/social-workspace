export interface CompanyEmployeeResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
  title: string;
  isCurrent: boolean;
}

export interface CompanyResponseDto {
  name: string;
  employeesCount: number;
  currentEmployeesCount: number;
  employees: CompanyEmployeeResponseDto[];
}
