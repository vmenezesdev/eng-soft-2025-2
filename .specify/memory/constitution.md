<!--
  SYNC IMPACT REPORT
  ==================
  Version Change: N/A → 1.0.0
  Type: INITIAL - First constitution establishment
  Date: 2026-01-03

  Modified Principles: N/A (initial creation)

  Added Sections:
  - Core Principles (7 principles focused on architectural pedagogy)
  - Educational Constraints
  - Development Workflow
  - Governance

  Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section aligned
  ✅ spec-template.md - Requirements validation aligned with architectural focus
  ✅ tasks-template.md - Task categorization supports modular architecture

  Follow-up TODOs: None

  Rationale:
  This is the initial constitution establishment for the Software Engineering academic project
  comparing MVC, MVP, and MVVM frontend architectures with REST and Reactive backend styles.
  The constitution focuses on architectural clarity, educational demonstration, and modular code reuse.
-->

# eng-soft-2025-2 Constitution

## Core Principles

### I. Architectural Separation (NON-NEGOTIABLE)

**MVC, MVP, and MVVM implementations MUST demonstrate clear architectural boundaries.**

- Each architecture (MVC, MVP, MVVM) MUST reside in separate frontend applications (`apps/frontend-mvc/`, `apps/frontend-mvp/`, `apps/frontend-mvvm/`)
- Architecture-specific code MUST be isolated in `architecture/<pattern>/` directories within each app
- MVC: View (React) calls Controller → Controller updates Model → Model notifies View
- MVP: View calls Presenter → Presenter orchestrates Model → Presenter updates View interface (no React in Presenter)
- MVVM: View binds to ViewModel → ViewModel exposes observable state → View reacts to changes (ViewModel has no JSX)
- Each implementation MUST showcase the pattern's inherent characteristics and trade-offs

**Rationale**: The primary goal is pedagogical comparison. Architectural clarity enables direct visual demonstration of responsibility separation differences to fulfill the 40% implementation correctness evaluation criterion.

### II. Modular Domain Core

**Shared business logic and infrastructure MUST be extracted into reusable packages.**

- `packages/todo-domain/`: Pure entities and business rules, zero dependencies on architecture or infrastructure
- `packages/todo-gateway/`: Abstract `TaskGateway` interface with REST and Realtime implementations
- `packages/todo-store/`: State management without Redux/MobX/Zustand (React hooks only)
- `packages/todo-ui/`: Presentation components accepting data via props, no direct gateway/store access
- `packages/todo-wiring/`: Dependency injection factory for mode switching (REST vs Realtime)

**Rationale**: Eliminates code duplication across three frontend implementations while ensuring the architecture demonstration remains uncompromised. Shared modules are infrastructure/domain—not architecture. This supports the professor's requirement to see "only the orchestration changed" in folder structure prints.

### III. Backend Mode Duality

**Backend MUST support both REST (pull) and Realtime (push) communication modes.**

- REST mode: HTTP endpoints (`GET /tasks`, `POST /tasks`, `DELETE /tasks/:id`, `PUT /tasks/:id`) with manual refresh required
- Realtime mode: WebSocket/Server-Sent Events for automatic propagation of task create/update/delete events
- Both modes MUST consume identical domain logic and storage layer
- Mode switching MUST be configurable via environment variable or runtime flag
- When two frontend instances are open:
  - REST: Changes appear ONLY after explicit refresh/re-request
  - Realtime: Changes propagate automatically with ≤1s latency (RNF01)

**Rationale**: Demonstrates the 25% "Integration REST + Reativa funcionando" evaluation criterion. Duality enables live comparison of architectural impact when swapping communication styles.

### IV. Evidence-Driven Development

**All implementation claims MUST be supported by executable code and visual proof.**

- Folder structure screenshots showing `architecture/` separation
- Video evidence (40-60s) demonstrating dual-instance synchronization behavior for both REST and Realtime modes
- Code snippets in report MUST match actual repository files (no generic or AI-generated disconnected examples)
- Implementation MUST be runnable (locally with Vite or via CodeSandbox/StackBlitz)

**Rationale**: Addresses professor's warning: "Códigos genéricos, sem relação com as evidências apresentadas, não serão aceitos." Ensures the 20% "Evidências (prints + vídeo)" criterion is fulfilled with authentic artifacts.

### V. No State Management Libraries

**Frontend state management MUST use React hooks exclusively—no external state libraries allowed.**

- FORBIDDEN: Redux, MobX, Zustand, RxJS (for state), Jotai, Recoil, XState
- PERMITTED: React's `useState`, `useReducer`, `useContext`, `useSyncExternalStore`, custom hooks
- `packages/todo-store/` implements a minimal observable store using vanilla TypeScript + React hooks

**Rationale**: Enforces RP03 constraint. External state libraries abstract away the architectural differences being studied. Using only hooks ensures the architecture patterns (Controller, Presenter, ViewModel) remain visible and comparable.

### VI. Monorepo Workspace Organization

**Project MUST be structured as a monorepo with workspaces for isolated execution and shared dependencies.**

- Use pnpm workspaces (or yarn/npm workspaces)
- `apps/` contains independently runnable applications: `frontend-mvc`, `frontend-mvp`, `frontend-mvvm`, `backend`
- `packages/` contains reusable modules with isolated responsibilities
- Each workspace package has its own `package.json` with explicit local dependencies (`@repo/todo-domain`, etc.)
- Root `package.json` defines workspace protocol and shared dev tooling (TypeScript, ESLint, Prettier)

**Rationale**: Enables clean dependency graphs, independent execution of each frontend for demonstration, and efficient code sharing without compromising architectural isolation. Simplifies the evidência requirement by allowing three side-by-side deployments.

### VII. Simplicity and Focus

**Implementation MUST prioritize architectural clarity over feature completeness.**

- Implement ONLY the required features: List tasks (RF03), Create task (RF01), Delete task (RF02), Edit task (RF04)
- NO authentication, pagination, sophisticated UI, or extra features unless explicitly required by professor
- Use minimal styling (Material-UI or Chakra UI for clean baseline, not custom CSS artistry)
- Avoid over-engineering: no need for complex abstractions beyond what demonstrates the architecture

**Rationale**: Enunciado states: "O foco NÃO é estética nem complexidade funcional, mas ARQUITETURA." Prevents scope creep and keeps the demonstration focused on the 40% implementation criterion and 15% analysis criterion.

## Educational Constraints

**These constraints are derived from the academic assignment requirements (RP01-RP04).**

- **RP01**: Frontend implemented in React
- **RP02**: Frontend implemented using MVC, MVP, and MVVM architectures
- **RP03**: No use of Redux, MobX, Zustand, or other state management frameworks
- **RP04**: Backend offers REST (pull) and Reactive/Event-Driven (push) communication
- **Stack**: React for frontend, Express.js + Socket.IO (or equivalent) for backend
- **Deployment**: Use CodeSandbox, StackBlitz, or local Vite for rapid setup with minimal infrastructure noise

**Acceptance Criteria Compliance**:
All functional requirements (RF01-RF04) MUST meet criteria defined in requirements table, including:
- Task persistence (reload maintains state)
- Dual-mode behavior (REST manual vs Realtime automatic propagation)
- Multi-instance synchronization demonstration

## Development Workflow

### Specification First

- Use `/speckit.specify` to capture requirements and user stories
- Use `/speckit.clarify` to resolve ambiguities in architecture implementation choices
- Specification MUST reference enunciado requirements (RF01-RF04, RNF01-RNF02, RP01-RP04)

### Design Before Implementation

- Use `/speckit.plan` to produce implementation plan covering:
  - Workspace structure (which apps, which packages)
  - Architecture-specific file organization within each frontend
  - Backend dual-mode routing and event emission strategy
- Plan MUST include Constitution Check validating adherence to Principles I-VII
- Use `/speckit.tasks` to generate task breakdown organized by feature (RF01-RF04) and by architecture (MVC/MVP/MVVM)

### Incremental Delivery

- Implement one architecture at a time (e.g., MVC first, then MVP, then MVVM)
- Validate each architecture with both REST and Realtime modes before moving to next
- Capture evidence (screenshots, video) immediately after each architecture is functional
- Use `/speckit.analyze` to verify consistency across spec, plan, and tasks before final delivery

### Code Review and Quality Gates

- Each pull request MUST validate:
  - Architectural boundaries not violated (e.g., Presenter doesn't import React JSX)
  - Shared packages (`todo-domain`, `todo-gateway`, `todo-store`, `todo-ui`, `todo-wiring`) remain architecture-agnostic
  - Evidence artifacts updated to reflect implementation state
- Constitution violations MUST be documented in Complexity Tracking table (plan.md) with justification

## Governance

**This constitution is the authoritative source of architectural and organizational rules for the eng-soft-2025-2 project.**

### Amendment Process

1. Proposed changes MUST be documented with rationale
2. Team consensus required for principle modifications
3. Use `/speckit.constitution` to update this file
4. Version increment rules:
   - **MAJOR** (X.0.0): Principle removal, redefinition, or backward-incompatible governance change
   - **MINOR** (x.Y.0): New principle added or existing principle materially expanded
   - **PATCH** (x.y.Z): Clarifications, typos, formatting, non-semantic edits
5. All dependent templates (plan, spec, tasks) MUST be reviewed and updated after amendment

### Compliance Review

- Constitution Check (plan.md) gates progression to implementation
- All PRs verify alignment with Principles I-VII
- Any complexity/violation MUST be justified in Complexity Tracking table
- Final deliverables (código + evidências + relatório) MUST reference constitution adherence

### Scope of Authority

- This constitution governs the academic project period (Engenharia de Software course)
- Runtime development guidance: see `README.md` and `docs/` folder
- For implementation-specific questions, consult plan.md and tasks.md generated via spec-kit commands

**Version**: 1.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-03
