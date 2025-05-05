import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class GithubInstallation {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'github_installation_id' })
  githubInstallationId: string;

  @Column({ name: 'org_name' })
  orgName: string;

  @Column({ name: 'is_org' })
  isOrg: boolean;

  @ManyToOne(() => User, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
