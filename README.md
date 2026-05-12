# CulturaZ

> Marketplace mobile-first para compra, venda e revenda de livros, desenvolvido em monorepo com **React Native (Expo)**, **Kotlin + Spring Boot** e **PostgreSQL**.

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Mobile](https://img.shields.io/badge/mobile-React%20Native%20%2B%20Expo-blue)]()
[![Backend](https://img.shields.io/badge/backend-Kotlin%20%2B%20Spring%20Boot%203-purple)]()
[![Database](https://img.shields.io/badge/database-PostgreSQL%2016-336791)]()

---

## Sumário

- [CulturaZ](#culturaz)
  - [Sumário](#sumário)
  - [Sobre o projeto](#sobre-o-projeto)
  - [Problema que resolve](#problema-que-resolve)
  - [Proposta de valor](#proposta-de-valor)
  - [🛠 Stack](#-stack)
  - [Arquitetura geral](#arquitetura-geral)
    - [🧩 Módulos da API (Kotlin + Spring Boot)](#-módulos-da-api-kotlin--spring-boot)
  - [📱 Componentes \& Telas do Mobile (React Native + TypeScript)](#-componentes--telas-do-mobile-react-native--typescript)
    - [Interface Component System](#interface-component-system)
    - [Fluxos de Telas](#fluxos-de-telas)
  - [🎯 Tipos de Dados (Domain Model)](#-tipos-de-dados-domain-model)
    - [Entidades Principais](#entidades-principais)
  - [🏗️ Estrutura do Monorepo](#️-estrutura-do-monorepo)
  - [🚀 Como rodar localmente](#-como-rodar-localmente)
    - [Pré-requisitos](#pré-requisitos)
    - [Setup inicial (5 minutos)](#setup-inicial-5-minutos)
    - [📚 Acessar interfaces](#-acessar-interfaces)
    - [🛠️ Comandos úteis](#️-comandos-úteis)
    - [🔍 Troubleshooting](#-troubleshooting)
  - [🎯 Próximas ações (Prioridade)](#-próximas-ações-prioridade)
  - [📖 Documentação detalhada](#-documentação-detalhada)
  - [📊 Status do projeto](#-status-do-projeto)
    - [Entrega 1 — Fundação ✅ (Atual)](#entrega-1--fundação--atual)
  - [🗺️ Roadmap até Entrega Final (30 de Junho)](#️-roadmap-até-entrega-final-30-de-junho)
    - [Fase 1️⃣ — Fundação **(Até 31 de Maio) ✅ Em andamento**](#fase-1️⃣--fundação-até-31-de-maio--em-andamento)
    - [Fase 2️⃣ — Autenticação + Catálogo **(1-15 de Junho)**](#fase-2️⃣--autenticação--catálogo-1-15-de-junho)
    - [Fase 3️⃣ — Carrinho + Checkout + Pedidos **(16-22 de Junho)**](#fase-3️⃣--carrinho--checkout--pedidos-16-22-de-junho)
    - [Fase 4️⃣ — Painel Vendedor + Admin MVP **(23-28 de Junho)**](#fase-4️⃣--painel-vendedor--admin-mvp-23-28-de-junho)
    - [Fase 5️⃣ — Polish, Testes \& Deploy **(29-30 de Junho)**](#fase-5️⃣--polish-testes--deploy-29-30-de-junho)
  - [📋 Roadmap Futuro (Pós-Entrega)](#-roadmap-futuro-pós-entrega)
  - [🤔 Por que essas tecnologias?](#-por-que-essas-tecnologias)
    - [Mobile: React Native + Expo](#mobile-react-native--expo)
    - [Backend: Kotlin + Spring Boot](#backend-kotlin--spring-boot)
    - [Banco: PostgreSQL 16](#banco-postgresql-16)
    - [Monorepo: pnpm workspaces](#monorepo-pnpm-workspaces)
  - [🙏 Observação](#-observação)

---

## Sobre o projeto

O **CulturaZ** é um marketplace especializado em livros — novos, usados e raros. Conecta **compradores**, **leitores**, **estudantes**, **sebos**, **pequenos vendedores** e **pessoas que desejam revender livros parados em casa**.

O projeto é construído como um produto real em evolução, não como um trabalho acadêmico descartável. Cada decisão técnica (monorepo, monólito modular, separação mobile/API, design system codificado) reflete escolhas que um produto de mercado tomaria.

## Problema que resolve

- **Para compradores:** livros novos são caros e a oferta de usados está espalhada em marketplaces genéricos onde a busca por título/edição é frustrante.
- **Para sebos e vendedores pequenos:** dependem de plataformas pesadas, com taxas altas e sem foco em livro como categoria.
- **Para quem tem livros parados em casa:** falta um canal simples para revender e dar nova vida ao acervo.

## Proposta de valor

- Catálogo focado em livro: título, autor, editora, ISBN, edição, condição.
- Comparação clara de **condição** (novo, seminovo, bom, regular, desgastado) e **reputação** do vendedor.
- Suporte nativo a **sebos** e **revendedores individuais** com perfis dedicados.
- UX mobile-first com Design System próprio, identidade editorial.

## 🛠 Stack

| Camada                  | Tecnologia                                       |
| ----------------------- | ------------------------------------------------ |
| **Mobile**              | React Native + Expo (managed) + TypeScript       |
| **Navegação**           | React Navigation v6 (native stack + bottom tabs) |
| **Estado**              | Zustand                                          |
| **Tipografia**          | Fraunces (títulos) + Inter (corpo)               |
| **Backend**             | Kotlin 1.9 + Spring Boot 3.3 + Java 21           |
| **Build backend**       | Gradle Kotlin DSL                                |
| **Banco**               | PostgreSQL 16                                    |
| **Migrações**           | Flyway                                           |
| **API**                 | REST (OpenAPI 3.1 como fonte de verdade)         |
| **Auth**                | JWT (implementação em progresso)                 |
| **Contêineres**         | Docker Compose                                   |
| **Monorepo**            | pnpm workspaces                                  |
| **CI/CD**               | GitHub Actions                                   |

## Arquitetura geral

```
┌──────────────────┐        REST / JSON         ┌────────────────────┐
│  Mobile (Expo)   │ ─────────────────────────▶ │  API (Spring Boot) │
│  React Native    │                            │  Kotlin · Java 21  │
│  TypeScript      │ ◀───────────────────────── │  Monólito modular  │
└──────────────────┘                            └──────────┬─────────┘
                                                           │ JPA / Flyway
                                                           ▼
                                                ┌────────────────────┐
                                                │  PostgreSQL 16     │
                                                │  Docker Compose    │
                                                └────────────────────┘
```

O backend é um **monólito modular** organizado por domínio (`users`, `sellers`, `books`, `listings`, `cart`, `orders`, `reviews`, `admin`). Microsserviços ficam fora de escopo até que haja necessidade concreta — ver [docs/decisoes-arquiteturais.md](docs/decisoes-arquiteturais.md).

Pagamento, frete, chat e IA estão **previstos** mas não implementados — ver [docs/roadmap.md](docs/roadmap.md).

### 🧩 Módulos da API (Kotlin + Spring Boot)

A API é estruturada em domínios independentes, cada um com suas responsabilidades:

| Módulo | Responsabilidade | Status |
|--------|-----------------|--------|
| **auth** | Autenticação, login, registro, geração de tokens JWT | 🔄 Em desenvolvimento |
| **users** | Gerenciamento de perfis, roles (CUSTOMER, SELLER, ADMIN, SUPPORT), status de conta | 🔄 Em desenvolvimento |
| **books** | Catálogo de livros com metadados completos (título, autor, ISBN, editora, ano) | 📋 Base estruturada |
| **listings** | Anúncios de livros (preço, condição, estoque, imagens, status) | 📋 Base estruturada |
| **sellers** | Perfis de vendedores (individual, bookstore, sebo), ratings e reputação | 🔄 Em desenvolvimento |
| **orders** | Gestão de pedidos, status, itens, histórico e rastreamento | 📋 Base estruturada |
| **cart** | Carrinho de compras multi-vendedor, adicionar/remover, checkout | 📋 Base estruturada |
| **reviews** | Avaliações de vendedores, comentários, tags e filtros | 📋 Base estruturada |
| **categories** | Categorias de livros com ícones, contadores e árvore de subcategorias | 📋 Base estruturada |
| **favorites** | Sistema de favoritos/wishlist por usuário | 📋 Base estruturada |
| **admin** | Painel administrativo, métricas, moderação e bloqueio de usuários | 🔄 Em desenvolvimento |
| **reports** | Denúncias de usuários/anúncios inadequados | 📋 Base estruturada |

---

## 📱 Componentes & Telas do Mobile (React Native + TypeScript)

### Interface Component System

**Buttons & Actions**
- `Button` — Primário, secundário, com loading states
- `FloatingActionButton` — FAB com ícone
- `IconButton` — Ações rápidas

**Cards & Displays**
- `BookCard` — Exibe livro com imagem, título, preço, condição
- `SellerCard` — Perfil do vendedor com rating
- `OrderCard` — Status e resumo de pedido
- `CategoryCard` — Categoria com ícone e contador
- `ReviewCard` — Avaliação com rating e comentário

**Forms & Input**
- `TextField` — Entrada de texto com validação
- `PasswordField` — Input seguro com toggle visibility
- `SearchInput` — Busca com debounce
- `SelectChip` — Seleção de filtros (condição, categoria)
- `SelectChipGroup` — Múltiplas seleções

**Layout**
- `AppScreen` — Wrapper com SafeArea, padding padrão
- `AppHeader` — Header customizável com back button
- `BottomTabBar` — Navegação inferior (Marketplace, Pedidos, Vendedor, Admin)
- `SectionHeader` — Título com ação (ex: "Ver todos")

**Feedback**
- `Badge` — Tag de status, condição, categoria
- `LoadingState` — Skeleton loaders
- `EmptyState` — Estado vazio com ilustração
- `ErrorState` — Erro com retry
- `StatusDot` — Indicador visual de status

**Marketplace Sections**
- `HeroBanner` — Imagem destaque no topo da home
- `CategoryCarousel` — Scroll horizontal de categorias
- `FlashOffersSection` — Oferta relâmpago com countdown
- `RecommendedBooksSection` — Livros recomendados por algoritmo
- `FeaturedSellerSection` — Destaque de seller ou sebo

### Fluxos de Telas

**Public (Não autenticado)**
```
SplashScreen → OnboardingScreen → LoginScreen / RegisterScreen
```

**Marketplace (Buyer/Comprador)**
```
MarketplaceHomeScreen → Busca/Filtros → BookDetailScreen → CartScreen → CheckoutScreen
                    ↓
              OrderHistoryScreen → OrderDetailScreen
```

**Seller/Vendedor (Em desenvolvimento)**
```
SellerDashboardScreen → AnúnciosScreen → CriarAnúncioScreen
                    ↓
              VendasScreen → DetalhesVendaScreen
```

**Admin (Em desenvolvimento)**
```
AdminDashboardScreen → ModeraçãoScreen → UsuáriosScreen
                    ↓
              RelatóriosScreen
```

---

## 🎯 Tipos de Dados (Domain Model)

### Entidades Principais

**👤 User** — Representa um usuário do sistema
```
ID | Email | Senha (bcrypt) | Nome | Telefone | Foto | Roles | Status | CreatedAt
- Roles: CUSTOMER, SELLER, ADMIN, SUPPORT
- Status: ACTIVE, PENDING_VERIFICATION, BLOCKED, DELETED
```

**📚 Book** — Catálogo de livros (dados imutáveis)
```
ID | Título | Autor | Editora | ISBN | Ano Publicação | Descrição | Categorias
```

**🏷️ BookListing** — Anúncio de um livro específico
```
ID | BookID | SellerID | Preço | Condição | Estoque | Imagens | Status | CreatedAt
- Condição: NEW, LIKE_NEW, GOOD, FAIR, DAMAGED
- Status: ACTIVE, DEACTIVATED, SOLD_OUT
```

**👨‍💼 Seller** — Perfil de vendedor
```
ID | UserID | TipoVendedor | Descrição | Localização | Rating | TotalVendas | Status
- TipoVendedor: INDIVIDUAL, BOOKSTORE, SEB
```

**🛒 Order** — Pedido de compra
```
ID | UserID | Items | SubTotal | Frete | Total | StatusPagamento | StatusEntrega | CreatedAt | UpdatedAt
- Items: Múltiplos livros de múltiplos vendedores
- StatusPagamento: PENDING, WAITING_PAYMENT, PAID, FAILED, REFUNDED
- StatusEntrega: CREATED, SHIPPED, DELIVERED, CANCELED
```

**💳 Cart** — Carrinho de compras
```
ID | UserID | Items | SubTotal | Timestamp
- Multi-seller: itens de diferentes vendedores
```

**⭐ Review** — Avaliação de vendedor
```
ID | OrderID | BuyerID | SellerID | Rating | Comentário | Tags | CreatedAt
- Rating: 1-5 stars
- Tags: "Entrega rápida", "Embalagem ótima", "Descrição precisa", etc
```

**📂 Category** — Categorias de livros
```
ID | Nome | Ícone | Descrição | Parent (para subcategorias)
```

**❤️ Favorite** — Wishlist/favoritos
```
ID | UserID | ListingID | CreatedAt
```

---

## 🏗️ Estrutura do Monorepo

```
CulturaZ/
├── 📱 apps/
│   ├── mobile/                    # React Native + Expo (iOS/Android)
│   │   ├── src/
│   │   │   ├── components/        # Design System & UI Kit
│   │   │   ├── screens/           # Telas (Public, Buyer, Seller, Admin)
│   │   │   ├── services/          # API calls & HTTP client
│   │   │   ├── stores/            # Zustand state management (auth, cart)
│   │   │   ├── types/             # TypeScript interfaces & domain models
│   │   │   ├── hooks/             # Custom hooks (useDebounce, useTheme)
│   │   │   ├── theme/             # Design tokens (colors, spacing, typography)
│   │   │   ├── mocks/             # Mock data for development
│   │   │   └── utils/             # Utilities (format, assert)
│   │   └── package.json
│   │
│   └── api/                       # Kotlin + Spring Boot 3.3
│       ├── src/main/kotlin/com/culturaz/api/
│       │   ├── auth/              # Login, registro, JWT
│       │   ├── users/             # Perfis, roles, status
│       │   ├── books/             # Catálogo de livros
│       │   ├── listings/          # Anúncios de livros
│       │   ├── sellers/           # Perfis de vendedores, ratings
│       │   ├── orders/            # Pedidos e rastreamento
│       │   ├── cart/              # Carrinho multi-vendedor
│       │   ├── reviews/           # Avaliações e comentários
│       │   ├── categories/        # Categorias de livros
│       │   ├── favorites/         # Sistema de favoritos
│       │   ├── admin/             # Dashboard administrativo
│       │   ├── reports/           # Denúncias e moderação
│       │   ├── config/            # Configurações, exceções, filtros
│       │   └── shared/            # Utilitários compartilhados
│       ├── src/main/resources/
│       │   ├── application.yml    # Configurações Spring
│       │   └── db/migration/      # Scripts Flyway (V001, V002...)
│       ├── build.gradle.kts       # Dependências e build Gradle
│       └── Dockerfile
│
├── 📦 packages/
│   └── contracts/
│       ├── openapi.yaml           # Especificação REST API (fonte de verdade)
│       ├── domain.md              # Glossário e modelos de domínio
│       └── package.json
│
├── 📚 docs/
│   ├── requisitos.md              # Visão, personas, user stories
│   ├── banco-de-dados.md          # Schema, ERD, índices
│   ├── arquitetura.md             # Decisões técnicas e justificativas
│   ├── regras-de-negocio.md       # Regras RN-001, RN-002...
│   ├── api-contracts.md           # Endpoints REST (tabela)
│   ├── figma-ui-ux.md             # Design System, componentes, fluxos
│   ├── roadmap.md                 # Fases de entrega (E1-E10)
│   ├── decisoes-arquiteturais.md  # ADRs (Architecture Decision Records)
│   └── portfolio-linkedin.md      # Como apresentar o projeto
│
├── 🐳 infra/
│   ├── docker-compose.yml         # PostgreSQL + Adminer
│   └── postgres/init/             # Scripts SQL de inicialização
│
├── 🚀 .github/workflows/           # CI/CD pipelines
│
├── 📄 pnpm-workspace.yaml          # Configuração do monorepo (pnpm)
├── package.json                    # Scripts root (pnpm mobile, pnpm api:run)
├── LICENSE
├── .env.example
└── README.md
```

## 🚀 Como rodar localmente

### Pré-requisitos

- **Node.js 20+** e **pnpm 9+** — [`npm i -g pnpm`](https://pnpm.io)
- **Java 21** — [Temurin recomendado](https://adoptium.net)
- **Docker Desktop** com Docker Compose
- **Git** para clonar o repositório

### Setup inicial (5 minutos)

```bash
# 1️⃣ Clonar o repositório
git clone https://github.com/DevAngeloOliveira/CulturaZ.git
cd CulturaZ

# 2️⃣ Copiar variáveis de ambiente
cp .env.example .env

# 3️⃣ Instalar dependências do monorepo (mobile + contracts)
pnpm install

# 4️⃣ Subir o banco de dados (PostgreSQL + Adminer)
pnpm infra:up

# ⏸️  PARAR AQUI - abra novos terminais para os próximos passos

# 5️⃣ Terminal 2: Rodar a API
pnpm api:run
# ✅ API disponível em http://localhost:8080
# ✅ Health check em http://localhost:8080/actuator/health

# 6️⃣ Terminal 3: Rodar o mobile
pnpm mobile
# ✅ Expo Dev Server pronto
# 📱 Abra o QR code no Expo Go (Android) ou pressione 'i' (iOS)
```

### 📚 Acessar interfaces

| Interface | URL | Usuário | Senha |
|-----------|-----|---------|-------|
| **Adminer** (DB) | http://localhost:8081 | culturaz | culturaz |
| **API Health** | http://localhost:8080/actuator/health | — | — |
| **Swagger UI** (em desenvolvimento) | http://localhost:8080/swagger-ui | — | — |

### 🛠️ Comandos úteis

```bash
# Mobile
pnpm mobile              # Inicia Expo Dev Server
pnpm mobile:typecheck    # Verifica tipos TypeScript (tsc --noEmit)
pnpm mobile:build        # Build de produção

# Backend API
pnpm api:run             # Inicia Spring Boot em dev (hot reload)
pnpm api:build           # Compila e roda testes
pnpm api:test            # Testa componentes específicos

# Infraestrutura
pnpm infra:up            # Sobe PostgreSQL + Adminer
pnpm infra:down          # Derruba containers
pnpm infra:logs          # Ver logs em tempo real

# Monorepo
pnpm install             # Instala dependências (top-level + workspaces)
pnpm -r build            # Build em todos os packages
```

### 🔍 Troubleshooting

**"erro ao conectar no PostgreSQL"**
```bash
# Garantir que containers estão rodando
docker ps
# Se não aparecer, subir de novo
pnpm infra:up
```

**"Porta 8080 já em uso"**
```bash
# Mudar porta na application.yml (apps/api/src/main/resources)
server.port=8081
```

**"Erro de dependências no mobile"**
```bash
# Limpar cache e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 🎯 Próximas ações (Prioridade)

- [ ] Implementar JWT completo (Spring Security + token refresh)
- [ ] Testes unitários para auth module
- [ ] Swagger UI / OpenAPI integration
- [ ] Dashboard admin básico
- [ ] Fluxo seller (ativar conta + criar anúncio)
- [ ] Integração de testes E2E (mobile + backend)

---

## 📖 Documentação detalhada

A documentação completa fica em [docs/](docs/):

| Arquivo                                                        | Conteúdo                                                |
| -------------------------------------------------------------- | ------------------------------------------------------- |
| [requisitos.md](docs/requisitos.md)                            | Visão, personas, requisitos funcionais e não-funcionais |
| [arquitetura.md](docs/arquitetura.md)                          | Visão técnica geral, justificativas, evolução           |
| [banco-de-dados.md](docs/banco-de-dados.md)                    | Modelo lógico, entidades, índices                       |
| [regras-de-negocio.md](docs/regras-de-negocio.md)              | Regras numeradas (RN-xxx)                               |
| [api-contracts.md](docs/api-contracts.md)                      | Tabela de endpoints REST                                |
| [figma-ui-ux.md](docs/figma-ui-ux.md)                          | Design System, tokens, fluxos                           |
| [roadmap.md](docs/roadmap.md)                                  | Fases de entrega                                        |
| [portfolio-linkedin.md](docs/portfolio-linkedin.md)            | Como apresentar o projeto                               |
| [decisoes-arquiteturais.md](docs/decisoes-arquiteturais.md)    | ADRs (Architecture Decision Records)                    |

## 📊 Status do projeto

### Entrega 1 — Fundação ✅ (Atual)

**Progresso: 60%**

O que já foi feito:
- ✅ Estrutura completa do monorepo (pnpm workspaces, mobile + API)
- ✅ Design System implementado (componentes, tokens, tema dark/light)
- ✅ Schema do banco PostgreSQL (13 tabelas principais)
- ✅ Autenticação skeleton (roteamento, guards)
- ✅ Estrutura modular da API (domínios separados)
- ✅ Configuração Docker Compose (PostgreSQL, Adminer)
- ✅ Tipos TypeScript sincronizados com API
- ✅ CI/CD basics (GitHub Actions)

O que ainda falta:
- 🔄 JWT tokens implementação real (login, registro, refresh)
- 🔄 Dashboard admin (métricas, moderação)
- 🔄 Fluxo seller/vendedor (criação de anúncios, análise)
- 🔄 Swagger/OpenAPI UI (documentação auto)

---

## 🗺️ Roadmap até Entrega Final (30 de Junho)

> **Objetivo:** Marketplace funcional com fluxo completo de compra-venda, pronto para produção.

### Fase 1️⃣ — Fundação **(Até 31 de Maio) ✅ Em andamento**
```
[████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 60%
```
**Escopo:**
- ✅ Estrutura do monorepo (pnpm workspaces)
- ✅ Design System completo (componentes, tokens)
- ✅ Schema PostgreSQL (13 tabelas)
- ✅ Esqueleto da API com domínios
- ✅ Docker Compose + CI/CD basics

**Próximo:** Finalizar JWT real

---

### Fase 2️⃣ — Autenticação + Catálogo **(1-15 de Junho)**
```
[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%
```
**Priority:** 🔴 CRÍTICO — Base para todo o resto

**Autenticação (JWT):**
- Endpoints: `POST /auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout`
- Spring Security + JWT tokens
- Validação de email
- Roles: CUSTOMER, SELLER, ADMIN

**Catálogo (Books & Categories):**
- CRUD completo de Books & Categories
- `GET /api/books` — Lista com paginação + filtros (categoria, preço, condição)
- `GET /api/books/:id` — Detalhes do livro
- `GET /api/books/search?q=termo` — Busca por título/autor/ISBN
- `GET /api/categories` — Árvore de categorias

**Telas no mobile:**
- `LoginScreen` + `RegisterScreen` → JWT armazenado
- `MarketplaceHomeScreen` — Categorias, destaques
- `SearchScreen` — Busca com filtros
- `BookDetailScreen` — Descrição, preço, seller, adicionar ao carrinho

---

### Fase 3️⃣ — Carrinho + Checkout + Pedidos **(16-22 de Junho)**
```
[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%
```
**Priority:** 🔴 CRÍTICO — Monetização

**Fluxo de Compra:**
- Cart persistido (Zustand + localStorage)
- Multi-vendedor no mesmo carrinho
- Cálculo automático de frete (simulado por agora)

**Endpoints:**
- `POST /api/cart` — Adiciona item
- `DELETE /api/cart/:id` — Remove item
- `GET /api/cart` — Retorna carrinho
- `POST /api/orders` — Cria pedido (checkout)
- `GET /api/orders` — Histórico de pedidos
- `GET /api/orders/:id` — Detalhes do pedido

**Pagamento:** Simulado (badge "pago", sem integração real)

**Telas no mobile:**
- `CartScreen` — Resumo, frete, total
- `CheckoutScreen` — Endereço de entrega
- `OrderHistoryScreen` — Pedidos anteriores

---

### Fase 4️⃣ — Painel Vendedor + Admin MVP **(23-28 de Junho)**
```
[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%
```
**Priority:** 🟡 IMPORTANTE — Experiência completa

**Painel Vendedor (MVP):**
- Ativação de conta como seller
- Dashboard com métricas básicas (total de anúncios, vendas, rating)
- Criar/editar/deletar anúncios

**Endpoints:**
- `POST /api/sellers/activate` — Ativa como vendedor
- `GET /api/sellers/:id/dashboard` — Métricas
- `POST /api/listings` — Cria anúncio
- `PATCH /api/listings/:id` — Edita
- `DELETE /api/listings/:id` — Remove

**Painel Admin (MVP):**
- Dashboard com métricas globais (GMV total, número de usuários, pedidos)
- Lista de usuários com possibilidade de bloquear

**Endpoints:**
- `GET /api/admin/dashboard` — Métricas globais
- `GET /api/admin/users` — Lista usuários
- `PATCH /api/admin/users/:id/status` — Bloqueia/ativa usuário

**Telas no mobile:**
- `SellerDashboardScreen` — Métricas e ações rápidas
- `ListingsScreen` — Lista de anúncios
- `CreateListingScreen` — Criar novo anúncio
- `AdminDashboardScreen` — Métricas e moderação básica

---

### Fase 5️⃣ — Polish, Testes & Deploy **(29-30 de Junho)**
```
[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%
```
**Priority:** 🟠 REFINAMENTOS

**Quality Assurance:**
- Testes unitários (auth, cart, orders)
- Testes de integração (API)
- Testes E2E (fluxo comprador)

**Refinamentos:**
- Tratamento de erros melhorado
- Loading states + feedback visual
- Validações no front + back
- Documentação Swagger/OpenAPI

**Deploy:**
- Build de produção (mobile)
- Deploy da API (Docker + CI/CD)
- Dados de seed (livros, categorias, vendedores)
- Guia de uso para apresentação

---

## 📋 Roadmap Futuro (Pós-Entrega)

Essas features ficarão para versão 2.0+ (não entram no deadline de junho):

| Feature | Descrição | Estimativa |
|---------|-----------|-----------|
| **Avaliações & Reputação** | Reviews do seller com stars e comentários | Julho |
| **Pagamento Real** | Stripe / Mercado Pago integrado | Agosto |
| **Frete Real** | Cálculo com Correios / Sedex | Agosto |
| **Chat & Notificações** | WebSocket para mensagens em tempo real | Setembro |
| **Analytics Avançado** | Relatórios e insights para sellers | Outubro |
| **Recomendações ML** | Busca semântica e sugestões personalizadas | Novembro+ |

- **Repositório:** https://github.com/DevAngeloOliveira/CulturaZ
- **Figma — Design System v0.1:** https://www.figma.com/design/3GJETOFgD8T1Vkiwkbp4YU/CulturaZ
- **Issues abertos:** [GitHub Issues](https://github.com/DevAngeloOliveira/CulturaZ/issues)

---

## 🤔 Por que essas tecnologias?

### Mobile: React Native + Expo
- **Escrita única** → Deploy Android + iOS sem duplicação
- **Expo Managed** → Zero configuração nativa, focus no produto
- **TypeScript** → Type safety desde o dia 1, menos bugs em produção
- **Fast Refresh** → Dev experience excelente (hot reload <100ms)

### Backend: Kotlin + Spring Boot
- **Kotlin** → Sintaxe elegante, menos boilerplate que Java puro, null safety
- **Spring Boot 3.3** → Padrão da indústria, suporte a GraalVM (compilação nativa futura)
- **Java 21** → Project Loom (virtual threads), records, pattern matching
- **Modular** → Domínios independentes facilita testes e escala

### Banco: PostgreSQL 16
- **JSON support** → Flexibilidade sem NoSQL
- **Full-text search** → Busca nativa (melhor que Elasticsearch para casos simples)
- **Arrays & Ranges** → Tipos ricos para negócio de livros
- **Flyway** → Versionamento de schema como código

### Monorepo: pnpm workspaces
- **Linking local** → Mudança em `contracts/` reflete no mobile automaticamente
- **Disk space** → Deduplica node_modules, 5x menor que npm/yarn
- **Workspace protocol** → Versões sincronizadas por padrão

---

## 🙏 Observação

Este projeto é desenvolvido em contexto acadêmico, mas é **modelado como produto real**: arquitetura escalável, documentação profissional, separação clara de responsabilidades, padrões de mercado. O objetivo é servir como portfólio técnico e demonstrar capacidade de levar um produto da ideia à fundação executável.
