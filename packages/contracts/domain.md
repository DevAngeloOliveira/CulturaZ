# CulturaZ — Glossário de Domínio

Termos usados de forma consistente em código, banco e documentação.

| Termo                | Significado                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **User**             | Pessoa cadastrada na plataforma. Pode acumular roles `CUSTOMER`, `SELLER`, `ADMIN`.        |
| **Customer**         | Usuário em modo de compra.                                                                 |
| **Seller**           | Usuário com perfil de vendedor ativado.                                                    |
| **SellerProfile**    | Dados de loja: nome, descrição, tipo (`INDIVIDUAL`, `BOOKSTORE`, `SEBO`), reputação.       |
| **Address**          | Endereço de entrega vinculado a um usuário.                                                |
| **Category**         | Categoria global definida pelo admin (ex: "Acadêmicos", "Sebos").                          |
| **Book**             | Obra bibliográfica única (título, autor, ISBN). Compartilhada entre múltiplos anúncios.    |
| **BookListing**      | Anúncio individual: um vendedor oferecendo um livro com preço, estoque e condição próprios.|
| **Listing**          | Sinônimo curto de `BookListing`.                                                            |
| **Condition**        | Estado físico do livro: `NEW`, `LIKE_NEW`, `GOOD`, `FAIR`, `DAMAGED`.                       |
| **Cart**             | Cesto de compras pessoal de um usuário.                                                    |
| **CartItem**         | Item dentro de um carrinho referenciando um listing.                                       |
| **Order**            | Pedido confirmado, gerado a partir de um carrinho.                                         |
| **OrderItem**        | Item dentro de um pedido. Carrega `seller_id` para facilitar visão por vendedor.           |
| **Review**           | Avaliação de vendedor feita por comprador após pedido entregue.                            |
| **Favorite**         | Marcação de um listing como favorito por um usuário.                                       |
| **AuditLog**         | Registro de ação relevante (especialmente administrativa).                                 |
| **Sebo**             | Loja de livros usados (palavra brasileira). No domínio = `SellerType.SEBO`.                |
| **Garimpo**          | Ato de procurar livros raros/baratos em sebos. Termo de marketing usado na home.           |
| **Moderação**        | Processo de revisão de anúncios novos pelo admin antes de tornarem-se públicos.            |
| **Status do pedido** | Estado dentro da máquina `CREATED → WAITING_PAYMENT → CONFIRMED → ... → DELIVERED`.        |

## Convenções de naming

- **Singular em código** (`User`, `BookListing`).
- **Plural em rotas e tabelas** (`/api/users`, `users`).
- **camelCase em JSON** (`storeName`, `createdAt`).
- **snake_case em SQL** (`store_name`, `created_at`).
- **UPPER_SNAKE em enums** (`PENDING_REVIEW`, `LIKE_NEW`).
