import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { cryptoUtil } from 'src/service/utils/crypto';

@Entity()
export class GithubToken {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  value: string;

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

  @AfterLoad()
  decryptToken() {
    this.value = cryptoUtil.decrypt(this.value);
  }

  @BeforeUpdate()
  @BeforeInsert()
  encryptToken() {
    this.value = cryptoUtil.encrypt(this.value);
  }
}
