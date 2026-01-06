# Todo UI

Pacote de componentes de UI para o projeto Todo App.

## Tecnologias

- React
- Tailwind CSS
- TypeScript

## Requisitos

Este pacote utiliza **Tailwind CSS** para estilização. O projeto que consumir este pacote deve ter o Tailwind configurado e incluir este pacote no escaneamento de classes.

### Configuração do Tailwind v4

No seu arquivo CSS principal (todos os `@import` devem vir primeiro):
```css
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap");

@source "../../packages/todo-ui/src/**/*.{ts,tsx}";
```

### Configuração do Tailwind v3 (Legacy)

No `tailwind.config.js`:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/todo-ui/src/**/*.{ts,tsx}"
  ],
  // ...
}
```

## Scripts Disponíveis

- `pnpm run build`: Gera a pasta `dist` com os arquivos compilados e definições de tipos.
- `pnpm run clean`: Remove a pasta `dist`.

## Estrutura do Pacote

O pacote está configurado com **Conditional Exports**:
- Em ambiente de **desenvolvimento** (ex: rodando com Vite), o entry point é `src/index.ts`, permitindo Hot Module Replacement (HMR) instantâneo sem necessidade de rebuild.
- Em ambiente de **produção** ou para outros consumidores, o entry point aponta para `dist/index.js`.

Para garantir que a pasta `dist` seja gerada, basta executar:
```bash
pnpm --filter todo-ui build
```
ou, na raiz do projeto:
```bash
pnpm build
```

## Padrões de Desenvolvimento

- Componentes funcionais.
- Props tipadas com TypeScript.
- Estilização via Tailwind CSS.
- Exportações centralizadas no `src/index.ts`.
