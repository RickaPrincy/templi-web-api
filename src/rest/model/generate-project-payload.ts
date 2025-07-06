import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class GenerateProjectPayloadValue {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  value: any;
}

export class GenerateProjectPayload {
  @IsString()
  @ApiProperty()
  templateUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  scope: string;

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
  @ApiProperty({ type: [GenerateProjectPayloadValue] })
  values: GenerateProjectPayloadValue[];
}
