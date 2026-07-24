import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  companyEmployeeSelect,
  CompanyEmployeeSelected,
} from '../companies.select';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** One row per distinct user who ever listed this company (their most recent stint). */
  findEmployeesByCompanyName(name: string): Promise<CompanyEmployeeSelected[]> {
    return this.prisma.workExperience.findMany({
      where: { companyName: { equals: name, mode: 'insensitive' } },
      distinct: ['userId'],
      orderBy: [
        { endDate: { sort: 'asc', nulls: 'first' } },
        { startDate: 'desc' },
      ],
      select: companyEmployeeSelect,
    });
  }
}
