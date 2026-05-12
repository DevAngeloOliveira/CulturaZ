# CulturaZ — Mobile

App React Native (Expo managed) do marketplace CulturaZ.

## Stack

- Expo SDK 51 · React Native 0.74 · React 18
- TypeScript strict
- React Navigation v6 (native-stack + bottom-tabs)
- Zustand para estado global
- @expo-google-fonts (Fraunces + Inter)
- @expo/vector-icons (Ionicons / Feather)

## Como rodar

```bash
# A partir da raiz do monorepo
pnpm install
pnpm mobile          # ou: pnpm --filter mobile start
```

Em seguida:
- Pressione **a** para Android emulador / **i** para iOS simulador
- Ou escaneie o QR Code com o app **Expo Go** (Android/iOS)

## Estrutura

```
src/
├── app/
│   ├── navigation/   # Stacks e tab navigators
│   └── providers/    # ThemeProvider, FontProvider
├── components/
│   ├── layout/       # AppScreen, AppHeader, SectionHeader, BottomTabBar
│   ├── buttons/      # Button, IconButton, FloatingActionButton
│   ├── forms/        # TextField, PasswordField, SearchInput, SelectChip
│   ├── feedback/     # Badge, StatusDot, EmptyState, LoadingState, ErrorState
│   ├── cards/        # BookCard, CategoryCard, QuickActionCard, SellerCard...
│   └── marketplace/  # Seções da Home (Header, Hero, FlashOffers...)
├── screens/
│   ├── public/       # Splash, Onboarding, Login, Register
│   ├── buyer/        # MarketplaceHome + placeholders
│   ├── seller/       # placeholders
│   └── admin/        # placeholders
├── services/         # http wrapper + namespaces de API
├── stores/           # Zustand (auth.store.ts)
├── hooks/            # useTheme, useDebounce
├── mocks/            # dados de exemplo tipados
├── theme/            # tokens (colors, spacing, radius, typography, shadows)
├── types/            # tipos de domínio
└── utils/            # format, assert
```

## Status atual

Entrega 1: tema fiel ao Figma, MarketplaceHomeScreen + Splash/Onboarding/Login/Register navegáveis com dados mockados. **Sem chamada real à API.** O login aceita qualquer credencial e popula um usuário fake.

Veja [../../docs/roadmap.md](../../docs/roadmap.md).

## Variáveis de ambiente

Suportadas via `EXPO_PUBLIC_*` (embutidas no bundle):

- `EXPO_PUBLIC_API_URL` — base da API (default `http://localhost:8080`)
- `EXPO_PUBLIC_ENV` — `local` / `staging` / `prod`
