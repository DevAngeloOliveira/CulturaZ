# @culturaz/contracts

Fonte de verdade dos contratos da API CulturaZ.

- `openapi.yaml` — especificação OpenAPI 3.x **gerada a partir da implementação real** da API.
- `domain.md` — glossário de termos do domínio.

## Como o openapi.yaml é mantido

A partir do backend completo, o `openapi.yaml` deixou de ser escrito à mão.
Ele é **exportado da própria API** via springdoc-openapi, garantindo fidelidade total
com o que está implementado.

Para regenerar após mudanças no backend:

```bash
# Com a API rodando (pnpm stack:up ou pnpm api:run)
curl -s http://localhost:8080/v3/api-docs.yaml -o packages/contracts/openapi.yaml
```

## Como visualizar

- **Swagger UI ao vivo:** http://localhost:8080/swagger-ui.html (com a API rodando)
- **Swagger Editor:** copiar/colar `openapi.yaml` em https://editor.swagger.io/
- **Redoc CLI:** `npx @redocly/cli preview-docs openapi.yaml`
- **VS Code:** extensão "OpenAPI (Swagger) Editor"

## Geração de tipos TypeScript (frontend)

Quando o mobile for integrado, planeja-se gerar tipos automaticamente do contrato:

```bash
npx openapi-typescript packages/contracts/openapi.yaml \
  -o apps/mobile/src/types/api.generated.ts
```
