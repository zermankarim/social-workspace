export class Hashtag {
  constructor(
    public readonly id: string,
    public readonly tag: string,
    public readonly postsCount: number,
  ) {}
}
