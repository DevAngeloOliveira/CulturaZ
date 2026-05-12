import type { IsoDate, UUID } from './common';

export interface Review {
  id: UUID;
  sellerId: UUID;
  reviewerName: string;
  rating: number;
  comment?: string;
  tags?: string;
  createdAt: IsoDate;
}
