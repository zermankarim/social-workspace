export interface ResumeResponseDto {
  id: string;
  fileName: string;
  fileUrl: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface CreateResumeRequestDto {
  fileName: string;
  fileUrl: string;
  sizeBytes: number;
}
