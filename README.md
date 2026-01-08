# 🚀 eng-soft-2025-2

> Trabalho Final de Engenharia de Software — Comparação de Arquiteturas Frontend e Backend

## 📋 Sumário

- [Objetivo](#objetivo)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Princípios arquiteturais](#princ%C3%ADpios-arquiteturais)
- [Stack tecnológico](#stack-tecnol%C3%B3gico)
- [Requisitos funcionais](#requisitos-funcionais)
- [Como executar](#como-executar)
- [Critérios de avaliação & Evidências](#crit%C3%A9rios-de-avalia%C3%A7%C3%A3o--evid%C3%AAncias)
- [Documentação adicional](#documenta%C3%A7%C3%A3o-adicional)
- [Equipe & Licença](#equipe--licen%C3%A7a)

---

## 🎯 Objetivo

Comparar **MVC, MVP e MVVM** no frontend (React) integrados a backends **REST** e **Reativo** (WebSocket/SSE), avaliando:

- Separação de responsabilidades
- Impacto da arquitetura do backend sobre o frontend
- Esforço de implementação e manutenção
- Clareza do fluxo de dados

**Foco:** arquitetura, não estética ou complexidade extra.

---

## 🗂️ Estrutura do Projeto

O repositório contém três apps de frontend (MVC / MVP / MVVM) e um backend, além de pacotes compartilhados:

```text
└── eng-soft-2025-2
    ├── apps/
    │   ├── backend/
    │   ├── frontend-mvc/
    │   ├── frontend-mvp/
    │   └── frontend-mvvm/
    ├── packages/
    │   ├── todo-domain/
    │   ├── todo-gateway/
    │   ├── todo-store/
    │   ├── todo-ui/
    │   └── todo-wiring/
    ├── assets/
    └── docs/
```

(Árvore completa no README original.)

---

## 🧭 Princípios Arquiteturais

1. **Separação arquitetural clara** — cada padrão em app separado (`architecture/<pattern>/`).

   - MVC: View → Controller → Model → View
   - MVP: View → Presenter → Model → Presenter → View (Presenter sem JSX)
   - MVVM: View ↔ ViewModel ↔ Model (ViewModel sem JSX, binding via hooks)

2. **Módulos compartilhados** — domínio e infra em `packages/`:

   - `todo-domain`, `todo-gateway`, `todo-store`, `todo-ui`, `todo-wiring`

3. **Backend dual-mode**

   - REST (pull): atualizações via refresh
   - Realtime (push): WebSocket/SSE, propagação automática ≤ 1s

4. **Apenas React Hooks** — `useState`, `useReducer`, `useContext`, `useSyncExternalStore` (sem Redux/MobX/etc.).

5. **Simplicidade por requisito** — implementar somente: criar, remover, listar e editar tarefas.

---

## 🛠️ Stack Tecnológico

| Camada    | Tecnologia                              |
| --------- | --------------------------------------- |
| Frontend  | React 18+ com TypeScript                |
| Backend   | Express.js + Socket.IO (ou equivalente) |
| Estado    | React Hooks                             |
| UI        | Material-UI ou Chakra UI (minimalista)  |
| Workspace | pnpm workspaces                         |
| Deploy    | Vite (local) / CodeSandbox / StackBlitz |

---

## ✅ Requisitos Funcionais

| Código | Nome           | Descrição                                                       |
| ------ | -------------- | --------------------------------------------------------------- |
| RF01   | Criar tarefa   | Adicionar nova tarefa (persistida e propagada em modo realtime) |
| RF02   | Remover tarefa | Excluir tarefa (persistida e propagada)                         |
| RF03   | Listar tarefas | Exibir todas as tarefas ao abrir o app                          |
| RF04   | Editar tarefa  | Alterar título de tarefa existente (persistida e propagada)     |

**Não-Funcionais:** RNF01 (latência ≤1s em modo reativo), RNF02 (consistência entre instâncias).

---

## ▶️ Como Executar

### Pré-requisitos

- Node.js 18+ e pnpm (ou npm/yarn)
- Git

### Passos rápidos

```bash
# Clonar
git clone https://github.com/vmenezesdev/todo-list-eng-soft-2025-2.git
cd eng-soft-2025-2
pnpm install

# Rodar backend
cd apps/backend && pnpm dev

# Em outra janela, rodar frontend (ex.: MVC)
cd apps/frontend-mvc && pnpm dev
```

Para alternar modo REST ↔ Realtime, defina no frontend:

```env
VITE_BACKEND_MODE=rest   # ou "realtime"
```

---

## 🧾 Critérios de Avaliação & Evidências

- Implementação das 3 arquiteturas (40%)
- Integração REST + Reativa com prova em vídeo (25%)
- Evidências (prints + vídeo 40–60s) (20%)
- Relatório técnico (15%)

### Evidências obrigatórias

- [ ] Screenshots: estrutura de pastas e arquivos centrais
- [ ] Vídeo (40–60s): duas instâncias, criar/excluir, demonstrar REST e Realtime
- [ ] Relatório técnico (máx. 2 páginas): análise das escolhas

---

## 📚 Documentação Adicional

- `.specify/memory/constitution.md` — princípios detalhados
- `docs/relatorio.pdf` — relatório final
- `assets/images/`, `assets/videos/` — evidências

---

## 😁 Acessar o site do projeto

https://mvc-eng-soft-2025-2.onrender.com/
https://mvp-eng-soft-2025-2.onrender.com/
https://mvvm-eng-soft-2025-2.onrender.com/
https://backend-eng-soft-2025-2.onrender.com/

---

## 👥 Equipe

Trabalho em equipe de até 4 membros.

---

## 📝 Licença

Projeto acadêmico — Engenharia de Software 2025.2
**Professor:** César Olavo
