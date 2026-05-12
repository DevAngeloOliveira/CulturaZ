# @culturaz/contracts

Fonte de verdade dos contratos da API CulturaZ.

- `openapi.yaml` — especificação OpenAPI 3.1 completa.
- `domain.md` — glossário de termos do domínio.

## Por que existe

Mobile e backend precisam concordar nos contratos. Em vez de manter "documentação" desatualizada em wiki ou Postman, mantemos um único YAML como **fonte de verdade**:

- Backend implementa o que o YAML descreve.
- Mobile consome tipos derivados dele.
- PRs que alteram contrato passam pelo YAML primeiro.

## Como visualizar

Qualquer ferramenta OpenAPI funciona:

- **Swagger Editor:** copiar/colar em https://editor.swagger.io/
- **Redoc CLI:** `npx @redocly/cli preview-docs openapi.yaml`
- **VS Code:** extensão "OpenAPI (Swagger) Editor"
- **springdoc-openapi:** quando a API roda, expõe `/swagger-ui.html` automaticamente

## Geração de tipos TypeScript (futuro)

Quando o mobile começar a consumir a API real (entrega 2), planejamos gerar tipos automaticamente:

```bash
npx openapi-typescript packages/contracts/openapi.yaml \
  -o apps/mobile/src/types/api.generated.ts
```
