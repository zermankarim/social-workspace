import type { Skill } from "@/core/domain/entities/skill.entity";
import type { EducationDegree } from "@/core/domain/enums/education-degree.enum";

export class Education {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly schoolName: string,
    public readonly degree: EducationDegree,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly description: string | null,
    public readonly gradePoint: number | null,
    public readonly skills: Skill[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
