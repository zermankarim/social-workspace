import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyEmployeeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  headline: string | null;

  @ApiProperty({ description: 'Their job title at this company' })
  title: string;

  @ApiProperty()
  isCurrent: boolean;
}

export class CompanyResponseDto {
  @ApiProperty({ example: 'Acme Inc.' })
  name: string;

  @ApiProperty({ example: 12 })
  employeesCount: number;

  @ApiProperty({ example: 4 })
  currentEmployeesCount: number;

  @ApiProperty({
    type: [CompanyEmployeeDto],
    description: 'Current employees first, then most recently departed.',
  })
  employees: CompanyEmployeeDto[];
}
