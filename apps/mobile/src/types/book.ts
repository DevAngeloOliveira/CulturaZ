import type { UUID } from './common';

export interface Book {
  id: UUID;
  title: string;
  author: string;
  publisher?: string;
  isbn?: string;
  publicationYear?: number;
  description?: string;
  categoryId: UUID;
}
