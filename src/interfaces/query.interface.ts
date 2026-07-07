
export interface IQueryParams {
  searchTerm?: string;

  page?: number | string;
  limit?: number | string;

  sortBy?: string;
  sortOrder?: "asc" | "desc";

  fields?: string;
  include?: string;
  [key: string]: any;
}
export interface IQueryConfig {
  searchableFields?: string[];
  filterableFields?: string[];
  applySoftDeleteDefault?: boolean;
}

export interface IQueryMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IQueryResult<T> {
  data: T[];
  meta: IQueryMeta;
}

