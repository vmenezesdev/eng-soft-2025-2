# Implementation Plan: Todo List Application with Architectural Comparison

**Branch**: `001-todo-app` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-app/spec.md`

**Note**: This plan implements three frontend architectures (MVC, MVP, MVVM) with dual backend communication modes (REST and Realtime) for academic comparison.

## Summary

Implement a todo list application demonstrating three architectural patterns (MVC, MVP, MVVM) in React, each consuming a dual-mode backend (REST and Realtime). The system enables comparative analysis of architectural trade-offs when integrating with different backend communication strategies. Core functionality includes viewing, creating, editing, and deleting tasks with consistent behavior across all three frontend implementations. The backend supports both pull-based (REST with manual refresh) and push-based (WebSocket/SSE with automatic propagation ≤1s) synchronization for multi-instance demonstration.

## Technical Context

**Language/Version**: TypeScript 5.3+ with React 18+, Node.js 20+ (LTS)

**Primary Dependencies**:
- **Frontend**: React 18.2+, TypeScript 5.3+, Vite 5+ (dev server + build)
- **Backend**: Express.js 4.18+, Socket.IO 4.6+ (WebSocket realtime), cors, body-parser
- **UI Library**: Material-UI (MUI) 5.15+ or Chakra UI 2.8+ (minimal baseline styling)
- **Workspace**: pnpm 8+ with workspace protocol (or yarn 4+/npm 10+ workspaces)
- **Code Quality**: ESLint 8+, Prettier 3+, TypeScript strict mode

**Storage**: In-memory array (Map<string, Task>) with optional JSON file persistence for demo durability

**Testing**: Not required for MVP per spec assumptions (demo code quality focus)

**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge) with WebSocket support; dev server on localhost

**Project Type**: Monorepo web application (3 frontend apps + 1 backend app + 5 shared packages)

**Performance Goals**:
- Initial load <3s (RNF-002)
- Task operations responsive <1s (SC-002)
- Realtime propagation ≤1s latency (RNF-001, SC-005)
- Render up to 100 tasks without degradation (RNF-003)

**Constraints**:
- No external state management libraries (RP03: no Redux, MobX, Zustand)
- React hooks only for state (useState, useReducer, useContext, useSyncExternalStore)
- Architectural boundaries strictly enforced (Principle I)
- Shared packages architecture-agnostic (Principle II)
- Runnable via Vite or CodeSandbox/StackBlitz

**Scale/Scope**: Academic demonstration for ~4 team members, ~10-50 test tasks, 2-3 concurrent browser instances for multi-instance sync demo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Architectural Separation (NON-NEGOTIABLE)

- ✅ **PASS**: Three separate frontend apps (`apps/frontend-mvc/`, `apps/frontend-mvp/`, `apps/frontend-mvvm/`)
- ✅ **PASS**: Architecture-specific code isolated in `architecture/<pattern>/` directories
- ✅ **PASS**: MVC pattern: View → Controller → Model → View
- ✅ **PASS**: MVP pattern: View → Presenter → Model → Presenter → View (Presenter without JSX)
- ✅ **PASS**: MVVM pattern: View ↔ ViewModel ↔ Model (ViewModel without JSX, hook-based binding)
- ✅ **PASS**: Each demonstrates distinct separation of concerns per pattern

**Status**: COMPLIANT - No violations

### Principle II: Modular Domain Core

- ✅ **PASS**: `packages/todo-domain/` - Task entity, validation rules (pure TypeScript)
- ✅ **PASS**: `packages/todo-gateway/` - TaskGateway interface + REST/Realtime implementations
- ✅ **PASS**: `packages/todo-store/` - Observable store using React hooks (no external libs)
- ✅ **PASS**: `packages/todo-ui/` - TaskList, TaskItem, TaskForm, EmptyState components (props-based)
- ✅ **PASS**: `packages/todo-wiring/` - Factory for mode switching (createGateway, createTaskStore)
- ✅ **PASS**: All packages architecture-agnostic

**Status**: COMPLIANT - No violations

### Principle III: Backend Mode Duality

- ✅ **PASS**: REST endpoints: GET /tasks, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id
- ✅ **PASS**: Realtime: Socket.IO events (task:created, task:updated, task:deleted)
- ✅ **PASS**: Mode switchable via environment variable (VITE_BACKEND_MODE=rest|realtime)
- ✅ **PASS**: Shared domain logic and storage layer for both modes
- ✅ **PASS**: Propagation ≤1s in Realtime, manual refresh in REST

**Status**: COMPLIANT - No violations

### Principle IV: Evidence-Driven Development

- ✅ **PASS**: Folder structure screenshots planned (architecture/ dirs visible)
- ✅ **PASS**: Video demo planned (40-60s, dual-instance sync behavior)
- ✅ **PASS**: Code matches repository (no generic examples)
- ✅ **PASS**: Runnable locally via Vite (`pnpm dev` per app)

**Status**: COMPLIANT - Evidence artifacts planned for final delivery

### Principle V: No State Management Libraries

- ✅ **PASS**: React hooks only (useState, useReducer, useContext, useSyncExternalStore)
- ✅ **PASS**: No Redux, MobX, Zustand, RxJS, Jotai, Recoil, XState
- ✅ **PASS**: `packages/todo-store/` uses vanilla TypeScript + React hooks

**Status**: COMPLIANT - No violations

### Principle VI: Monorepo Workspace Organization

- ✅ **PASS**: pnpm workspaces configured (pnpm-workspace.yaml)
- ✅ **PASS**: `apps/` for runnable applications (4 apps)
- ✅ **PASS**: `packages/` for shared modules (5 packages)
- ✅ **PASS**: Local dependencies via workspace protocol (`@repo/todo-domain`, etc.)
- ✅ **PASS**: Root package.json with shared tooling (TypeScript, ESLint, Prettier)

**Status**: COMPLIANT - No violations

### Principle VII: Simplicity and Focus

- ✅ **PASS**: Only RF01-RF04 implemented (Create, Read, Update, Delete tasks)
- ✅ **PASS**: No authentication, pagination, search, advanced features
- ✅ **PASS**: Minimal UI (Material-UI or Chakra UI baseline)
- ✅ **PASS**: No over-engineering beyond architectural demonstration

**Status**: COMPLIANT - No violations

### Overall Gate Result: ✅ PASS

All 7 constitution principles satisfied. No complexity tracking required. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-app/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 data model
├── quickstart.md        # Phase 1 setup guide
├── contracts/           # Phase 1 API contracts
│   ├── rest-api.yaml    # OpenAPI 3.0 for REST endpoints
│   └── realtime-events.md  # Socket.IO event schema
└── checklists/
    └── requirements.md  # Spec quality validation (completed)
```

### Source Code (repository root)

```text
eng-soft-2025-2/
├── apps/
│   ├── frontend-mvc/
│   │   ├── src/
│   │   │   ├── architecture/
│   │   │   │   └── mvc/
│   │   │   │       ├── TaskController.ts       # Handles user actions, updates model
│   │   │   │       ├── TaskModel.ts            # State + domain logic wrapper
│   │   │   │       └── wiring.ts               # Dependency injection setup
│   │   │   ├── App.tsx                         # View composition + controller binding
│   │   │   ├── main.tsx                        # Entry point
│   │   │   └── vite-env.d.ts
│   │   ├── index.html
│   │   ├── package.json                        # Dependencies: @repo/todo-*
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── frontend-mvp/
│   │   ├── src/
│   │   │   ├── architecture/
│   │   │   │   └── mvp/
│   │   │   │       ├── TaskPresenter.ts        # Orchestrates model, updates view interface
│   │   │   │       ├── TaskView.ts             # Interface (no React dependency)
│   │   │   │       ├── TaskViewImpl.tsx        # React implementation of TaskView
│   │   │   │       └── wiring.ts
│   │   │   ├── App.tsx                         # View implementation + presenter wiring
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── frontend-mvvm/
│   │   ├── src/
│   │   │   ├── architecture/
│   │   │   │   └── mvvm/
│   │   │   │       ├── TaskViewModel.ts        # Observable state + command handlers
│   │   │   │       ├── useTaskViewModel.ts     # React hook for ViewModel binding
│   │   │   │       └── wiring.ts
│   │   │   ├── App.tsx                         # View with ViewModel binding
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── backend/
│       ├── src/
│       │   ├── rest/
│       │   │   └── taskRoutes.ts               # Express REST endpoints
│       │   ├── realtime/
│       │   │   └── taskSocket.ts               # Socket.IO event handlers
│       │   ├── domain/
│       │   │   ├── Task.ts                     # Server-side Task entity
│       │   │   └── taskService.ts              # Business logic layer
│       │   ├── store/
│       │   │   └── taskRepository.ts           # In-memory Map + persistence
│       │   └── server.ts                       # Express + Socket.IO bootstrap
│       ├── package.json
│       ├── tsconfig.json
│       └── .env.example                        # PORT, CORS_ORIGIN
│
├── packages/
│   ├── todo-domain/
│   │   ├── src/
│   │   │   ├── Task.ts                         # Task entity interface
│   │   │   ├── taskRules.ts                    # Validation (non-empty title, etc.)
│   │   │   └── index.ts                        # Public exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── todo-gateway/
│   │   ├── src/
│   │   │   ├── TaskGateway.ts                  # Abstract interface (CRUD methods)
│   │   │   ├── RestTaskGateway.ts              # Fetch-based HTTP implementation
│   │   │   ├── RealtimeTaskGateway.ts          # Socket.IO implementation
│   │   │   └── index.ts
│   │   ├── package.json                        # Deps: socket.io-client (peer)
│   │   └── tsconfig.json
│   │
│   ├── todo-store/
│   │   ├── src/
│   │   │   ├── TaskStore.ts                    # Observable store (vanilla TS)
│   │   │   ├── StoreObserver.ts                # Subscription interface
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── todo-ui/
│   │   ├── src/
│   │   │   ├── TaskList.tsx                    # Renders array of tasks
│   │   │   ├── TaskItem.tsx                    # Single task (inline edit, delete)
│   │   │   ├── TaskForm.tsx                    # Input + create button
│   │   │   ├── EmptyState.tsx                  # "No tasks" message
│   │   │   └── index.ts
│   │   ├── package.json                        # Deps: React, @mui/material or @chakra-ui/react
│   │   └── tsconfig.json
│   │
│   └── todo-wiring/
│       ├── src/
│       │   ├── mode.ts                         # Type: 'rest' | 'realtime'
│       │   ├── createGateway.ts                # Factory for gateway impl
│       │   ├── createTaskStore.ts              # Store + gateway wiring
│       │   └── index.ts
│       ├── package.json                        # Deps: @repo/todo-gateway, @repo/todo-store
│       └── tsconfig.json
│
├── docs/                                       # Final report (2-page analysis)
├── assets/
│   ├── images/                                 # Folder structure screenshots
│   └── videos/                                 # 40-60s demo video
│
├── .gitignore
├── package.json                                # Root workspace config
├── pnpm-workspace.yaml                         # Workspace package definitions
├── tsconfig.json                               # Shared TypeScript base config
├── .eslintrc.json                              # Shared lint rules
├── .prettierrc                                 # Shared formatting
└── README.md                                   # Project overview + setup
```

**Structure Decision**: Monorepo web application (Option 2 variant) with three parallel frontend implementations sharing common infrastructure. This structure optimally demonstrates the constitution's requirement that "only the orchestration changed" (Principle II) while maintaining strict architectural isolation (Principle I). The monorepo enables side-by-side execution for dual-instance synchronization demos and facilitates code reuse without violating separation of concerns.

## Complexity Tracking

> **No violations detected - this section intentionally left empty per constitution compliance.**

All implementation decisions align with the 7 core principles. No complexity justifications required.

