import type { Category } from '@/types/category';

export const categoriesMock: Category[] = [
  { id: 'cat-academicos', name: 'Acadêmicos',    icon: 'school',   booksCount: 1342, active: true },
  { id: 'cat-tecnicos',   name: 'Técnicos',      icon: 'hardware-chip-outline', booksCount: 982, active: true },
  { id: 'cat-literatura', name: 'Literatura',    icon: 'book',     booksCount: 2891, active: true },
  { id: 'cat-sebos',      name: 'Sebos',         icon: 'archive',  booksCount: 5621, active: true },
  { id: 'cat-mais',       name: 'Mais vendidos', icon: 'flame',    booksCount: 312,  active: true },
];
