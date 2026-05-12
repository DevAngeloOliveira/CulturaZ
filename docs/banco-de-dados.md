# CulturaZ — Banco de Dados

## 1. Visão geral

- **SGBD:** PostgreSQL 16.
- **Migrações:** Flyway versiona toda mudança de schema.
- **Identificadores:** UUID (v4) para todas as tabelas de domínio.
- **Naming:** `snake_case` para colunas e tabelas, plural nas tabelas (`users`, `book_listings`).
- **Auditoria:** colunas `created_at` e `updated_at` em todas as tabelas transacionais.
- **Enums:** persistidos como `VARCHAR` com `CHECK constraint` (evita ALTER TYPE no Postgres ao adicionar novo valor).
- **Soft delete:** evitado quando possível; preferimos status explícitos (`status = 'DELETED'`).

## 2. Diagrama lógico (ASCII)

```
                    ┌───────────┐
                    │   users   │
                    └─────┬─────┘
            ┌─────────────┼────────────┬──────────────┐
            │             │            │              │
      ┌─────▼─────┐ ┌─────▼─────┐ ┌────▼─────┐  ┌─────▼──────┐
      │user_roles │ │ addresses │ │   carts  │  │seller_     │
      │           │ │           │ │          │  │profiles    │
      └───────────┘ └───────────┘ └────┬─────┘  └─────┬──────┘
                                       │              │
                                       │              │
                                  ┌────▼─────┐        │
                                  │cart_items│        │
                                  └────┬─────┘        │
                                       │              │
                                       │   ┌──────────▼──────────┐
                                       │   │   book_listings     │
                                       └──▶│                     │
                                           └──────────┬──────────┘
                                                      │
                                          ┌───────────┼─────────────┐
                                          │           │             │
                                     ┌────▼────┐ ┌────▼─────┐ ┌─────▼──────┐
                                     │  books  │ │favorites │ │order_items │
                                     └────┬────┘ └──────────┘ └─────┬──────┘
                                          │                          │
                                    ┌─────▼──────┐             ┌─────▼─────┐
                                    │ categories │             │  orders   │
                                    └────────────┘             └─────┬─────┘
                                                                     │
                                                              ┌──────▼──────┐
                                                              │   reviews   │
                                                              └─────────────┘

                                              ┌─────────────┐
                                              │ audit_logs  │
                                              └─────────────┘
```

## 3. Entidades

### `users`

| Coluna          | Tipo         | Notas                                              |
| --------------- | ------------ | -------------------------------------------------- |
| id              | UUID PK      | gerado pela aplicação                              |
| name            | VARCHAR(120) | NOT NULL                                           |
| email           | VARCHAR(160) | NOT NULL, UNIQUE                                   |
| password_hash   | VARCHAR(120) | BCrypt                                             |
| phone           | VARCHAR(20)  | nullable                                           |
| status          | VARCHAR(30)  | CHECK em (`ACTIVE`,`BLOCKED`,`PENDING_VERIFICATION`,`DELETED`) |
| created_at      | TIMESTAMPTZ  | DEFAULT now()                                      |
| updated_at      | TIMESTAMPTZ  | DEFAULT now()                                      |

Índice: `idx_users_email` (UNIQUE).

### `user_roles`

| Coluna     | Tipo        | Notas                                          |
| ---------- | ----------- | ---------------------------------------------- |
| id         | UUID PK     |                                                |
| user_id    | UUID FK     | → users(id)                                    |
| role       | VARCHAR(20) | CHECK em (`CUSTOMER`,`SELLER`,`ADMIN`,`SUPPORT`) |
| created_at | TIMESTAMPTZ |                                                |

Índice: `UNIQUE (user_id, role)`.

### `addresses`

| Coluna       | Tipo         | Notas       |
| ------------ | ------------ | ----------- |
| id           | UUID PK      |             |
| user_id      | UUID FK      | → users(id) |
| label        | VARCHAR(60)  | "Casa", etc |
| recipient    | VARCHAR(120) |             |
| street       | VARCHAR(200) |             |
| number       | VARCHAR(20)  |             |
| complement   | VARCHAR(120) | nullable    |
| neighborhood | VARCHAR(120) |             |
| city         | VARCHAR(120) |             |
| state        | VARCHAR(2)   |             |
| postal_code  | VARCHAR(20)  |             |
| is_default   | BOOLEAN      | DEFAULT false |
| created_at   | TIMESTAMPTZ  |             |
| updated_at   | TIMESTAMPTZ  |             |

Índice: `idx_addresses_user_id`.

### `seller_profiles`

| Coluna                  | Tipo          | Notas                                              |
| ----------------------- | ------------- | -------------------------------------------------- |
| id                      | UUID PK       |                                                    |
| user_id                 | UUID FK       | → users(id), UNIQUE                                |
| store_name              | VARCHAR(160)  |                                                    |
| description             | TEXT          | nullable                                           |
| type                    | VARCHAR(20)   | CHECK em (`INDIVIDUAL`,`BOOKSTORE`,`SEBO`)         |
| rating                  | NUMERIC(3,2)  | DEFAULT 0                                          |
| status                  | VARCHAR(20)   | CHECK em (`ACTIVE`,`SUSPENDED`,`PENDING_REVIEW`)   |
| created_at, updated_at  | TIMESTAMPTZ   |                                                    |

### `categories`

| Coluna                  | Tipo         | Notas    |
| ----------------------- | ------------ | -------- |
| id                      | UUID PK      |          |
| name                    | VARCHAR(120) | UNIQUE   |
| description             | TEXT         | nullable |
| icon                    | VARCHAR(60)  | nome do ícone Ionicons/Feather |
| active                  | BOOLEAN      | DEFAULT true |
| created_at, updated_at  | TIMESTAMPTZ  |          |

### `books`

| Coluna                  | Tipo         | Notas         |
| ----------------------- | ------------ | ------------- |
| id                      | UUID PK      |               |
| title                   | VARCHAR(255) | NOT NULL      |
| author                  | VARCHAR(255) | NOT NULL      |
| publisher               | VARCHAR(255) | nullable      |
| isbn                    | VARCHAR(20)  | nullable      |
| publication_year        | INT          | nullable      |
| description             | TEXT         | nullable      |
| category_id             | UUID FK      | → categories  |
| created_at, updated_at  | TIMESTAMPTZ  |               |

Índices: `idx_books_isbn`, `idx_books_category_id`, `idx_books_title_trgm` (futuro com pg_trgm).

### `book_listings`

| Coluna                  | Tipo         | Notas                                                                     |
| ----------------------- | ------------ | ------------------------------------------------------------------------- |
| id                      | UUID PK      |                                                                           |
| book_id                 | UUID FK      | → books                                                                   |
| seller_id               | UUID FK      | → seller_profiles                                                         |
| price                   | NUMERIC(12,2)| > 0                                                                       |
| original_price          | NUMERIC(12,2)| nullable                                                                  |
| stock_quantity          | INT          | >= 0                                                                      |
| condition               | VARCHAR(20)  | CHECK em (`NEW`,`LIKE_NEW`,`GOOD`,`FAIR`,`DAMAGED`)                       |
| status                  | VARCHAR(20)  | CHECK em (`PENDING_REVIEW`,`ACTIVE`,`PAUSED`,`BLOCKED`,`SOLD_OUT`,`REMOVED`) |
| cover_image_url         | VARCHAR(500) | nullable                                                                  |
| description             | TEXT         |                                                                           |
| city                    | VARCHAR(120) | nullable                                                                  |
| state                   | VARCHAR(2)   | nullable                                                                  |
| created_at, updated_at  | TIMESTAMPTZ  |                                                                           |

Índices: `idx_listings_seller_id`, `idx_listings_book_id`, `idx_listings_status`, `idx_listings_status_city`.

### `favorites`

| Coluna     | Tipo        | Notas                          |
| ---------- | ----------- | ------------------------------ |
| id         | UUID PK     |                                |
| user_id    | UUID FK     | → users                        |
| listing_id | UUID FK     | → book_listings                |
| created_at | TIMESTAMPTZ |                                |

Índice: `UNIQUE (user_id, listing_id)`.

### `carts`

| Coluna                  | Tipo        | Notas             |
| ----------------------- | ----------- | ----------------- |
| id                      | UUID PK     |                   |
| user_id                 | UUID FK     | → users, UNIQUE   |
| created_at, updated_at  | TIMESTAMPTZ |                   |

### `cart_items`

| Coluna                  | Tipo         | Notas                  |
| ----------------------- | ------------ | ---------------------- |
| id                      | UUID PK      |                        |
| cart_id                 | UUID FK      | → carts                |
| listing_id              | UUID FK      | → book_listings        |
| quantity                | INT          | > 0                    |
| unit_price              | NUMERIC(12,2)| snapshot do preço      |
| created_at, updated_at  | TIMESTAMPTZ  |                        |

Índice: `UNIQUE (cart_id, listing_id)`.

### `orders`

| Coluna                  | Tipo          | Notas                                          |
| ----------------------- | ------------- | ---------------------------------------------- |
| id                      | UUID PK       |                                                |
| code                    | VARCHAR(20)   | legível (`CZ-2025-000123`), UNIQUE             |
| buyer_id                | UUID FK       | → users                                        |
| status                  | VARCHAR(30)   | CHECK enum OrderStatus                         |
| payment_status          | VARCHAR(30)   | CHECK enum PaymentStatus                       |
| subtotal_amount         | NUMERIC(12,2) |                                                |
| shipping_amount         | NUMERIC(12,2) |                                                |
| total_amount            | NUMERIC(12,2) |                                                |
| shipping_address_id     | UUID FK       | → addresses, nullable (retirada local)         |
| created_at, updated_at  | TIMESTAMPTZ   |                                                |

Índices: `idx_orders_buyer_id`, `idx_orders_status`, `idx_orders_code` (UNIQUE).

### `order_items`

| Coluna     | Tipo          | Notas                                            |
| ---------- | ------------- | ------------------------------------------------ |
| id         | UUID PK       |                                                  |
| order_id   | UUID FK       | → orders                                         |
| listing_id | UUID FK       | → book_listings                                  |
| seller_id  | UUID FK       | → seller_profiles (denormalizado p/ relatórios) |
| quantity   | INT           |                                                  |
| unit_price | NUMERIC(12,2) |                                                  |
| subtotal   | NUMERIC(12,2) |                                                  |
| created_at | TIMESTAMPTZ   |                                                  |

Índices: `idx_order_items_order_id`, `idx_order_items_seller_id`.

### `reviews`

| Coluna       | Tipo          | Notas                                |
| ------------ | ------------- | ------------------------------------ |
| id           | UUID PK       |                                      |
| order_id     | UUID FK       | → orders                             |
| reviewer_id  | UUID FK       | → users                              |
| seller_id    | UUID FK       | → seller_profiles                    |
| rating       | INT           | CHECK BETWEEN 1 AND 5                |
| comment      | TEXT          | nullable                             |
| tags         | TEXT          | CSV simples ("rápido,bem embalado")  |
| created_at   | TIMESTAMPTZ   |                                      |

Índices: `UNIQUE (order_id, seller_id)`, `idx_reviews_seller_id`.

### `audit_logs`

| Coluna         | Tipo          | Notas                                |
| -------------- | ------------- | ------------------------------------ |
| id             | UUID PK       |                                      |
| actor_user_id  | UUID FK       | nullable (ação automática do sistema)|
| action         | VARCHAR(60)   | `USER_BLOCKED`, `LISTING_APPROVED`...|
| resource_type  | VARCHAR(40)   |                                      |
| resource_id    | UUID          | nullable                             |
| metadata       | JSONB         | nullable                             |
| created_at     | TIMESTAMPTZ   |                                      |

Índice: `idx_audit_logs_resource (resource_type, resource_id)`.

## 4. Enums

```
UserStatus:    ACTIVE | BLOCKED | PENDING_VERIFICATION | DELETED
Role:          CUSTOMER | SELLER | ADMIN | SUPPORT
SellerType:    INDIVIDUAL | BOOKSTORE | SEBO
SellerStatus:  ACTIVE | SUSPENDED | PENDING_REVIEW
BookCondition: NEW | LIKE_NEW | GOOD | FAIR | DAMAGED
ListingStatus: PENDING_REVIEW | ACTIVE | PAUSED | BLOCKED | SOLD_OUT | REMOVED
OrderStatus:   CREATED | WAITING_PAYMENT | CONFIRMED | IN_PREPARATION | SHIPPED | DELIVERED | CANCELLED | REFUNDED
PaymentStatus: SIMULATED | PENDING | APPROVED | REJECTED | REFUNDED | CANCELLED
```

## 5. Estratégia de migrações

- Cada mudança = um arquivo `V<N>__descricao.sql` em `apps/api/src/main/resources/db/migration/`.
- Migrações **nunca são editadas** após aplicadas em qualquer ambiente (criar nova versão para corrigir).
- Seeds idempotentes (`INSERT ... ON CONFLICT DO NOTHING`) quando aplicável.
- Em desenvolvimento, `spring.flyway.clean-disabled=false` permite reset; em produção, **proibido**.

## 6. Convenções de FK

- Toda FK declarada com `ON DELETE` explícito:
  - `RESTRICT` (default) para dados que não podem se perder com a deleção do pai (ex: `order_items` → `book_listings`).
  - `CASCADE` apenas para relações "filhas naturais" (ex: `cart_items` → `carts`).
- Naming: `<tabela>_<coluna>_fkey`.

## 7. Performance

- Postgres oferece **EXPLAIN ANALYZE** — usar antes de adicionar índice especulativo.
- Índices compostos para queries frequentes (ex: `(status, city)` em listings).
- Buscar texto livre: começar com `ILIKE` simples; migrar para `pg_trgm + GIN` quando crescer.

## 8. Backup e recuperação

- Em produção: snapshots diários do volume + dump lógico semanal.
- Restauração testada trimestralmente.
- Fora de escopo desta entrega.
