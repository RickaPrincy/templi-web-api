import { ApiProperty } from '@nestjs/swagger';

export class GithubInstallation {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  orgName: string;

  @ApiProperty()
  isOrg: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
}
