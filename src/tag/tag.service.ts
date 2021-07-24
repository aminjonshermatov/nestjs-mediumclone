import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TagEntity } from "@app/tag/tag.entity";

@Injectable()
export class TagService {

  constructor(
    @InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>
  ) { }

  public async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }
}
