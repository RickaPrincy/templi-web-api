import { ApiProperty } from '@nestjs/swagger';

export class Value {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: any;
}

export class GenerateTemplate {
  @ApiProperty()
  repositoryName: string;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  installationId: string;

  @ApiProperty({ type: [Value] })
  values: Value[];
}
