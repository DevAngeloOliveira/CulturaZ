# CulturaZ — Decisões Arquiteturais (ADRs)

ADRs (Architecture Decision Records) registram **por que** uma decisão foi tomada, **o que** foi escolhido e **quais alternativas** foram consideradas. O objetivo é ter um histórico navegável para entender escolhas estruturais sem precisar rastrear conversas ou commits.

Formato adotado: ADR curto, em uma página. Cada ADR tem status (`Proposed`, `Accepted`, `Superseded`).

---

## ADR-001 — Monorepo com pnpm workspaces

**Status:** Accepted (2025-05)

**Contexto.** O projeto envolve mobile (TypeScript), backend (Kotlin/Gradle) e contratos compartilhados (OpenAPI). Precisamos decidir como organizar o código.

**Decisão.** Usar **monorepo único** com `pnpm workspaces` controlando `apps/mobile` e `packages/contracts`. O backend (`apps/api`) vive no mesmo repositório mas é controlado pelo Gradle (fora dos workspaces pnpm).

**Alternativas consideradas:**
- **Multi-repo.** Rejeitado: contratos drift entre repos é a maior fonte de bug em projetos cliente-servidor; clone/setup mais lento.
- **Monorepo com Turborepo.** Rejeitado **por enquanto**: só vale com cache distribuído ou múltiplos pipelines. Pode entrar depois sem refatoração.
- **Monorepo com Nx.** Rejeitado: mais opinativo que necessário para o tamanho atual.

**Consequências.**
- Setup local: `git clone && pnpm install` + `./gradlew build` na API.
- Mudanças de contrato viajam num único PR.
- CI roda jobs separados por path filter (mobile vs api).

---

## ADR-002 — Monólito modular no backend

**Status:** Accepted (2025-05)

**Contexto.** Estamos em descoberta de domínio. Limites entre serviços ainda não são claros.

**Decisão.** Backend é **monólito modular** em Kotlin/Spring Boot, organizado em pacotes por domínio (`users`, `sellers`, `books`, `listings`, `cart`, `orders`, `reviews`, `admin`, `reports`). Cada pacote é autocontido (controller + service + repository + dto + entidade).

**Alternativas consideradas:**
- **Microsserviços.** Rejeitado: complexidade operacional alta, transações distribuídas, escalabilidade organizacional desnecessária para time pequeno.
- **Monólito sem modularização.** Rejeitado: vira "bola de lama" rápido.
- **Modular monolith com módulos Gradle separados.** Considerado para o futuro. Adicionar depois é um refactor mecânico.

**Consequências.**
- Transações ACID entre módulos triviais.
- Promover módulo a serviço próprio é factível sem reescrita.
- Equipe precisa ter disciplina pra respeitar fronteiras (não importar de `orders.internal` em `cart`).

---

## ADR-003 — Expo (managed workflow) para mobile

**Status:** Accepted (2025-05)

**Contexto.** Precisamos rodar em iOS e Android com produtividade alta.

**Decisão.** Usar **Expo SDK 51+ managed workflow**.

**Alternativas consideradas:**
- **Bare React Native CLI.** Rejeitado: exige Xcode/Android Studio configurados, build mais lento, sem Expo Go.
- **Flutter.** Rejeitado: requer Dart (curva de aprendizado para o autor); ecossistema de libs menor para marketplace.
- **Native (Swift + Kotlin).** Rejeitado: dobro de trabalho, dobro de manutenção.

**Consequências.**
- Build via EAS quando necessário.
- Limitado a módulos nativos suportados pelo Expo SDK.
- Hot reload e Expo Go aceleram demo.
- Se precisar de módulo nativo customizado, posso migrar para `expo-modules` ou ejetar parcialmente.

---

## ADR-004 — Kotlin + Spring Boot 3 + Java 21

**Status:** Accepted (2025-05)

**Contexto.** Precisamos de backend robusto com bom ecossistema, tipagem forte e produtividade.

**Decisão.** **Kotlin 1.9** rodando em **Java 21** (LTS) com **Spring Boot 3.3.x**.

**Alternativas consideradas:**
- **Java puro.** Rejeitado: verbose demais para DTOs e data classes.
- **NestJS (Node).** Rejeitado: queria explicitamente demonstrar competência JVM.
- **Quarkus / Micronaut.** Considerados. Spring Boot escolhido pela maturidade do ecossistema, documentação e familiaridade do autor.

**Consequências.**
- `data class` para DTOs e value objects.
- `sealed class` para máquinas de estado (status de pedido, resultados de operação).
- Gradle Kotlin DSL.
- Java 21 = virtual threads disponíveis para escala futura.

---

## ADR-005 — Zustand para estado global no mobile

**Status:** Accepted (2025-05)

**Contexto.** App mobile precisa de estado compartilhado (autenticação, carrinho, preferências).

**Decisão.** Usar **Zustand**.

**Alternativas consideradas:**
- **Redux Toolkit.** Rejeitado: boilerplate alto para o tamanho do projeto.
- **Context API pura.** Rejeitado: re-render excessivo em árvores grandes.
- **Jotai / Recoil.** Considerados. Zustand vence pela simplicidade (API minimalista) e por convergir com `*.store.ts` mencionado no prompt do projeto.
- **React Query / TanStack Query.** Vai entrar **complementando** Zustand quando começarmos a chamar API real (Zustand para estado de UI; TanStack Query para estado de servidor).

**Consequências.**
- Stores em `src/stores/<dominio>.store.ts`.
- Hooks tipados (`useAuthStore()`).
- Devtools opcionais via middleware.

---

## ADR-006 — PostgreSQL + Flyway

**Status:** Accepted (2025-05)

**Contexto.** Precisamos de banco relacional confiável com suporte a migrações versionadas.

**Decisão.** **PostgreSQL 16** como SGBD, **Flyway** para migrações.

**Alternativas consideradas:**
- **MySQL/MariaDB.** Rejeitado: Postgres tem ecossistema melhor (JSONB, pg_trgm, extensões).
- **Liquibase.** Rejeitado: XML/YAML verbose; Flyway com SQL puro é mais legível.
- **Hibernate `ddl-auto=update`.** Rejeitado: nunca usado em produção; risco de drift e perda de dados.

**Consequências.**
- Toda mudança de schema = nova migration `V<N>__descricao.sql`.
- Em dev podemos limpar; em prod não.
- UUID como PK (compatível com sistemas distribuídos).
- Enums como `VARCHAR + CHECK` (evita `ALTER TYPE`).

---

## ADR-007 — Estilos React Native sem NativeWind/Tailwind

**Status:** Accepted (2025-05)

**Contexto.** Decisão sobre como estilar componentes React Native.

**Decisão.** Usar **`StyleSheet.create`** do React Native + tokens importados do `src/theme/`. Sem NativeWind, sem styled-components.

**Alternativas consideradas:**
- **NativeWind.** Rejeitado nesta fase: traz overhead de configuração e build, padroniza menos para nosso Design System editorial.
- **styled-components.** Rejeitado: prop-drilling de tema e cost em re-render.
- **Restyle (Shopify).** Considerado. Mais opinativo; pode entrar se padronização visual exigir.

**Consequências.**
- Estilos co-localizados com componentes.
- Tema acessado via hook `useTheme()`.
- Migração futura para qualquer biblioteca é factível porque tokens já estão centralizados.

---

## ADR-008 — OpenAPI como fonte de verdade dos contratos

**Status:** Accepted (2025-05)

**Contexto.** Mobile e API precisam concordar nos contratos.

**Decisão.** `packages/contracts/openapi.yaml` é a **fonte de verdade**. Backend implementa o que o YAML descreve; mobile consome tipos derivados.

**Alternativas consideradas:**
- **Geração automática de tipos TypeScript** (`openapi-typescript`). Vai entrar na entrega 2, quando o mobile começar a consumir API real. Adicionar agora é overhead sem benefício imediato.
- **gRPC / Protobuf.** Rejeitado: REST é suficiente; ecossistema mobile RN para gRPC é fraco.
- **GraphQL.** Rejeitado: overkill para CRUD direto; pode evoluir para BFF se a complexidade de queries crescer.

**Consequências.**
- Mudança de contrato passa pelo YAML primeiro, depois pela implementação.
- `springdoc-openapi` valida que a implementação bate com o YAML (futuro).

---

## ADR-009 — Login fake na entrega 1

**Status:** Accepted (2025-05)

**Contexto.** Entrega 1 não inclui autenticação real, mas o app precisa ter um fluxo navegável.

**Decisão.** `useAuthStore` aceita qualquer e-mail/senha e popula um mock user. Substituído por integração real na entrega 2.

**Alternativas consideradas:**
- **Pular telas de login.** Rejeitado: removeria peças visuais importantes do portfólio.
- **Implementar JWT real agora.** Rejeitado: implicaria implementar entidade User + Auth + Security no backend, fugindo do escopo da entrega 1.

**Consequências.**
- Comentários `// TODO: substituir por chamada real` no `auth.store.ts`.
- Documentado no README e roadmap.

---

## Como adicionar um novo ADR

1. Próximo número sequencial.
2. Título curto e descritivo.
3. Status, contexto, decisão, alternativas, consequências.
4. Sempre que possível, citar **trade-offs explícitos**.
5. ADR aceito não muda — se a decisão for revertida, criar novo ADR marcando o antigo como `Superseded by ADR-XXX`.
