export class CreateJobDto {
  constructor(
    public readonly title: string,
    public readonly companyName: string,
    public readonly description: string,
    public readonly applyUrl: string,
    public readonly location?: string,
  ) {}
}
