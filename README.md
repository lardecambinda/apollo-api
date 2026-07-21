# Apollo API

Backend do Lar Fraterno de Cambinda. Express + Prisma + PostgreSQL.

## Quick Start

```bash
cp .env.example .env
docker compose up -d
```

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | Direct connection (migrations) |
| `JWT_SECRET` | JWT secret key |
| `PORT` | Server port (default: 3333) |
| `ALLOWED_ORIGINS` | CORS origins (comma separated) |
| `WHISPER_SERVER_URL` | Whisper server URL (default: localhost:8000) |

## Scripts

```bash
pnpm docker:up       # Start services
pnpm docker:down     # Stop services
pnpm docker:setup    # Start + schema + seed
pnpm docker:migrate  # Run migrations
pnpm docker:seed     # Run seed
pnpm dev:server      # Local dev server
```

## Licença

MIT
