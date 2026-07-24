import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompaniesService } from '../services/companies.service';
import { CompanyResponseDto } from '../dto/company.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':name')
  @ApiOperation({
    summary: 'Company page — derived from WorkExperience.companyName',
    description:
      'No separate company registry: this is computed from every profile ' +
      'that lists this company (by name, case-insensitive) as a workplace.',
  })
  @ApiOkResponse({ type: CompanyResponseDto })
  getCompanyByName(@Param('name') name: string): Promise<CompanyResponseDto> {
    return this.companiesService.getCompanyByName(name);
  }
}
