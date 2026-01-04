# Quickstart Guide: Todo List Application

**Feature**: 001-todo-app
**Phase**: 1 (Design & Contracts)
**Date**: 2026-01-03
**Audience**: Developers setting up the project for the first time

## Overview

This guide provides step-by-step instructions to bootstrap the eng-soft-2025-2 monorepo workspace, install dependencies, and run all three frontend architectures (MVC, MVP, MVVM) with the dual-mode backend (REST and Realtime).

**Time to First Run**: ~15-20 minutes (with stable internet for package downloads)

---

## Prerequisites

### Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **Node.js** | 20.x LTS | Runtime for frontend and backend | [nodejs.org](https://nodejs.org/) |
| **pnpm** | 8.x+ | Workspace package manager | `npm install -g pnpm` |
| **Git** | 2.40+ | Version control | [git-scm.com](https://git-scm.com/) |

### Verify Installation

```bash
node --version   # Should show v20.x.x
pnpm --version   # Should show 8.x.x or higher
git --version    # Should show 2.40.x or higher
```

### System Requirements

- **OS**: Windows 10+, macOS 11+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum, 8GB recommended (concurrent dev servers)
- **Disk**: ~500MB for node_modules + build artifacts
- **Browser**: Chrome 100+, Firefox 100+, Safari 15+, or Edge 100+

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/vmenezesdev/todo-list-eng-soft-2025-2.git
cd eng-soft-2025-2
```

If you already cloned and are on a different branch:
```bash
git checkout 001-todo-app  # Checkout feature branch
```

### 2. Install Dependencies

**Root workspace setup**:
```bash
pnpm install
```

This command:
- Installs all dependencies for all apps and packages
- Sets up symlinks for workspace packages (`@repo/todo-*`)
- Runs postinstall hooks (if any)

**Expected Output**:
```
Packages: +XXX
++++++++++++++++++++++++++++++++++++++++++
Progress: resolved XXX, reused XXX, downloaded X, added XXX, done
```

**Troubleshooting**:
- If `pnpm install` fails, try `pnpm install --force`
- Check that Node.js version is 20.x (`node --version`)
- Ensure stable internet connection for package downloads

### 3. Verify Workspace Structure

```bash
ls -la
```

**Expected Output**:
```
apps/
  backend/
  frontend-mvc/
  frontend-mvp/
  frontend-mvvm/
packages/
  todo-domain/
  todo-gateway/
  todo-store/
  todo-ui/
  todo-wiring/
node_modules/
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
```

---

## Running the Application

### Option A: All Servers Simultaneously (Recommended for Demo)

**Purpose**: Run backend + all three frontends for multi-instance testing

**Setup**: Create a `run-all.sh` script (or use separate terminals)

**Manual Approach (4 terminals)**:

**Terminal 1 - Backend (REST mode)**:
```bash
cd apps/backend
pnpm dev
```

Expected output:
```
Server running on http://localhost:3000
Mode: REST
CORS enabled for: http://localhost:5173, http://localhost:5174, http://localhost:5175
```

**Terminal 2 - Frontend MVC**:
```bash
cd apps/frontend-mvc
pnpm dev
```

Expected output:
```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Terminal 3 - Frontend MVP**:
```bash
cd apps/frontend-mvp
pnpm dev
```

Expected output:
```
➜  Local:   http://localhost:5174/
```

**Terminal 4 - Frontend MVVM**:
```bash
cd apps/frontend-mvvm
pnpm dev
```

Expected output:
```
➜  Local:   http://localhost:5175/
```

**Access URLs**:
- MVC: http://localhost:5173
- MVP: http://localhost:5174
- MVVM: http://localhost:5175
- Backend API: http://localhost:3000/api

---

### Option B: Single Frontend + Backend

**For focused development on one architecture**

**Terminal 1 - Backend**:
```bash
cd apps/backend
pnpm dev
```

**Terminal 2 - Choose ONE frontend**:
```bash
# For MVC:
cd apps/frontend-mvc
pnpm dev

# OR for MVP:
cd apps/frontend-mvp
pnpm dev

# OR for MVVM:
cd apps/frontend-mvvm
pnpm dev
```

---

## Testing Backend Modes

### REST Mode (Manual Refresh Required)

**Backend Configuration**:
```bash
cd apps/backend
echo "BACKEND_MODE=rest" > .env
pnpm dev
```

**Frontend Configuration** (any architecture):
```bash
cd apps/frontend-mvc  # Or mvp/mvvm
echo "VITE_BACKEND_MODE=rest" > .env
pnpm dev
```

**Expected Behavior**:
1. Open two browser tabs: http://localhost:5173
2. In Tab 1: Create a task "Buy groceries"
3. In Tab 2: Task does NOT appear automatically
4. In Tab 2: Press Ctrl+R (refresh page)
5. In Tab 2: Task now appears ✓

---

### Realtime Mode (Automatic Propagation)

**Backend Configuration**:
```bash
cd apps/backend
echo "BACKEND_MODE=realtime" > .env
pnpm dev
```

**Frontend Configuration** (any architecture):
```bash
cd apps/frontend-mvc  # Or mvp/mvvm
echo "VITE_BACKEND_MODE=realtime" > .env
pnpm dev
```

**Expected Behavior**:
1. Open two browser tabs: http://localhost:5173
2. In Tab 1: Create a task "Buy groceries"
3. In Tab 2: Task appears automatically within ≤1s ✓ (no refresh needed)
4. In Tab 1: Edit task to "Buy organic groceries"
5. In Tab 2: Task updates automatically within ≤1s ✓
6. In Tab 1: Delete task
7. In Tab 2: Task disappears automatically within ≤1s ✓

---

## Verifying Installation

### Backend Health Check

**REST Mode**:
```bash
curl http://localhost:3000/api/tasks
```

Expected response:
```json
{
  "tasks": []
}
```

**Realtime Mode**:
Use browser console:
```javascript
// Open browser console (F12) on http://localhost:5173
// Check for connection log
// Should see: "Connected: <socket-id>"
```

### Frontend Health Check

**Visual Verification**:
1. Open http://localhost:5173 (or 5174/5175)
2. Should see:
   - "Todo List" heading
   - Input field with "Add a task..." placeholder
   - "Add" button
   - Empty state message: "📝 No tasks yet"

**Console Check**:
```javascript
// Open browser console (F12)
// Should have no errors
// React DevTools should show component tree
```

### Create First Task

1. Type "Test task" in input field
2. Click "Add" button or press Enter
3. Task should appear at top of list
4. Reload page (Ctrl+R)
5. Task should still be visible (persistence works)

---

## Troubleshooting

### Port Already in Use

**Symptom**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

**Alternative**: Change port in `.env`:
```bash
# Backend
PORT=3001

# Frontend (automatic - Vite finds next available port)
```

---

### CORS Errors in Browser Console

**Symptom**: `Access to fetch at 'http://localhost:3000/api/tasks' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution**:
1. Verify backend `.env` has correct CORS origins:
   ```bash
   CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
   ```
2. Restart backend server
3. Hard refresh frontend (Ctrl+Shift+R)

---

### Socket.IO Connection Failed

**Symptom**: "Disconnected from server" or "Connection timeout"

**Solution**:
1. Verify backend running in Realtime mode: `BACKEND_MODE=realtime`
2. Check backend console for "Socket.IO initialized"
3. Check browser console for connection logs
4. Verify firewall not blocking WebSocket connections
5. Try `transports: ['polling']` temporarily (disable WebSocket):
   ```typescript
   const socket = io('http://localhost:3000', {
     transports: ['polling']  // HTTP fallback
   });
   ```

---

### Workspace Package Not Found

**Symptom**: `Cannot find module '@repo/todo-domain'`

**Solution**:
```bash
# From repository root
pnpm install

# If still failing, clear cache
pnpm store prune
pnpm install --force
```

---

### TypeScript Errors

**Symptom**: `Cannot find name 'Task'` or similar type errors

**Solution**:
1. Verify `tsconfig.json` paths are correct:
   ```json
   "paths": {
     "@repo/*": ["./packages/*/src"]
   }
   ```
2. Restart TypeScript server in IDE (VSCode: Cmd+Shift+P → "Restart TS Server")
3. Rebuild workspace:
   ```bash
   pnpm --filter @repo/todo-domain build
   pnpm --filter @repo/todo-gateway build
   # etc.
   ```

---

## Development Workflow

### Code Changes

**Frontend Changes**:
- Vite provides Hot Module Replacement (HMR)
- Changes reflect instantly in browser (no manual refresh)
- If HMR fails, browser auto-reloads

**Backend Changes**:
- Install `nodemon` for auto-restart: `pnpm add -D nodemon`
- Update `package.json`:
  ```json
  "scripts": {
    "dev": "nodemon --watch src --exec ts-node src/server.ts"
  }
  ```

**Shared Package Changes**:
- Changes automatically propagate via workspace symlinks
- If not reflecting, restart dev servers

### Testing Multi-Instance Sync

1. Start backend in Realtime mode
2. Start ONE frontend (e.g., MVC)
3. Open 2-3 browser windows/tabs to http://localhost:5173
4. Perform CRUD operations in one tab
5. Verify automatic propagation in other tabs (≤1s latency)
6. Record 40-60s video for evidence

### Switching Architectures

**To compare MVC vs MVP vs MVVM**:

1. Open three browser windows side-by-side
2. Window 1: http://localhost:5173 (MVC)
3. Window 2: http://localhost:5174 (MVP)
4. Window 3: http://localhost:5175 (MVVM)
5. Perform same task operations in each
6. Observe identical functionality (RF-019 compliance)
7. Take screenshots of folder structures for evidence

---

## Environment Variables Reference

### Backend (.env)

```bash
# Required
PORT=3000                                   # Server port
BACKEND_MODE=rest                           # or 'realtime'

# Optional
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
PERSISTENCE_FILE=./data/tasks.json         # Optional file persistence
LOG_LEVEL=info                              # debug | info | warn | error
```

### Frontend (.env)

```bash
# Required
VITE_BACKEND_MODE=rest                     # or 'realtime'
VITE_BACKEND_URL=http://localhost:3000     # Backend base URL

# Optional
VITE_UI_LIBRARY=mui                        # or 'chakra'
```

---

## Next Steps

After successful setup:

1. **Review Architecture Code**:
   - MVC: `apps/frontend-mvc/src/architecture/mvc/`
   - MVP: `apps/frontend-mvp/src/architecture/mvp/`
   - MVVM: `apps/frontend-mvvm/src/architecture/mvvm/`

2. **Study Shared Packages**:
   - Domain: `packages/todo-domain/src/`
   - Gateway: `packages/todo-gateway/src/`
   - Store: `packages/todo-store/src/`
   - UI: `packages/todo-ui/src/`

3. **Review Contracts**:
   - REST API: `specs/001-todo-app/contracts/rest-api.yaml`
   - Realtime Events: `specs/001-todo-app/contracts/realtime-events.md`

4. **Capture Evidence**:
   - Screenshots of folder structures
   - 40-60s video of multi-instance sync demo
   - Code snippets for 2-page report

5. **Generate Tasks**:
   ```bash
   # Run from repository root
   /speckit.tasks
   ```

---

## Cheat Sheet

**Start Everything**:
```bash
# Terminal 1
cd apps/backend && pnpm dev

# Terminal 2
cd apps/frontend-mvc && pnpm dev

# Terminal 3
cd apps/frontend-mvp && pnpm dev

# Terminal 4
cd apps/frontend-mvvm && pnpm dev
```

**Switch to Realtime Mode**:
```bash
# Backend
cd apps/backend
echo "BACKEND_MODE=realtime" > .env

# Frontend (all three)
cd apps/frontend-mvc && echo "VITE_BACKEND_MODE=realtime" > .env
cd apps/frontend-mvp && echo "VITE_BACKEND_MODE=realtime" > .env
cd apps/frontend-mvvm && echo "VITE_BACKEND_MODE=realtime" > .env
```

**Clean Reinstall**:
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm pnpm-lock.yaml
pnpm install
```

**Build for Production** (if needed):
```bash
pnpm build  # Builds all apps
```

---

## Support

**Issues**: https://github.com/vmenezesdev/todo-list-eng-soft-2025-2/issues

**Documentation**:
- Specification: `specs/001-todo-app/spec.md`
- Plan: `specs/001-todo-app/plan.md`
- Data Model: `specs/001-todo-app/data-model.md`
- Constitution: `.specify/memory/constitution.md`

**Team**: eng-soft-2025-2 (up to 4 members)
