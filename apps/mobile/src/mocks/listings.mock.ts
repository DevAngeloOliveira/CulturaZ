import type { BookListing } from '@/types/listing';

import { booksMock } from './books.mock';
import { sellersMock } from './sellers.mock';

const find = <T extends { id: string }>(items: T[], id: string): T => {
  const found = items.find((it) => it.id === id);
  if (!found) {
    throw new Error(`Mock não encontrado: ${id}`);
  }
  return found;
};

const sellerPaginaViva = find(sellersMock, 'sel-pagina-viva');
const sellerAcademica = find(sellersMock, 'sel-academica');
const sellerRodrigo = find(sellersMock, 'sel-rodrigo');

export const listingsMock: BookListing[] = [
  {
    id: 'lst-grande-sertao',
    book: find(booksMock, 'bk-grande-sertao'),
    seller: sellerPaginaViva,
    price: '34.90',
    originalPrice: '59.90',
    stockQuantity: 3,
    condition: 'GOOD',
    status: 'ACTIVE',
    coverImageUrl: 'https://covers.openlibrary.org/b/isbn/9788535914849-L.jpg',
    description: 'Edição com leve marca de uso na capa, miolo impecável.',
    city: 'São Paulo',
    state: 'SP',
    tags: ['Garimpo', 'Literatura brasileira'],
    discountPercentage: 41,
    isFavorite: true,
  },
  {
    id: 'lst-clean-code',
    book: find(booksMock, 'bk-clean-code'),
    seller: sellerAcademica,
    price: '89.00',
    originalPrice: '149.00',
    stockQuantity: 5,
    condition: 'LIKE_NEW',
    status: 'ACTIVE',
    coverImageUrl: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
    description: 'Capa dura, edição em inglês. Páginas sem marcações.',
    city: 'Rio de Janeiro',
    state: 'RJ',
    tags: ['Mais vendido'],
    discountPercentage: 40,
    isFavorite: false,
  },
  {
    id: 'lst-direito',
    book: find(booksMock, 'bk-direito-civil'),
    seller: sellerAcademica,
    price: '128.00',
    originalPrice: '189.00',
    stockQuantity: 2,
    condition: 'NEW',
    status: 'ACTIVE',
    coverImageUrl: 'https://covers.openlibrary.org/b/isbn/9788547234421-L.jpg',
    description: 'Lacrado, direto da editora.',
    city: 'Rio de Janeiro',
    state: 'RJ',
    tags: ['Universitário'],
    discountPercentage: 32,
    isFavorite: false,
  },
  {
    id: 'lst-1984',
    book: find(booksMock, 'bk-1984'),
    seller: sellerRodrigo,
    price: '24.90',
    originalPrice: '49.90',
    stockQuantity: 1,
    condition: 'FAIR',
    status: 'ACTIVE',
    coverImageUrl: 'https://covers.openlibrary.org/b/isbn/9788535914849-L.jpg',
    description: 'Edição de bolso, com algumas anotações a lápis.',
    city: 'Belo Horizonte',
    state: 'MG',
    tags: ['Distopia'],
    discountPercentage: 50,
    isFavorite: false,
  },
  {
    id: 'lst-mistborn',
    book: find(booksMock, 'bk-mistborn'),
    seller: sellerPaginaViva,
    price: '49.90',
    stockQuantity: 4,
    condition: 'LIKE_NEW',
    status: 'ACTIVE',
    coverImageUrl: 'https://covers.openlibrary.org/b/isbn/9788580446005-L.jpg',
    description: 'Primeira edição em português, miolo perfeito.',
    city: 'São Paulo',
    state: 'SP',
    tags: ['Fantasia', 'Sanderson'],
    isFavorite: true,
  },
  {
    id: 'lst-calculus',
    book: find(booksMock, 'bk-calculus'),
    seller: sellerAcademica,
    price: '94.50',
    originalPrice: '189.00',
    stockQuantity: 3,
    condition: 'GOOD',
    status: 'ACTIVE',
    coverImageUrl: 'https://covers.openlibrary.org/b/isbn/9788522112586-L.jpg',
    description: 'Pequenas anotações no índice, restante preservado.',
    city: 'Rio de Janeiro',
    state: 'RJ',
    tags: ['Engenharia', 'Cálculo'],
    discountPercentage: 50,
    isFavorite: false,
  },
];
