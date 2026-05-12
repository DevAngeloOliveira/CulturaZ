import type { Order } from '@/types/order';

export const ordersMock: Order[] = [
  {
    id: 'ord-1',
    code: 'CZ-2025-000412',
    buyerId: 'usr-mock',
    items: [
      {
        id: 'oi-1',
        listingId: 'lst-clean-code',
        sellerId: 'sel-academica',
        bookTitle: 'Clean Code',
        bookCoverUrl: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
        quantity: 1,
        unitPrice: '89.00',
        subtotal: '89.00',
      },
    ],
    status: 'SHIPPED',
    paymentStatus: 'APPROVED',
    subtotalAmount: '89.00',
    shippingAmount: '14.90',
    totalAmount: '103.90',
    createdAt: '2025-05-08T14:22:00Z',
  },
  {
    id: 'ord-2',
    code: 'CZ-2025-000389',
    buyerId: 'usr-mock',
    items: [
      {
        id: 'oi-2',
        listingId: 'lst-grande-sertao',
        sellerId: 'sel-pagina-viva',
        bookTitle: 'Grande Sertão: Veredas',
        bookCoverUrl: 'https://covers.openlibrary.org/b/isbn/9788535914849-L.jpg',
        quantity: 1,
        unitPrice: '34.90',
        subtotal: '34.90',
      },
    ],
    status: 'DELIVERED',
    paymentStatus: 'APPROVED',
    subtotalAmount: '34.90',
    shippingAmount: '12.50',
    totalAmount: '47.40',
    createdAt: '2025-04-29T10:05:00Z',
  },
];
