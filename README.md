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
  - [Stack](#stack)
  - [Arquitetura geral](#arquitetura-geral)
  - [Estrutura do monorepo](#estrutura-do-monorepo)
  - [Como rodar localmente](#como-rodar-localmente)
    - [Pré-requisitos](#pré-requisitos)
    - [Setup inicial](#setup-inicial)
    - [Comandos úteis](#comandos-úteis)
  - [Documentação](#documentação)
  - [Status do projeto](#status-do-projeto)
  - [Roadmap](#roadmap)
  - [Links úteis](#links-úteis)
  - [Observação](#observação)

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

## Stack

| Camada                  | Tecnologia                                       |
| ----------------------- | ------------------------------------------------ |
| Mobile                  | React Native + Expo (managed) + TypeScript       |
| Navegação               | React Navigation v6 (native stack + bottom tabs) |
| Estado                  | Zustand                                          |
| Tipografia              | Fraunces (títulos) + Inter (corpo)               |
| Backend                 | Kotlin 1.9 + Spring Boot 3.3 + Java 21           |
| Build backend           | Gradle Kotlin DSL                                |
| Banco                   | PostgreSQL 16                                    |
| Migrações               | Flyway                                           |
| API                     | REST (OpenAPI 3.1 como fonte de verdade)         |
| Auth (futura)           | JWT                                              |
| Contêineres             | Docker Compose                                   |
| Monorepo                | pnpm workspaces                                  |
| CI                      | GitHub Actions                                   |

## Arquitetura geral

```
┌──────────────────┐        REST / JSON        ┌────────────────────┐
│  Mobile (Expo)   │ ────────────────────────▶ │  API (Spring Boot) │
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

## Estrutura do monorepo

```
CulturaZ/
├── apps/
│   ├── mobile/                    # App React Native (Expo)
│   └── api/                       # API Kotlin Spring Boot
├── packages/
│   └── contracts/                 # OpenAPI + glossário de domínio
├── docs/                          # Documentação técnica e de produto
├── infra/                         # docker-compose, scripts de banco
├── .github/workflows/             # CI/CD
├── README.md
├── LICENSE
├── .env.example
├── pnpm-workspace.yaml
└── package.json
```

## Como rodar localmente

### Pré-requisitos

- **Node.js 20+** e **pnpm 9+** (`npm i -g pnpm`)
- **Java 21** (Temurin recomendado)
- **Docker Desktop** com Docker Compose
- **Expo Go** no celular (Android/iOS) — opcional para preview

### Setup inicial

```bash
# 1. Clonar
git clone https://github.com/DevAngeloOliveira/CulturaZ.git
cd CulturaZ

# 2. Copiar variáveis de ambiente
cp .env.example .env

# 3. Instalar dependências do monorepo (mobile + contracts)
pnpm install

# 4. Subir o banco de dados
pnpm infra:up
# PostgreSQL em localhost:5432 (user: culturaz / pass: culturaz)
# Adminer em http://localhost:8081

# 5. Rodar a API (em outro terminal)
pnpm api:run
# API em http://localhost:8080  |  Health: /actuator/health

# 6. Rodar o mobile (em outro terminal)
pnpm mobile
# Abrir o QR no Expo Go ou pressionar 'a' (Android) / 'i' (iOS)
```

### Comandos úteis

| Comando                  | O que faz                                       |
| ------------------------ | ----------------------------------------------- |
| `pnpm mobile`            | Inicia o Expo Dev Server                        |
| `pnpm mobile:typecheck`  | Roda `tsc --noEmit` no app mobile               |
| `pnpm api:run`           | Sobe a API com `./gradlew bootRun`              |
| `pnpm api:build`         | Compila e roda testes do backend                |
| `pnpm infra:up`          | Sobe PostgreSQL + Adminer via Docker Compose    |
| `pnpm infra:down`        | Derruba containers                              |

## Documentação

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

## Status do projeto

**Entrega 1 — Fundação (atual):** estrutura do monorepo, documentação, Design System, tela home do marketplace, fluxo público (Splash/Onboarding/Login/Register), esqueleto da API Kotlin com schema do banco, Docker Compose, contratos OpenAPI iniciais e CI.

> Esta entrega não inclui autenticação real, CRUDs completos, pagamento, frete, chat ou IA. Veja [roadmap.md](docs/roadmap.md).

## Roadmap

1. **Entrega 1 — Fundação** ✅
2. **Entrega 2 — Autenticação** (JWT, registro, login, controle de roles)
3. **Entrega 3 — Catálogo** (livros, categorias, anúncios, busca, filtros)
4. **Entrega 4 — Compra** (carrinho, checkout, pedidos com pagamento simulado)
5. **Entrega 5 — Vendedor** (ativação, dashboard, gestão de anúncios e pedidos)
6. **Entrega 6 — Admin** (moderação, categorias globais, relatórios)
7. **Entrega 7 — Confiança** (avaliações, reputação, audit log completo)
8. **Entrega 8 — Pagamento real e frete real** (integrações terceirizadas)
9. **Entrega 9 — Comunicação** (chat comprador-vendedor, notificações)
10. **Entrega 10 — Inteligência** (recomendações, busca semântica)

## Links úteis

- **Repositório:** https://github.com/DevAngeloOliveira/CulturaZ
- **Figma — Design System v0.1:** https://www.figma.com/design/3GJETOFgD8T1Vkiwkbp4YU/CulturaZ

## Observação

Este projeto é desenvolvido em contexto acadêmico, mas é **modelado como produto real**: arquitetura escalável, documentação profissional, separação clara de responsabilidades, padrões de mercado. O objetivo é servir como portfólio técnico e demonstrar capacidade de levar um produto da ideia à fundação executável.
