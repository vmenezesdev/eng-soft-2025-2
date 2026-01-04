# Realtime Events Contract (Socket.IO)

**Feature**: 001-todo-app
**Phase**: 1 (Design & Contracts)
**Date**: 2026-01-03
**Protocol**: Socket.IO 4.6+ (WebSocket with fallback)

## Overview

This document specifies the Socket.IO event schema for realtime (push-based) communication mode. When `BACKEND_MODE=realtime`, task mutations automatically propagate to all connected clients within ≤1s (RNF-001).

---

## Connection

### Client Connection

**URL**: `http://localhost:3000` (Socket.IO endpoint)

**Initialization** (frontend):
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'],  // WebSocket preferred, fallback to polling
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
```

**Authentication**: None (academic demo, single-user context per Assumption 1)

---

## Client → Server Events

### 1. task:create

**Description**: Create a new task

**Payload**:
```typescript
{
  title: string;  // 1-500 chars, non-empty after trim
}
```

**Example**:
```json
{
  "title": "Buy groceries"
}
```

**Response Event**: `task:created` (broadcast to all clients)

**Error Event**: `task:error` (sent only to requester)

**Validation**:
- Title must not be empty (after trim)
- Title length ≤ 500 characters

---

### 2. task:update

**Description**: Update an existing task's title

**Payload**:
```typescript
{
  id: string;      // UUID of task to update
  title: string;   // New title (1-500 chars, non-empty)
}
```

**Example**:
```json
{
  "id": "a3f2c8b1-4d5e-6f7g-8h9i-0j1k2l3m4n5o",
  "title": "Buy organic groceries"
}
```

**Response Event**: `task:updated` (broadcast to all clients)

**Error Event**: `task:error` (sent only to requester)

**Validation**:
- Task with given ID must exist
- Title must not be empty (after trim)
- Title length ≤ 500 characters

---

### 3. task:delete

**Description**: Delete an existing task

**Payload**:
```typescript
{
  id: string;  // UUID of task to delete
}
```

**Example**:
```json
{
  "id": "a3f2c8b1-4d5e-6f7g-8h9i-0j1k2l3m4n5o"
}
```

**Response Event**: `task:deleted` (broadcast to all clients)

**Error Event**: `task:error` (sent only to requester)

**Validation**:
- Task with given ID must exist

---

### 4. task:list

**Description**: Request current task list (initial load or manual refresh)

**Payload**: None (or empty object `{}`)

**Example**:
```json
{}
```

**Response Event**: `task:list` (sent only to requester, not broadcast)

**Error Event**: `task:error` (sent only to requester)

---

## Server → Client Events

### 1. task:created

**Description**: A new task was created (broadcast to all connected clients)

**Payload**:
```typescript
{
  task: Task;  // Full task object with id, title, createdAt, updatedAt
}
```

**Example**:
```json
{
  "task": {
    "id": "c5h4e0d3-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
    "title": "Buy groceries",
    "createdAt": "2026-01-03T16:00:00.000Z",
    "updatedAt": "2026-01-03T16:00:00.000Z"
  }
}
```

**Trigger**: After successful `task:create` validation and storage

**Broadcast**: To all connected clients (including sender for consistency)

**Frontend Handling**:
```typescript
socket.on('task:created', ({ task }) => {
  taskStore.addTask(task);  // Prepend to list (newest first)
});
```

---

### 2. task:updated

**Description**: An existing task was updated (broadcast to all connected clients)

**Payload**:
```typescript
{
  task: Task;  // Full updated task object
}
```

**Example**:
```json
{
  "task": {
    "id": "a3f2c8b1-4d5e-6f7g-8h9i-0j1k2l3m4n5o",
    "title": "Buy organic groceries",
    "createdAt": "2026-01-03T15:00:00.000Z",
    "updatedAt": "2026-01-03T16:15:00.000Z"
  }
}
```

**Trigger**: After successful `task:update` validation and storage

**Broadcast**: To all connected clients

**Frontend Handling**:
```typescript
socket.on('task:updated', ({ task }) => {
  taskStore.updateTask(task.id, task);  // Replace in-place
});
```

---

### 3. task:deleted

**Description**: A task was deleted (broadcast to all connected clients)

**Payload**:
```typescript
{
  id: string;  // UUID of deleted task
}
```

**Example**:
```json
{
  "id": "a3f2c8b1-4d5e-6f7g-8h9i-0j1k2l3m4n5o"
}
```

**Trigger**: After successful `task:delete` storage removal

**Broadcast**: To all connected clients

**Frontend Handling**:
```typescript
socket.on('task:deleted', ({ id }) => {
  taskStore.removeTask(id);
});
```

---

### 4. task:list

**Description**: Response to `task:list` request (sent only to requester)

**Payload**:
```typescript
{
  tasks: Task[];  // Array of all tasks, ordered newest first
}
```

**Example**:
```json
{
  "tasks": [
    {
      "id": "a3f2c8b1-4d5e-6f7g-8h9i-0j1k2l3m4n5o",
      "title": "Buy organic groceries",
      "createdAt": "2026-01-03T15:00:00.000Z",
      "updatedAt": "2026-01-03T15:00:00.000Z"
    },
    {
      "id": "b4g3d9c2-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      "title": "Prepare presentation",
      "createdAt": "2026-01-03T14:30:00.000Z",
      "updatedAt": "2026-01-03T14:30:00.000Z"
    }
  ]
}
```

**Trigger**: After successful `task:list` request

**Broadcast**: No (sent only to requester via `socket.emit('task:list', ...)`)

**Frontend Handling**:
```typescript
socket.on('task:list', ({ tasks }) => {
  taskStore.setTasks(tasks);  // Replace entire list
});
```

---

### 5. task:error

**Description**: Error response for failed operation (sent only to requester)

**Payload**:
```typescript
{
  error: string;            // Error message
  details?: object;         // Additional context
  operation?: string;       // Which operation failed (create/update/delete)
}
```

**Example** (validation error):
```json
{
  "error": "Validation failed",
  "details": {
    "title": "Title cannot be empty"
  },
  "operation": "create"
}
```

**Example** (not found error):
```json
{
  "error": "Task not found",
  "details": {
    "id": "a3f2c8b1-4d5e-6f7g-8h9i-0j1k2l3m4n5o"
  },
  "operation": "update"
}
```

**Trigger**: After validation failure or storage error

**Broadcast**: No (sent only to requester via `socket.emit('task:error', ...)`)

**Frontend Handling**:
```typescript
socket.on('task:error', ({ error, details, operation }) => {
  console.error(`${operation} failed:`, error, details);
  // Show error toast or inline message
});
```

---

## Event Flow Diagrams

### Create Task Flow (Realtime Mode)

```
Client A                      Server                      Client B (observer)
   │                             │                              │
   │ emit: task:create           │                              │
   │ { title: "Buy groceries" }  │                              │
   ├─────────────────────────────►                              │
   │                             │                              │
   │                        [Validate]                          │
   │                        [Generate ID]                       │
   │                        [Store task]                        │
   │                             │                              │
   │         broadcast: task:created                            │
   │◄─────────────────────────────┼──────────────────────────────►
   │ { task: {...} }             │          { task: {...} }     │
   │                             │                              │
   │ [Add to local store]        │         [Add to local store] │
   │ [Re-render list]            │         [Re-render list]     │
   │                             │                              │
```

### Update Task Flow (Realtime Mode)

```
Client A                      Server                      Client B (observer)
   │                             │                              │
   │ emit: task:update           │                              │
   │ { id: "uuid", title: "..." }│                              │
   ├─────────────────────────────►                              │
   │                             │                              │
   │                        [Validate]                          │
   │                        [Update task]                       │
   │                             │                              │
   │         broadcast: task:updated                            │
   │◄─────────────────────────────┼──────────────────────────────►
   │ { task: {...} }             │          { task: {...} }     │
   │                             │                              │
   │ [Update local store]        │         [Update local store] │
   │ [Re-render task]            │         [Re-render task]     │
   │                             │                              │
```

### Delete Task Flow (Realtime Mode)

```
Client A                      Server                      Client B (observer)
   │                             │                              │
   │ emit: task:delete           │                              │
   │ { id: "uuid" }              │                              │
   ├─────────────────────────────►                              │
   │                             │                              │
   │                        [Validate ID]                       │
   │                        [Delete task]                       │
   │                             │                              │
   │         broadcast: task:deleted                            │
   │◄─────────────────────────────┼──────────────────────────────►
   │ { id: "uuid" }              │           { id: "uuid" }     │
   │                             │                              │
   │ [Remove from store]         │          [Remove from store] │
   │ [Re-render list]            │          [Re-render list]    │
   │                             │                              │
```

---

## Error Handling

### Network Disconnection

**Scenario**: Client loses network connection

**Behavior**:
1. Socket.IO auto-reconnects (up to 5 attempts)
2. On reconnect, client emits `task:list` to sync state
3. Server responds with full task list
4. Client replaces local store with server state

**Frontend Implementation**:
```typescript
socket.on('disconnect', () => {
  console.warn('Disconnected from server');
  // Show "Offline" indicator
});

socket.on('connect', () => {
  console.log('Reconnected to server');
  socket.emit('task:list', {});  // Re-sync
});
```

### Operation Timeout

**Scenario**: Server doesn't respond within 5 seconds

**Behavior**:
- Frontend shows timeout error message
- User can retry operation manually
- No automatic retry (keeps UX simple)

**Frontend Implementation**:
```typescript
const createTask = (title: string) => {
  const timeout = setTimeout(() => {
    console.error('Operation timed out');
    // Show error toast
  }, 5000);

  socket.emit('task:create', { title });

  socket.once('task:created', ({ task }) => {
    clearTimeout(timeout);
    // Success handling
  });

  socket.once('task:error', ({ error }) => {
    clearTimeout(timeout);
    // Error handling
  });
};
```

---

## Multi-Instance Synchronization

### Demonstration Scenario (Acceptance Criteria)

**Setup**:
- Backend running in Realtime mode (`BACKEND_MODE=realtime`)
- Two browser tabs open (both connected to same backend)
  - Tab 1: http://localhost:5173 (MVC app)
  - Tab 2: http://localhost:5173 (MVC app duplicate instance)

**Test Flow**:
1. Tab 1: Create task "Buy groceries"
   - Tab 1 emits `task:create`
   - Server broadcasts `task:created` to both tabs
   - Tab 1: Task appears at top within <1s
   - **Tab 2: Task appears at top within <1s (automatic propagation ✓)**

2. Tab 1: Edit task to "Buy organic groceries"
   - Tab 1 emits `task:update`
   - Server broadcasts `task:updated` to both tabs
   - Tab 1: Task title updates within <1s
   - **Tab 2: Task title updates within <1s (automatic propagation ✓)**

3. Tab 1: Delete task
   - Tab 1 emits `task:delete`
   - Server broadcasts `task:deleted` to both tabs
   - Tab 1: Task disappears within <1s
   - **Tab 2: Task disappears within <1s (automatic propagation ✓)**

**Success Criteria**: SC-005 (Realtime mode ≤1s propagation)

---

## Comparison with REST Mode

| Aspect | REST Mode | Realtime Mode |
|--------|-----------|---------------|
| **Transport** | HTTP (stateless) | WebSocket (persistent connection) |
| **Client Requests** | GET, POST, PUT, DELETE | emit('task:create', ...) etc. |
| **Server Responses** | JSON (200/201/204) | on('task:created', ...) etc. |
| **Multi-Instance Sync** | Manual refresh required | Automatic broadcast ≤1s |
| **Connection** | Request-response per operation | Single persistent socket |
| **Latency** | ~50-200ms per request | ~10-50ms event propagation |
| **Bandwidth** | Higher (HTTP headers) | Lower (binary WebSocket frames) |

---

## Implementation Notes

### Backend (apps/backend/src/realtime/taskSocket.ts)

```typescript
import { Server, Socket } from 'socket.io';
import { taskService } from '../domain/taskService';

export function setupTaskSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('task:create', async ({ title }) => {
      try {
        const task = await taskService.create(title);
        io.emit('task:created', { task });  // Broadcast to all
      } catch (error) {
        socket.emit('task:error', { error: error.message, operation: 'create' });
      }
    });

    socket.on('task:update', async ({ id, title }) => {
      try {
        const task = await taskService.update(id, title);
        io.emit('task:updated', { task });  // Broadcast to all
      } catch (error) {
        socket.emit('task:error', { error: error.message, operation: 'update' });
      }
    });

    socket.on('task:delete', async ({ id }) => {
      try {
        await taskService.delete(id);
        io.emit('task:deleted', { id });  // Broadcast to all
      } catch (error) {
        socket.emit('task:error', { error: error.message, operation: 'delete' });
      }
    });

    socket.on('task:list', async () => {
      try {
        const tasks = await taskService.getAll();
        socket.emit('task:list', { tasks });  // Send only to requester
      } catch (error) {
        socket.emit('task:error', { error: error.message, operation: 'list' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
```

### Frontend (packages/todo-gateway/src/RealtimeTaskGateway.ts)

```typescript
import { io, Socket } from 'socket.io-client';
import { Task, TaskGateway } from './TaskGateway';

export class RealtimeTaskGateway implements TaskGateway {
  private socket: Socket;

  constructor(backendUrl: string) {
    this.socket = io(backendUrl);
  }

  async create(title: string): Promise<Task> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);

      this.socket.emit('task:create', { title });

      this.socket.once('task:created', ({ task }) => {
        clearTimeout(timeout);
        resolve(task);
      });

      this.socket.once('task:error', ({ error }) => {
        clearTimeout(timeout);
        reject(new Error(error));
      });
    });
  }

  // Similar implementations for update, delete, getAll...
}
```

---

## Summary

| Event | Direction | Purpose | Broadcast? |
|-------|-----------|---------|------------|
| `task:create` | Client → Server | Create task | - |
| `task:created` | Server → Client | Notify task created | Yes (all clients) |
| `task:update` | Client → Server | Update task | - |
| `task:updated` | Server → Client | Notify task updated | Yes (all clients) |
| `task:delete` | Client → Server | Delete task | - |
| `task:deleted` | Server → Client | Notify task deleted | Yes (all clients) |
| `task:list` | Client → Server | Request task list | - |
| `task:list` | Server → Client | Respond with task list | No (requester only) |
| `task:error` | Server → Client | Operation failed | No (requester only) |

This event schema ensures ≤1s propagation (RNF-001) and consistent multi-instance synchronization (RNF-002) in Realtime mode.
