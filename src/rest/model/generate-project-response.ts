import { ApiProperty } from '@nestjs/swagger';

export class GenerateProjectResponse {
  @ApiProperty()
  url: string;
}
