export class NewsStory {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly summary: string | null,
    public readonly body: string | null,
    public readonly url: string | null,
    public readonly readersCount: number,
    public readonly createdAt: Date,
  ) {}

  withReadersCount(readersCount: number): NewsStory {
    return new NewsStory(
      this.id,
      this.title,
      this.summary,
      this.body,
      this.url,
      readersCount,
      this.createdAt,
    );
  }
}
