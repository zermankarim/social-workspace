import { Injectable } from '@nestjs/common';
import { CompanyAdminRole, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  companyAdminSelect,
  CompanyAdminSelected,
  companyEmployeeSelect,
  CompanyEmployeeSelected,
  companySelect,
  CompanySelected,
  companyServiceSelect,
  CompanyServiceSelected,
  companySummarySelect,
  CompanySummarySelected,
} from '../companies.select';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/create-company.dto';
import { CreateCompanyServiceDto } from '../dto/company-service.dto';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByName(name: string): Promise<CompanySelected | null> {
    return this.prisma.company.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      select: companySelect,
    });
  }

  findById(id: string): Promise<CompanySelected | null> {
    return this.prisma.company.findUnique({
      where: { id },
      select: companySelect,
    });
  }

  async nameExists(name: string): Promise<boolean> {
    const existing = await this.prisma.company.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      select: { id: true },
    });
    return existing !== null;
  }

  async create(
    ownerId: string,
    dto: CreateCompanyDto,
  ): Promise<CompanySelected> {
    const company = await this.prisma.company.create({
      data: {
        ...dto,
        admins: {
          create: { userId: ownerId, role: CompanyAdminRole.OWNER },
        },
      },
      select: companySelect,
    });
    return company;
  }

  update(id: string, dto: UpdateCompanyDto): Promise<CompanySelected> {
    return this.prisma.company.update({
      where: { id },
      data: dto,
      select: companySelect,
    });
  }

  async isAdmin(companyId: string, userId: string): Promise<boolean> {
    const admin = await this.prisma.companyAdmin.findUnique({
      where: { companyId_userId: { companyId, userId } },
      select: { id: true },
    });
    return admin !== null;
  }

  async isOwner(companyId: string, userId: string): Promise<boolean> {
    const admin = await this.prisma.companyAdmin.findUnique({
      where: { companyId_userId: { companyId, userId } },
      select: { role: true },
    });
    return admin?.role === CompanyAdminRole.OWNER;
  }

  listAdmins(companyId: string): Promise<CompanyAdminSelected[]> {
    return this.prisma.companyAdmin.findMany({
      where: { companyId },
      select: companyAdminSelect,
      orderBy: { createdAt: 'asc' },
    });
  }

  countOwners(companyId: string): Promise<number> {
    return this.prisma.companyAdmin.count({
      where: { companyId, role: CompanyAdminRole.OWNER },
    });
  }

  async addAdmin(
    companyId: string,
    userId: string,
    role: CompanyAdminRole = CompanyAdminRole.ADMIN,
  ): Promise<void> {
    await this.prisma.companyAdmin.upsert({
      where: { companyId_userId: { companyId, userId } },
      create: { companyId, userId, role },
      update: { role },
    });
  }

  async removeAdmin(companyId: string, userId: string): Promise<boolean> {
    const result = await this.prisma.companyAdmin.deleteMany({
      where: { companyId, userId },
    });
    return result.count > 0;
  }

  createService(
    companyId: string,
    dto: CreateCompanyServiceDto,
  ): Promise<CompanyServiceSelected> {
    return this.prisma.companyService.create({
      data: { companyId, name: dto.name, description: dto.description },
      select: companyServiceSelect,
    });
  }

  async deleteService(id: string, companyId: string): Promise<boolean> {
    const result = await this.prisma.companyService.deleteMany({
      where: { id, companyId },
    });
    return result.count > 0;
  }

  listServices(companyId: string): Promise<CompanyServiceSelected[]> {
    return this.prisma.companyService.findMany({
      where: { companyId },
      select: companyServiceSelect,
      orderBy: { createdAt: 'asc' },
    });
  }

  findEmployeesByCompanyId(
    companyId: string,
  ): Promise<CompanyEmployeeSelected[]> {
    return this.prisma.workExperience.findMany({
      where: { companyId },
      distinct: ['userId'],
      orderBy: [
        { endDate: { sort: 'asc', nulls: 'first' } },
        { startDate: 'desc' },
      ],
      select: companyEmployeeSelect,
    });
  }

  /** Legacy fallback for companies without a registered page — matched by free-text name. */
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

  countJobsByCompanyId(companyId: string): Promise<number> {
    return this.prisma.job.count({ where: { companyId } });
  }

  countFollowers(companyId: string): Promise<number> {
    return this.prisma.companyFollower.count({ where: { companyId } });
  }

  async isFollowing(companyId: string, userId: string): Promise<boolean> {
    const follow = await this.prisma.companyFollower.findUnique({
      where: { companyId_userId: { companyId, userId } },
      select: { id: true },
    });
    return follow !== null;
  }

  async follow(companyId: string, userId: string): Promise<void> {
    await this.prisma.companyFollower.upsert({
      where: { companyId_userId: { companyId, userId } },
      create: { companyId, userId },
      update: {},
    });
  }

  async unfollow(companyId: string, userId: string): Promise<void> {
    await this.prisma.companyFollower.deleteMany({
      where: { companyId, userId },
    });
  }

  async search(
    where: Prisma.CompanyWhereInput,
    skip: number,
    take: number,
  ): Promise<CompanySummarySelected[]> {
    return this.prisma.company.findMany({
      where,
      select: companySummarySelect,
      orderBy: { name: 'asc' },
      skip,
      take,
    });
  }

  count(where: Prisma.CompanyWhereInput): Promise<number> {
    return this.prisma.company.count({ where });
  }
}
