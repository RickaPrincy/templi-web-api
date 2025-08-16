import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class Tag {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
}
