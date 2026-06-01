# CulturaZ

> Marketplace mobile-first para compra, venda e revenda de livros — fluxo completo de **comprador, vendedor e administrador** em um monorepo com React Native (Expo), Kotlin + Spring Boot e PostgreSQL.

[![Status](https://img.shields.io/badge/status-MVP%20completo-brightgreen)](#status-do-projeto)
[![Mobile](https://img.shields.io/badge/mobile-Expo%20SDK%2051-blue)](#stack)
[![Backend](https://img.shields.io/badge/backend-Spring%20Boot%203.3-purple)](#stack)
[![DB](https://img.shields.io/badge/database-PostgreSQL%2016-336791)](#stack)
[![Endpoints](https://img.shields.io/badge/REST%20endpoints-53-success)](packages/contracts/openapi.yaml)

## TL;DR

App **React Native + TypeScript** integrado a uma API **Spring Boot + Kotlin** com 53 endpoints REST, autenticação JWT (refresh + rotação), 13 tabelas em PostgreSQL com Flyway, e três personas vivas (CUSTOMER, SELLER, ADMIN) gateadas no router por role. Stack roda em Docker Compose. Tipos do mobile gerados a partir do OpenAPI. Sem mocks no app, sem dependências nativas extras além do Expo SDK.

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Status do projeto](#status-do-projeto)
- [Funcionalidades por perfil](#funcionalidades-por-perfil)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Estrutura do monorepo](#estrutura-do-monorepo)
- [Como rodar localmente](#como-rodar-localmente)
- [Credenciais de desenvolvimento](#credenciais-de-desenvolvimento)
- [Documentação adicional](#documentação-adicional)
- [Decisões técnicas em destaque](#decisões-técnicas-em-destaque)
- [Roadmap futuro](#roadmap-futuro)
- [Autor e licença](#autor-e-licença)

---

## Sobre o projeto

CulturaZ é uma plataforma mobile-first para compra, venda e revenda de livros, com proposta de:

- **Catálogo focado em livro** — título, autor, editora, ISBN, ano, condição (NEW/LIKE_NEW/GOOD/FAIR/DAMAGED) e estoque por anúncio.
- **Confiança via reputação** — avaliações pós-entrega com estrelas, tags e comentário, alimentando o rating médio do vendedor.
- **Suporte a três tipos de vendedor** — vendedor individual, livraria e sebo, com perfis e fluxos dedicados.
- **Moderação centralizada** — todo anúncio passa por `PENDING_REVIEW` e só vira público quando admin aprova.
- **Pagamento simulado** — checkout completo do ponto de vista de fluxo (carrinho, endereço, status do pedido), com `paymentMethod=SIMULATED` enquanto o gateway real não é integrado.

Desenvolvido em contexto acadêmico mas **modelado como produto real**: separação por domínios, contratos OpenAPI como fonte de verdade, migrações versionadas, role-based access em todos endpoints sensíveis, navegação por role no router do mobile.

---

## Status do projeto

O ciclo de implementação foi entregue em **8 sprints**, todas concluídas. App e API estão integrados ponta a ponta — typecheck e lint zerados, dependências alinhadas via `expo install --check`.

| Sprint                                       | Status |
| -------------------------------------------- | ------ |
| 0 — Desbloquear boot (sem dep nativa extra)  | ✅      |
| 1 — Home consumindo API real                 | ✅      |
| 2 — Catálogo, Filtros, Detalhes, Favoritos   | ✅      |
| 3 — Carrinho e Checkout                      | ✅      |
| 4 — Pedidos e Avaliações                     | ✅      |
| 5 — Perfil e Endereços                       | ✅      |
| 6 — Fluxo Vendedor                           | ✅      |
| 7 — Fluxo Admin                              | ✅      |
| 8 — Hardening (toasts, lint, mocks removidos)| ✅      |

Métricas do mobile:

- **~40 telas** distribuídas em 4 buckets de navegação (public, buyer, seller, admin).
- **~50 componentes** reutilizáveis (cards, forms, feedback, marketplace, layout).
- **30 hooks de query/mutation** (TanStack Query) organizados por domínio.
- **~37 endpoints REST consumidos** sobre os 53 totais (não usamos `/api/health`, alguns `/api/admin/*` raros, e admin login não tem fluxo separado — login normal + role check basta).
- **2 stores Zustand** (`auth`, `catalog`) + `useToastStore` interno.

---

## Funcionalidades por perfil

**Comprador (CUSTOMER)** — auth completa (Splash/Onboarding/Login/Registro) com sessão em `expo-secure-store` e refresh em 401; Home com categorias, ofertas-relâmpago, recomendados, vendedor em destaque e último pedido em andamento; catálogo com busca debounced (350ms), paginação infinita e modal de filtros (categoria, condição, faixa de preço, cidade/UF); detalhes do livro com favoritar, carrinho e card do vendedor; carrinho com stepper respeitando `stockQuantity`; checkout selecionando endereço (com fallback inline), confirmando `paymentMethod=SIMULATED`; pedidos em abas com timeline visual `CREATED → CONFIRMED → IN_PREPARATION → SHIPPED → DELIVERED`, cancelamento condicional e avaliação pós-`DELIVERED` (5 estrelas, tags, comentário de 500 chars); perfil com edição de nome/telefone e CRUD de endereços.

**Vendedor (SELLER)** — ativação por form de loja (`storeName`, descrição, tipo INDIVIDUAL/BOOKSTORE/SEBO) com `forceRefreshSession()` reemitindo o JWT já com a role nova; painel com 6 MetricCards (ativos, pendentes, esgotados, pedidos abertos, vendas 30d, receita 30d); CRUD de anúncios com badge de status, ações Pausar/Reativar/Remover e criação que faz busca debounced de livro existente *ou* cadastro inline de livro novo; pedidos recebidos com CTA dinâmica de transição de status; relatórios com barras horizontais custom (zero dep nova); página de reputação com média e lista de reviews.

**Admin** — painel com 6 MetricCards globais (usuários, vendedores, ativos, em moderação, pedidos hoje, GMV 30d); gestão de usuários com filtros por status e bloqueio/desbloqueio com motivo; moderação de anúncios em `PENDING_REVIEW` (aprovar/bloquear invalida cascata de `queryKeys.listings.all`); CRUD de categorias via modal; auditoria de pedidos com payment status; relatórios visuais.

**Roteamento por role** — `RootNavigator` escolhe a árvore baseada em `useAuthStore.activeRole`, com prioridade `ADMIN > SUPPORT > SELLER > CUSTOMER`. Admin cai direto em `AdminTabs`, vendedor em `SellerTabs`, comprador em `BuyerTabs`. Dashboards de admin/seller têm um botão de swap pra voltar ao modo comprador sem logout.

---

## Stack

| Camada                  | Tecnologia                                                |
| ----------------------- | --------------------------------------------------------- |
| **Mobile**              | React Native 0.74 · Expo SDK 51 · TypeScript 5.3          |
| **Navegação**           | React Navigation v6 (native stack + bottom tabs)          |
| **State server**        | TanStack Query v5                                         |
| **State client**        | Zustand 4                                                 |
| **Tipos da API**        | `openapi-typescript` (gerado de `packages/contracts`)     |
| **Sessão**              | `expo-secure-store` (Bearer + refresh single-flight)      |
| **Tipografia**          | Fraunces (display) + Inter (corpo)                        |
| **Backend**             | Kotlin 1.9 · Spring Boot 3.3 · Java 21                    |
| **Build backend**       | Gradle Kotlin DSL                                         |
| **Banco**               | PostgreSQL 16                                             |
| **Migrações**           | Flyway (`V001…V013`)                                      |
| **Contratos**           | OpenAPI 3.1 (fonte de verdade — `packages/contracts`)     |
| **Auth**                | JWT (HS512) com refresh rotativo                          |
| **Contêineres**         | Docker Compose (API + PostgreSQL)                         |
| **Monorepo**            | pnpm workspaces (`node-linker=hoisted`)                   |
| **CI**                  | GitHub Actions (`ci-mobile.yml`, `ci-api.yml`)            |

---

## Arquitetura

```
┌──────────────────┐        REST / JSON         ┌────────────────────┐
│  Mobile (Expo)   │ ─────────────────────────▶ │  API (Spring Boot) │
│  React Native    │   Bearer JWT + refresh     │  Kotlin · Java 21  │
│  TypeScript      │ ◀───────────────────────── │  Monólito modular  │
└──────────────────┘                            └──────────┬─────────┘
                                                           │ JPA + Flyway
                                                           ▼
                                                ┌────────────────────┐
                                                │  PostgreSQL 16     │
                                                │  Docker Compose    │
                                                └────────────────────┘
```

### Backend — monólito modular por domínio

Cada domínio tem seu controller, service, repository e testes isolados. Acoplamento entre módulos só por DTO + chamadas via service.

```
auth         · login, registro, refresh, /me, JWT HS512
users        · perfil, endereços, atualização de dados
sellers      · ativação, perfil, dashboard, reputação, CRUD de listings, gestão de pedidos
books        · catálogo (search com filtros, getById, create)
categories   · listagem pública + CRUD admin
listings     · catálogo público de anúncios com filtros
favorites    · adicionar/remover/listar
cart         · carrinho do usuário com cálculo de subtotal
orders       · checkout (SIMULATED), histórico, cancelamento
reviews      · avaliações pós-DELIVERED, alimentam rating do vendedor
admin        · dashboard global, moderação, gestão de usuários/categorias/pedidos
```

### Mobile — camadas e fluxo de dados

```
Tela (componente fino)
   ↓
hooks/api/useXxx (TanStack Query)
   ↓
services/api/xxx.ts (cliente tipado por endpoint)
   ↓
services/http.ts (Bearer + timeout 15s + refresh single-flight em 401)
   ↓
fetch ─→ API
```

- **Tipos da API** vivem em `types/api.generated.ts` (gerado por `pnpm --filter mobile gen:api`).
- **Adapters API → tipos locais** em `utils/adapters.ts` (`toListing`, `toCategory`, `toOrder`).
- **Tela** não conhece HTTP: só consome hooks, recebe dados já no formato local.
- **Auth store** (`Zustand`) é a fonte da verdade de sessão; mutations relevantes (perfil, ativação de vendedor) sincronizam o `user` no store para a UI reagir sem precisar recarregar.

### Navegação no mobile

```
RootNavigator
├── PublicStack         (deslogado)
│   ├── Splash → Onboarding → Login/Register/ForgotPassword
├── BuyerTabs           (CUSTOMER ativo)
│   ├── HomeStack       (Home → BookDetails → Favorites → Cart → Checkout → OrderDetails → Review)
│   ├── SearchStack     (Catalog → BookDetails → Filters[modal])
│   ├── ActivateSeller  (form de virada de role)
│   ├── OrdersStack     (MyOrders → OrderDetails → Review)
│   └── ProfileStack    (Profile → Addresses)
├── SellerTabs          (SELLER ativo)
│   ├── DashboardStack  (Dashboard → Reputation)
│   ├── ListingsStack   (MyListings → CreateListing)
│   ├── OrdersStack     (SellerOrders → SellerOrderDetails)
│   └── Reports
└── AdminTabs           (ADMIN ativo)
    ├── DashboardStack  (Dashboard → AdminOrders → AdminOrderDetails)
    ├── Users
    ├── Moderation
    ├── Categories
    └── Reports
```

---

## Estrutura do monorepo

```
CulturaZ/
├── apps/
│   ├── mobile/              React Native + Expo (App.tsx, src/{app,components,screens,services,stores,hooks,theme,types,utils})
│   └── api/                 Spring Boot 3.3 · Kotlin (src/main/kotlin/com/culturaz/api/{auth,users,sellers,books,categories,listings,favorites,cart,orders,reviews,admin,shared,config} + db/migration V001…V013)
├── packages/contracts/      openapi.yaml (53 endpoints) + domain.md
├── docs/                    ver "Documentação adicional"
├── infra/                   docker-compose.yml, smoke-test.py, postgres/init/
├── .github/workflows/       ci-mobile.yml + ci-api.yml
├── pnpm-workspace.yaml
├── package.json             scripts root agregadores
└── README.md
```

---

## Como rodar localmente

### Pré-requisitos

- **Node.js 20+** e **pnpm 9+** — `npm i -g pnpm`
- **Java 21** — [Temurin recomendado](https://adoptium.net)
- **Docker Desktop** com Docker Compose v2
- **Expo Go** no celular *ou* emulador Android/iOS

### Setup (3 passos)

```bash
# 1. Clonar + instalar dependências
git clone https://github.com/DevAngeloOliveira/CulturaZ.git
cd CulturaZ
pnpm install

# 2. Subir backend completo (API + PostgreSQL via Docker)
pnpm stack:up
# Aguarde ~30s até API ficar "healthy" — confira com:
docker ps

# 3. Rodar o mobile
pnpm mobile
```

> Em `apps/mobile/.env`, ajuste `EXPO_PUBLIC_API_URL` para o IP da sua máquina na LAN (ex.: `http://192.168.0.7:8080`) se for testar em celular físico. Para emulador Android Studio, `http://10.0.2.2:8080` também funciona.

### Verificar saúde

| Recurso        | URL                                              |
| -------------- | ------------------------------------------------ |
| Health da API  | http://localhost:8080/actuator/health            |
| OpenAPI JSON   | http://localhost:8080/v3/api-docs                |
| Swagger UI     | http://localhost:8080/swagger-ui/index.html      |
| PostgreSQL     | `localhost:5432` · user `culturaz` · db `culturaz` |

### Comandos úteis

```bash
# Mobile
pnpm mobile                       # Expo Dev Server
pnpm mobile:typecheck             # tsc --noEmit
pnpm mobile:lint                  # eslint
pnpm --filter mobile gen:api      # regera types/api.generated.ts a partir do openapi.yaml

# Backend
pnpm api:run                      # bootRun (hot reload)
pnpm api:build                    # build + testes
pnpm api:test                     # testes

# Infra
pnpm infra:up                     # só PostgreSQL
pnpm infra:down
pnpm stack:up                     # PostgreSQL + API (build)
pnpm stack:down
pnpm stack:logs                   # logs da API em tempo real
pnpm stack:smoke                  # smoke test E2E (Python)
```

### Troubleshooting comum

- **Celular não alcança a API** — confirme que celular e PC estão na mesma Wi-Fi, abra `http://<seu-IP>:8080/api/categories` no browser do celular. Se travar, é firewall do Windows na 8080 (libere em PowerShell admin: `New-NetFirewallRule -DisplayName "CulturaZ 8080" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow -Profile Private`).
- **"O servidor demorou para responder"** — mesmo sintoma do firewall, ou `EXPO_PUBLIC_API_URL` apontando para `localhost` em vez do IP da LAN.
- **403 ao virar vendedor** — JWT antigo sem a role nova. Logout + login resolve. O fluxo do app agora força `forceRefreshSession()` logo após a ativação para evitar isso.

---

## Credenciais de desenvolvimento

O Flyway popula três usuários de seed (hashes bcrypt no script [V013](apps/api/src/main/resources/db/migration/V013__seed_local_admin_user.sql)):

| Perfil    | E-mail                    | Roles            |
| --------- | ------------------------- | ---------------- |
| Admin     | `admin@culturaz.local`    | ADMIN, CUSTOMER  |
| Comprador | `buyer@culturaz.local`    | CUSTOMER         |
| Vendedor  | `seller@culturaz.local`   | SELLER, CUSTOMER |

As senhas de login local são usadas pelo script [infra/smoke-test.py](infra/smoke-test.py) — abra esse arquivo para copiá-las. **Apenas para ambiente local**; em produção, seeds com credenciais reais devem vir de um vault.

---

## Documentação adicional

Os arquivos abaixo aprofundam decisões e contratos. Todos vivem em [docs/](docs/).

| Arquivo                                                          | Conteúdo                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------- |
| [requisitos.md](docs/requisitos.md)                              | Visão, personas, requisitos funcionais e não-funcionais |
| [arquitetura.md](docs/arquitetura.md)                            | Visão técnica geral, justificativas, evolução           |
| [banco-de-dados.md](docs/banco-de-dados.md)                      | Modelo lógico, entidades, índices                       |
| [regras-de-negocio.md](docs/regras-de-negocio.md)                | Regras numeradas (RN-xxx)                               |
| [api-contracts.md](docs/api-contracts.md)                        | Tabela de endpoints REST                                |
| [figma-ui-ux.md](docs/figma-ui-ux.md)                            | Design System, tokens, fluxos                           |
| [plano-frontend.md](docs/plano-frontend.md)                      | Plano de execução das 8 sprints do mobile               |
| [roadmap.md](docs/roadmap.md)                                    | Próximas fases (pós-MVP)                                |
| [decisoes-arquiteturais.md](docs/decisoes-arquiteturais.md)      | ADRs                                                    |

Contrato OpenAPI (53 endpoints): [packages/contracts/openapi.yaml](packages/contracts/openapi.yaml).

---

## Decisões técnicas em destaque

- **Tipos do mobile gerados do OpenAPI** — `openapi-typescript` cria `types/api.generated.ts` automaticamente. Mudou backend → roda `pnpm --filter mobile gen:api` e o front pega o drift na compilação.
- **Refresh de JWT single-flight** — `services/http.ts` mantém um `Promise` em voo enquanto um refresh acontece, para várias requisições paralelas em 401 não dispararem N refreshes. Em falha terminal, chama o `setUnauthorizedHandler` que limpa sessão e cache do React Query.
- **`forceRefreshSession()` exposto** — usado no fluxo de ativação de vendedor para reemitir JWT com a role nova antes da próxima chamada. Sem isso, o usuário continuaria com `roles: ["CUSTOMER"]` no token e veria 403 ao tentar publicar.
- **Adapters API → tipos locais** — backend devolve `price: number`, mobile usa `Money = string` no domínio. `utils/adapters.ts` faz a ponte em um lugar só, tipos locais (`Book`, `BookListing`, etc.) recebem campos derivados como `discountPercentage` e `isFavorite`.
- **Prioridade de roles invertida** — `ADMIN > SUPPORT > SELLER > CUSTOMER` em `pickActiveRole`. Admin que loga cai em `AdminTabs`, não em `BuyerTabs`. Swap manual existe para quando admin quer comprar.
- **Toasts com Zustand + Animated** — `useToastStore` global, `ToastHost` ouve e renderiza com fade + translate. Zero dep nativa nova; pode ser invocado de qualquer mutation via `toast.success('…')`.
- **Telas finas, hooks gordos** — telas só compõem; hooks invalidam queries certas; services chamam endpoints; HTTP cuida de auth. Cada camada tem uma responsabilidade.
- **Sem mocks no app** — toda tela consome API real. Mocks ficaram só durante a construção e foram apagados na Sprint 8.

---

## Roadmap futuro

Fora do escopo atual, mas previstos: pagamento real (Stripe/MP — hoje `SIMULATED`), frete com Correios/Melhor Envio (hoje `shippingAmount=0`), chat comprador↔vendedor (UI mostra "em breve"), upload de imagens em S3 (hoje `coverImageUrl` é string externa), push notifications via Expo Push, i18n + dark mode (tokens prontos, faltam provider e dicionários), validação de forms com Zod (avaliar conforme forms ficarem complexos). Fora do backlog ativo: editoras, campanhas e pré-vendas — entram só se virarem requisito.

---

## Autor e licença

- **Autor:** Ângelo Oliveira · [dev.angelooliveira@gmail.com](mailto:dev.angelooliveira@gmail.com)
- **Repositório:** [github.com/DevAngeloOliveira/CulturaZ](https://github.com/DevAngeloOliveira/CulturaZ)
- **Figma — Design System v0.1:** [figma.com/design/3GJETOFgD8T1Vkiwkbp4YU/CulturaZ](https://www.figma.com/design/3GJETOFgD8T1Vkiwkbp4YU/CulturaZ)
- **Licença:** MIT (ver `package.json`)

Projeto desenvolvido em contexto acadêmico, modelado como produto real para servir como portfólio técnico.
