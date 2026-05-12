# CulturaZ — Apresentação para Portfólio e LinkedIn

Documento de apoio para mostrar o CulturaZ como projeto técnico em **portfólio**, **LinkedIn** e **conversas com recrutadores**.

## 1. Pitch curto (1 frase)

> CulturaZ é um marketplace mobile-first para compra, venda e revenda de livros, construído em monorepo com React Native + Expo, Kotlin + Spring Boot e PostgreSQL, modelado como produto real desde a fundação.

## 2. Pitch estendido (parágrafo)

> CulturaZ é um marketplace especializado em livros que conecta compradores, leitores, estudantes, sebos e revendedores individuais. O projeto é desenvolvido como produto real — não como MVP descartável — com monorepo organizado, Design System próprio derivado do Figma, monólito modular em Kotlin/Spring Boot preparado para evoluir, contratos OpenAPI como fonte de verdade entre mobile e backend, e documentação técnica em cada etapa. Cada entrega tem critério de aceite claro e mantém o produto sempre executável.

## 3. Pontos técnicos para destacar

### Arquitetura

- **Monorepo** com pnpm workspaces (mobile + contracts) e Gradle (API).
- **Monólito modular** consciente — não microsserviços prematuros.
- **OpenAPI 3.1** como fonte de verdade compartilhada entre frontend e backend.
- **Separação clara**: regra de negócio só no backend, mobile só apresenta e dispara ações.
- **ADRs** documentando cada decisão estrutural relevante.

### Backend

- Kotlin 1.9 + Spring Boot 3.3 + Java 21.
- Gradle Kotlin DSL.
- PostgreSQL + Flyway para migrações versionadas.
- DTOs em todas as fronteiras (entidade JPA nunca exposta).
- `GlobalExceptionHandler` com envelope de erro padronizado.
- Estrutura pronta para JWT + refresh token, audit log e RBAC.

### Mobile

- React Native + Expo (managed) + TypeScript strict.
- React Navigation v6 (native-stack + bottom-tabs).
- Zustand para estado global enxuto.
- Design System próprio: tokens (cores, espaçamento, raios, tipografia, sombras) codificados.
- Fraunces (editorial) + Inter (corpo) via `@expo-google-fonts`.
- Componentes reutilizáveis organizados por função (`layout`, `buttons`, `forms`, `cards`, `marketplace`).

### DevEx e qualidade

- Docker Compose sobe PostgreSQL e Adminer em um comando.
- CI/CD via GitHub Actions (build API + typecheck mobile).
- `.env.example` na raiz, sem segredos no repo.
- Documentação em português, atualizada a cada entrega.
- Commits convencionais, branch `main` protegida (futuro).

## 4. Sugestão de posts no LinkedIn por etapa

### Pós Entrega 1 — Fundação

> Comecei o **CulturaZ**: um marketplace mobile-first para compra, venda e revenda de livros 📚
>
> O foco desta primeira entrega não foi feature, foi **fundação**: monorepo organizado, documentação técnica completa, Design System derivado do Figma, esqueleto da API Kotlin/Spring Boot, schema PostgreSQL versionado via Flyway, contratos OpenAPI e CI/CD básico.
>
> Stack:
> ▸ Mobile: React Native + Expo + TypeScript
> ▸ Backend: Kotlin + Spring Boot 3 + Java 21
> ▸ Banco: PostgreSQL 16 + Flyway
> ▸ Monorepo: pnpm workspaces
>
> Sem pagamento real, sem CRUD completo, sem chat — tudo isso vem nas próximas entregas. A meta foi entregar uma base que recrutador abre e entende o projeto em 5 minutos.
>
> Repositório: github.com/DevAngeloOliveira/CulturaZ
>
> #ReactNative #Kotlin #SpringBoot #Java #PostgreSQL #Mobile #BackendDevelopment

### Pós Entrega 2 — Autenticação

> Autenticação 100% funcional no CulturaZ ✅
>
> ▸ JWT + refresh token
> ▸ BCrypt para hash de senha
> ▸ SecurityConfig com filtro de autenticação
> ▸ Interceptor HTTP no mobile injetando o token
>
> O que torna isso interessante? A estrutura já estava preparada desde a entrega 1 — não precisei refatorar nada. Esse é o ganho de planejar a fundação com cuidado.
>
> #JWT #Spring #Kotlin

### Pós Entrega 3 — Catálogo

> Catálogo do CulturaZ agora navegável de verdade 🔍
>
> Implementei busca, filtros, detalhes de anúncio, favoritos. Vendedor pode publicar, editar e remover anúncios (com fluxo de moderação).
>
> No backend: 3 novos módulos (`books`, `listings`, `favorites`) entrando no padrão monólito modular já estabelecido.
> No mobile: 4 novas telas, todas usando os componentes do Design System já prontos.
>
> Próximo: carrinho e checkout.

### Pós Entrega 4 — Compra

> Ciclo de compra completo no CulturaZ 🛒➡️📦
>
> O comprador agora consegue: adicionar ao carrinho, finalizar pedido com pagamento simulado, acompanhar status. O pedido pode ter itens de **múltiplos vendedores** (modelo realista de marketplace).
>
> Próxima entrega: experiência do vendedor.

### Pós Entrega 5 — Vendedor

> Lado vendedor do CulturaZ pronto 💼
>
> Ativação de perfil, dashboard, gestão de anúncios, recebimento e atualização de pedidos, relatório básico de vendas.
>
> Todos os endpoints validam ownership: vendedor só enxerga itens dos próprios anúncios. RBAC consistente em todo o backend.

## 5. Como responder em entrevistas

### "Por que esse projeto?"

> Quis construir algo que mostrasse **mais do que código** — fundação arquitetural, documentação, decisões justificadas, evolução planejada. Marketplace de livros é nicho conhecido (todo mundo entende compra/venda) mas com regras de negócio o suficiente pra exercitar modelagem, autenticação, autorização, ciclo de pedido e moderação.

### "Por que monólito e não microsserviços?"

> Microsserviços resolvem escala organizacional e isolamento de falha. Em projeto novo, com time pequeno, eles introduzem latência, complexidade operacional e overhead de transação distribuída sem benefício correspondente. CulturaZ é monólito modular — quando (se) houver justificativa real, extraio módulos. A organização por pacote já estabelece o limite.

### "Por que Expo e não bare React Native?"

> Expo managed entrega 80% do valor com 20% do esforço: hot reload instantâneo, build via EAS, Expo Go pra demo. Bare RN só compensa quando preciso de módulo nativo que não existe no Expo SDK, o que ainda não é o caso.

### "Como você lidaria com escala?"

> Hoje, está dimensionado pra dev local. Para escalar:
>
> 1. **Cache:** Redis pra hot listings, lista de categorias, sessões.
> 2. **Storage:** S3-compatible pra imagens.
> 3. **Async:** filas (RabbitMQ/Kafka) pra eventos de pedido e notificações.
> 4. **Observabilidade:** OpenTelemetry + Prometheus + Grafana.
> 5. **Banco:** réplicas de leitura para queries pesadas; particionamento se `orders` crescer muito.
> 6. **Frontend:** EAS Updates pra over-the-air updates.
> 7. **Microsserviços:** só se necessidade concreta aparecer (equipes separadas, picos desbalanceados).

### "O que faria diferente?"

> A próxima rodada teria testes desde a entrega 1 — escrevi a estrutura mas deixei testes reais pra fase 2. Em produto real, eu começaria com testes de contrato OpenAPI desde o primeiro endpoint.

## 6. Diferenciais para recrutadores

- **Documentação que se lê em 10 minutos** e dá visão completa.
- **Decisões justificadas** (ADRs, README, este documento).
- **Código limpo, modular, sem duplicação**.
- **Stack moderna**: Kotlin + Spring Boot 3 + Java 21 + React Native + Expo + PostgreSQL.
- **Evolução visível** — cada entrega tem PR, commit semântico, atualização de docs.
- **Pensa como produto**, não como exercício acadêmico.

## 7. Links

- **Repositório:** https://github.com/DevAngeloOliveira/CulturaZ
- **Figma:** https://www.figma.com/design/3GJETOFgD8T1Vkiwkbp4YU/CulturaZ
- **LinkedIn do autor:** (preencher após primeiro post)
