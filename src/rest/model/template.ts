import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class Template {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  scope?: string;

  @IsString()
  @ApiProperty()
  url: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsDateString()
  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @IsDateString()
  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
}
