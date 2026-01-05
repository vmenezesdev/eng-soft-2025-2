# Backend - API de Bloco de Notas (Dual-Mode)

Este é o backend do projeto de comparação de arquiteturas, desenvolvido com **Express.js** e **Socket.IO**. Implementa uma API dual-mode que oferece suporte tanto a comunicação tradicional **REST** quanto a comunicação em tempo real **reativa** através de WebSockets, seguindo estritamente os contratos definidos no projeto (`realtime-events.md` e `rest-api.yaml`).

## 🏗️ Arquitetura Dual-Mode

O backend foi projetado para funcionar em dois modos simultaneamente:

- **Modo REST**: Endpoints HTTP padrão para operações CRUD, seguindo a especificação OpenAPI
- **Modo Reativo**: Comunicação em tempo real via Socket.IO com eventos padronizados

Ambos os modos compartilham o mesmo armazenamento de dados em memória, garantindo consistência entre as diferentes formas de acesso.

## 📁 Estrutura de Arquivos Atualizada

```
apps/backend/
├── src/
│   ├── index.js              # Ponto de entrada do servidor
│   ├── store.js              # Armazenamento centralizado com UUIDs
│   └── rest/
│       └── routes.js         # Rotas REST seguindo contrato OpenAPI
├── public/
│   ├── teste.html            # Cliente de teste completo com interface
│   └── teste-contrato.html   # Cliente de teste para validação de contratos
├── package.json
└── README.md
```

## 📦 Dependências

### Dependências principais:
- **express**: Framework web para Node.js
- **socket.io**: Biblioteca para comunicação em tempo real via WebSockets
- **cors**: Middleware para habilitar CORS
- **helmet**: Middleware de segurança para Express

### Dependências de desenvolvimento:
- **nodemon**: Reinício automático do servidor durante desenvolvimento

## 🚀 Instalação e Configuração

1. **Navegue até a pasta do backend:**
   ```bash
   cd apps/backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure variáveis de ambiente (opcional):**
   Crie um arquivo `.env` na raiz do backend:
   ```env
   PORT=3000
   NODE_ENV=development
   ```

4. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

   O servidor estará disponível em `http://localhost:3000`

## 📋 Conformidade com Contratos

Este backend implementa estritamente os contratos definidos no projeto:

### ✅ REST API
- Segue a especificação `rest-api.yaml`
- Respostas no formato exato definido (ex: `{ "tasks": [...] }`)
- Códigos HTTP e mensagens de erro padronizadas
- IDs no formato UUID (string), não sequenciais

### ✅ Socket.IO (Modo Reativo)
- Implementa todos os eventos definidos em `realtime-events.md`
- Estrutura de payloads exatamente como especificado
- Eventos de erro padronizados (`task:error`)
- Propagação automática ≤1s para múltiplos clientes

## 🔌 Endpoints da API (Atualizados)

### REST API (HTTP) - Conforme `rest-api.yaml`

| Método | Endpoint | Descrição | Formato da Resposta |
|--------|----------|-----------|---------------------|
| GET | `/api/tasks` | Lista todas as tarefas (mais recentes primeiro) | `{ "tasks": [{...}, {...}] }` |
| POST | `/api/tasks` | Cria uma nova tarefa | `{ "id": "uuid", "title": "...", "createdAt": "...", "updatedAt": "..." }` |
| PUT | `/api/tasks/:id` | Atualiza uma tarefa existente | `{ "id": "uuid", "title": "...", "createdAt": "...", "updatedAt": "..." }` |
| DELETE | `/api/tasks/:id` | Remove uma tarefa | Status 204 (sem conteúdo) |

#### Exemplos de uso com curl:

```bash
# Listar tarefas
curl http://localhost:3000/api/tasks

# Criar tarefa (validação: título não vazio, ≤500 caracteres)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha nova tarefa"}'

# Atualizar tarefa
curl -X PUT http://localhost:3000/api/tasks/a3f2c8b1-4d5e-6f7g-8h9i-0j1k2l3m4n5o \
  -H "Content-Type: application/json" \
  -d '{"title":"Título atualizado"}'

# Excluir tarefa
curl -X DELETE http://localhost:3000/api/tasks/a3f2c8b1-4d5e-6f7g-8h9i-0j1k2l3m4n5o
```

### WebSocket (Socket.IO) - Conforme `realtime-events.md`

O servidor Socket.IO está disponível em `ws://localhost:3000`:

#### 📤 Eventos recebidos (cliente → servidor):
- `task:list` - Solicita lista de tarefas
- `task:create` - Cria nova tarefa: `{ "title": "string" }`
- `task:update` - Atualiza tarefa: `{ "id": "uuid", "title": "string" }`
- `task:delete` - Exclui tarefa: `{ "id": "uuid" }`

#### 📥 Eventos emitidos (servidor → cliente):
- `task:list` - Resposta: `{ "tasks": [...] }` (apenas para solicitante)
- `task:created` - Broadcast: `{ "task": {...} }` (para todos os clientes)
- `task:updated` - Broadcast: `{ "task": {...} }` (para todos os clientes)
- `task:deleted` - Broadcast: `{ "id": "uuid" }` (para todos os clientes)
- `task:error` - Erro: `{ "error": "string", "operation": "string", "details": {...} }` (apenas para solicitante)

## 💻 Integração com Frontend

### Modo REST (Pull)

Para frontends que utilizam o modo tradicional, use chamadas HTTP:

```javascript
// Buscar tarefas
const response = await fetch('http://localhost:3000/api/tasks');
const data = await response.json(); // { tasks: [...] }
const tasks = data.tasks;

// Criar tarefa
const createResponse = await fetch('http://localhost:3000/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type: 'application/json' },
  body: JSON.stringify({ title: 'Nova tarefa' })
});
const newTask = await createResponse.json(); // { id: "...", ... }
```

### Modo Reativo (Push)

Para frontends que utilizam comunicação em tempo real:

```javascript
// Conectar ao servidor Socket.IO
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Escutar eventos do servidor
socket.on('task:created', ({ task }) => {
  console.log('Nova tarefa:', task);
  // Atualizar interface do usuário
});

socket.on('task:updated', ({ task }) => {
  console.log('Tarefa atualizada:', task);
  // Atualizar interface do usuário
});

socket.on('task:deleted', ({ id }) => {
  console.log('Tarefa excluída:', id);
  // Remover da interface
});

// Enviar eventos para o servidor
socket.emit('task:create', { title: 'Título da tarefa' });
socket.emit('task:update', { id: 'uuid', title: 'Novo título' });
socket.emit('task:delete', { id: 'uuid' });
socket.emit('task:list', {}); // Solicitar lista inicial
```

## 🧪 Testando o Backend

### Cliente de Teste Completo

Um cliente de teste completo está disponível em `http://localhost:3000/teste.html`. Ele permite:

- Visualizar o status da conexão WebSocket
- Ver a contagem de clientes conectados em tempo real
- Criar, editar (título e conclusão) e excluir tarefas
- Testar a sincronização em tempo real entre múltiplas abas/navegadores
- Interface completa com todas as operações CRUD

### Cliente de Validação de Contratos

Para testar especificamente a conformidade com os contratos, acesse `http://localhost:3000/teste-contrato.html`. Ele testa:

- Todos os eventos Socket.IO definidos no contrato
- Estrutura exata dos payloads
- Tratamento de erros padronizado
- Validações de título (vazio, muito longo)

### Teste com Múltiplos Clientes

Para demonstrar a funcionalidade em tempo real conforme requisitos do trabalho:

1. Abra `http://localhost:3000/teste.html` em duas abas/navegadores diferentes
2. Crie uma tarefa na primeira aba
3. Observe a tarefa aparecer automaticamente na segunda aba (≤1s)
4. Edite o título ou estado de conclusão em uma aba
5. Verifique a sincronização automática na outra aba
6. Exclua uma tarefa e observe o desaparecimento em ambas

### Teste Automatizado com Curl

```bash
# Teste completo do fluxo REST
./test-rest.sh  # Script incluído no projeto

# Validações específicas
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":""}'  # Erro 400
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"x".repeat(501)}'  # Erro 400
```

## 🏗️ Armazenamento de Dados

O backend utiliza um **armazenamento em memória** implementado no arquivo `store.js`. Esta implementação:

- Usa `Map` para armazenamento eficiente de tarefas
- Gera **UUIDs** (não sequenciais) para cada tarefa
- Mantém timestamps ISO 8601 de criação (`createdAt`) e atualização (`updatedAt`)
- Ordena tarefas por data de criação (mais recentes primeiro)
- Implementa validações: título não vazio e ≤500 caracteres
- É compartilhado entre modos REST e Socket.IO para consistência

**Nota**: Para produção, recomenda-se substituir por um banco de dados persistente, mantendo a mesma interface.

## ⚙️ Configurações Técnicas

### CORS (Cross-Origin Resource Sharing)

O servidor está configurado para aceitar conexões de:
- `http://localhost:3000` (próprio backend servindo páginas estáticas)
- `http://localhost:5173` (Vite - porta padrão para frontends)
- Demais portas conforme necessário para desenvolvimento

### Segurança

- **Helmet.js**: Configurado para desenvolvimento (CSP desabilitado para testes locais)
- **Validação rigorosa**: Verificação de campos obrigatórios e limites
- **Tratamento de erros**: Respostas de erro padronizadas conforme contratos

### Performance

- **Propagação em tempo real**: ≤1 segundo entre ações e atualizações em outros clientes
- **Armazenamento otimizado**: Uso de Map para operações O(1) em buscas por ID
- **Ordenação eficiente**: Ordenação por timestamp para listagem

## 🔍 Monitoramento e Depuração

### Logs do Servidor

Ao iniciar o servidor com `npm run dev`, são exibidos:

- Mensagem de inicialização com URLs disponíveis
- Log de conexão/desconexão de clientes WebSocket (com IDs de sessão)
- Registro de todas as operações CRUD realizadas com timestamps
- Erros de validação e operações falhas

### Debug no Navegador

No console do navegador (F12), é possível:

- Verificar status da conexão WebSocket
- Monitorar eventos recebidos/emitidos
- Testar manualmente a conexão Socket.IO
- Verificar erros de validação e estrutura de dados

### Ferramentas Recomendadas

- **Postman/Insomnia**: Para testar endpoints REST
- **Browser DevTools**: Para debug WebSocket
- **wscat**: Cliente WebSocket de linha de comando (`npm install -g wscat`)

## 📝 Notas para Desenvolvimento

### Adicionando Novos Campos às Tarefas

1. Atualize a criação no `store.js` (validações se necessário)
2. Atualize os handlers no `index.js` (Socket.IO)
3. Atualize as rotas no `routes.js` (REST)
4. Atualize clientes de teste se necessário
5. **Importante**: Mantenha compatibilidade com contratos existentes

### Implementando Persistência

Para substituir o armazenamento em memória:

1. **Sistema de arquivos (JSON)**:
   - Substitua `Map` por leitura/escrita em arquivo
   - Use `fs/promises` para operações assíncronas

2. **Banco de dados SQL (SQLite, PostgreSQL)**:
   - Adicione driver do banco (ex: `pg`, `sqlite3`)
   - Implemente métodos do `TaskStore` com queries

3. **Banco de dados NoSQL (MongoDB)**:
   - Adicione driver do MongoDB
   - Use coleções para armazenamento

**Manter a mesma interface pública** para não quebrar clientes existentes.

### Adicionando Autenticação (Opcional)

1. Implementar sistema de usuários (login/registro)
2. Adicionar middleware de autenticação nas rotas REST
3. Implementar namespaces/rooms no Socket.IO para isolamento
4. Adicionar tokens JWT para autenticação WebSocket

## 🚨 Solução de Problemas Comuns

### Servidor não inicia
```bash
# Verifique se a porta 3000 está disponível
sudo lsof -i :3000

# Mate processos se necessário
kill -9 $(lsof -t -i:3000)

# Verifique dependências
npm install
```

### Conexão WebSocket falha
1. Verifique se o servidor está rodando (`npm run dev`)
2. Confirme a configuração de CORS no `index.js`
3. Verifique o console do navegador para mensagens de erro específicas
4. Teste com `wscat -c ws://localhost:3000`

### Eventos não são propagados
1. Confirme se o cliente está conectado (`socket.connected`)
2. Verifique se os listeners estão registrados corretamente
3. Confirme nomes exatos dos eventos (case-sensitive)
4. Verifique se o servidor está emitindo para `io.emit()` (broadcast) vs `socket.emit()` (apenas cliente)

### Erros de Validação
- **Título vazio**: `{"error":"Title cannot be empty"}`
- **Título muito longo**: `{"error":"Title must be 500 characters or less"}`
- **ID não encontrado**: `{"error":"Task not found"}`
- **Formato JSON inválido**: Verifique sintaxe do corpo da requisição

## 📊 Requisitos Atendidos

- [x] **RF01**: Criar tarefa (REST + Socket.IO) com validações
- [x] **RF02**: Remover tarefa (REST + Socket.IO) com confirmação
- [x] **RF03**: Listar tarefas (REST + Socket.IO) ordenadas por data
- [x] **RF04**: Editar tarefa (REST + Socket.IO) com validações
- [x] **RNF01**: Propagação em tempo real com latência ≤1s
- [x] **RNF02**: Consistência entre múltiplas instâncias conectadas

### Conformidade com Contratos
- [x] **Socket.IO**: Implementa todos os eventos de `realtime-events.md`
- [x] **REST API**: Segue estrutura de `rest-api.yaml`
- [x] **Formato de IDs**: UUIDs (strings) conforme especificado
- [x] **Estrutura de respostas**: Exatamente como definido nos contratos
- [x] **Tratamento de erros**: Eventos e respostas HTTP padronizados

## 🤝 Integração com Frontends do Projeto

Este backend está preparado para integrar-se com os três frontends do projeto (MVC, MVP, MVVM). Cada frontend pode escolher entre:

### 1. **Modo REST (Pull)**
- Usando `fetch()` ou `axios` para chamadas HTTP
- Atualização manual via refresh ou polling
- Ideal para demonstrar contraste arquitetural

### 2. **Modo Reativo (Push)**
- Usando `socket.io-client` para WebSockets
- Atualizações automáticas em tempo real
- Demonstra sincronização multi-instância

### 3. **Modo Híbrido**
- REST para operações iniciais + Socket.IO para atualizações
- Combina benefícios de ambos os modos

### Configuração do Frontend

Os frontends devem configurar a URL base:
- **REST**: `http://localhost:3000/api`
- **Socket.IO**: `http://localhost:3000`

Para alternar entre modos, use variáveis de ambiente ou configuração dinâmica conforme especificado no projeto principal.

---
