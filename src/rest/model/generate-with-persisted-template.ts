import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID, ValidateNested } from 'class-validator';
import { GenerateProjectPayloadValue } from './generate-project-payload';

export class GenerateWithPersistedTemplate {
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
