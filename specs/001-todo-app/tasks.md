# Tasks: Todo List Application with Architectural Comparison

**Input**: Design documents from `/specs/001-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: NOT REQUESTED - Tests are omitted per spec assumptions (demo code quality focus, no test suite required)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo root**: `eng-soft-2025-2/`
- **Frontend apps**: `apps/frontend-mvc/`, `apps/frontend-mvp/`, `apps/frontend-mvvm/`
- **Backend app**: `apps/backend/`
- **Shared packages**: `packages/todo-domain/`, `packages/todo-gateway/`, etc.

---

## Phase 1: Setup (Workspace Initialization)

**Purpose**: Bootstrap monorepo workspace structure and tooling

- [?] T001 Create root package.json with pnpm workspace configuration
- [?] T002 Create pnpm-workspace.yaml defining apps/* and packages/* workspaces
- [ ] T003 Create root tsconfig.json with strict mode and path aliases for @repo/*
- [ ] T004 [P] Create .gitignore for node_modules, dist, .env files
- [ ] T005 [P] Create .eslintrc.json with TypeScript and React rules
- [ ] T006 [P] Create .prettierrc with formatting configuration
- [ ] T007 Create apps/ directory structure (frontend-mvc, frontend-mvp, frontend-mvvm, backend)
- [ ] T008 Create packages/ directory structure (todo-domain, todo-gateway, todo-store, todo-ui, todo-wiring)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Shared Packages (Infrastructure)

- [x] T009 [P] Create packages/todo-domain/package.json with TypeScript dependency
- [x] T010 [P] Create packages/todo-domain/tsconfig.json extending root config
- [x] T011 [P] Create packages/todo-domain/src/Task.ts interface (id, title, createdAt, updatedAt)
- [x] T012 [P] Create packages/todo-domain/src/taskRules.ts validation functions (validateTitle)
- [x] T013 [P] Create packages/todo-domain/src/index.ts exporting Task and validation

- [ ] T014 [P] Create packages/todo-gateway/package.json with socket.io-client peer dependency
- [ ] T015 [P] Create packages/todo-gateway/tsconfig.json extending root config
- [ ] T016 [P] Create packages/todo-gateway/src/TaskGateway.ts interface (create, update, delete, getAll methods)
- [ ] T017 [P] Create packages/todo-gateway/src/RestTaskGateway.ts implementing fetch-based HTTP calls
- [ ] T018 [P] Create packages/todo-gateway/src/RealtimeTaskGateway.ts implementing Socket.IO client
- [ ] T019 [P] Create packages/todo-gateway/src/index.ts exporting all gateway classes

- [ ] T020 [P] Create packages/todo-store/package.json (no external dependencies)
- [ ] T021 [P] Create packages/todo-store/tsconfig.json extending root config
- [ ] T022 [P] Create packages/todo-store/src/StoreObserver.ts interface for subscriptions
- [ ] T023 [P] Create packages/todo-store/src/TaskStore.ts observable store class (vanilla TS, no external libs)
- [ ] T024 [P] Create packages/todo-store/src/index.ts exporting TaskStore and StoreObserver

- [ ] T025 [P] Create packages/todo-ui/package.json with React and @mui/material dependencies
- [ ] T026 [P] Create packages/todo-ui/tsconfig.json extending root config with jsx: react-jsx
- [ ] T027 [P] Create packages/todo-ui/src/EmptyState.tsx component (props-based, no store access)
- [ ] T028 [P] Create packages/todo-ui/src/index.ts exporting all UI components

- [ ] T029 [P] Create packages/todo-wiring/package.json depending on @repo/todo-gateway and @repo/todo-store
- [ ] T030 [P] Create packages/todo-wiring/tsconfig.json extending root config
- [ ] T031 [P] Create packages/todo-wiring/src/mode.ts type definition ('rest' | 'realtime')
- [ ] T032 [P] Create packages/todo-wiring/src/createGateway.ts factory function for gateway selection
- [ ] T033 [P] Create packages/todo-wiring/src/createTaskStore.ts factory wiring store with gateway
- [ ] T034 [P] Create packages/todo-wiring/src/index.ts exporting all wiring functions

### Backend Foundation

- [ ] T035 Create apps/backend/package.json with express, socket.io, cors, uuid, typescript dependencies
- [ ] T036 Create apps/backend/tsconfig.json extending root config
- [ ] T037 Create apps/backend/.env.example with PORT, BACKEND_MODE, CORS_ORIGIN variables
- [ ] T038 Create apps/backend/src/domain/Task.ts server-side Task interface matching packages/todo-domain
- [ ] T039 Create apps/backend/src/store/taskRepository.ts in-memory Map<string, Task> implementation
- [ ] T040 Create apps/backend/src/domain/taskService.ts business logic layer (create, update, delete, getAll with validation)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Existing Tasks (Priority: P1) 🎯 MVP

**Goal**: Display all tasks ordered newest first, with empty state when no tasks exist

**Independent Test**: Open application and verify pre-existing tasks display in list format (newest first), or empty state message if none exist

### Backend for User Story 1

- [ ] T041 [P] [US1] Implement GET /tasks endpoint in apps/backend/src/rest/taskRoutes.ts returning sorted task array
- [ ] T042 [P] [US1] Implement task:list Socket.IO event handler in apps/backend/src/realtime/taskSocket.ts

### Shared UI Components for User Story 1

- [ ] T043 [P] [US1] Create packages/todo-ui/src/TaskList.tsx component accepting tasks array via props
- [ ] T044 [P] [US1] Create packages/todo-ui/src/TaskItem.tsx component displaying single task title (read-only for US1)

### Frontend MVC for User Story 1

- [ ] T045 [P] [US1] Create apps/frontend-mvc/package.json depending on @repo/todo-* packages, React, Vite
- [ ] T046 [P] [US1] Create apps/frontend-mvc/tsconfig.json extending root config
- [ ] T047 [P] [US1] Create apps/frontend-mvc/vite.config.ts with React plugin
- [ ] T048 [P] [US1] Create apps/frontend-mvc/index.html entry point
- [ ] T049 [US1] Create apps/frontend-mvc/src/architecture/mvc/TaskModel.ts wrapping TaskStore
- [ ] T050 [US1] Create apps/frontend-mvc/src/architecture/mvc/TaskController.ts with loadTasks method
- [ ] T051 [US1] Create apps/frontend-mvc/src/architecture/mvc/wiring.ts setting up gateway and store
- [ ] T052 [US1] Create apps/frontend-mvc/src/App.tsx composing View with Controller binding
- [ ] T053 [US1] Create apps/frontend-mvc/src/main.tsx React entry point

### Frontend MVP for User Story 1

- [ ] T054 [P] [US1] Create apps/frontend-mvp/package.json (same structure as MVC)
- [ ] T055 [P] [US1] Create apps/frontend-mvp/tsconfig.json extending root config
- [ ] T056 [P] [US1] Create apps/frontend-mvp/vite.config.ts with React plugin
- [ ] T057 [P] [US1] Create apps/frontend-mvp/index.html entry point
- [ ] T058 [US1] Create apps/frontend-mvp/src/architecture/mvp/TaskView.ts interface (no React dependency)
- [ ] T059 [US1] Create apps/frontend-mvp/src/architecture/mvp/TaskPresenter.ts orchestrating model, updating view interface
- [ ] T060 [US1] Create apps/frontend-mvp/src/architecture/mvp/TaskViewImpl.tsx React implementation of TaskView interface
- [ ] T061 [US1] Create apps/frontend-mvp/src/architecture/mvp/wiring.ts setting up dependencies
- [ ] T062 [US1] Create apps/frontend-mvp/src/App.tsx with Presenter wiring
- [ ] T063 [US1] Create apps/frontend-mvp/src/main.tsx React entry point

### Frontend MVVM for User Story 1

- [ ] T064 [P] [US1] Create apps/frontend-mvvm/package.json (same structure as MVC/MVP)
- [ ] T065 [P] [US1] Create apps/frontend-mvvm/tsconfig.json extending root config
- [ ] T066 [P] [US1] Create apps/frontend-mvvm/vite.config.ts with React plugin
- [ ] T067 [P] [US1] Create apps/frontend-mvvm/index.html entry point
- [ ] T068 [US1] Create apps/frontend-mvvm/src/architecture/mvvm/TaskViewModel.ts observable state class (no JSX)
- [ ] T069 [US1] Create apps/frontend-mvvm/src/architecture/mvvm/useTaskViewModel.ts React hook using useSyncExternalStore
- [ ] T070 [US1] Create apps/frontend-mvvm/src/architecture/mvvm/wiring.ts setting up dependencies
- [ ] T071 [US1] Create apps/frontend-mvvm/src/App.tsx binding View to ViewModel via hook
- [ ] T072 [US1] Create apps/frontend-mvvm/src/main.tsx React entry point

### Backend Server Bootstrap

- [ ] T073 [US1] Create apps/backend/src/server.ts Express + Socket.IO initialization with CORS and routes

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP complete!)

---

## Phase 4: User Story 2 - Create New Tasks (Priority: P2)

**Goal**: Enable users to create tasks that appear at top of list and persist across reloads

**Independent Test**: Enter task title, click create, verify task appears at top and persists after page reload

### Backend for User Story 2

- [ ] T074 [P] [US2] Implement POST /tasks endpoint in apps/backend/src/rest/taskRoutes.ts
- [ ] T075 [P] [US2] Implement task:create Socket.IO event handler in apps/backend/src/realtime/taskSocket.ts broadcasting task:created

### Shared UI Components for User Story 2

- [ ] T076 [P] [US2] Create packages/todo-ui/src/TaskForm.tsx component with input field and create button (validation for empty title)

### Frontend MVC for User Story 2

- [ ] T077 [US2] Add createTask method to apps/frontend-mvc/src/architecture/mvc/TaskController.ts
- [ ] T078 [US2] Update apps/frontend-mvc/src/App.tsx to include TaskForm with controller binding

### Frontend MVP for User Story 2

- [ ] T079 [US2] Add createTask method to apps/frontend-mvp/src/architecture/mvp/TaskPresenter.ts
- [ ] T080 [US2] Update apps/frontend-mvp/src/architecture/mvp/TaskView.ts interface with onTaskCreate callback
- [ ] T081 [US2] Update apps/frontend-mvp/src/App.tsx to include TaskForm with presenter binding

### Frontend MVVM for User Story 2

- [ ] T082 [US2] Add createTaskCommand to apps/frontend-mvvm/src/architecture/mvvm/TaskViewModel.ts
- [ ] T083 [US2] Update apps/frontend-mvvm/src/App.tsx to include TaskForm bound to ViewModel command

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Edit Existing Tasks (Priority: P3)

**Goal**: Enable inline editing (double-click or click edit icon) of task titles with persistence

**Independent Test**: Double-click task or click edit icon, change title, press Enter/click save, verify update persists and propagates

### Backend for User Story 3

- [ ] T084 [P] [US3] Implement PUT /tasks/:id endpoint in apps/backend/src/rest/taskRoutes.ts
- [ ] T085 [P] [US3] Implement task:update Socket.IO event handler in apps/backend/src/realtime/taskSocket.ts broadcasting task:updated

### Shared UI Components for User Story 3

- [ ] T086 [US3] Update packages/todo-ui/src/TaskItem.tsx to support inline edit mode (double-click trigger, TextField, save/cancel)

### Frontend MVC for User Story 3

- [ ] T087 [US3] Add updateTask method to apps/frontend-mvc/src/architecture/mvc/TaskController.ts
- [ ] T088 [US3] Update apps/frontend-mvc/src/App.tsx to bind edit handlers to TaskItem

### Frontend MVP for User Story 3

- [ ] T089 [US3] Add updateTask method to apps/frontend-mvp/src/architecture/mvp/TaskPresenter.ts
- [ ] T090 [US3] Update apps/frontend-mvp/src/architecture/mvp/TaskView.ts interface with onTaskUpdate callback
- [ ] T091 [US3] Update apps/frontend-mvp/src/App.tsx to bind edit handlers to TaskItem

### Frontend MVVM for User Story 3

- [ ] T092 [US3] Add updateTaskCommand to apps/frontend-mvvm/src/architecture/mvvm/TaskViewModel.ts
- [ ] T093 [US3] Update apps/frontend-mvvm/src/App.tsx to bind edit command to TaskItem

**Checkpoint**: All user stories 1, 2, AND 3 should now be independently functional

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P4)

**Goal**: Enable immediate task deletion (no confirmation) with persistence

**Independent Test**: Click delete button, verify task disappears immediately and does not reappear after page reload

### Backend for User Story 4

- [ ] T094 [P] [US4] Implement DELETE /tasks/:id endpoint in apps/backend/src/rest/taskRoutes.ts
- [ ] T095 [P] [US4] Implement task:delete Socket.IO event handler in apps/backend/src/realtime/taskSocket.ts broadcasting task:deleted

### Shared UI Components for User Story 4

- [ ] T096 [US4] Update packages/todo-ui/src/TaskItem.tsx to include delete button (trash icon, no confirmation dialog)

### Frontend MVC for User Story 4

- [ ] T097 [US4] Add deleteTask method to apps/frontend-mvc/src/architecture/mvc/TaskController.ts
- [ ] T098 [US4] Update apps/frontend-mvc/src/App.tsx to bind delete handler to TaskItem

### Frontend MVP for User Story 4

- [ ] T099 [US4] Add deleteTask method to apps/frontend-mvp/src/architecture/mvp/TaskPresenter.ts
- [ ] T100 [US4] Update apps/frontend-mvp/src/architecture/mvp/TaskView.ts interface with onTaskDelete callback
- [ ] T101 [US4] Update apps/frontend-mvp/src/App.tsx to bind delete handler to TaskItem

### Frontend MVVM for User Story 4

- [ ] T102 [US4] Add deleteTaskCommand to apps/frontend-mvvm/src/architecture/mvvm/TaskViewModel.ts
- [ ] T103 [US4] Update apps/frontend-mvvm/src/App.tsx to bind delete command to TaskItem

**Checkpoint**: All user stories should now be independently functional (complete feature set)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories or final delivery requirements

- [ ] T104 [P] Add file persistence to apps/backend/src/store/taskRepository.ts (optional JSON file save/load)
- [ ] T105 [P] Create apps/backend/.env file with BACKEND_MODE=rest for testing
- [ ] T106 [P] Create apps/frontend-mvc/.env file with VITE_BACKEND_MODE=rest
- [ ] T107 [P] Create apps/frontend-mvp/.env file with VITE_BACKEND_MODE=rest
- [ ] T108 [P] Create apps/frontend-mvvm/.env file with VITE_BACKEND_MODE=rest
- [ ] T109 Update README.md in repository root with setup instructions and architecture overview
- [ ] T110 [P] Create docs/report.md template for 2-page technical analysis
- [ ] T111 Take screenshots of folder structures showing architecture/ directories for all three frontends
- [ ] T112 Record 40-60s video demonstrating dual-instance sync in REST mode (manual refresh required)
- [ ] T113 Record 40-60s video demonstrating dual-instance sync in Realtime mode (automatic propagation ≤1s)
- [ ] T114 Verify all three frontend architectures provide identical functionality per RF-019

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US1/US2 but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable

### Within Each User Story

- Backend endpoints can be built in parallel with frontend architecture setup
- Shared UI components can be built in parallel with architecture-specific code
- All three frontend architectures (MVC, MVP, MVVM) can be built in parallel for same user story
- Architecture-specific files (Controller vs Presenter vs ViewModel) have no inter-dependencies

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T004, T005, T006 can run in parallel (gitignore, eslint, prettier)

**Foundational Phase (Phase 2)**:
- All package.json and tsconfig.json files can be created in parallel (T009-T036)
- Domain, gateway, store, UI, wiring packages can be built in parallel

**User Story 1 (Phase 3)**:
- T041 and T042 (backend endpoints) can run in parallel
- T043 and T044 (shared UI) can run in parallel with backend
- T045-T053 (MVC), T054-T063 (MVP), T064-T072 (MVVM) can all run in parallel if team has 3+ developers
- Within each frontend: package.json, tsconfig, vite.config, index.html can all be created in parallel

**User Story 2 (Phase 4)**:
- T074 and T075 (backend) in parallel
- T076 (shared UI) in parallel with backend
- T077-T078 (MVC), T079-T081 (MVP), T082-T083 (MVVM) can run in parallel

**User Story 3 (Phase 5)**:
- T084 and T085 (backend) in parallel
- T087-T088 (MVC), T089-T091 (MVP), T092-T093 (MVVM) can run in parallel

**User Story 4 (Phase 6)**:
- T094 and T095 (backend) in parallel
- T097-T098 (MVC), T099-T101 (MVP), T102-T103 (MVVM) can run in parallel

**Polish Phase (Phase 7)**:
- T104-T108 (.env files) can run in parallel
- T111-T113 (evidence capture) can run in parallel

---

## Parallel Example: User Story 1 (3 Developers)

```bash
# Developer A: MVC Architecture
Tasks: T045, T046, T047, T048 (parallel setup)
Then: T049 → T050 → T051 → T052 → T053 (sequential architecture code)

# Developer B: MVP Architecture
Tasks: T054, T055, T056, T057 (parallel setup)
Then: T058 → T059 → T060 → T061 → T062 → T063 (sequential architecture code)

# Developer C: MVVM Architecture + Shared Components
Tasks: T041, T042 (backend), T043, T044 (UI) - all parallel
Then: T064, T065, T066, T067 (parallel setup)
Then: T068 → T069 → T070 → T071 → T072 (sequential architecture code)

# All converge at T073 (backend server bootstrap)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Open app, verify tasks display (if pre-seeded) or empty state
   - Test with REST mode
   - Test with Realtime mode (dual-instance sync)
5. Deploy/demo if ready (basic task viewing works!)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP: View tasks!)
3. Add User Story 2 → Test independently → Deploy/Demo (Can create tasks!)
4. Add User Story 3 → Test independently → Deploy/Demo (Can edit tasks!)
5. Add User Story 4 → Test independently → Deploy/Demo (Full CRUD complete!)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With 3-4 developers and foundational phase complete:

**Option A: Horizontal (by architecture)**:
- Developer A: All of MVC (US1 → US2 → US3 → US4)
- Developer B: All of MVP (US1 → US2 → US3 → US4)
- Developer C: All of MVVM (US1 → US2 → US3 → US4)
- Developer D: Backend + Shared UI for all stories

**Option B: Vertical (by user story)**:
- All developers: User Story 1 together (MVC, MVP, MVVM in parallel)
- All developers: User Story 2 together
- All developers: User Story 3 together
- All developers: User Story 4 together
- Benefit: Each story gets full team focus, demo-ready sooner

**Recommended**: Option B (vertical) for academic context - enables earlier architecture comparison discussions

---

## Notes

- [P] tasks = different files, no dependencies on incomplete work
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Commit after each task or logical group
- Tests intentionally omitted per spec assumptions (demo code quality focus)
- Focus on architectural clarity over production optimization
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Count Summary

- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 65 tasks (32 shared packages + 6 backend foundation + 1 checkpoint)
- **Phase 3 (US1 - View Tasks)**: 33 tasks (2 backend + 2 UI + 9 MVC + 10 MVP + 9 MVVM + 1 server)
- **Phase 4 (US2 - Create Tasks)**: 10 tasks (2 backend + 1 UI + 2 MVC + 3 MVP + 2 MVVM)
- **Phase 5 (US3 - Edit Tasks)**: 11 tasks (2 backend + 1 UI + 2 MVC + 3 MVP + 2 MVVM)
- **Phase 6 (US4 - Delete Tasks)**: 10 tasks (2 backend + 1 UI + 2 MVC + 3 MVP + 2 MVVM)
- **Phase 7 (Polish)**: 11 tasks (5 config + 4 evidence + 2 validation)

**Total**: 148 tasks

**Parallel Opportunities**: ~60% of tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phases 1 + 2 + 3 = 106 tasks (User Story 1 only - view tasks with dual-mode backend)

**Full Feature Set**: All phases = 148 tasks (complete CRUD with architectural comparison)
