import { create } from 'zustand';

import type { ListingCondition } from '@/types/api';

export interface CatalogFilters {
  categoryId?: string;
  condition?: ListingCondition;
  priceMin?: number;
  priceMax?: number;
  city?: string;
  state?: string;
}

interface CatalogState {
  query: string;
  filters: CatalogFilters;
  setQuery: (value: string) => void;
  setFilters: (next: CatalogFilters) => void;
  clearFilters: () => void;
}

const emptyFilters: CatalogFilters = {};

export const useCatalogStore = create<CatalogState>((set) => ({
  query: '',
  filters: emptyFilters,
  setQuery: (value) => set({ query: value }),
  setFilters: (next) => set({ filters: next }),
  clearFilters: () => set({ filters: emptyFilters }),
}));

export const filterCount = (filters: CatalogFilters): number =>
  (Object.values(filters).filter((v) => v !== undefined && v !== '') as unknown[]).length;
