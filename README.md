# eng-soft-2025-2

> Trabalho Final de Engenharia de Software - Comparação de Arquiteturas Frontend e Backend

## Objetivo

Comparar **MVC, MVP e MVVM** no frontend (React) integrados a backends **REST** e **Reativo** (WebSocket/SSE), analisando:

- Separação de responsabilidades
- Impacto da arquitetura do backend sobre o frontend
- Esforço de implementação e manutenção
- Clareza do fluxo de dados

**Foco**: Arquitetura, não estética ou complexidade funcional.

---

## Estrutura do Projeto

```
eng-soft-2025-2/
├── apps/
│   ├── frontend-mvc/          # Todo App implementado em MVC
│   │   ├── src/
│   │   │   ├── architecture/
│   │   │   │   └── mvc/
│   │   │   │       ├── TaskController.ts
│   │   │   │       ├── TaskModel.ts
│   │   │   │       └── wiring.ts
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   └── package.json
│   │
│   ├── frontend-mvp/          # Todo App implementado em MVP
│   │   ├── src/
│   │   │   ├── architecture/
│   │   │   │   └── mvp/
│   │   │   │       ├── TaskPresenter.ts
│   │   │   │       ├── TaskView.ts
│   │   │   │       ├── TaskViewImpl.tsx
│   │   │   │       └── wiring.ts
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   └── package.json
│   │
│   ├── frontend-mvvm/         # Todo App implementado em MVVM
│   │   ├── src/
│   │   │   ├── architecture/
│   │   │   │   └── mvvm/
│   │   │   │       ├── TaskViewModel.ts
│   │   │   │       ├── useTaskViewModel.ts
│   │   │   │       └── wiring.ts
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   └── package.json
│   │
│   └── backend/               # Backend com suporte REST e Realtime
│       ├── src/
│       │   ├── rest/          # Endpoints HTTP (GET/POST/PUT/DELETE)
│       │   ├── realtime/      # WebSocket/SSE para push automático
│       │   ├── domain/        # Lógica de negócio compartilhada
│       │   └── store/         # Camada de persistência
│       └── package.json
│
├── packages/                  # Módulos compartilhados (infraestrutura)
│   ├── todo-domain/           # Entidades e regras de negócio puras
│   ├── todo-gateway/          # Interface para backend (REST/Realtime)
│   ├── todo-store/            # Gerenciamento de estado (React hooks)
│   ├── todo-ui/               # Componentes de UI reutilizáveis
│   └── todo-wiring/           # Factory para injeção de dependências
│
├── docs/                      # Documentação e relatório técnico
├── assets/
│   ├── images/                # Screenshots de estrutura de pastas
│   └── videos/                # Vídeo de demonstração (40-60s)
│
├── .specify/                  # Configuração do spec-kit
│   └── memory/
│       └── constitution.md    # Princípios arquiteturais do projeto
│
├── package.json               # Configuração do workspace (pnpm/yarn)
├── pnpm-workspace.yaml        # Definição dos workspaces
└── README.md
```

---

## Princípios Arquiteturais

### 1. Separação Arquitetural Clara

Cada arquitetura (MVC, MVP, MVVM) em app separado com código específico isolado em `architecture/<pattern>/`:

- **MVC**: View → Controller → Model → View
- **MVP**: View → Presenter → Model → Presenter → View (Presenter sem JSX)
- **MVVM**: View ↔ ViewModel ↔ Model (ViewModel sem JSX, binding via hooks)

### 2. Módulos Compartilhados

Domínio e infraestrutura reutilizados em `packages/`:

- `todo-domain`: Entidades e regras (Task, validações)
- `todo-gateway`: Comunicação com backend (RestTaskGateway, RealtimeTaskGateway)
- `todo-store`: Estado local (sem Redux/MobX/Zustand)
- `todo-ui`: Componentes visuais (TaskList, TaskItem, TaskForm)
- `todo-wiring`: Factory para trocar modo REST ↔ Realtime

**Importante**: Módulos compartilhados são infraestrutura, não arquitetura. A orquestração muda, o core não.

### 3. Backend Dual-Mode

- **REST (pull)**: HTTP endpoints, atualização manual via refresh
- **Realtime (push)**: WebSocket/SSE, propagação automática ≤1s

**Demonstração obrigatória**: Duas instâncias abertas → criar/excluir tarefa em uma → observar comportamento em ambos os modos.

### 4. Apenas React Hooks

Sem Redux, MobX, Zustand, RxJS, Jotai, Recoil, XState.
Estado gerenciado com `useState`, `useReducer`, `useContext`, `useSyncExternalStore`.

### 5. Simplicidade

Implementar **apenas** os requisitos obrigatórios:

- RF01: Criar tarefa
- RF02: Remover tarefa
- RF03: Listar tarefas
- RF04: Editar tarefa

Sem autenticação, paginação, UI sofisticada ou features extras.

---

## Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18+ com TypeScript |
| Backend | Express.js + Socket.IO (ou equivalente) |
| Estado | React Hooks (useState, useReducer, useContext) |
| UI | Material-UI ou Chakra UI (estilo minimalista) |
| Workspace | pnpm workspaces (ou yarn/npm workspaces) |
| Deploy | Vite (local) ou CodeSandbox/StackBlitz |

---

## Requisitos Funcionais

| Código | Nome | Descrição |
|--------|------|-----------|
| **RF01** | Criar tarefa | Adicionar nova tarefa (persistida, propagada em realtime) |
| **RF02** | Remover tarefa | Excluir tarefa existente (persistida, propagada em realtime) |
| **RF03** | Listar tarefas | Exibir todas as tarefas ao abrir app |
| **RF04** | Editar tarefa | Alterar título de tarefa existente (persistida, propagada em realtime) |

### Requisitos Não-Funcionais

- **RNF01**: Propagação em modo reativo com latência ≤1s
- **RNF02**: Consistência entre múltiplas instâncias conectadas

---

## Como Executar

### Pré-requisitos

- Node.js 18+ e pnpm (ou yarn/npm)
- Git

### Instalação

```bash
# Clonar repositório
git clone https://github.com/vmenezesdev/todo-list-eng-soft-2025-2.git
cd eng-soft-2025-2

# Instalar dependências (todos os workspaces)
pnpm install

# Executar backend
cd apps/backend
pnpm dev

# Em outro terminal, executar frontend MVC
cd apps/frontend-mvc
pnpm dev

# Para testar MVP ou MVVM, trocar para frontend-mvp ou frontend-mvvm
```

### Trocar Modo REST ↔ Realtime

Configurar variável de ambiente no frontend:

```env
VITE_BACKEND_MODE=rest      # ou "realtime"
```

---

## Critérios de Avaliação

| Critério | Peso | O que demonstrar |
|----------|------|------------------|
| Implementação das 3 arquiteturas | 40% | Código funcional + estrutura de pastas clara |
| Integração REST + Reativa | 25% | Vídeo mostrando dual-mode com 2 instâncias |
| Evidências (prints + vídeo) | 20% | Screenshots de código + vídeo 40-60s |
| Análise crítica no relatório | 15% | Respostas baseadas na implementação real |

---

## Evidências Obrigatórias

### 1. Screenshots

- [ ] Estrutura de pastas de cada arquitetura (MVC, MVP, MVVM)
- [ ] Código-fonte principal (Controller, Presenter, ViewModel)
- [ ] Projeto aberto na IDE

### 2. Vídeo (40-60 segundos)

- [ ] Duas instâncias do app abertas lado a lado
- [ ] Criar/excluir tarefa em uma instância
- [ ] Demonstrar comportamento REST (refresh manual)
- [ ] Demonstrar comportamento Realtime (propagação automática)

### 3. Relatório Técnico (máx. 2 páginas)

- [ ] Onde ficou a maior parte da lógica em cada arquitetura?
- [ ] Qual arquitetura foi mais simples de integrar com backend reativo?
- [ ] O que mudou no frontend ao trocar REST por reativo?
- [ ] Qual arquitetura escolheria para sistema maior? Por quê?

---

## Documentação Adicional

- **Constituição do Projeto**: `.specify/memory/constitution.md` (princípios detalhados)
- **Relatório Técnico**: `docs/` (análise comparativa final)
- **Evidências**: `assets/images/` e `assets/videos/`

---

## Equipe

Trabalho em equipe de até 4 membros.

---

## Licença

Projeto acadêmico - Engenharia de Software 2025.2
**Professor**: César Olavo
