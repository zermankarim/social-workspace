import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CompaniesRepository } from '../repositories/companies.repository';
import { CompaniesMapper } from '../mappers/companies.mapper';
import { CompanyResponseDto, CompanySummaryDto } from '../dto/company.dto';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/create-company.dto';
import { CreateCompanyServiceDto } from '../dto/company-service.dto';
import { CompanySearchQueryDto } from '../dto/company-search-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  public async createCompany(
    ownerId: string,
    dto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    if (await this.companiesRepository.nameExists(dto.name)) {
      throw new ConflictException('A company with this name already exists');
    }
    const company = await this.companiesRepository.create(ownerId, dto);
    return this.buildCompanyResponse(company, ownerId);
  }

  public async updateCompany(
    userId: string,
    companyId: string,
    dto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    await this.assertAdminOrThrow(companyId, userId);
    const company = await this.companiesRepository.update(companyId, dto);
    return this.buildCompanyResponse(company, userId);
  }

  public async getCompanyByName(
    name: string,
    viewerId?: string,
  ): Promise<CompanyResponseDto> {
    const company = await this.companiesRepository.findByName(name);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return this.buildCompanyResponse(company, viewerId);
  }

  public async getCompanyById(
    id: string,
    viewerId?: string,
  ): Promise<CompanyResponseDto> {
    const company = await this.companiesRepository.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return this.buildCompanyResponse(company, viewerId);
  }

  public async searchCompanies(
    query: CompanySearchQueryDto,
  ): Promise<PaginatedResponseDto<CompanySummaryDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const where: Prisma.CompanyWhereInput = query.q?.trim()
      ? { name: { contains: query.q.trim(), mode: 'insensitive' } }
      : {};

    const [companies, total] = await Promise.all([
      this.companiesRepository.search(where, skip, take),
      this.companiesRepository.count(where),
    ]);

    return {
      data: companies.map((company) => CompaniesMapper.toSummaryDto(company)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async addAdmin(
    actingUserId: string,
    companyId: string,
    targetUserId: string,
  ): Promise<void> {
    await this.assertOwnerOrThrow(companyId, actingUserId);
    await this.companiesRepository.addAdmin(companyId, targetUserId);
  }

  public async removeAdmin(
    actingUserId: string,
    companyId: string,
    targetUserId: string,
  ): Promise<void> {
    await this.assertOwnerOrThrow(companyId, actingUserId);

    const isTargetOwner = await this.companiesRepository.isOwner(
      companyId,
      targetUserId,
    );
    if (isTargetOwner) {
      const ownerCount = await this.companiesRepository.countOwners(companyId);
      if (ownerCount <= 1) {
        throw new BadRequestException(
          'Cannot remove the last owner of a company page',
        );
      }
    }

    const removed = await this.companiesRepository.removeAdmin(
      companyId,
      targetUserId,
    );
    if (!removed) {
      throw new NotFoundException('Admin not found');
    }
  }

  public async addService(
    userId: string,
    companyId: string,
    dto: CreateCompanyServiceDto,
  ) {
    await this.assertAdminOrThrow(companyId, userId);
    const service = await this.companiesRepository.createService(
      companyId,
      dto,
    );
    return CompaniesMapper.toServiceDto(service);
  }

  public async removeService(
    userId: string,
    companyId: string,
    serviceId: string,
  ): Promise<void> {
    await this.assertAdminOrThrow(companyId, userId);
    const removed = await this.companiesRepository.deleteService(
      serviceId,
      companyId,
    );
    if (!removed) {
      throw new NotFoundException('Service not found');
    }
  }

  /** Used by JobApplicationsService to fan out "application received" notifications. */
  public listAdmins(companyId: string) {
    return this.companiesRepository.listAdmins(companyId);
  }

  /** Used by JobsService to authorize posting a job on behalf of a company. */
  public async assertAdminOrThrow(
    companyId: string,
    userId: string,
  ): Promise<void> {
    const isAdmin = await this.companiesRepository.isAdmin(companyId, userId);
    if (!isAdmin) {
      throw new ForbiddenException('Not an admin of this company');
    }
  }

  private async assertOwnerOrThrow(
    companyId: string,
    userId: string,
  ): Promise<void> {
    const isOwner = await this.companiesRepository.isOwner(companyId, userId);
    if (!isOwner) {
      throw new ForbiddenException('Only an owner can do this');
    }
  }

  public async followCompany(userId: string, companyId: string): Promise<void> {
    await this.companiesRepository.follow(companyId, userId);
  }

  public async unfollowCompany(
    userId: string,
    companyId: string,
  ): Promise<void> {
    await this.companiesRepository.unfollow(companyId, userId);
  }

  private async buildCompanyResponse(
    company: NonNullable<Awaited<ReturnType<CompaniesRepository['findById']>>>,
    viewerId?: string,
  ): Promise<CompanyResponseDto> {
    const [
      employeesById,
      services,
      admins,
      jobsCount,
      isViewerAdmin,
      followersCount,
      isViewerFollowing,
    ] = await Promise.all([
      this.companiesRepository.findEmployeesByCompanyId(company.id),
      this.companiesRepository.listServices(company.id),
      this.companiesRepository.listAdmins(company.id),
      this.companiesRepository.countJobsByCompanyId(company.id),
      viewerId
        ? this.companiesRepository.isAdmin(company.id, viewerId)
        : Promise.resolve(false),
      this.companiesRepository.countFollowers(company.id),
      viewerId
        ? this.companiesRepository.isFollowing(company.id, viewerId)
        : Promise.resolve(false),
    ]);

    // Most WorkExperience rows still only carry the free-text company name —
    // fall back to a name match so a freshly registered page isn't empty.
    const employees =
      employeesById.length > 0
        ? employeesById
        : await this.companiesRepository.findEmployeesByCompanyName(
            company.name,
          );

    return CompaniesMapper.toCompanyResponseDto(company, {
      employees,
      services,
      admins,
      jobsCount,
      isViewerAdmin,
      followersCount,
      isViewerFollowing,
    });
  }
}
