export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedQuery<F = Record<string, unknown>> extends PaginationParams {
  filters?: F;
}
