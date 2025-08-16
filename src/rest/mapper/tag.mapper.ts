import { Injectable } from '@nestjs/common';
import { Tag as DomainTag } from 'src/model';
import { Tag } from '../model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagMapper {
  constructor(
    @InjectRepository(DomainTag)
    private readonly tagRepository: Repository<DomainTag>,
  ) {}

  async toRest(tag: DomainTag): Promise<Tag> {
    const { deletedAt: _deletedAt, ...restTag } = tag;
    return restTag;
  }

  async toDomain(tag: Tag): Promise<DomainTag> {
    return this.tagRepository.create(tag);
  }
}
