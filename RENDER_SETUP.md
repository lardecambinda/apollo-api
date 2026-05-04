# Configuração de CI/CD com Render

Este projeto usa GitHub Actions para CI/CD e Render para hospedagem.

## Configuração no Render

1. **Criar novo Web Service no Render**
   - Acesse https://dashboard.render.com
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub `apollo-api`
   - Configure:
     - **Name**: `apollo-api` (ou nome de sua preferência)
     - **Environment**: `Node`
     - **Build Command**: `npm install && npx prisma generate`
     - **Start Command**: `npm start`
     - **Instance Type**: Free ou Starter

2. **Configurar Variáveis de Ambiente no Render**
   - No dashboard do seu serviço, vá em "Environment"
   - Adicione as seguintes variáveis:
     ```
     DATABASE_URL=sua_connection_string_do_postgres
     DIRECT_URL=sua_direct_connection_string
     JWT_SECRET=seu_jwt_secret_aqui
     ALLOWED_ORIGINS=https://seu-frontend.onrender.com,http://localhost:3000
     PORT=3333
     ```

3. **Criar PostgreSQL Database no Render**
   - Clique em "New +" → "PostgreSQL"
   - Copie a `Internal Database URL` e `External Database URL`
   - Use `Internal Database URL` para `DATABASE_URL`
   - Use `External Database URL` para `DIRECT_URL`

4. **Obter Deploy Hook URL**
   - No dashboard do serviço, vá em "Settings"
   - Role até "Deploy Hook"
   - Copie a URL do Deploy Hook

## Configuração no GitHub

1. **Adicionar Secrets no GitHub**
   - Vá em Settings → Secrets and variables → Actions
   - Adicione o secret:
     - `RENDER_DEPLOY_HOOK_URL`: Cole a URL do Deploy Hook do Render

2. **Testar o Pipeline**
   - Faça um push para a branch `main` ou `master`
   - Vá em Actions no GitHub para ver o workflow rodando
   - O deploy será automaticamente disparado no Render após os testes passarem

## Workflow

O pipeline executa:
1. **Test Job**: Instala dependências, gera Prisma Client, roda build
2. **Deploy Job**: Dispara deploy no Render (apenas em push para main/master)

## Migrations

Para rodar migrations no Render:
1. Acesse o Shell do seu serviço no dashboard do Render
2. Execute: `npx prisma migrate deploy`

Ou configure um script de build que rode as migrations automaticamente:
```json
"scripts": {
  "build": "tsc && npx prisma migrate deploy"
}
```
