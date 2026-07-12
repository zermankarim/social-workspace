import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { Language } from "@/core/domain/entities/language.entity";
import type { Skill } from "@/core/domain/entities/skill.entity";

export class PaginatedLanguages {
  constructor(
    public readonly data: Language[],
    public readonly meta: PaginationMeta,
  ) {}
}

export class PaginatedSkills {
  constructor(
    public readonly data: Skill[],
    public readonly meta: PaginationMeta,
  ) {}
}
