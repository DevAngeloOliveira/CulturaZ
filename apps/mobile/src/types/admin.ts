import type { Money } from './common';

export interface AdminMetrics {
  usersCount: number;
  sellersCount: number;
  listingsPendingCount: number;
  ordersTodayCount: number;
  revenueLast30Days: Money;
}
