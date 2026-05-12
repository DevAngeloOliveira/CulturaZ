import type { UUID } from './common';

export interface Category {
  id: UUID;
  name: string;
  icon: string;
  booksCount: number;
  active: boolean;
}
