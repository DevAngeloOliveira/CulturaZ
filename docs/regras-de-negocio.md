# CulturaZ — Regras de Negócio

Lista numerada das regras que governam o domínio. Cada regra tem identificador (`RN-xxx`), descrição e fase de implementação prevista.

## Legenda de status

- `[ENTREGA 1]` — definida apenas no schema ou documentação.
- `[ENTREGA 2+]` — implementada quando o módulo correspondente entrar.
- `[TODO]` — referenciada no código com `// TODO: RN-XXX` quando ainda não implementada.

---

## RN — Usuários

- **RN-001** Todo usuário deve possuir `name`, `email` e `password_hash`. `[ENTREGA 2]`
- **RN-002** `email` é único na tabela `users`. `[ENTREGA 1 — constraint]`
- **RN-003** Senha deve ser armazenada com **BCrypt** (cost ≥ 12). `[ENTREGA 2]`
- **RN-004** Usuário recém-criado nasce com role `CUSTOMER`. `[ENTREGA 2]`
- **RN-005** Usuário pode ativar perfil `SELLER` em qualquer momento. `[ENTREGA 5]`
- **RN-006** Usuário com `status = BLOCKED` **não pode** comprar nem vender. `[ENTREGA 2+]`
- **RN-007** Usuário com `status = DELETED` é tratado como inexistente nas listagens públicas. `[ENTREGA 2+]`

## RN — Vendedores

- **RN-010** Apenas usuário autenticado pode ativar perfil de vendedor. `[ENTREGA 5]`
- **RN-011** Vendedor só pode editar **anúncios próprios**. `[ENTREGA 3]`
- **RN-012** Vendedor só pode visualizar **pedidos ligados aos próprios anúncios**. `[ENTREGA 4]`
- **RN-013** Vendedor com `status = SUSPENDED` não pode publicar novo anúncio. `[ENTREGA 5]`
- **RN-014** `rating` do vendedor é calculado como média aritmética das `reviews.rating` aceitas. `[ENTREGA 7]`

## RN — Anúncios (`book_listings`)

- **RN-020** Todo anúncio deve estar associado a um `book_id` válido. `[ENTREGA 3 — constraint]`
- **RN-021** `price > 0`. `[ENTREGA 3 — validação]`
- **RN-022** `stock_quantity >= 0`. `[ENTREGA 3 — validação]`
- **RN-023** Quando `stock_quantity = 0`, status muda automaticamente para `SOLD_OUT`. `[ENTREGA 4]`
- **RN-024** Anúncios com status `BLOCKED` ou `REMOVED` **não aparecem** no catálogo público. `[ENTREGA 3]`
- **RN-025** Anúncios com status `PENDING_REVIEW` aparecem apenas para o próprio vendedor e admin. `[ENTREGA 3]`
- **RN-026** Campo `condition` é obrigatório. `[ENTREGA 3 — validação]`
- **RN-027** Anúncio publicado pela primeira vez nasce em `PENDING_REVIEW`. `[ENTREGA 3]`

## RN — Favoritos

- **RN-030** Um usuário não pode favoritar o mesmo anúncio duas vezes (constraint UNIQUE). `[ENTREGA 3]`
- **RN-031** Ao favoritar um anúncio bloqueado, retornar erro `409 LISTING_NOT_AVAILABLE`. `[ENTREGA 3]`

## RN — Carrinho

- **RN-040** Carrinho pertence a um único usuário autenticado. `[ENTREGA 4 — constraint UNIQUE user_id]`
- **RN-041** `quantity` no carrinho não pode exceder `stock_quantity` do anúncio. `[ENTREGA 4]`
- **RN-042** Antes de criar pedido, o carrinho deve ser **revalidado**: estoque, preço e disponibilidade. `[ENTREGA 4]`
- **RN-043** Se preço mudou desde adição ao carrinho, exibir alerta ao comprador. `[ENTREGA 4]`

## RN — Pedidos

- **RN-050** Pedido deve ter ao menos **um** item. `[ENTREGA 4]`
- **RN-051** Pedido pertence a um único `buyer_id`. `[ENTREGA 4]`
- **RN-052** Pedido pode conter itens de **múltiplos vendedores** (cada `OrderItem` traz `seller_id`). `[ENTREGA 4]`
- **RN-053** Ao confirmar pagamento, `stock_quantity` de cada listing relacionado deve ser decrementado. `[ENTREGA 4]`
- **RN-054** Pedido com status `CANCELLED` ou `REFUNDED` **não conta** como venda concluída em relatórios. `[ENTREGA 6]`
- **RN-055** Comprador visualiza apenas **seus próprios** pedidos. `[ENTREGA 4]`
- **RN-056** Vendedor visualiza apenas **itens** dos quais é dono via `seller_id`. `[ENTREGA 5]`
- **RN-057** Transições válidas de status:
  ```
  CREATED → WAITING_PAYMENT → CONFIRMED → IN_PREPARATION → SHIPPED → DELIVERED
                          ↘ CANCELLED
                                        ↘ REFUNDED (após DELIVERED)
  ```
  Qualquer transição fora desta máquina retorna `400 INVALID_STATUS_TRANSITION`. `[ENTREGA 4]`
- **RN-058** O `code` do pedido segue formato `CZ-AAAA-NNNNNN` (ano + sequencial). `[ENTREGA 4]`

## RN — Avaliações

- **RN-060** Somente compradores com `OrderItem` em pedido status `DELIVERED` podem avaliar. `[ENTREGA 7]`
- **RN-061** Um pedido **não pode** gerar duas avaliações para o mesmo `seller_id` (constraint UNIQUE `(order_id, seller_id)`). `[ENTREGA 7]`
- **RN-062** `rating ∈ [1, 5]` inteiro. `[ENTREGA 7]`
- **RN-063** Após cadastro de nova avaliação, recalcular `seller_profiles.rating`. `[ENTREGA 7]`

## RN — Administração

- **RN-070** Apenas usuário com role `ADMIN` pode bloquear/desbloquear outros usuários. `[ENTREGA 6]`
- **RN-071** Apenas `ADMIN` pode mudar status de anúncio para `BLOCKED`. `[ENTREGA 6]`
- **RN-072** Apenas `ADMIN` pode criar, editar, ativar ou desativar categorias globais. `[ENTREGA 6]`
- **RN-073** Toda ação administrativa que afeta usuário ou anúncio deve gerar registro em `audit_logs`. `[ENTREGA 6]`

## RN — Segurança e autenticação

- **RN-080** JWT possui expiração de **60 minutos** (configurável via env). `[ENTREGA 2]`
- **RN-081** Refresh token possui expiração de **30 dias**. `[ENTREGA 2]`
- **RN-082** Senha deve ter no mínimo **8 caracteres**, contendo letra e número. `[ENTREGA 2]`
- **RN-083** Após **5 tentativas** falhas de login em 10 minutos, bloquear temporariamente por 15 minutos. `[ENTREGA 2+]`

## RN — Dados sensíveis

- **RN-090** API **nunca** retorna `password_hash`. `[ENTREGA 1 — DTOs]`
- **RN-091** Endereços completos são visíveis apenas ao próprio usuário e ao vendedor do pedido em curso. `[ENTREGA 4]`
- **RN-092** E-mail só é visível para o próprio usuário e admin; nas avaliações públicas, exibir apenas nome ou apelido. `[ENTREGA 7]`
