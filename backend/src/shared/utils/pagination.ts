export function getPaginationParams(page = 1, limit = 20) {
  return { page, limit, skip: (page - 1) * limit, take: limit };
}
export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
) {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
