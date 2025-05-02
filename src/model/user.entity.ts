import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true, name: 'github_id' })
  githubId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  avatar?: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
