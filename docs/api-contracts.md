# CulturaZ — API Contracts

A especificação completa (request/response, schemas, exemplos) vive em [packages/contracts/openapi.yaml](../packages/contracts/openapi.yaml). Este documento serve como **mapa de alto nível** dos endpoints.

## Convenções

- Base path: `/api`
- Autenticação: `Authorization: Bearer <jwt>` (quando aplicável)
- Erros: envelope padrão (ver [packages/contracts/openapi.yaml](../packages/contracts/openapi.yaml) → `Error`)
- Paginação: query params `page` (default 0) e `size` (default 20, max 100)
- Datas: ISO 8601 UTC (`2025-05-12T14:30:00Z`)
- Dinheiro: `NUMERIC(12,2)` retornado como string para evitar perda de precisão (`"34.90"`)

## Status de implementação

- ✅ **Stub** — controller existe e responde `/health`
- 🚧 **Próxima entrega** — definido no OpenAPI, implementação prevista
- 🔮 **Roadmap** — endpoint planejado para fase futura

---

## Auth

| Método | Path                     | Status | Descrição                          |
| ------ | ------------------------ | ------ | ---------------------------------- |
| POST   | `/api/auth/register`     | 🚧 E2  | Cadastra novo usuário              |
| POST   | `/api/auth/login`        | 🚧 E2  | Autentica e retorna JWT            |
| POST   | `/api/auth/logout`       | 🚧 E2  | Invalida refresh token             |
| GET    | `/api/auth/me`           | 🚧 E2  | Retorna usuário autenticado        |

## Users

| Método | Path                                  | Status | Descrição                  |
| ------ | ------------------------------------- | ------ | -------------------------- |
| GET    | `/api/users/me`                       | 🚧 E2  | Perfil do usuário          |
| PUT    | `/api/users/me`                       | 🚧 E2  | Atualizar perfil           |
| GET    | `/api/users/me/addresses`             | 🚧 E2  | Listar endereços           |
| POST   | `/api/users/me/addresses`             | 🚧 E2  | Criar endereço             |
| PUT    | `/api/users/me/addresses/{id}`        | 🚧 E2  | Atualizar endereço         |
| DELETE | `/api/users/me/addresses/{id}`        | 🚧 E2  | Remover endereço           |

## Sellers

| Método | Path                                  | Status | Descrição                       |
| ------ | ------------------------------------- | ------ | ------------------------------- |
| POST   | `/api/sellers`                        | 🚧 E5  | Ativar perfil de vendedor       |
| GET    | `/api/sellers/me`                     | 🚧 E5  | Meu perfil de vendedor          |
| PUT    | `/api/sellers/me`                     | 🚧 E5  | Atualizar perfil de vendedor    |
| GET    | `/api/sellers/{id}`                   | 🚧 E5  | Perfil público de vendedor      |
| GET    | `/api/sellers/{id}/reviews`           | 🚧 E7  | Avaliações públicas             |

## Categories

| Método | Path                                            | Status | Descrição                |
| ------ | ----------------------------------------------- | ------ | ------------------------ |
| GET    | `/api/categories`                               | 🚧 E3  | Listar categorias ativas |
| POST   | `/api/admin/categories`                         | 🚧 E6  | Criar categoria          |
| PUT    | `/api/admin/categories/{id}`                    | 🚧 E6  | Atualizar categoria      |
| PATCH  | `/api/admin/categories/{id}/activate`           | 🚧 E6  | Ativar categoria         |
| PATCH  | `/api/admin/categories/{id}/deactivate`         | 🚧 E6  | Desativar categoria      |

## Books

| Método | Path                | Status | Descrição                              |
| ------ | ------------------- | ------ | -------------------------------------- |
| GET    | `/api/books`        | 🚧 E3  | Buscar livros no catálogo bibliográfico|
| GET    | `/api/books/{id}`   | 🚧 E3  | Detalhes do livro                      |
| POST   | `/api/books`        | 🚧 E3  | Adicionar livro (caso ISBN não exista) |
| PUT    | `/api/books/{id}`   | 🚧 E6  | Editar livro (admin)                   |

## Listings (anúncios)

| Método | Path                                          | Status | Descrição                          |
| ------ | --------------------------------------------- | ------ | ---------------------------------- |
| GET    | `/api/listings`                               | 🚧 E3  | Catálogo público de anúncios       |
| GET    | `/api/listings/{id}`                          | 🚧 E3  | Detalhes do anúncio                |
| POST   | `/api/seller/listings`                        | 🚧 E3  | Criar anúncio                      |
| PUT    | `/api/seller/listings/{id}`                   | 🚧 E3  | Editar anúncio                     |
| PATCH  | `/api/seller/listings/{id}/pause`             | 🚧 E3  | Pausar anúncio                     |
| PATCH  | `/api/seller/listings/{id}/activate`          | 🚧 E3  | Reativar anúncio                   |
| DELETE | `/api/seller/listings/{id}`                   | 🚧 E3  | Remover anúncio                    |
| PATCH  | `/api/admin/listings/{id}/approve`            | 🚧 E6  | Aprovar anúncio                    |
| PATCH  | `/api/admin/listings/{id}/block`              | 🚧 E6  | Bloquear anúncio                   |

## Favorites

| Método | Path                              | Status | Descrição              |
| ------ | --------------------------------- | ------ | ---------------------- |
| GET    | `/api/favorites`                  | 🚧 E3  | Meus favoritos         |
| POST   | `/api/favorites/{listingId}`      | 🚧 E3  | Favoritar anúncio      |
| DELETE | `/api/favorites/{listingId}`      | 🚧 E3  | Remover favorito       |

## Cart

| Método | Path                          | Status | Descrição                    |
| ------ | ----------------------------- | ------ | ---------------------------- |
| GET    | `/api/cart`                   | 🚧 E4  | Ver meu carrinho             |
| POST   | `/api/cart/items`             | 🚧 E4  | Adicionar item               |
| PUT    | `/api/cart/items/{id}`        | 🚧 E4  | Atualizar quantidade         |
| DELETE | `/api/cart/items/{id}`        | 🚧 E4  | Remover item                 |
| DELETE | `/api/cart`                   | 🚧 E4  | Esvaziar carrinho            |

## Orders

| Método | Path                                          | Status | Descrição                          |
| ------ | --------------------------------------------- | ------ | ---------------------------------- |
| POST   | `/api/orders`                                 | 🚧 E4  | Criar pedido a partir do carrinho  |
| GET    | `/api/orders/me`                              | 🚧 E4  | Meus pedidos (comprador)           |
| GET    | `/api/orders/{id}`                            | 🚧 E4  | Detalhes do pedido                 |
| PATCH  | `/api/orders/{id}/cancel`                     | 🚧 E4  | Cancelar pedido                    |
| GET    | `/api/seller/orders`                          | 🚧 E5  | Pedidos do vendedor                |
| GET    | `/api/seller/orders/{id}`                     | 🚧 E5  | Detalhes (somente itens próprios)  |
| PATCH  | `/api/seller/orders/{id}/status`              | 🚧 E5  | Atualizar status (enviado, etc.)   |
| GET    | `/api/admin/orders`                           | 🚧 E6  | Lista global de pedidos            |
| GET    | `/api/admin/orders/{id}`                      | 🚧 E6  | Detalhes globais                   |

## Reviews

| Método | Path                              | Status | Descrição                    |
| ------ | --------------------------------- | ------ | ---------------------------- |
| POST   | `/api/reviews`                    | 🚧 E7  | Avaliar vendedor             |
| GET    | `/api/sellers/{id}/reviews`       | 🚧 E7  | Avaliações de um vendedor    |

## Admin

| Método | Path                                          | Status | Descrição                  |
| ------ | --------------------------------------------- | ------ | -------------------------- |
| GET    | `/api/admin/dashboard`                        | 🚧 E6  | Dashboard com métricas     |
| GET    | `/api/admin/users`                            | 🚧 E6  | Listar usuários            |
| PATCH  | `/api/admin/users/{id}/block`                 | 🚧 E6  | Bloquear usuário           |
| PATCH  | `/api/admin/users/{id}/unblock`               | 🚧 E6  | Desbloquear                |
| GET    | `/api/admin/reports`                          | 🚧 E6  | Relatórios consolidados    |

## Health (presente desde a entrega 1)

| Método | Path                            | Status | Descrição                                       |
| ------ | ------------------------------- | ------ | ----------------------------------------------- |
| GET    | `/actuator/health`              | ✅     | Health geral (Spring Boot Actuator)             |
| GET    | `/api/{module}/health`          | ✅     | Health por módulo (verifica que o pacote subiu) |
