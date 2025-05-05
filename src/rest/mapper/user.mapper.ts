import { Injectable } from '@nestjs/common';
import { User } from '../model';
import { User as DomainUser } from 'src/model';

@Injectable()
export class UserMapper {
  async toRest(user: DomainUser): Promise<User> {
    const { deletedAt: _deletedAt, ...restUser } = user;
    return restUser;
  }
}
