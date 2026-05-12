export type UUID = string;

export type Money = string;

export type IsoDate = string;

export type Nullable<T> = T | null;

export interface Pagination {
  page: number;
  size: number;
  total: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
