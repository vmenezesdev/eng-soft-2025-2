/**
 * Entrypoint do pacote `todo-wiring`.
 *
 * Re-exporta tipos e fábricas úteis para montar a integração entre a
 * `TaskStore` local e os `TaskGateway` (REST / Realtime).
 *
 * Uso típico:
 * ```ts
 * import { createTaskStore } from '@repo/todo-wiring';
 * const { store, gateway } = createTaskStore('rest', { baseUrl: 'http://localhost:3000' });
 * ```
 */
export type { Mode } from './mode.js';
export { createGateway } from './createGateway.js';
export type { CreateGatewayOptions } from './createGateway.js';
export { createTaskStore } from './createTaskStore.js';
export type { CreateTaskStoreResult } from './createTaskStore.js';