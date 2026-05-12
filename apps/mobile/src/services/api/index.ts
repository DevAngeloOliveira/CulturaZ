/**
 * Namespaces de API.
 *
 * Nesta entrega, os métodos são placeholders. A integração real entra na entrega 2,
 * quando a autenticação for implementada. Cada namespace usará `http()` de `services/http.ts`.
 */

export const api = {
  auth: {
    // login: (req: LoginRequest) => http<AuthResponse>('/api/auth/login', { method: 'POST', body: req }),
  },
  listings: {
    // list: (filters?: ListingFilters) => http<Paginated<BookListing>>('/api/listings', { method: 'GET' }),
  },
  cart: {},
  orders: {},
  reviews: {},
} as const;
