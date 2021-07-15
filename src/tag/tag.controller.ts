import { Controller, Get } from "@nestjs/common";

import { TagService } from "@app/tag/tag.service";

@Controller()
export class TagController {

  constructor(
    private readonly tagService: TagService
  ) { }

  @Get('/tags')
  public async findAll(): Promise<{tags: string[]}> {
    const tags = await this.tagService.findAll();

    return { tags: tags.map(tag => tag.name) };
  }
}
