import type { Language } from "@/core/domain/entities/language.entity";
import type { LanguageProficiency } from "@/core/domain/enums/language-proficiency.enum";

export class UserLanguage {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly language: Language,
    public readonly proficiency: LanguageProficiency,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
