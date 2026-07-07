export class PaginationMeta {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly total: number,
    public readonly totalPages: number,
    public readonly hasNextPage: boolean,
    public readonly hasPrevPage: boolean,
  ) {}
}
