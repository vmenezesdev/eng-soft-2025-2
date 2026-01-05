# packages/todo-store

A small vanilla TypeScript observable store implementing the Observer (GoF) pattern.

This package provides:
- `TaskStore` (Subject): Attach/Detach/Notify (GoF semantics) + convenience API for React integration
- `StoreObserver` (concrete Observer): Example Observer implementation

Usage examples

1) GoF-style Observer (Attach / Detach / Notify)

```ts
import { TaskStore } from './src/TaskStore.js';
import { StoreObserver } from './src/StoreObserver.js';

const store = new TaskStore();
const observer = new StoreObserver();

store.attach(observer);
store.setTasks([{ id: '1', title: 'Example', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
// observer.update will be called when store.notify() is triggered by mutations
store.detach(observer);
```

2) React integration using `useSyncExternalStore` (React-facing adapter)

```ts
import { useSyncExternalStore } from 'react';
import { TaskStore } from './src/TaskStore.js';

const store = new TaskStore();

function useTasks() {
  return useSyncExternalStore(
    (callback) => store.subscribe(callback), // subscribe => returns unsubscribe
    () => store.getSnapshot()               // pull snapshot
  );
}

// In a component:
// const tasks = useTasks();
```

Notes

- The snippet above shows how to consume the store from React; the internal store implements full GoF Subject semantics (Attach / Detach / Notify) and follows a pull-based snapshot model.
- The implementation intentionally avoids external state libraries to remain pedagogical and clear.
- The package uses a concrete `StoreObserver` adapter (accepts an optional callback) instantiated by `TaskStore.subscribe()` to simplify React integration; this also aligns with the GoF Observer pattern for academic demonstration.
