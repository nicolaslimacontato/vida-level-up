# Roadmap Vida Level Up - Próximas Etapas

## Status Atual do Projeto ✅

### MVP Completo e Funcional

- ✅ Sistema de XP e progressão de níveis
- ✅ Quests customizáveis (diárias, semanais, principais)
- ✅ Sistema de atributos (Força, Inteligência, Carisma, Disciplina)
- ✅ Loja com itens consumíveis e permanentes
- ✅ Inventário com gerenciamento de itens
- ✅ Sistema de upgrades com gates de atributos
- ✅ Recompensas personalizadas
- ✅ Sistema de streak com multiplicadores
- ✅ UI completa, responsiva e polida
- ✅ Dark mode
- ✅ Persistência em localStorage

---

## FASE 1: Polimento e Funcionalidades Offline (1-2 semanas)

### Objetivo

Melhorar a experiência do usuário e adicionar funcionalidades que não dependem de back-end, preparando o terreno para uma base de usuários engajados.

### 1.1 Sistema de Export/Import de Dados

**Prioridade**: ALTA  
**Tempo estimado**: 4-6 horas

#### Funcionalidades

- Botão para exportar dados como JSON (backup completo)
- Importar dados de um arquivo JSON
- Validação de dados na importação
- Preview antes de confirmar importação
- Aviso sobre sobrescrever dados existentes

#### Implementação

```typescript
// src/utils/dataExport.ts
export function exportUserData(user, quests, mainQuests, rewards, upgrades) {
  const data = {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    user,
    quests,
    mainQuests,
    rewards,
    upgrades,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vidalevelup-backup-${Date.now()}.json`;
  a.click();
}
```

#### Arquivos a criar/modificar

- `src/utils/dataExport.ts` (novo)
- `src/utils/dataImport.ts` (novo)
- `src/app/settings/page.tsx` (adicionar botões)
- `src/components/ImportModal.tsx` (novo)

---

### 1.2 Tutorial Interativo de Primeiro Acesso

**Prioridade**: MÉDIA-ALTA  
**Tempo estimado**: 6-8 horas

#### Funcionalidades

- Detectar primeiro acesso (flag no localStorage)
- Tour guiado pelos principais recursos
- Tooltips destacando funcionalidades-chave
- Opção de pular tutorial
- Reativar tutorial nas configurações

#### Fluxo do Tutorial

1. Boas-vindas e explicação do conceito
2. Criar primeira quest
3. Completar quest e ganhar XP
4. Ver progresso de nível
5. Visitar loja
6. Explicar sistema de atributos
7. Finalização com dicas

#### Biblioteca Sugerida

- React Joyride ou Intro.js
- Ou implementação custom com Tailwind

#### Arquivos a criar/modificar

- `src/components/Tutorial.tsx` (novo)
- `src/hooks/useTutorial.ts` (novo)
- `src/contexts/TutorialContext.tsx` (novo)
- `src/app/dashboard/page.tsx` (integrar tutorial)

---

### 1.3 Sistema de Conquistas (Achievements)

**Prioridade**: MÉDIA  
**Tempo estimado**: 8-10 horas

#### Conquistas Sugeridas

**Categoria: Iniciante**

- 🎯 "Primeiro Passo": Complete sua primeira quest
- 📈 "Subindo de Nível": Alcance o nível 2
- 💰 "Primeira Compra": Compre um item na loja
- 🔥 "Aquecendo": Mantenha 3 dias de streak

**Categoria: Dedicação**

- ⭐ "Comprometido": Complete 10 quests
- 🏆 "Veterano": Alcance o nível 10
- 💎 "Colecionador": Compre 5 itens diferentes
- 🔥 "Em Chamas": Mantenha 7 dias de streak

**Categoria: Mestre**

- 👑 "Lenda": Alcance o nível 25
- 💪 "Fortão": Alcance 50 de Força
- 🧠 "Gênio": Alcance 50 de Inteligência
- 😎 "Carismático": Alcance 50 de Carisma
- ⚡ "Disciplinado": Alcance 50 de Disciplina
- 🔥 "Inabalável": Mantenha 30 dias de streak

**Categoria: Elite**

- 🌟 "Completista": Complete 100 quests
- 💰 "Milionário": Acumule 10.000 moedas
- 🎯 "Perfeição": Complete todas as missões principais

#### Estrutura de Dados

```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "beginner" | "dedication" | "master" | "elite";
  requirement: {
    type:
      | "level"
      | "quests_completed"
      | "streak"
      | "attribute"
      | "coins"
      | "shop_purchases";
    value: number;
  };
  reward?: {
    xp?: number;
    coins?: number;
    item?: string;
  };
  unlockedAt?: Date;
  unlocked: boolean;
}
```

#### Implementação

- Sistema de verificação automática após cada ação
- Notificação toast ao desbloquear conquista
- Página dedicada para visualizar todas as conquistas
- Barra de progresso para conquistas próximas
- Efeitos visuais ao desbloquear

#### Arquivos a criar/modificar

- `src/types/rpg.ts` (adicionar interface Achievement)
- `src/data/achievementTemplates.ts` (novo)
- `src/hooks/useAchievements.ts` (novo)
- `src/app/conquistas/page.tsx` (novo)
- `src/components/AchievementNotification.tsx` (novo)
- `src/components/AchievementCard.tsx` (novo)

---

### 1.4 Melhorias Visuais e de Feedback

**Prioridade**: MÉDIA  
**Tempo estimado**: 4-6 horas

#### Animações

- Transições suaves ao completar quests
- Efeito de "level up" mais elaborado
- Animação ao ganhar moedas
- Particles ao completar missão principal
- Shake effect ao perder streak

#### Sons (Opcional)

- Som ao ganhar XP (já existe)
- Som ao level up (já existe)
- Som ao completar quest
- Som ao desbloquear conquista
- Som ao comprar item
- Opção de mute nas configurações

#### Feedback Visual

- Loading states mais elaborados
- Skeleton screens
- Toasts mais informativos com ícones
- Confirmações visuais claras

#### Arquivos a criar/modificar

- `src/hooks/useGameAudio.ts` (expandir)
- `src/components/animations/` (novo diretório)
- `src/app/settings/page.tsx` (configurações de som)

---

### 1.5 Gráficos e Estatísticas

**Prioridade**: BAIXA-MÉDIA  
**Tempo estimado**: 6-8 horas

#### Funcionalidades

- Gráfico de progresso de XP ao longo do tempo
- Histórico de streak (últimos 30 dias)
- Distribuição de quests por categoria
- Evolução de atributos
- Conquistas desbloqueadas vs total

#### Biblioteca Sugerida

- Recharts (React + responsivo)
- Chart.js
- Victory (React Native style)

#### Dados a Rastrear

```typescript
interface DailyStats {
  date: string;
  xpGained: number;
  questsCompleted: number;
  coinsEarned: number;
  streakDay: number;
}

interface WeeklyStats {
  week: string;
  totalXP: number;
  totalQuests: number;
  averageStreak: number;
}
```

#### Arquivos a criar/modificar

- `src/types/rpg.ts` (adicionar interfaces de stats)
- `src/app/estatisticas/page.tsx` (expandir)
- `src/components/charts/` (novo diretório)
- `src/hooks/useStats.ts` (novo)

---

## FASE 2: Planejamento e Desenvolvimento do Back-end (2-4 semanas)

### Objetivo

Criar infraestrutura robusta para persistência de dados, autenticação e preparar para funcionalidades futuras.

### 2.1 Definição da Arquitetura

**Prioridade**: CRÍTICA  
**Tempo estimado**: 4-8 horas (planejamento)

#### Stack Sugerida

```
Frontend: Next.js 15 (App Router) - JÁ IMPLEMENTADO
Backend: Next.js API Routes
Banco de Dados: PostgreSQL (Supabase ou Vercel Postgres)
ORM: Prisma
Autenticação: NextAuth.js v5 (Auth.js)
Storage: Supabase Storage ou Cloudinary (para avatares)
Deploy: Vercel
```

#### Alternativas

- **Backend Separado**: Node.js + Express (mais escalável)
- **BaaS**: Firebase, Supabase standalone (mais rápido)
- **Serverless**: AWS Lambda + DynamoDB (mais complexo)

#### Decisões a Tomar

1. Manter tudo no Next.js ou separar backend?
2. SQL (PostgreSQL) ou NoSQL (MongoDB)?
3. Autenticação própria ou OAuth (Google, GitHub)?
4. Hospedagem (Vercel, Railway, Render)?

---

### 2.2 Schema do Banco de Dados

**Prioridade**: CRÍTICA  
**Tempo estimado**: 6-8 horas

#### Schema Prisma Proposto

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  username      String    @unique
  password      String    // hash
  avatar        String?

  // RPG Stats
  level         Int       @default(1)
  currentXP     Int       @default(0)
  totalXP       Int       @default(0)
  coins         Int       @default(0)
  currentStreak Int       @default(0)
  maxStreak     Int       @default(0)
  lastLoginAt   DateTime?

  // Attributes
  strength      Int       @default(0)
  intelligence  Int       @default(0)
  charisma      Int       @default(0)
  discipline    Int       @default(0)

  // Relations
  quests        Quest[]
  mainQuests    MainQuest[]
  rewards       Reward[]
  inventory     InventoryItem[]
  upgrades      UserUpgrade[]
  achievements  UserAchievement[]
  dailyStats    DailyStats[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
  @@index([username])
}

model Quest {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  title         String
  description   String
  xpReward      Int
  coinReward    Int
  category      String    // daily, weekly
  icon          String?
  attributeBonus String?  // strength, intelligence, etc

  completed     Boolean   @default(false)
  completedAt   DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId, category])
  @@index([userId, completed])
}

model MainQuest {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  title         String
  description   String
  xpReward      Int
  coinReward    Int

  completed     Boolean   @default(false)
  completedAt   DateTime?

  steps         MainQuestStep[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId, completed])
}

model MainQuestStep {
  id            String    @id @default(cuid())
  mainQuestId   String
  mainQuest     MainQuest @relation(fields: [mainQuestId], references: [id], onDelete: Cascade)

  title         String
  completed     Boolean   @default(false)
  order         Int

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([mainQuestId])
}

model Reward {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  title         String
  description   String
  cost          Int
  icon          String?

  purchased     Boolean   @default(false)
  purchasedAt   DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId, purchased])
}

model InventoryItem {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  itemId        String    // Reference to shop item
  name          String
  type          String    // consumable, permanent
  category      String
  effect        String

  quantity      Int       @default(1)
  active        Boolean   @default(false)
  activatedAt   DateTime?
  expiresAt     DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId, type])
  @@index([userId, active])
}

model UserUpgrade {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  upgradeId     String    // Reference to upgrade template
  name          String
  category      String
  isPermanent   Boolean
  active        Boolean   @default(false)

  purchasedAt   DateTime  @default(now())

  @@index([userId, active])
  @@unique([userId, upgradeId])
}

model UserAchievement {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  achievementId String
  title         String
  category      String

  unlockedAt    DateTime  @default(now())

  @@index([userId])
  @@unique([userId, achievementId])
}

model DailyStats {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  date            DateTime  @db.Date
  xpGained        Int       @default(0)
  questsCompleted Int       @default(0)
  coinsEarned     Int       @default(0)
  streakDay       Int       @default(0)

  createdAt       DateTime  @default(now())

  @@index([userId, date])
  @@unique([userId, date])
}
```

---

### 2.3 Sistema de Autenticação

**Prioridade**: CRÍTICA  
**Tempo estimado**: 8-12 horas

#### Funcionalidades

- Registro de usuário (email + senha)
- Login com email/senha
- Login com Google (OAuth)
- Login com GitHub (OAuth)
- Recuperação de senha
- Verificação de email
- Sessões seguras

#### Implementação com NextAuth.js v5

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Lógica de validação
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signUp: "/registro",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### Páginas a Criar

- `src/app/login/page.tsx`
- `src/app/registro/page.tsx`
- `src/app/auth/error/page.tsx`
- `src/app/recuperar-senha/page.tsx`

---

### 2.4 API Routes

**Prioridade**: CRÍTICA  
**Tempo estimado**: 12-16 horas

#### Estrutura de APIs

```
src/app/api/
├── auth/
│   └── [...nextauth]/route.ts
├── user/
│   ├── profile/route.ts          # GET, PATCH
│   ├── stats/route.ts             # GET
│   └── avatar/route.ts            # POST, DELETE
├── quests/
│   ├── route.ts                   # GET, POST
│   ├── [id]/route.ts              # GET, PATCH, DELETE
│   └── [id]/complete/route.ts     # POST
├── main-quests/
│   ├── route.ts                   # GET, POST
│   ├── [id]/route.ts              # GET, PATCH, DELETE
│   └── [id]/steps/[stepId]/complete/route.ts # POST
├── rewards/
│   ├── route.ts                   # GET, POST
│   ├── [id]/route.ts              # PATCH, DELETE
│   └── [id]/purchase/route.ts     # POST
├── shop/
│   └── purchase/route.ts          # POST
├── inventory/
│   ├── route.ts                   # GET
│   └── [id]/use/route.ts          # POST
├── upgrades/
│   ├── route.ts                   # GET
│   └── [id]/purchase/route.ts     # POST
└── achievements/
    ├── route.ts                   # GET
    └── check/route.ts             # POST
```

#### Exemplo de API Route

```typescript
// src/app/api/quests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quests = await prisma.quest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quests);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const quest = await prisma.quest.create({
    data: {
      userId: session.user.id,
      ...body,
    },
  });

  return NextResponse.json(quest, { status: 201 });
}
```

---

### 2.5 Migração de Dados do LocalStorage

**Prioridade**: ALTA  
**Tempo estimado**: 6-8 horas

#### Estratégia de Migração

1. **Detecção de Dados Locais**
   - Verificar se existe dados no localStorage
   - Mostrar banner oferecendo migração

2. **Processo de Migração**
   - Usuário faz login/registro
   - Sistema detecta dados no localStorage
   - Modal pergunta se quer importar dados
   - Preview dos dados a serem migrados
   - Confirmação e importação

3. **Sincronização**
   - Dados locais → Banco de dados
   - Validação de integridade
   - Backup antes de limpar localStorage
   - Confirmação de sucesso

#### Implementação

```typescript
// src/utils/dataMigration.ts
export async function migrateLocalDataToServer() {
  const localData = {
    user: JSON.parse(localStorage.getItem("vida-level-up-user") || "null"),
    quests: JSON.parse(localStorage.getItem("vida-level-up-quests") || "[]"),
    mainQuests: JSON.parse(
      localStorage.getItem("vida-level-up-main-quests") || "[]",
    ),
    rewards: JSON.parse(localStorage.getItem("vida-level-up-rewards") || "[]"),
    upgrades: JSON.parse(
      localStorage.getItem("vida-level-up-upgrades") || "[]",
    ),
  };

  if (!localData.user) {
    return { success: false, message: "No local data found" };
  }

  try {
    // Enviar para API de migração
    const response = await fetch("/api/migrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localData),
    });

    if (response.ok) {
      // Backup antes de limpar
      const backup = JSON.stringify(localData);
      localStorage.setItem("vida-level-up-backup", backup);

      // Limpar dados locais
      localStorage.removeItem("vida-level-up-user");
      localStorage.removeItem("vida-level-up-quests");
      localStorage.removeItem("vida-level-up-main-quests");
      localStorage.removeItem("vida-level-up-rewards");
      localStorage.removeItem("vida-level-up-upgrades");

      return { success: true, message: "Data migrated successfully" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}
```

---

### 2.6 Página de Perfil Completa

**Prioridade**: MÉDIA  
**Tempo estimado**: 8-10 horas

#### Funcionalidades

**Seção: Informações Pessoais**

- Avatar (upload/edição)
- Nome de usuário
- Email
- Bio (opcional)
- Data de cadastro

**Seção: Estatísticas**

- Nível atual e XP total
- Total de quests completadas
- Streak atual e máximo
- Moedas acumuladas
- Conquistas desbloqueadas

**Seção: Histórico**

- Gráfico de progresso de XP
- Evolução de atributos
- Atividade recente

**Seção: Configurações**

- Alterar senha
- Notificações (email)
- Preferências de privacidade
- Tema (dark/light)
- Sons e efeitos

**Seção: Perigos**

- Exportar dados
- Deletar conta

#### Arquivos a Criar

- `src/app/perfil/page.tsx`
- `src/components/profile/AvatarUpload.tsx`
- `src/components/profile/ProfileStats.tsx`
- `src/components/profile/ProfileSettings.tsx`
- `src/components/profile/ActivityHistory.tsx`

---

## FASE 3: Funcionalidades Sociais (Opcional - 3-4 semanas)

### Objetivo

Adicionar elementos sociais e competitivos para aumentar engajamento.

### 3.1 Perfis Públicos

**Prioridade**: BAIXA  
**Tempo estimado**: 8-10 horas

#### Funcionalidades

- URL pública do perfil (`/user/[username]`)
- Visualização de conquistas públicas
- Estatísticas gerais (sem detalhes sensíveis)
- Badge de nível
- Streak público

---

### 3.2 Sistema de Leaderboards

**Prioridade**: BAIXA  
**Tempo estimado**: 10-12 horas

#### Tipos de Ranking

- XP Total (semanal, mensal, all-time)
- Streak mais longo
- Quests completadas
- Nível mais alto
- Por atributo específico

#### Implementação

- Rankings globais
- Rankings entre amigos
- Atualização em tempo real
- Filtros por período

---

### 3.3 Sistema de Amigos

**Prioridade**: BAIXA  
**Tempo estimado**: 12-16 horas

#### Funcionalidades

- Enviar/aceitar solicitações de amizade
- Ver progresso dos amigos
- Comparar estatísticas
- Feed de atividades

---

### 3.4 Desafios Compartilhados

**Prioridade**: BAIXA  
**Tempo estimado**: 16-20 horas

#### Funcionalidades

- Criar desafios em grupo
- Metas coletivas
- Recompensas especiais
- Ranking do desafio

---

## Cronograma Sugerido

### Semana 1-2: FASE 1

- [ ] Sistema de Export/Import (2 dias)
- [ ] Tutorial Interativo (3 dias)
- [ ] Sistema de Conquistas (4 dias)
- [ ] Melhorias Visuais (2 dias)

### Semana 3: Planejamento FASE 2

- [ ] Definir stack final (1 dia)
- [ ] Criar schema do banco (2 dias)
- [ ] Setup do projeto (Prisma, Supabase, etc) (2 dias)

### Semana 4-5: Desenvolvimento FASE 2

- [ ] Sistema de Autenticação (3 dias)
- [ ] API Routes principais (4 dias)
- [ ] Migração de dados (2 dias)

### Semana 6-7: Finalização FASE 2

- [ ] Página de Perfil (3 dias)
- [ ] Testes e ajustes (3 dias)
- [ ] Deploy e documentação (2 dias)

### FASE 3: Futuro (opcional)

- A definir baseado em feedback dos usuários

---

## Métricas de Sucesso

### FASE 1

- [ ] Taxa de retenção de usuários (medida por localStorage)
- [ ] Tempo médio de sessão
- [ ] Número de conquistas desbloqueadas
- [ ] Taxa de conclusão do tutorial

### FASE 2

- [ ] Taxa de migração bem-sucedida (localStorage → DB)
- [ ] Número de cadastros
- [ ] Taxa de autenticação bem-sucedida
- [ ] Tempo de resposta das APIs (<200ms)

### FASE 3

- [ ] Número de amizades criadas
- [ ] Engajamento em desafios
- [ ] Atividade no leaderboard

---

## Próximos Passos Imediatos

1. **Decidir prioridades**: Quais funcionalidades da FASE 1 são mais importantes?
2. **Definir stack**: Confirmar tecnologias para FASE 2
3. **Criar backlog**: Organizar tarefas no GitHub Projects ou Trello
4. **Começar desenvolvimento**: Implementar primeira feature da FASE 1

---

## Notas Técnicas

### Considerações de Performance

- Implementar cache no backend (Redis)
- Pagination para listas grandes
- Lazy loading de imagens
- Code splitting no frontend

### Segurança

- Rate limiting nas APIs
- Validação de inputs (Zod)
- Sanitização de dados
- HTTPS obrigatório
- Proteção contra CSRF

### Testes

- Unit tests (Vitest)
- Integration tests (Playwright)
- E2E tests para fluxos críticos
- CI/CD com GitHub Actions

---

**Última atualização**: 2025-01-15  
**Versão**: 1.0.0  
**Status**: 🟢 Pronto para iniciar FASE 1
