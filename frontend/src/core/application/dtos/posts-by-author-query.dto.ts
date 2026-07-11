export class PostsByAuthorQueryDto {
  constructor(
    public readonly authorId: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}
