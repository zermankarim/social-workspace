export interface NewsStoryResponseDto {
  id: string;
  title: string;
  summary: string | null;
  body?: string | null;
  url: string | null;
  readersCount: number;
  createdAt: string;
}

export interface CreateNewsStoryRequestDto {
  title: string;
  summary?: string;
  body?: string;
  url?: string;
}
