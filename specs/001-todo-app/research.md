# Research: Todo List Application with Architectural Comparison

**Feature**: 001-todo-app
**Phase**: 0 (Research & Best Practices)
**Date**: 2026-01-03

## Overview

This document captures research findings for implementing MVC, MVP, and MVVM patterns in React with dual backend communication modes (REST and Realtime). All decisions prioritize architectural clarity for educational demonstration over production optimization.

---

## 1. React Architecture Patterns (MVC, MVP, MVVM)

### Decision: How to implement each pattern in React

**Rationale**: React components naturally blend view and logic, making pure architectural patterns challenging. We adapt each pattern to leverage React while maintaining distinguishable boundaries.

**MVC in React**:
- **Model**: Separate class/module managing state + domain logic wrapper
- **View**: React components (JSX) rendering UI, calling controller methods via props/callbacks
- **Controller**: Class with methods handling user actions, updating model, triggering view re-renders
- **Flow**: User action → Controller method → Model update → Controller forces view update (setState/forceUpdate)
- **Challenge**: Violates React's unidirectional data flow; pedagogically valuable to show awkwardness

**MVP in React**:
- **Model**: Same as MVC (state + domain)
- **View**: Interface (TypeScript) defining view contract (NO React dependency) + React implementation (TaskViewImpl.tsx)
- **Presenter**: Orchestrator with view interface reference, updates view via interface methods
- **Flow**: User action → View calls presenter → Presenter updates model → Presenter calls view.updateTaskList()
- **Key**: Presenter has ZERO JSX knowledge; view interface is technology-agnostic

**MVVM in React**:
- **Model**: Domain layer (same)
- **View**: React components binding to ViewModel via custom hook
- **ViewModel**: Observable state object (using useSyncExternalStore pattern) + command methods
- **Flow**: User action → ViewModel command → ViewModel state change → Hook re-renders view automatically
- **Key**: Two-way binding simulation via React hooks (useTaskViewModel subscribes to ViewModel)

**Alternatives Considered**:
- Using Redux/MobX for MVVM: Rejected per RP03 constraint
- Class components for MVC: Considered but function components + hooks more idiomatic in React 18+
- Signals/observables library: Rejected to keep vanilla TypeScript + hooks only

---

## 2. Monorepo Workspace Management

### Decision: Use pnpm workspaces

**Rationale**:
- **Performance**: Fastest install times, content-addressable storage (single node_modules/.pnpm)
- **Workspace protocol**: Native support for `workspace:*` dependencies (e.g., `@repo/todo-domain`)
- **Strictness**: Peer dependency resolution prevents accidental transitive imports
- **Compatibility**: Works with Vite, TypeScript, ESLint out of the box

**Implementation**:
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Alternatives Considered**:
- **Yarn workspaces**: Similar features but slower installation
- **npm workspaces**: Less mature, missing some pnpm strictness features
- **Lerna**: Overkill for simple monorepo; publishing not needed for academic demo

---

## 3. Backend Dual-Mode Architecture

### Decision: Single Express server with mode switch via environment variable

**Rationale**: Simplifies deployment and demonstrates backend flexibility. REST and Realtime share identical domain logic and storage.

**REST Mode**:
- **Technology**: Express.js with standard HTTP routes
- **Endpoints**: GET /tasks, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id
- **Response**: JSON with 200/201/204 status codes
- **CORS**: Enabled for localhost:5173, localhost:5174, localhost:5175 (three Vite dev servers)

**Realtime Mode**:
- **Technology**: Socket.IO 4.6+ (WebSocket with fallback to long-polling)
- **Events**:
  - Client → Server: `task:create`, `task:update`, `task:delete`
  - Server → Clients: `task:created`, `task:updated`, `task:deleted` (broadcast)
- **Connection**: Persistent WebSocket per client
- **Propagation**: Broadcast to all connected clients except sender (prevents echo)

**Shared Layer**:
- **Domain**: `Task` entity, validation rules (taskRules.ts)
- **Storage**: In-memory `Map<string, Task>` with optional JSON file persistence
- **Service**: Business logic layer (taskService.ts) validates + coordinates storage

**Mode Selection**:
```typescript
// Backend environment variable
BACKEND_MODE=rest  // or 'realtime'

// Frontend environment variable (Vite)
VITE_BACKEND_MODE=rest  // or 'realtime'
```

**Alternatives Considered**:
- Separate servers for REST and Realtime: Rejected (increases deployment complexity)
- GraphQL subscriptions: Rejected (adds unnecessary abstraction for simple CRUD)
- Server-Sent Events (SSE): Considered but Socket.IO provides bidirectional with better fallback support

---

## 4. State Management Without External Libraries

### Decision: Vanilla TypeScript observable store + React useSyncExternalStore

**Rationale**: RP03 forbids Redux/MobX/Zustand. React 18's `useSyncExternalStore` hook enables subscription to external stores while maintaining compatibility with concurrent rendering.

**Implementation Pattern**:
```typescript
// packages/todo-store/src/TaskStore.ts
export class TaskStore {
  private tasks: Task[] = [];
  private listeners = new Set<() => void>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot() {
    return this.tasks;
  }

  addTask(task: Task) {
    this.tasks = [task, ...this.tasks];  // Newest first
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

// Frontend hook
function useTaskStore(store: TaskStore) {
  return useSyncExternalStore(
    (callback) => store.subscribe(callback),
    () => store.getSnapshot()
  );
}
```

**Alternatives Considered**:
- useState + useEffect: Too imperative, doesn't scale to three architectures cleanly
- useReducer: Considered but observable store pattern better demonstrates external state management

---

## 5. UI Component Library

### Decision: Material-UI (MUI) 5.15+

**Rationale**:
- **Baseline**: Provides clean, professional components out-of-the-box (Button, TextField, List, IconButton)
- **Accessibility**: ARIA attributes built-in
- **TypeScript**: Full type support
- **Simplicity**: Minimal configuration required per Principle VII
- **Inline editing**: MUI TextField supports controlled/uncontrolled modes easily

**Usage**:
- `<TextField>` for task input and inline editing
- `<List>` + `<ListItem>` for task display
- `<IconButton>` for delete action
- `<Typography>` for empty state
- **No custom CSS**: Use MUI's `sx` prop for minimal spacing/layout adjustments only

**Alternatives Considered**:
- **Chakra UI**: Slightly simpler API but less comprehensive component library
- **Tailwind CSS**: Rejected (requires custom components, violates simplicity principle)
- **Vanilla CSS**: Rejected (wastes time on styling, distracts from architecture)

---

## 6. Task Ordering Strategy

### Decision: Reverse chronological (newest first) by creation timestamp

**Rationale**: Clarified via `/speckit.clarify`. Most intuitive for users to see recent tasks at top. Sorting is deterministic and consistent across all three architectures.

**Implementation**:
- Task entity includes `createdAt: Date` (ISO 8601 string)
- Backend stores in Map, returns sorted array
- Frontend displays as-received (no client-side re-sorting)
- New tasks prepended to array (`[newTask, ...existingTasks]`)

**Alternatives Considered**:
- Alphabetical: Rejected (less intuitive for task management)
- Last edited first: Rejected (adds complexity with updateAt tracking and re-sorting)

---

## 7. Inline Editing Interaction

### Decision: Double-click or click edit icon to enter inline edit mode

**Rationale**: Clarified via `/speckit.clarify`. Inline editing keeps users in context, reduces friction compared to modal dialogs.

**Implementation**:
- **TaskItem Component**: Displays task title as text by default
- **Edit Trigger**: Double-click title or click edit icon (pencil icon)
- **Edit Mode**: Replace text with `<TextField>` (controlled input)
- **Save**: Press Enter or click checkmark icon
- **Cancel**: Press Escape or click outside (blur) reverts to original
- **Validation**: Empty title shows inline error, prevents save

**User Flow**:
1. User sees "Buy groceries" in list
2. Double-clicks or clicks edit icon
3. Title becomes `<TextField value="Buy groceries" />`
4. User edits to "Buy organic groceries"
5. Presses Enter
6. Text reverts to display mode with new title
7. Backend update triggers (REST or Realtime depending on mode)

**Alternatives Considered**:
- Modal dialog: Rejected (breaks context, adds complexity)
- Dedicated edit page: Rejected (overkill for single field)

---

## 8. Delete Confirmation Strategy

### Decision: No confirmation (immediate delete)

**Rationale**: Clarified via `/speckit.clarify`. Simplifies implementation for academic demonstration. Task data is low-risk (just titles), and focus is architectural comparison not production UX safety.

**Implementation**:
- User clicks delete button (trash icon)
- Task immediately removed from store
- Backend deletion triggered
- No undo feature (out of scope per spec)

**Alternatives Considered**:
- Confirmation dialog: Rejected (adds UI complexity without architectural value)
- Undo toast: Rejected (requires temporary state management, violates simplicity)

---

## 9. TypeScript Configuration

### Decision: Strict mode enabled, path aliases for clean imports

**Rationale**: Type safety prevents common errors, path aliases improve code readability across monorepo.

**Root tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@repo/*": ["./packages/*/src"]
    }
  }
}
```

**Per-App Extension**:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "baseUrl": ".",
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

**Alternatives Considered**:
- Loose mode: Rejected (loses type safety benefits)
- JavaScript: Rejected (TypeScript interfaces critical for TaskGateway abstraction)

---

## 10. Development Workflow

### Decision: Concurrent dev servers (4 terminals) for multi-instance demo

**Rationale**: Enables live dual-instance testing during development.

**Setup**:
```bash
# Terminal 1: Backend (REST or Realtime mode)
cd apps/backend
pnpm dev  # Runs on http://localhost:3000

# Terminal 2: Frontend MVC
cd apps/frontend-mvc
pnpm dev  # Runs on http://localhost:5173

# Terminal 3: Frontend MVP
cd apps/frontend-mvp
pnpm dev  # Runs on http://localhost:5174

# Terminal 4: Frontend MVVM
cd apps/frontend-mvvm
pnpm dev  # Runs on http://localhost:5175
```

**Demo Flow**:
1. Start backend in Realtime mode
2. Open two browser windows:
   - Window 1: http://localhost:5173 (MVC)
   - Window 2: http://localhost:5173 (MVC duplicate instance)
3. Create task in Window 1
4. Observe propagation to Window 2 within 1s
5. Repeat with REST mode (manual refresh required)
6. Record 40-60s video

**Alternatives Considered**:
- Docker Compose: Rejected (overkill for local development, adds setup complexity)
- Concurrently npm package: Considered but manual terminals provide better visibility

---

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Architecture Patterns | MVC (awkward React fit), MVP (view interface), MVVM (hook binding) | Pedagogical demonstration of differences |
| Workspace | pnpm with workspace protocol | Performance + strictness |
| Backend Dual-Mode | Single Express + Socket.IO with env switch | Shared logic, simplified deployment |
| State Management | Vanilla TS store + useSyncExternalStore | RP03 compliance, React 18 compatibility |
| UI Library | Material-UI 5.15+ | Minimal setup, clean baseline |
| Task Ordering | Newest first (reverse chronological) | User-specified via clarification |
| Edit Interaction | Inline editing (double-click/icon) | User-specified via clarification |
| Delete Confirmation | None (immediate) | User-specified via clarification |
| TypeScript | Strict mode + path aliases | Type safety + clean imports |
| Dev Workflow | 4 concurrent servers | Multi-instance demo capability |

---

## Next Steps (Phase 1)

1. **data-model.md**: Define Task entity schema, validation rules, state transitions
2. **contracts/rest-api.yaml**: OpenAPI 3.0 specification for REST endpoints
3. **contracts/realtime-events.md**: Socket.IO event schema and payloads
4. **quickstart.md**: Setup instructions for initial workspace bootstrap

All research findings inform concrete design artifacts in Phase 1.
