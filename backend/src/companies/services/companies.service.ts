import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from '../repositories/companies.repository';
import { CompaniesMapper } from '../mappers/companies.mapper';
import { CompanyResponseDto } from '../dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  public async getCompanyByName(name: string): Promise<CompanyResponseDto> {
    const employees =
      await this.companiesRepository.findEmployeesByCompanyName(name);
    return CompaniesMapper.toCompanyResponseDto(name, employees);
  }
}
