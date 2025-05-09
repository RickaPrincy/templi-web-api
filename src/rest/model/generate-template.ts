import { ApiProperty } from '@nestjs/swagger';

export class GenerateTemplate {
  @ApiProperty()
  repositoryName: string;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  installationId: string;

  @ApiProperty()
  values: Value[];
}

export interface Value<T = any> {
  name: string;
  value: T;
}
