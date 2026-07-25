import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddCompanyAdminDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
}
