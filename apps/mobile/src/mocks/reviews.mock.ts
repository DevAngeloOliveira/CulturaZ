import type { Review } from '@/types/review';

export const reviewsMock: Review[] = [
  {
    id: 'rev-1',
    sellerId: 'sel-pagina-viva',
    reviewerName: 'Camila A.',
    rating: 5,
    comment: 'Livro chegou bem embalado e no estado descrito. Recomendo!',
    tags: 'bem embalado,rapido',
    createdAt: '2025-05-02T11:20:00Z',
  },
  {
    id: 'rev-2',
    sellerId: 'sel-pagina-viva',
    reviewerName: 'Pedro M.',
    rating: 5,
    comment: 'Atendimento atencioso, vou comprar novamente.',
    tags: 'atendimento',
    createdAt: '2025-04-25T16:45:00Z',
  },
  {
    id: 'rev-3',
    sellerId: 'sel-academica',
    reviewerName: 'Sofia R.',
    rating: 4,
    comment: 'Livro chegou um pouco depois do prazo mas em ótimo estado.',
    createdAt: '2025-04-18T09:10:00Z',
  },
  {
    id: 'rev-4',
    sellerId: 'sel-rodrigo',
    reviewerName: 'João V.',
    rating: 4,
    comment: 'Preço justo e comunicação fluida.',
    createdAt: '2025-04-12T13:00:00Z',
  },
];
