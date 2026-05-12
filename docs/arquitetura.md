# CulturaZ — Arquitetura

## 1. Visão geral

CulturaZ adota uma arquitetura **cliente-servidor clássica** com:

- **Cliente:** app React Native (Expo managed) consumindo uma API REST.
- **Servidor:** monólito modular em Kotlin + Spring Boot, exposto via REST/JSON.
- **Persistência:** PostgreSQL, migrações via Flyway.
- **Infraestrutura local:** Docker Compose orquestra apenas o banco; mobile e API rodam nativamente para feedback rápido.

A escolha consciente é **simplicidade hoje, escalabilidade amanhã**. Toda complexidade só entra quando há justificativa concreta.

## 2. Monorepo

Todo o projeto vive em um único repositório (`CulturaZ/`), gerenciado por **pnpm workspaces**.

```
CulturaZ/
├── apps/
│   ├── mobile/           # App React Native
│   └── api/              # API Kotlin (Gradle, fora dos workspaces pnpm)
├── packages/
│   └── contracts/        # OpenAPI + glossário (fonte única de verdade dos contratos)
├── docs/                 # Documentação técnica e de produto
├── infra/                # docker-compose, scripts de inicialização do banco
└── .github/workflows/    # Pipelines CI
```

**Por que monorepo?**

- Contratos compartilhados ficam ao lado de quem os usa (frontend e backend).
- Mudanças cross-cutting (ex: novo campo em `BookListing`) viajam em um único PR.
- Documentação centralizada elimina drift entre código e specs.
- Setup local em um único `clone`.

**Por que pnpm workspaces e não Turbo/Nx?**

- Esta fase tem apenas um app TypeScript real (mobile) e um pacote (contracts). Turbo só compensaria com cache distribuído ou múltiplos pipelines paralelos.
- A API roda em Gradle (sistema de build próprio) — pnpm não a controla.
- Adicionar Turbo depois é trivial; remover é doloroso.

## 3. Mobile (`apps/mobile`)

### Stack

- **Expo SDK 51+** (managed workflow).
- **React Native 0.74+** com **TypeScript strict**.
- **React Navigation v6** (native-stack + bottom-tabs).
- **Zustand** para estado global leve.
- **@expo-google-fonts** para Fraunces e Inter.
- **@expo/vector-icons** (Ionicons / Feather) para ícones.

### Organização interna

```
src/
├── app/
│   ├── navigation/       # RootNavigator + stacks
│   └── providers/        # ThemeProvider, FontProvider, etc.
├── components/           # Componentes reutilizáveis por categoria
│   ├── layout/
│   ├── buttons/
│   ├── forms/
│   ├── feedback/
│   ├── cards/
│   └── marketplace/      # Componentes específicos da home
├── screens/              # Telas, organizadas por fluxo
│   ├── public/           # Splash, Onboarding, Login, Register
│   ├── buyer/            # MarketplaceHome, Catalog, Cart, etc.
│   ├── seller/
│   └── admin/
├── services/             # http.ts e wrappers de API
├── stores/               # Zustand (auth.store.ts, cart.store.ts...)
├── hooks/                # useDebounce, useTheme, etc.
├── mocks/                # Dados de exemplo tipados
├── theme/                # Tokens (colors, spacing, radius, typography, shadows)
├── types/                # Tipos compartilhados (User, Book, Listing, Order...)
└── utils/                # format, assert, helpers
```

### Princípios

- **Sem regra de negócio no mobile.** O app apenas exibe dados e dispara ações via API.
- **Sem acesso direto ao banco.** Toda persistência passa pelo backend.
- **Composição > posicionamento absoluto.** Telas montadas a partir de componentes pequenos, não traduções pixel-perfect do Figma.
- **Tipagem forte.** Nada de `any` desnecessário.
- **Tema centralizado.** Cores, espaçamentos, raios e tipografia codificados como tokens.

## 4. API (`apps/api`)

### Stack

- **Kotlin 1.9.x** (target JVM 21).
- **Spring Boot 3.3.x** (Web, Validation, Data JPA, Security, Actuator).
- **Gradle Kotlin DSL** como build tool.
- **Flyway** para migrações.
- **PostgreSQL** como banco.
- **springdoc-openapi** para gerar a documentação a partir do código.
- **Jackson Kotlin module** para serialização.

### Organização interna — monólito modular

Cada domínio é uma "fatia vertical": controller + service + repository + dto + (futuras) entidades, isolados em pacote próprio:

```
com.culturaz.api/
├── CulturaZApplication.kt
├── config/               # Beans transversais (CORS, Jackson, OpenAPI)
├── auth/                 # Login, registro, JWT (futuro)
├── users/                # Usuário, endereços, perfil
├── sellers/              # Perfil de vendedor
├── books/                # Catálogo bibliográfico
├── categories/           # Categorias globais
├── listings/             # Anúncios de venda
├── favorites/            # Lista de desejos
├── cart/                 # Carrinho do comprador
├── orders/               # Pedidos e itens
├── reviews/              # Avaliações de vendedor
├── admin/                # Endpoints exclusivos admin
├── reports/              # Relatórios consolidados
└── shared/
    ├── exceptions/       # Hierarquia de exceções + GlobalExceptionHandler
    ├── responses/        # ApiError, PagedResponse
    ├── security/         # SecurityConfig, JWT helpers (futuro)
    └── validation/       # Validators customizados
```

### Por que monólito modular e não microsserviços?

- Estamos em fase de descoberta de domínio — limites entre serviços ainda não estão claros.
- Microsserviços trazem custo operacional (deploy, rede, observabilidade distribuída) que **não compensa** sem escala.
- A organização em módulos por pacote permite **extrair serviços no futuro** sem reescrever — basta promover um módulo para um deployable separado.
- Transações ACID entre módulos (ex: criar pedido + reduzir estoque) são triviais com um único banco.

### Princípios

- **Controllers fininhos:** recebem request, validam, delegam ao service, retornam DTO.
- **Services concentram regra de negócio.**
- **Repositories acessam apenas o banco.** Sem regra de negócio.
- **Entidades JPA nunca expostas via REST.** Sempre DTO de saída.
- **Tudo validado na entrada** com `jakarta.validation`.
- **Erros padronizados** via `GlobalExceptionHandler` retornando `ApiError`.

## 5. Banco de dados

- **PostgreSQL 16** rodando em container Docker.
- **UUID** como identificador primário (compatível com sistemas distribuídos futuros).
- **Flyway** versiona o schema. Cada mudança = nova migration `V<N>__descricao.sql`.
- **Enums armazenados como `VARCHAR` + `CHECK constraint`** — facilita evolução sem ALTER TYPE.
- **Timestamps `created_at` / `updated_at`** em toda tabela transacional.
- **Índices** em FKs, campos de busca (`email`, `isbn`) e filtros frequentes (`listings.status`).

Detalhamento em [banco-de-dados.md](banco-de-dados.md).

## 6. Comunicação

- **REST/JSON.** Contratos definidos em [packages/contracts/openapi.yaml](../packages/contracts/openapi.yaml).
- **OpenAPI como fonte de verdade.** Tanto código quanto documentação derivam dele.
- **CORS liberado em dev**, restrito por origem em produção.
- **Auth via JWT (Bearer)** quando implementado — header `Authorization: Bearer <token>`.

## 7. Evolução futura

A arquitetura é deliberadamente preparada para crescer sem reescrita:

| Capacidade        | Adição prevista                                                  | Quando entra                |
| ----------------- | ---------------------------------------------------------------- | --------------------------- |
| Cache             | Redis (sessões, lista de categorias, hot listings)               | quando latência subir       |
| Filas             | RabbitMQ ou Kafka (eventos de pedido, notificações)              | quando houver job assíncrono |
| Storage de mídia  | S3-compatible (MinIO local / AWS em prod) para capas de livros   | ao implementar upload       |
| Pagamento         | Integração via gateway (Pagar.me, Stripe, Mercado Pago)          | entrega 8                   |
| Frete             | Melhor Envio / Frenet                                            | entrega 8                   |
| Chat              | WebSocket via Spring + serviço dedicado                          | entrega 9                   |
| Busca             | OpenSearch ou Postgres `pg_trgm` + `tsvector`                    | quando catálogo crescer     |
| Observabilidade   | OpenTelemetry, Prometheus, Grafana                               | antes de produção           |
| Microsserviços    | Extrair `orders`, `payments`, `notifications` se houver escala   | só com necessidade real     |

## 8. Por que NÃO começar com microsserviços

> "If you can't build a well-structured monolith, you can't build well-structured microservices." — Simon Brown

Microsserviços resolvem problemas de **escala organizacional** e **isolamento de falha**. Em projeto novo, com um time pequeno (ou solo), eles introduzem:

- Latência adicional entre chamadas.
- Complexidade operacional (orquestração, service discovery, observabilidade).
- Necessidade de gestão de transações distribuídas (sagas).
- Sobrecarga de versionamento de contratos entre serviços.

CulturaZ começa monólito modular **bem desenhado**. Quando (se) houver justificativa concreta — equipes separadas, picos de escala desbalanceados, deploys independentes críticos — módulos individuais podem ser promovidos a serviços. A modularização por pacote já estabelece a fronteira.

## 9. Decisões registradas

ADRs vivem em [decisoes-arquiteturais.md](decisoes-arquiteturais.md). Cada decisão estrutural relevante (escolha de framework, padrão de organização, política de segurança) deve gerar um ADR.
