import { JobApplicationResponseDto } from '../dto/job-application.dto';
import { JobApplicationSelected } from '../job-applications.select';

export class JobApplicationsMapper {
  static toResponseDto(
    application: JobApplicationSelected,
  ): JobApplicationResponseDto {
    return {
      id: application.id,
      status: application.status,
      contactEmail: application.contactEmail,
      contactPhone: application.contactPhone,
      coverNote: application.coverNote,
      decisionReason: application.decisionReason,
      decidedAt: application.decidedAt,
      applicant: application.applicant,
      job: {
        id: application.job.id,
        title: application.job.title,
        companyName: application.job.companyName,
        companyLogoUrl: application.job.company?.logoUrl ?? null,
      },
      resume: application.resume,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }
}
