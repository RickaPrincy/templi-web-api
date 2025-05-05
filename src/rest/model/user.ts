import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  githubId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  avatar?: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
}
