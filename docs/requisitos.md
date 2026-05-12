# CulturaZ — Requisitos

## 1. Visão geral

CulturaZ é um **marketplace mobile-first** especializado em livros. Permite a qualquer pessoa **comprar**, **vender** ou **revender** livros novos, usados ou raros, com identidade visual editorial e foco em confiança entre as partes.

## 2. Problema

O mercado de livros usados no Brasil é fragmentado:

- Sebos físicos têm acervo rico mas presença digital limitada.
- Marketplaces genéricos (que vendem de tudo) tratam livro como mais um SKU — busca por **edição, ISBN, condição** é precária.
- Quem tem livros parados em casa raramente revende: o esforço de listar em plataformas genéricas não compensa.

## 3. Objetivos

- Centralizar a oferta de livros novos e usados em uma única plataforma mobile-first.
- Reduzir o atrito para sebos e vendedores individuais publicarem catálogo.
- Garantir comparação clara entre opções (preço × condição × reputação do vendedor).
- Construir base sólida de confiança via avaliações e curadoria.

## 4. Público-alvo

- Estudantes de graduação/pós em busca de bibliografia acadêmica acessível.
- Leitores frequentes em busca de literatura, técnicos e raros.
- Sebos (físicos e online) que querem ampliar canal de venda.
- Pessoas que querem revender livros parados em casa.

## 5. Personas

### Persona 1 — Camila, estudante de Direito (22 anos)

- Precisa de manuais caros (R$ 200–600 novos).
- Aceita livros usados em bom estado.
- Comprou via marketplaces genéricos e teve dificuldade em encontrar a **edição correta**.
- **Necessidades:** filtros por edição, condição visível, retirada local quando possível.

### Persona 2 — Sebo Página Viva (vendedor, micro)

- Loja física com 8.000 títulos catalogados em planilha.
- Já vende em marketplace genérico, mas paga taxa alta e a interface é hostil.
- **Necessidades:** importar lote, ver pedidos por status, ter perfil de loja verificado.

### Persona 3 — Rodrigo, leitor casual (35 anos)

- Tem ~80 livros em casa que não vai reler.
- Quer monetizar sem virar "vendedor profissional".
- **Necessidades:** publicar anúncio em < 2 minutos, receber pagamento simples.

### Persona 4 — Lara, administradora da plataforma

- Modera anúncios, bloqueia usuários problemáticos.
- Acompanha métricas de saúde do marketplace.
- **Necessidades:** dashboard claro, fila de moderação, audit log.

## 6. Escopo funcional

### Em escopo (produto)

- Catálogo, busca, filtros, detalhes de livro/anúncio.
- Cadastro e login (futuro JWT).
- Perfis: comprador, vendedor (individual / sebo / loja), administrador.
- Anúncios: criação, edição, pausa, exclusão, moderação.
- Carrinho e checkout (com pagamento simulado nesta primeira fase).
- Pedidos: visão do comprador e do vendedor.
- Avaliações de vendedor após pedido entregue.
- Painel administrativo (usuários, anúncios, categorias, relatórios).

### Fora de escopo (até evolução futura)

- Pagamento real (Pix, cartão).
- Frete real (cálculo via Correios/Melhor Envio).
- Chat em tempo real comprador-vendedor.
- Notificações push.
- Recomendações baseadas em IA.
- Internacionalização.

## 7. Requisitos funcionais

### RF — Autenticação e usuários

- **RF-01** O sistema deve permitir cadastro com nome, e-mail e senha.
- **RF-02** O sistema deve permitir login com e-mail e senha.
- **RF-03** O sistema deve permitir recuperação de senha por e-mail (em fase futura).
- **RF-04** O sistema deve permitir que o usuário ative perfil de vendedor.
- **RF-05** O sistema deve permitir gerenciamento de endereços de entrega.

### RF — Catálogo

- **RF-10** O sistema deve listar livros disponíveis no marketplace.
- **RF-11** O sistema deve permitir busca por título, autor, ISBN.
- **RF-12** O sistema deve permitir filtros por categoria, condição, faixa de preço e localização.
- **RF-13** O sistema deve exibir detalhes do livro: capa, descrição, condição, vendedor, preço, frete estimado.

### RF — Anúncios

- **RF-20** O vendedor deve criar anúncio associando livro, preço, estoque, condição e descrição.
- **RF-21** O vendedor deve pausar, ativar, editar ou remover anúncio.
- **RF-22** O administrador deve aprovar ou bloquear anúncios.

### RF — Carrinho e pedidos

- **RF-30** O comprador deve adicionar itens ao carrinho respeitando estoque.
- **RF-31** O comprador deve revisar carrinho antes do checkout.
- **RF-32** O sistema deve criar pedido a partir do carrinho com pagamento simulado.
- **RF-33** O comprador deve acompanhar status do pedido.
- **RF-34** O vendedor deve atualizar status (em preparação, enviado, entregue).

### RF — Avaliações

- **RF-40** O comprador deve avaliar o vendedor após pedido entregue.
- **RF-41** A nota média do vendedor deve ser recalculada após cada avaliação.

### RF — Administração

- **RF-50** O admin deve bloquear/desbloquear usuários.
- **RF-51** O admin deve gerenciar categorias globais.
- **RF-52** O admin deve consultar relatórios básicos (vendas, anúncios pendentes, usuários ativos).

## 8. Requisitos não funcionais

- **RNF-01** O app mobile deve funcionar em iOS e Android (via Expo).
- **RNF-02** O backend deve responder a 95% das requisições em menos de 500ms em ambiente local com carga típica.
- **RNF-03** Senhas devem ser armazenadas com hash seguro (BCrypt).
- **RNF-04** Comunicação mobile↔API deve ser via HTTPS em produção.
- **RNF-05** O sistema deve manter audit log de ações administrativas relevantes.
- **RNF-06** A documentação deve estar em português e ser mantida atualizada.
- **RNF-07** O código deve seguir TypeScript strict no mobile e ktlint no backend.
- **RNF-08** O banco deve usar migrações versionadas (Flyway).

## 9. Regras de negócio

Ver [regras-de-negocio.md](regras-de-negocio.md) para a lista completa numerada.

## 10. Perfis de usuário

| Perfil   | Descrição                                                            |
| -------- | -------------------------------------------------------------------- |
| CUSTOMER | Usuário padrão, pode navegar e comprar                               |
| SELLER   | Usuário com perfil de vendedor ativado, pode publicar anúncios       |
| ADMIN    | Equipe interna com acesso a moderação e configurações globais        |
| SUPPORT  | Equipe interna com acesso limitado para atendimento (futuro)         |

Um usuário pode acumular `CUSTOMER + SELLER` simultaneamente.

## 11. Fluxos principais

### F1 — Onboarding e primeira compra

1. Splash → Onboarding → Login/Register
2. Login bem-sucedido → MarketplaceHome
3. Busca/filtro → BookDetails
4. Adicionar ao carrinho → Checkout → Pagamento (simulado)
5. Acompanhar pedido em MyOrders

### F2 — Tornar-se vendedor

1. Perfil → "Ativar vendedor"
2. Preencher dados da loja (nome, descrição, tipo)
3. Criar primeiro anúncio
4. Anúncio entra em "Em revisão"
5. Admin aprova → anúncio ativo

### F3 — Moderação de anúncio

1. Anúncio criado entra em fila "Pending Review"
2. Admin acessa Moderation → revisa
3. Aprova ou bloqueia (com motivo)
4. Vendedor recebe atualização

## 12. Modelagem conceitual

Resumo das entidades principais (detalhes em [banco-de-dados.md](banco-de-dados.md)):

```
User ──< UserRole ── Role
User ──1:1── SellerProfile
User ──< Address
User ──< Favorite >── BookListing
User ──< Cart >── CartItem >── BookListing
User ──< Order >── OrderItem >── BookListing
Order ──< Review
Book ──> Category
BookListing ──> Book
BookListing ──> SellerProfile
```

## 13. Critérios de sucesso

### Para a entrega 1 (fundação)

- Repositório com estrutura clara, documentação completa, código limpo.
- App mobile com tema fiel ao Figma e tela home navegável.
- API que sobe sem erro com schema do banco aplicado.
- Docker Compose funcional.

### Para o produto (longo prazo)

- Tempo médio entre cadastro e primeira compra concluída < 7 dias.
- Taxa de anúncios aprovados > 80% na primeira tentativa.
- NPS de vendedores > 50.
- Reputação média da plataforma > 4.3.
