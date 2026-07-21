# Apollo API

Backend da plataforma do Lar Fraterno de Cambinda. API REST com Express, Prisma ORM e PostgreSQL.

## Funcionalidades

- Autenticação JWT (login/registro)
- CRUD de Publicações (posts)
- Categorias
- Notificações
- Upload de arquivos (Supabase Storage)
- Gerenciamento de usuários (ADMIN/EDITOR)
- Transcrição de áudio para texto (integrado com Whisper)

## Stack

- **Runtime:** Node.js 20
- **Framework:** Express
- **ORM:** Prisma 4.x
- **Banco:** PostgreSQL 16
- **Auth:** JWT (jsonwebtoken)
- **Upload:** Multer + Supabase Storage

## Instalação

### Docker (recomendado)

```bash
# Copiar .env
cp .env.example .env

# Subir tudo (API + PostgreSQL)
npm run docker:setup
```

### Local

```bash
# Instalar dependências
npm install

# Configurar .env
cp .env.example .env

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# Seed
npm run seed

# Iniciar servidor
npm run dev:server
```

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DATABASE_URL` | URL de conexão PostgreSQL | - |
| `DIRECT_URL` | Conexão direta (migrations) | - |
| `JWT_SECRET` | Chave secreta JWT | - |
| `PORT` | Porta do servidor | 3333 |
| `ALLOWED_ORIGINS` | Origens CORS (vírgula) | localhost:3000 |
| `WHISPER_SERVER_URL` | URL do servidor Whisper | localhost:8000 |

## Scripts Docker

```bash
npm run docker:up       # Iniciar serviços
npm run docker:down     # Parar serviços
npm run docker:setup    # Iniciar + schema + seed
npm run docker:migrate  # Rodar migrations
npm run docker:seed     # Rodar seeder
npm run docker:logs     # Ver logs
npm run docker:restart  # Reiniciar
```

## Endpoints

### Auth

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/auth` | Login |

### Posts

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/post/list` | Listar posts |
| `GET` | `/post/:id` | Buscar post |
| `POST` | `/post/create` | Criar post |
| `PUT` | `/post/:id` | Atualizar post |
| `DELETE` | `/post/:id` | Deletar post |
| `POST` | `/post/upload` | Upload de arquivos |

### Categories

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/category/list` | Listar categorias |
| `POST` | `/category` | Criar categoria |
| `PUT` | `/category/:id` | Atualizar categoria |
| `DELETE` | `/category/:id` | Deletar categoria |

### Users (ADMIN)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/user/list` | Listar usuários |
| `GET` | `/user/:id` | Buscar usuário |
| `POST` | `/user/register` | Registrar usuário |
| `PUT` | `/user/:id` | Atualizar usuário |
| `DELETE` | `/user/:id` | Deletar usuário |
| `PATCH` | `/user/:id/toggle` | Ativar/desativar |

### Transcriptions

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/transcription/upload` | Upload de áudio |
| `GET` | `/transcription/list` | Listar transcrições |
| `GET` | `/transcription/:id` | Buscar transcrição |
| `GET` | `/transcription/:id/progress` | SSE progresso |
| `GET` | `/transcription/:id/download` | Download TXT |
| `DELETE` | `/transcription/:id/cancel` | Cancelar |
| `DELETE` | `/transcription/:id` | Remover |

## Estrutura

```
apollo-api/
├── src/
│   ├── @types/          # Tipos TypeScript
│   ├── controller/      # Controllers
│   ├── middleware/       # Auth, logger
│   ├── routes/          # Rotas Express
│   └── server.ts        # Entry point
├── prisma/
│   ├── migrations/      # Migrations SQL
│   ├── schema.prisma    # Schema do banco
│   └── seed.ts          # Dados iniciais
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Licença

MIT
