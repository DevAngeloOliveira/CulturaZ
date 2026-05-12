# CulturaZ — Roadmap

O CulturaZ avança em **entregas incrementais**. Cada entrega tem um objetivo claro, escopo bem definido e critério de aceite. A meta é manter o produto **sempre executável**, mesmo nas fases iniciais.

---

## Entrega 1 — Fundação ✅

**Objetivo:** Estabelecer base profissional do projeto.

**Inclui:**
- Estrutura completa do monorepo (apps/mobile, apps/api, packages/contracts, docs, infra)
- Documentação técnica e de produto
- Design System mobile com tokens do Figma
- Componentes base reutilizáveis (layout, buttons, forms, feedback, cards, marketplace)
- `MarketplaceHomeScreen` composta por componentes (sem cópia literal do Figma)
- Telas públicas: Splash, Onboarding, Login, Register
- Navegação inicial (React Navigation v6)
- Mock store de autenticação (Zustand)
- API Kotlin Spring Boot com módulos esqueleto e endpoints `/health`
- Schema PostgreSQL via Flyway
- Docker Compose com PostgreSQL e Adminer
- OpenAPI 3.1 inicial
- CI/CD básico (build API + typecheck mobile)

**Não inclui:** autenticação real, CRUDs funcionais, integração mobile↔API.

---

## Entrega 2 — Autenticação

**Objetivo:** Permitir cadastro e login reais.

**Backend:**
- Implementar `users` (entidade JPA, repositório, service, controller)
- Implementar `auth` (registro, login, JWT, refresh token)
- `SecurityConfig` com filtro JWT
- `GET /api/auth/me`
- BCrypt para hash de senha

**Mobile:**
- Substituir login fake pela chamada real
- Persistir token (SecureStore)
- Interceptor HTTP injetando `Authorization`
- Logout limpa token

**Critério de aceite:** usuário consegue se cadastrar, fazer login, acessar `/me` autenticado e fazer logout.

---

## Entrega 3 — Catálogo

**Objetivo:** Tornar o catálogo navegável de verdade.

**Backend:**
- Entidades: `Book`, `Category`, `BookListing`, `Favorite`
- Endpoints públicos: `GET /api/listings`, `GET /api/listings/{id}`, `GET /api/categories`, `GET /api/books`
- Endpoints autenticados: favoritos
- Endpoints de vendedor: CRUD de listings (sem aprovação automática)
- Busca por título/autor (ILIKE simples)

**Mobile:**
- Tela `CatalogScreen` consumindo API
- Tela `BookDetailsScreen`
- Tela `FiltersScreen`
- Tela `FavoritesScreen`

**Critério de aceite:** comprador navega catálogo real, vê detalhes, favorita e desfavorita; vendedor cria, edita e remove anúncios.

---

## Entrega 4 — Compra

**Objetivo:** Fechar o ciclo de compra com pagamento simulado.

**Backend:**
- Entidades: `Cart`, `CartItem`, `Order`, `OrderItem`
- Endpoints de carrinho (add/update/remove/clear)
- Endpoint de criação de pedido (revalida estoque e preço)
- Endpoint de listagem de pedidos do comprador
- Decremento de estoque na confirmação
- Pagamento **simulado** (status muda automaticamente após N segundos)

**Mobile:**
- Tela `CartScreen`
- Tela `CheckoutScreen`
- Tela `MyOrdersScreen`
- Tela `OrderDetailsScreen`

**Critério de aceite:** comprador adiciona ao carrinho, finaliza pedido com pagamento simulado, vê pedido em "Meus pedidos".

---

## Entrega 5 — Vendedor

**Objetivo:** Experiência completa do vendedor.

**Backend:**
- Entidade `SellerProfile`
- Endpoint de ativação de vendedor
- Endpoints de gestão de pedidos do vendedor (visualizar, atualizar status)
- Relatórios básicos (vendas do mês, ticket médio)

**Mobile:**
- Tela `ActivateSellerScreen`
- Tela `SellerDashboardScreen`
- Tela `CreateListingScreen`
- Tela `MyListingsScreen`
- Tela `SellerOrdersScreen`
- Tela `SellerReportScreen`
- Bottom tabs do vendedor

**Critério de aceite:** usuário ativa perfil de vendedor, publica anúncio, recebe pedido, atualiza status.

---

## Entrega 6 — Admin

**Objetivo:** Painel administrativo funcional.

**Backend:**
- Endpoints `/api/admin/*` protegidos por role
- Moderação de anúncios (aprovar/bloquear)
- Bloqueio/desbloqueio de usuários
- Gestão de categorias
- Audit log em todas as ações admin

**Mobile:**
- Tela `AdminLoginScreen` (login separado, opcional)
- Tela `AdminDashboardScreen`
- Tela `AdminUsersScreen`
- Tela `AdminModerationScreen`
- Tela `AdminCategoriesScreen`
- Tela `AdminOrdersScreen`
- Tela `AdminReportsScreen`

**Critério de aceite:** admin modera anúncios pendentes, bloqueia usuário problemático, ação fica registrada em audit log.

---

## Entrega 7 — Confiança

**Objetivo:** Avaliações e reputação.

**Backend:**
- Entidade `Review`
- Endpoint `POST /api/reviews`
- Recálculo automático de `seller_profiles.rating`
- Validação: só pedidos `DELIVERED` podem ser avaliados

**Mobile:**
- Tela `ReviewScreen`
- `SellerReputationScreen` (visão pública do perfil de vendedor)
- Exibir nota e avaliações em `BookDetailsScreen`

**Critério de aceite:** comprador avalia vendedor após receber pedido; nota aparece publicamente.

---

## Entrega 8 — Pagamento e frete reais

**Objetivo:** Integrar serviços externos.

- Pagamento via gateway (Pagar.me, Stripe ou Mercado Pago)
- Frete via Melhor Envio ou Frenet
- Webhooks de status de pagamento
- Tratamento de estornos

**Não trivial.** Requer ambientes sandbox, atenção a idempotência e segurança.

---

## Entrega 9 — Comunicação

**Objetivo:** Chat e notificações.

- Chat comprador-vendedor (WebSocket via Spring + Redis para presença)
- Notificações push (Expo Notifications)
- E-mail transacional (SendGrid ou similar)

---

## Entrega 10 — Inteligência

**Objetivo:** Diferenciais via dados.

- Recomendações ("quem comprou X também comprou Y")
- Busca semântica (`pg_trgm` ou OpenSearch)
- Detecção de anúncios suspeitos (heurísticas + revisão manual)

---

## Princípios do roadmap

- **Sempre executável.** Nenhuma entrega quebra o build ou deixa o app inutilizável.
- **Documentação no mesmo PR do código.**
- **Migrações Flyway por mudança de schema.**
- **Sem implementação especulativa.** Cada feature entra quando há justificativa concreta.
- **Refatorar quando dói, não antes.**
