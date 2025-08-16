import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Tag } from './tag';

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

  @ValidateNested()
  @ApiProperty({ type: [Tag] })
  tags: Tag[];
}
