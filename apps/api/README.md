# CulturaZ — API

Backend Kotlin + Spring Boot 3 + Java 21 do marketplace CulturaZ.

## Stack

- Kotlin 1.9.25
- Spring Boot 3.3.4
- Java 21 (Temurin)
- Gradle Kotlin DSL 8.10
- PostgreSQL 16
- Flyway (migrações versionadas)
- springdoc-openapi (Swagger UI)

## Estrutura

```
src/main/kotlin/com/culturaz/api/
├── CulturaZApplication.kt         # Entry point
├── config/                        # Beans transversais
├── shared/                        # Cross-cutting (exceções, respostas, segurança)
└── <modulo>/                      # Um pacote por domínio (users, sellers, books...)
    └── <Modulo>Controller.kt
```

Cada módulo é uma fatia vertical autocontida (controller + service + repository + dto + entidades). Detalhes em [../../docs/arquitetura.md](../../docs/arquitetura.md).

## Como rodar

### Pré-requisitos

- Java 21 (Temurin recomendado)
- PostgreSQL 16 rodando em `localhost:5432` (use `pnpm infra:up` na raiz do monorepo)

### Comando

```bash
./gradlew bootRun
```

API em `http://localhost:8080`. Health: [/actuator/health](http://localhost:8080/actuator/health). Swagger: [/swagger-ui.html](http://localhost:8080/swagger-ui.html).

### Build standalone

```bash
./gradlew build
java -jar build/libs/culturaz-api-0.1.0.jar
```

### Docker

```bash
docker build -t culturaz-api .
docker run --rm -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=local \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/culturaz \
  -e SPRING_DATASOURCE_USERNAME=culturaz \
  -e SPRING_DATASOURCE_PASSWORD=culturaz \
  culturaz-api
```

## Endpoints disponíveis nesta entrega

| Endpoint                                    | Status                                                   |
| ------------------------------------------- | -------------------------------------------------------- |
| `GET /actuator/health`                      | ✅ Health check geral                                    |
| `GET /api/{module}/health`                  | ✅ Health por módulo (auth, users, sellers, books...)    |
| `GET /swagger-ui.html`                      | ✅ Swagger UI consumindo a spec gerada por anotações     |
| Demais endpoints documentados em OpenAPI    | 🚧 Implementação prevista para entregas 2+               |

Spec completa em [packages/contracts/openapi.yaml](../../packages/contracts/openapi.yaml).

## Migrações

Flyway aplica automaticamente toda migração em `src/main/resources/db/migration/` ao subir.

Estado atual:

- `V1__init_schema.sql` — todas as tabelas do domínio com FKs, índices e checks.
- `V2__seed_categories.sql` — seed inicial das 5 categorias da home.

Para adicionar nova migração: criar arquivo `V<N>__descricao_curta.sql`. **Nunca editar uma migração já aplicada** em qualquer ambiente.

## Testes

```bash
./gradlew test
```

Nesta entrega, apenas o smoke test de carga do contexto (`CulturaZApplicationTests`). Cobertura real vem a partir da entrega 2.
