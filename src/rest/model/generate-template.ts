import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID, ValidateNested } from 'class-validator';

export class Value {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  value: any;
}

export class GenerateTemplate {
  @IsString()
  @ApiProperty()
  repositoryName: string;

  @IsBoolean()
  @ApiProperty()
  isPrivate: boolean;

  @IsUUID()
  @ApiProperty()
  installationId: string;

  @ValidateNested()
  @ApiProperty({ type: [Value] })
  values: Value[];
}
