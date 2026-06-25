<div align="center">

# ⚔️ MYTHARA RPG

**Plataforma web de RPG online — fichas de personagem, campanhas e aventuras.**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

</div>

---

## Sobre o projeto

O **Mythara RPG** é uma plataforma para jogadores e mestres gerenciarem suas campanhas de RPG de mesa online. Inspirado em sites como [crisordemparanormal.com](https://crisordemparanormal.com), o Mythara oferece fichas de personagem completas por sistema, gerenciamento de campanhas e convites por link.

## Funcionalidades

- **Fichas de Personagem** — Ordem Paranormal RPG e D&D 5e com todos os campos necessários
- **Campanhas** — Criação de campanhas, convite de jogadores por link único
- **Notas de Sessão** — Registro do que aconteceu em cada sessão
- **Autenticação** — Login e registro com email e senha
- **Dashboard** — Visão geral dos personagens e campanhas do usuário

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 + Cinzel (fonte) |
| Componentes | shadcn/ui + Radix UI |
| ORM | Prisma 5 |
| Banco (dev) | SQLite |
| Banco (prod) | PostgreSQL — Supabase |
| Autenticação | NextAuth.js v5 |
| Validação | Zod v4 |
| Formulários | react-hook-form |

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm

### 1. Clone o repositório

```bash
git clone https://github.com/JoaoVD001/mythara-rpg.git
cd mythara-rpg
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="sua-chave-secreta-de-pelo-menos-32-caracteres"
NEXTAUTH_URL="http://localhost:3000"
```

> Para usar PostgreSQL (produção), substitua `DATABASE_URL` pela string de conexão do Supabase e adicione `DIRECT_URL`.

### 4. Crie o banco de dados

```bash
npx prisma db push
```

### 5. Inicie o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura do projeto

```
mythara-rpg/
├── prisma/
│   └── schema.prisma        # Modelos do banco de dados
├── src/
│   ├── auth.ts              # Configuração NextAuth
│   ├── middleware.ts         # Proteção de rotas
│   ├── lib/
│   │   ├── db.ts            # Cliente Prisma
│   │   └── systems.ts       # Tipos e dados dos sistemas de RPG
│   ├── components/
│   │   ├── navbar.tsx
│   │   ├── ui/              # Componentes shadcn/Radix
│   │   └── character-sheets/
│   │       ├── ordem-paranormal-sheet.tsx
│   │       └── dnd5e-sheet.tsx
│   └── app/
│       ├── (app)/           # Rotas protegidas
│       │   ├── dashboard/
│       │   ├── characters/
│       │   └── campaigns/
│       ├── login/
│       ├── register/
│       └── api/             # API Routes
```

## Sistemas de RPG suportados

| Sistema | Status |
|---------|--------|
| Ordem Paranormal RPG | ✅ Disponível |
| D&D 5e | ✅ Disponível |
| Tormenta 20 | 🔲 Planejado |
| Call of Cthulhu 7e | 🔲 Planejado |

## Roadmap

- [x] MVP — Fichas + Campanhas + Autenticação
- [x] Redesign visual (tema Verde Floresta)
- [x] Migração para Supabase (PostgreSQL)
- [ ] Login social (Google OAuth)
- [ ] Deploy no Vercel
- [ ] Mesa virtual em tempo real (Fase 2)

---

<div align="center">
  Construído com paixão por RPG 🎲
</div>
