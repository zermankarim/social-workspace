export class Language {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly nameEn: string,
    public readonly nameRu: string,
  ) {}

  displayName(locale: "en" | "ru"): string {
    return locale === "ru" ? this.nameRu : this.nameEn;
  }
}
