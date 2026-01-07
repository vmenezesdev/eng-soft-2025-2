/**
 * Fábrica de gateways de tarefas (`todo-wiring`)
 *
 * Este módulo encapsula a criação de uma instância de `TaskGateway` baseada
 * no modo de operação escolhido. Usado para desacoplar a aplicação das
 * implementações concretas (REST x Realtime) e facilitar testes.
 *
 * Exemplo de opções:
 * - `baseUrl` (REST): URL base para chamadas HTTP
 * - `socketUrl` (Realtime): URL do servidor socket.io
 */
import type { Mode } from './mode.ts';
import { RestTaskGateway, RealtimeTaskGateway } from 'todo-gateway';
import type { TaskGateway } from 'todo-gateway';

export interface CreateGatewayOptions {
  /** URL base usada por `RestTaskGateway` (ex.: http://localhost:3000) - será automaticamente concatenada com `/api` */
  baseUrl?: string;
  /** URL usada por `RealtimeTaskGateway` (ex.: http://localhost:3000) */
  socketUrl?: string;
}

/**
 * Cria uma instância de `TaskGateway` adequada ao `mode`.
 *
 * @param mode - `'rest'` para criar `RestTaskGateway` ou `'realtime'` para `RealtimeTaskGateway`
 * @param opts - opções específicas da implementação (ex.: `baseUrl`, `socketUrl`)
 * @returns uma instância de `TaskGateway` pronta para uso
 */
export function createGateway(mode: Mode, opts: CreateGatewayOptions = {}): TaskGateway {
  if (mode === 'rest') {
    const base = opts.baseUrl ?? 'http://localhost:3000';
    return new RestTaskGateway(`${base}/api`);
  }
  const socket = opts.socketUrl ?? 'http://localhost:3000';
  return new RealtimeTaskGateway(socket);
}