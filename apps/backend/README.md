# Backend - API de Bloco de Notas (Dual-Mode)

Este é o backend do projeto de comparação de arquiteturas, desenvolvido com **Express.js** e **Socket.IO**. Implementa uma API dual-mode que oferece suporte tanto a comunicação tradicional **REST** quanto a comunicação em tempo real **reativa** através de WebSockets.

## 🏗️ Arquitetura Dual-Mode

O backend foi projetado para funcionar em dois modos simultaneamente:

- **Modo REST**: Endpoints HTTP padrão para operações CRUD
- **Modo Reativo**: Comunicação em tempo real via Socket.IO para atualizações automáticas

Ambos os modos compartilham o mesmo armazenamento de dados, garantindo consistência entre as diferentes formas de acesso.

## 📁 Estrutura de Arquivos

```
apps/backend/
├── src/
│   ├── index.js              # Ponto de entrada do servidor
│   ├── store.js              # Armazenamento centralizado de tarefas
│   └── rest/
│       └── routes.js         # Rotas da API REST
├── public/
│   └── teste.html            # Cliente de teste para Socket.IO
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

## 🔌 Endpoints da API

### REST API (HTTP)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tasks` | Lista todas as tarefas |
| POST | `/api/tasks` | Cria uma nova tarefa |
| PUT | `/api/tasks/:id` | Atualiza uma tarefa existente |
| DELETE | `/api/tasks/:id` | Remove uma tarefa |

#### Exemplos de uso com curl:

```bash
# Listar tarefas
curl http://localhost:3000/api/tasks

# Criar tarefa
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha nova tarefa"}'

# Atualizar tarefa
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Título atualizado", "completed": true}'

# Excluir tarefa
curl -X DELETE http://localhost:3000/api/tasks/1
```

### WebSocket (Socket.IO)

O servidor Socket.IO está disponível em `ws://localhost:3000` e emite os seguintes eventos:

#### Eventos recebidos (cliente → servidor):
- `criar-tarefa` - Cria uma nova tarefa
- `editar-tarefa` - Atualiza uma tarefa existente
- `excluir-tarefa` - Remove uma tarefa
- `listar-tarefas` - Solicita a lista atual de tarefas

#### Eventos emitidos (servidor → cliente):
- `tarefas-iniciais` - Envia a lista inicial de tarefas ao conectar
- `tarefa-criada` - Notifica sobre nova tarefa criada
- `tarefa-atualizada` - Notifica sobre tarefa atualizada
- `tarefa-excluida` - Notifica sobre tarefa excluída
- `clientes-conectados` - Envia contagem atual de clientes conectados

## 💻 Integração com Frontend

### Modo REST (Pull)

Para frontends que utilizam o modo tradicional, use chamadas HTTP:

```javascript
// Buscar tarefas
const response = await fetch('http://localhost:3000/api/tasks');
const tasks = await response.json();

// Criar tarefa
await fetch('http://localhost:3000/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Nova tarefa' })
});
```

### Modo Reativo (Push)

Para frontends que utilizam comunicação em tempo real:

```javascript
// Conectar ao servidor Socket.IO
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Escutar eventos do servidor
socket.on('tarefa-criada', (tarefa) => {
  console.log('Nova tarefa:', tarefa);
  // Atualizar interface do usuário
});

socket.on('tarefa-atualizada', (tarefa) => {
  console.log('Tarefa atualizada:', tarefa);
  // Atualizar interface do usuário
});

// Enviar eventos para o servidor
socket.emit('criar-tarefa', 'Título da tarefa');
```

## 🧪 Testando o Backend

### Cliente de Teste

Um cliente de teste está disponível em `http://localhost:3000/teste.html`. Ele permite:

- Visualizar o status da conexão WebSocket
- Ver a contagem de clientes conectados
- Criar, editar e excluir tarefas
- Testar a sincronização em tempo real entre múltiplas abas/navegadores

### Teste com Múltiplos Clientes

Para demonstrar a funcionalidade em tempo real:

1. Abra `http://localhost:3000/teste.html` em duas abas diferentes
2. Crie uma tarefa na primeira aba
3. Observe a tarefa aparecer automaticamente na segunda aba
4. Edite ou exclua a tarefa em uma aba
5. Verifique a sincronização automática na outra aba

## 🏗️ Armazenamento de Dados

O backend utiliza um **armazenamento em memória** implementado no arquivo `store.js`. Esta implementação:

- Usa um `Map` para armazenar as tarefas
- Atribui IDs sequenciais automaticamente
- Mantém timestamps de criação e atualização
- É compartilhado entre os modos REST e Socket.IO

**Nota**: Para produção, recomenda-se substituir por um banco de dados persistente.

## ⚙️ Configurações Técnicas

### CORS (Cross-Origin Resource Sharing)

O servidor está configurado para aceitar conexões de:
- `http://localhost:3000` (próprio backend)
- `http://localhost:5173` (Vite - porta padrão)
- Outras portas conforme necessário para os frontends

### Segurança

- **Helmet.js**: Configurado para desenvolvimento (CSP desabilitado)
- **Validação básica**: Verificação de campos obrigatórios nas rotas REST
- **Tipos de dados**: Conversão automática de IDs para números inteiros

## 🔍 Monitoramento e Depuração

### Logs do Servidor

Ao iniciar o servidor com `npm run dev`, são exibidos:

- Mensagem de inicialização com as URLs disponíveis
- Log de conexão/desconexão de clientes WebSocket
- Registro de todas as operações CRUD realizadas

### Debug no Navegador

No console do navegador (F12), é possível:

- Verificar erros de conexão WebSocket
- Monitorar eventos recebidos do servidor
- Testar manualmente a conexão Socket.IO

## 📝 Notas para Desenvolvimento

### Para Adicionar Novos Campos às Tarefas

1. Atualize a criação no `store.js`
2. Atualize os handlers no `index.js` (Socket.IO)
3. Atualize as rotas no `routes.js` (REST)
4. Atualize o cliente de teste se necessário

### Para Implementar Persistência

Substitua a classe `TaskStore` por uma implementação que utilize:

- Sistema de arquivos (JSON)
- Banco de dados SQL (SQLite, PostgreSQL)
- Banco de dados NoSQL (MongoDB)

### Para Adicionar Autenticação

1. Implementar sistema de usuários
2. Adicionar middleware de autenticação nas rotas REST
3. Implementar namespaces/rooms no Socket.IO para isolamento

## 🚨 Solução de Problemas

### Servidor não inicia
- Verifique se a porta 3000 está disponível
- Confirme a instalação das dependências com `npm install`

### Conexão WebSocket falha
- Verifique se o servidor está rodando
- Confirme a configuração de CORS no `index.js`
- Verifique o console do navegador para mensagens de erro

### Eventos não são propagados
- Confirme se o cliente está conectado ao Socket.IO
- Verifique se os handlers de eventos estão registrados corretamente

## 📊 Requisitos Atendidos

- [x] RF01: Criar tarefa (REST + Socket.IO)
- [x] RF02: Remover tarefa (REST + Socket.IO)
- [x] RF03: Listar tarefas (REST + Socket.IO)
- [x] RF04: Editar tarefa (REST + Socket.IO)
- [x] RNF01: Propagação em tempo real com latência ≤1s
- [x] RNF02: Consistência entre múltiplas instâncias

## 🤝 Integração com Frontends do Projeto

Este backend está preparado para integrar-se com os três frontends do projeto (MVC, MVP, MVVM). Cada frontend pode escolher entre:

1. **Modo REST**: Usando `fetch()` para chamadas HTTP
2. **Modo Reativo**: Usando `socket.io-client` para WebSockets
3. **Modo Híbrido**: Combinando ambos conforme necessário

Para alternar entre modos, os frontends podem usar variáveis de ambiente ou configuração dinâmica.

---

**Pronto para desenvolvimento**: Este backend está completo e funcional, pronto para integrar-se com os frontends do projeto de comparação de arquiteturas.