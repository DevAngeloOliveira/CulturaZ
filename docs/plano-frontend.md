# CulturaZ — Plano de Implementação do Frontend

## Contexto

O **backend está completo** (53 endpoints, JWT/RBAC, checkout transacional, validado por
smoke test end-to-end). O app mobile, da Entrega 1, tem apenas a **fundação**: tema, ~27
componentes base, navegação (Public/Buyer/Seller/Admin tabs), `MarketplaceHomeScreen` e 4
telas públicas — tudo com **mocks**, sem integração real.

Este plano cobre transformar o app numa aplicação **integrada à API**, implementando as
**29 telas** do Figma.

- **Figma:** https://www.figma.com/design/3GJETOFgD8T1Vkiwkbp4YU/CulturaZ
- **API local:** `http://localhost:8080` (Swagger em `/swagger-ui.html`)

## Decisões confirmadas

| Tema | Decisão |
| --- | --- |
| Faseamento | Por fluxo, na ordem de valor: Integração+Público → Comprador → Vendedor → Admin |
| Estado de servidor | **TanStack Query** (cache/refetch/loading) + **Zustand** (UI/sessão) |
| Gráficos | Barras custom com `View`/Flexbox — zero dependência nova |
| Tipos da API | Gerados de `packages/contracts/openapi.yaml` via `openapi-typescript` |

## Inventário de telas (Figma → backend)

### Público (4)
Splash · Onboarding · Login · Cadastro → `POST /api/auth/{login,register,refresh}`

### Comprador (11)
Home · Catálogo/Busca · Filtros · Detalhes do Livro · Favoritos · Carrinho · Checkout ·
Meus Pedidos · Detalhes do Pedido · Avaliação · Perfil/Endereços
→ `/api/listings`, `/api/categories`, `/api/favorites`, `/api/cart`, `/api/orders`,
`/api/reviews`, `/api/users/me/*`

### Vendedor (7)
Ativar Vendedor · Dashboard Loja · Cadastrar Anúncio · Meus Anúncios · Pedidos Recebidos ·
Relatório · Reputação
→ `/api/sellers/*`, `/api/seller/listings`, `/api/seller/orders`

### Admin (7)
Login Admin · Dashboard · Usuários · Moderação · Categorias · Pedidos · Relatórios
→ `/api/admin/*`

---

## Fase 0 — Camada de integração

Base técnica de toda comunicação com a API. Sem telas novas.

1. **Tipos gerados** — adicionar `openapi-typescript`; script `pnpm --filter mobile gen:api`
   que gera `src/types/api.generated.ts` a partir de `packages/contracts/openapi.yaml`.
2. **HTTP client** — refatorar `src/services/http.ts`:
   - base URL via `EXPO_PUBLIC_API_URL`;
   - injeta `Authorization: Bearer <accessToken>`;
   - desserializa o envelope de erro `ApiErrorResponse` (`code`/`message`/`details`);
   - **refresh automático** no `401`: tenta `POST /api/auth/refresh`, repete a request,
     e desloga se o refresh falhar.
3. **Serviços tipados** — `src/services/api/{auth,users,listings,categories,books,favorites,cart,orders,reviews,sellers,admin}.ts`
   usando os tipos gerados.
4. **TanStack Query** — `QueryClient` + `QueryClientProvider` no `App.tsx`; hooks por
   domínio (`useListingsQuery`, `useCartQuery`, `useCreateOrderMutation`, …).
5. **Sessão real** — `expo-secure-store` para persistir `accessToken`/`refreshToken`;
   `auth.store.ts` passa a logar via API, hidratar sessão no boot e limpar no logout.
6. **Mocks** — `src/mocks/` deixa de alimentar telas; pode virar fixture de teste.

**Verificação:** login real a partir do app retorna JWT; request autenticada funciona;
expirar o token dispara refresh transparente.

## Fase A — Fluxo Público (4 telas)

- **Splash** — lê SecureStore; sessão válida → tabs, senão → Onboarding.
- **Onboarding** — 3 slides (base já existe).
- **Login** — form real → `POST /api/auth/login`; trata `INVALID_CREDENTIALS`, `USER_BLOCKED`.
- **Cadastro** — form real → `POST /api/auth/register`; trata `EMAIL_ALREADY_EXISTS`.
- Reconciliar tokens do tema com o Design System v0.1 do Figma (passo rápido).

**Verificação:** cadastro → login → app entra autenticado e persiste sessão ao reabrir.

## Fase B — Fluxo Comprador (11 telas)

Componentes novos previstos: chips de filtro, range de preço (slider), stepper de
quantidade, timeline de status do pedido, input de estrelas.

- **Home** — refina `MarketplaceHomeScreen`; liga a `/api/listings` e `/api/categories`.
- **Catálogo/Busca** — `/api/listings` com `q`, `sort`, paginação.
- **Filtros** — tela modal; monta query params (categoria, condição, preço, cidade/UF).
- **Detalhes do Livro** — `/api/listings/{id}`; favoritar; adicionar ao carrinho.
  "Conversar com vendedor" fica **desabilitado** ("em breve" — sem chat no backend).
- **Favoritos** — `/api/favorites`.
- **Carrinho** — `/api/cart`; stepper de quantidade; subtotal.
- **Checkout** — seleção de endereço + `POST /api/orders` (pagamento simulado).
- **Meus Pedidos** — `/api/orders/me`; abas Todos/Em andamento/Entregues.
- **Detalhes do Pedido** — `/api/orders/{id}`; timeline; `PATCH .../cancel`.
- **Avaliação** — `POST /api/reviews` (apenas pedidos entregues).
- **Perfil/Endereços** — `/api/users/me` e `/api/users/me/addresses` (CRUD + padrão).

**Verificação:** comprar um livro ponta a ponta dentro do app; ver pedido; avaliar.

## Fase C — Fluxo Vendedor (7 telas)

- **Ativar Vendedor** — `POST /api/sellers`; passa a usar `SellerTabs`.
- **Dashboard Loja** — `/api/sellers/me/dashboard` (cards de métrica).
- **Cadastrar Anúncio** — `POST /api/seller/listings`.
- **Meus Anúncios** — `GET /api/seller/listings`; pausar/ativar/remover.
- **Pedidos Recebidos** — `/api/seller/orders`; `PATCH .../status`.
- **Relatório** — `/api/sellers/me/dashboard` + gráfico de barras custom.
- **Reputação** — `/api/sellers/{id}/reviews`.

**Verificação:** ativar loja, publicar anúncio, receber o pedido da Fase B, avançar status.

## Fase D — Fluxo Admin (7 telas)

- **Login Admin** — reusa o fluxo de auth; valida `role = ADMIN`; entra em `AdminTabs`.
- **Dashboard** — `/api/admin/dashboard`.
- **Usuários** — `/api/admin/users`; bloquear/desbloquear.
- **Moderação** — `/api/admin/listings?status=PENDING_REVIEW`; aprovar/bloquear.
- **Categorias** — `/api/admin/categories` (CRUD + ativar/desativar).
- **Pedidos** — `/api/admin/orders`.
- **Relatórios** — `/api/admin/dashboard` + gráfico de barras custom.

**Verificação:** admin aprova o anúncio da Fase C, modera usuário, vê métricas.

---

## Notas técnicas

- **API em device físico:** Expo Go não enxerga `localhost`. Usar o IP LAN da máquina em
  `EXPO_PUBLIC_API_URL` (ex.: `http://192.168.0.10:8080`). Emulador Android usa
  `http://10.0.2.2:8080`.
- **Estados de UI:** `LoadingState`, `ErrorState`, `EmptyState` já existem — usar em toda
  tela que carrega dados.
- **Erros:** o envelope `ApiErrorResponse` traz `code` estável — mapear códigos para
  mensagens amigáveis num helper único.
- **Sem chat / pagamento real / frete real:** itens marcados "em breve" na UI, conforme
  o backend (checkout é simulado).

## Critérios de pronto (por fase)

- [ ] Fase 0 — login real + refresh automático funcionando
- [ ] Fase A — cadastro/login/sessão persistente
- [ ] Fase B — compra ponta a ponta no app
- [ ] Fase C — vendedor publica e gerencia pedido
- [ ] Fase D — admin modera e vê métricas
- [ ] App sem mocks; todas as telas consumindo a API real
