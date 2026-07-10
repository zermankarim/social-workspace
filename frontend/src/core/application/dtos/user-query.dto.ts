import { SortBy } from "@/core/domain/enums/sort-by.enum";
import { SortOrder } from "@/core/domain/enums/sort-order.enum";

export class UserQueryDto {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly sortBy: SortBy = SortBy.CREATED_AT,
    public readonly orderBy: SortOrder = SortOrder.DESC,
    public readonly search?: string,
  ) {}
}
