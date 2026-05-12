# CulturaZ — UI/UX e Figma

## 1. Fonte de verdade

- **Figma:** https://www.figma.com/design/3GJETOFgD8T1Vkiwkbp4YU/CulturaZ
- **Arquivos contidos:**
  - **CulturaZ Design System v0.1** — tokens, componentes
  - **CulturaZ Mobile Screens Full Flow** — 29 telas mobile
  - **CulturaZ Marketplace Home** — versão refinada da home

## 2. Identidade visual

CulturaZ tem identidade **editorial e calorosa**: paleta verde e creme remete a biblioteca, terracota acrescenta personalidade, amarelo destaca ofertas.

## 3. Tokens

Todos os tokens visuais foram **codificados** em [apps/mobile/src/theme/](../apps/mobile/src/theme/) — modificar lá apenas se o Figma mudar.

### 3.1 Cores

| Token            | Hex       | Uso                                |
| ---------------- | --------- | ---------------------------------- |
| `primary`        | `#173F35` | Verde Biblioteca — header, CTAs    |
| `secondary`      | `#2F6F5E` | Verde Folha — acentos secundários  |
| `background`     | `#F6F0E4` | Creme Página — fundo geral         |
| `surface`        | `#FFFDF7` | Papel Vivo — cards e superfícies   |
| `accent`         | `#D99A2B` | Amarelo Marcador — destaques       |
| `usedPrice`      | `#B95F3B` | Terracota Usado — preço de usados  |
| `textPrimary`    | `#26312E` | Tinta — texto principal            |
| `textSecondary`  | `#65736E` | Grafite Suave — texto secundário   |
| `success`        | `#2F8F5B` | Estados de sucesso                 |
| `warning`        | `#E3B341` | Estados de atenção                 |
| `error`          | `#C95B55` | Erros                              |
| `info`           | `#4B6F9F` | Informações                        |
| `border`         | `#E4DED0` | Bordas sutis                       |

### 3.2 Espaçamento (escala 4pt)

`xs: 4 · sm: 8 · md: 16 · lg: 24 · xl: 32 · xxl: 40`

### 3.3 Raios

`sm: 12 · md: 18 · lg: 24 · xl: 32 · pill: 999`

### 3.4 Touch target

Mínimo **48px** em qualquer área interativa.

### 3.5 Tipografia

| Família    | Uso                                     |
| ---------- | --------------------------------------- |
| `Fraunces` | Títulos editoriais, hero, splash        |
| `Inter`    | Corpo, labels, botões, inputs           |

Fallback do sistema (`System`) quando as fontes ainda não carregaram.

### 3.6 Sombras

Três níveis: `none`, `sm` (cards), `md` (modais, FAB). Compatíveis iOS (`shadow*`) e Android (`elevation`).

## 4. Componentes (referência cruzada Figma ↔ código)

| Figma                  | Componente em código                                              |
| ---------------------- | ----------------------------------------------------------------- |
| Button / Primary       | `components/buttons/Button.tsx` (variant `primary`)               |
| Button / Secondary     | `components/buttons/Button.tsx` (variant `secondary`)             |
| Icon Button            | `components/buttons/IconButton.tsx`                               |
| FAB                    | `components/buttons/FloatingActionButton.tsx`                     |
| Input                  | `components/forms/TextField.tsx`                                  |
| Input / Password       | `components/forms/PasswordField.tsx`                              |
| Input / Search         | `components/forms/SearchInput.tsx`                                |
| Chip                   | `components/forms/SelectChip.tsx`                                 |
| Badge                  | `components/feedback/Badge.tsx`                                   |
| Status Dot             | `components/feedback/StatusDot.tsx`                               |
| Book Card              | `components/cards/BookCard.tsx` / `BookListItem.tsx`              |
| Category Card          | `components/cards/CategoryCard.tsx`                               |
| Quick Action           | `components/cards/QuickActionCard.tsx`                            |
| Seller Card            | `components/cards/SellerCard.tsx`                                 |
| Header Marketplace     | `components/marketplace/MarketplaceHeader.tsx`                    |
| Hero Banner            | `components/marketplace/HeroBanner.tsx`                           |
| Bottom Tab Bar         | `components/layout/BottomTabBar.tsx` (renderizada pelo navigator) |

## 5. Fluxos

### 5.1 Fluxo público

`SplashScreen` → `OnboardingScreen` → `LoginScreen` ↔ `RegisterScreen` ↔ `ForgotPasswordScreen`

Pós-login: redireciona para `MarketplaceHomeScreen` (comprador).

### 5.2 Fluxo comprador

```
MarketplaceHomeScreen
  ├── CatalogScreen ─ FiltersScreen ─ BookDetailsScreen
  ├── FavoritesScreen ─ BookDetailsScreen
  ├── CartScreen ─ CheckoutScreen ─ MyOrdersScreen
  └── ProfileScreen ─ AddressesScreen
```

### 5.3 Fluxo vendedor

```
ActivateSellerScreen → SellerDashboardScreen
                          ├── CreateListingScreen
                          ├── MyListingsScreen
                          ├── SellerOrdersScreen
                          ├── SellerReportScreen
                          └── SellerReputationScreen
```

### 5.4 Fluxo administrativo

```
AdminLoginScreen → AdminDashboardScreen
                      ├── AdminUsersScreen
                      ├── AdminModerationScreen
                      ├── AdminCategoriesScreen
                      ├── AdminOrdersScreen
                      └── AdminReportsScreen
```

## 6. Home refinada do marketplace

A `MarketplaceHomeScreen` é composta por seções independentes:

```
MarketplaceHeader
CategoryChips        (SelectChipGroup)
HeroBanner           ("Semana do Garimpo")
CategoryCarousel     (Acadêmicos, Técnicos, Literatura, Sebos, Mais vendidos)
QuickActionsGrid     (Anunciar, Pedidos, Favoritos, Lojas confiáveis)
FlashOffersSection   (FlatList horizontal de BookCard com desconto)
ContinueBrowsingCard (último livro visualizado)
FeaturedSellerSection(Sebo Página Viva)
RecommendedBooksSection (FlatList horizontal)
SellerCallToAction   ("Tem livros parados? Venda")
OrderStatusSection   (OrderCard com status atuais)
BottomTabBar         (Home · Busca · Vender · Pedidos · Perfil)
```

Cada seção é um componente próprio, importado de `components/marketplace/`. Isso permite:

- **Reordenar** seções sem reescrever a tela.
- **A/B testar** seções (desligar uma sem afetar as demais).
- **Reusar** seções em outras telas (ex: `FeaturedSellerSection` na tela de busca).

## 7. Estratégia de conversão Figma → React Native

### O que **fazemos**

- **Codificar tokens** uma única vez (`src/theme/`).
- **Quebrar telas** em componentes pequenos por função.
- **Usar `FlatList`** para listas horizontais e verticais (performance e lazy render).
- **Usar `ScrollView`** apenas para a estrutura principal da Home.
- **`SafeAreaView`** sempre que necessário (notch, gestos).
- **Imagens** via `Image` com `source={{ uri }}` (mocks usam URLs externas; produção via CDN).
- **Ícones** via `@expo/vector-icons` (Ionicons / Feather).
- **Estados** explícitos: `LoadingState`, `EmptyState`, `ErrorState`.

### O que **NÃO fazemos**

- **Não copiamos posicionamento absoluto** do Figma.
- **Não usamos NativeWind/Tailwind** nesta fase (decisão consciente — ver ADR-007 quando entrar).
- **Não duplicamos** Button, Card ou Input em telas diferentes.
- **Não embutimos lógica de domínio** em componentes — eles só recebem props.
- **Não criamos `StyleSheet` para apenas 1 linha** — preferimos prop ou `style={{}}` inline curto.

### Adaptações conscientes do Figma

Algumas decisões diferem ligeiramente do Figma quando React Native impõe limitações ou quando ganhamos clareza:

- Sombras em Android usam `elevation` (não suporta cor customizada).
- Gradientes complexos do hero podem ser aproximados com cor sólida + acento até `expo-linear-gradient` ser adotado.
- Cards horizontais usam `FlatList` com `snapToInterval` para paginação suave.

## 8. Responsividade

- **Largura adaptativa:** componentes usam `flex` e `%`, evitam larguras fixas.
- **Tamanhos de tela testados:** iPhone SE (375), iPhone 14 (390), Pixel 7 (412), iPad Mini (744 — futuro).
- **Densidades:** Expo trata automaticamente `@2x` / `@3x` para assets.

## 9. Acessibilidade (futuro)

- Toda imagem decorativa: `accessibilityElementsHidden`.
- Toda imagem com conteúdo: `accessibilityLabel`.
- Toda área interativa: `accessibilityRole="button"`, `accessibilityLabel`.
- Contraste mínimo AA validado nos tokens (verificar antes de releases).
