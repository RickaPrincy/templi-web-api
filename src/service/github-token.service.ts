import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GithubToken, User } from 'src/model';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GithubTokenService {
  constructor(
    @InjectRepository(GithubToken)
    private readonly repository: Repository<GithubToken>,
  ) {}

  async findByUserId(userId: string) {
    const token = await this.repository.find({
      where: { user: { id: userId } },
    });

    // Ensure exactly one valid token exists for the user.
    // If not, delete all tokens for that user and throw a ForbiddenException for expired token.
    if (token?.length !== 1) {
      await this.repository.delete({ user: { id: userId } });
      throw new ForbiddenException('Expired token');
    }
    return token[0];
  }

  async syncUserToken(token: string, user: User) {
    await this.repository.delete({ user: { id: user.id } });
    const newToken = this.repository.create({
      id: uuid(),
      user,
      value: token,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return this.repository.save(newToken);
  }
}
