import { ApiProperty } from '@nestjs/swagger';
import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Dummy {
  @ApiProperty({ format: 'uuid' })
  @PrimaryColumn()
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
