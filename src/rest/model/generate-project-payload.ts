import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID, ValidateNested } from 'class-validator';

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
