# CulturaZ — API

Backend Kotlin + Spring Boot 3 + Java 21 do marketplace CulturaZ.

## Stack

- Kotlin 1.9.25
- Spring Boot 3.3.4
- Java 21 (Temurin)
- Gradle Kotlin DSL 8.10
- PostgreSQL 16
- Flyway (migrações versionadas)
- springdoc-openapi (Swagger UI)
- JJWT 0.12 (assinatura HS256)
- BCrypt (Spring Security)

## Módulos

```
src/main/kotlin/com/culturaz/api/
├── CulturaZApplication.kt
├── config/                    JacksonConfig, CorsConfig, OpenApiConfig
├── shared/
│   ├── exceptions/            BusinessException + GlobalExceptionHandler
│   ├── responses/             ApiErrorResponse, PagedResponse, FieldErrorResponse
│   └── security/              SecurityConfig, JwtProperties, AuthUser, helpers
├── auth/                      AuthService, JwtService, JwtAuthenticationFilter, controller
├── users/                     User, Address, services, controllers, repos
├── sellers/                   SellerProfile + service/controller (dashboard, reputação)
├── categories/                Category + admin/public controllers
├── books/                     Book + busca paginada e CRUD
├── listings/                  BookListing + máquina de estados (seller/admin)
├── favorites/                 Favorite + controller
├── cart/                      Cart, CartItem + service transacional
├── orders/                    Order, OrderItem + checkout transacional, cancelamento
├── reviews/                   Review + atualização de reputação do vendedor
└── admin/                     AuditLog, AdminService, AdminController, dashboard
```

Detalhes arquiteturais em [../../docs/arquitetura.md](../../docs/arquitetura.md).

## Como rodar

### Pré-requisitos

- Java 21 (Temurin recomendado)
- PostgreSQL 16 (use `pnpm infra:up` para subir só o banco via Docker)
- ou Docker Desktop para subir a stack inteira (veja abaixo)

### Modo dev (gradle bootRun)

```bash
pnpm infra:up
cd apps/api
./gradlew bootRun
```

- API em [http://localhost:8080](http://localhost:8080)
- Health: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
- Swagger: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Modo stack completa (Docker, idêntico ao de deploy)

A partir da raiz do monorepo:

```bash
pnpm stack:up        # build da imagem + sobe postgres + api
pnpm stack:logs      # acompanha logs da API
pnpm stack:smoke     # roda smoke test end-to-end via HTTP
pnpm stack:down      # derruba a stack
```

A imagem é a mesma definida em [Dockerfile](Dockerfile) (multi-stage: gradle build → JRE Alpine). Tudo o que roda em dev via Docker é o que vai pra produção.

## Variáveis de ambiente

| Variável                                  | Default                                                                                            | Notas                       |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------- |
| `SPRING_PROFILES_ACTIVE`                  | `local`                                                                                            | `local`, `test` ou `prod`   |
| `DATABASE_URL`                            | `jdbc:postgresql://localhost:5432/culturaz`                                                        |                             |
| `DATABASE_USERNAME`                       | `culturaz`                                                                                         |                             |
| `DATABASE_PASSWORD`                       | `culturaz`                                                                                         |                             |
| `API_PORT`                                | `8080`                                                                                             |                             |
| `JWT_SECRET`                              | placeholder de dev                                                                                 | **trocar em produção**      |
| `JWT_ACCESS_TOKEN_EXPIRATION_SECONDS`     | `3600`                                                                                             |                             |
| `JWT_REFRESH_TOKEN_EXPIRATION_SECONDS`    | `2592000`                                                                                          |                             |

## Migrações Flyway

Todas em [src/main/resources/db/migration/](src/main/resources/db/migration/):

```text
V001__create_users.sql
V002__create_seller_profiles.sql
V003__create_categories.sql
V004__create_books.sql
V005__create_book_listings.sql
V006__create_addresses.sql
V007__create_favorites.sql
V008__create_cart.sql
V009__create_orders.sql
V010__create_reviews.sql
V011__create_audit_logs.sql
V012__seed_initial_categories.sql
V013__seed_local_admin_user.sql
```

Regras:

- `spring.jpa.hibernate.ddl-auto=validate` — schema é gerenciado **apenas** por Flyway.
- Nunca edite uma migração já aplicada — crie a próxima `V<N>__...`.

### Usuários de seed (apenas ambiente local)

| Email                    | Senha          | Roles            |
| ------------------------ | -------------- | ---------------- |
| `admin@culturaz.local`   | `Admin123456`  | ADMIN, CUSTOMER  |
| `buyer@culturaz.local`   | `Buyer123456`  | CUSTOMER         |
| `seller@culturaz.local`  | `Seller123456` | SELLER, CUSTOMER |

> Credenciais documentadas no V013. **Não usar em produção** — refazer seeds com hashes reais e segredos versionados em vault.

## Testes

```bash
./gradlew test
```

Cobertura atual:

- `JwtServiceTest` — round-trip do JWT (HS256, roles, tipo, expiração)
- `AuthServiceTest` — register/login/regras (e-mail duplicado, credenciais ruins, usuário bloqueado)
- `ListingStateMachineTest` — transições válidas/inválidas seller × admin
- `OrderStateMachineTest` — máquina do pedido + janelas de cancelamento

Para validar o fluxo end-to-end (HTTP, banco real, JWT real), use o smoke test em Python contra a stack Docker:

```bash
pnpm stack:up       # builda imagem + sobe stack
pnpm stack:smoke    # python infra/smoke-test.py
```

O smoke test cobre: health → categorias → login admin → /me → registrar comprador → 401 sem token → login vendedor → ativar seller → criar livro → criar anúncio → aprovar → catálogo → endereço → carrinho → checkout → estoque reduz → carrinho limpa → vendedor avança status → DELIVERED → review → dashboard admin.

## Padrão global de erro

Toda exceção é convertida pelo `GlobalExceptionHandler` em um envelope estável:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Existem campos inválidos na requisição.",
  "path": "/api/auth/register",
  "timestamp": "2026-05-13T10:00:00Z",
  "details": [
    { "field": "email", "issue": "E-mail é obrigatório." }
  ]
}
```

Códigos principais: `VALIDATION_ERROR`, `RESOURCE_NOT_FOUND`, `EMAIL_ALREADY_EXISTS`, `INVALID_CREDENTIALS`, `USER_BLOCKED`, `SELLER_PROFILE_ALREADY_EXISTS`, `CATEGORY_ALREADY_EXISTS`, `BOOK_ISBN_ALREADY_EXISTS`, `LISTING_NOT_ACTIVE`, `LISTING_NOT_FOUND`, `INSUFFICIENT_STOCK`, `CART_EMPTY`, `ORDER_NOT_FOUND`, `ORDER_NOT_CANCELABLE`, `INVALID_STATUS_TRANSITION`, `REVIEW_ALREADY_EXISTS`, `ACCESS_DENIED`, `INTERNAL_ERROR`.
