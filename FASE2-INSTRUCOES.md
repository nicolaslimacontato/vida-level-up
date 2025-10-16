# 🚀 FASE 2: Back-end e Infraestrutura - INSTRUÇÕES

## ✅ **O que já foi implementado:**

### 1. **Dependências Instaladas**

- ✅ `@supabase/supabase-js` - Cliente JavaScript do Supabase
- ✅ `@supabase/ssr` - Suporte para Server-Side Rendering

### 2. **Arquivos Criados**

- ✅ `src/lib/supabase.ts` - Cliente browser-side
- ✅ `src/lib/supabase-server.ts` - Cliente server-side
- ✅ `src/types/database.types.ts` - Tipos TypeScript do banco
- ✅ `src/middleware.ts` - Proteção de rotas
- ✅ `src/app/login/page.tsx` - Página de login
- ✅ `src/app/signup/page.tsx` - Página de cadastro
- ✅ `src/app/auth/callback/route.ts` - Callback OAuth
- ✅ `supabase-schema.sql` - Scripts SQL para o banco

## 🔧 **PRÓXIMOS PASSOS PARA VOCÊ:**

### **PASSO 1: Configurar Variáveis de Ambiente**

Crie o arquivo `.env.local` na raiz do projeto com:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hwqytyowfvbqowbkzmzs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui

# Database URL (Transaction Pooler)
DATABASE_URL=postgresql://postgres.hwqytyowfvbqowbkzmzs:YRjVXjxOxlGBjZa4@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

**Como obter as keys:**

1. Acesse seu projeto no Supabase Dashboard
2. Vá em **Settings** > **API**
3. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### **PASSO 2: Executar Scripts SQL**

1. Acesse o **Supabase Dashboard** > **SQL Editor**
2. Copie todo o conteúdo do arquivo `supabase-schema.sql`
3. Cole e execute no SQL Editor
4. Verifique se todas as tabelas foram criadas

### **PASSO 3: Configurar Google OAuth (Opcional)**

1. No Supabase Dashboard, vá em **Authentication** > **Providers**
2. Ative o **Google** provider
3. Configure:
   - **Client ID** (do Google Cloud Console)
   - **Client Secret** (do Google Cloud Console)
4. Adicione `http://localhost:3000/auth/callback` nas URLs permitidas

### **PASSO 4: Testar Localmente**

```bash
npm run dev
```

Teste:

- ✅ Acesse `/login` - deve funcionar
- ✅ Acesse `/signup` - deve funcionar
- ✅ Tente fazer login - deve redirecionar para `/dashboard`
- ✅ Acesse `/dashboard` sem login - deve redirecionar para `/login`

## 🎯 **PRÓXIMAS IMPLEMENTAÇÕES:**

Depois que você configurar as variáveis e executar os scripts SQL, vou continuar com:

1. **Migrar RPGContext** para Supabase
2. **Criar API routes** para operações complexas
3. **Implementar migração** do localStorage
4. **Testes e validação**
5. **Deploy na Vercel**

## 🚨 **IMPORTANTE:**

- **NÃO commite** o arquivo `.env.local` (já está no `.gitignore`)
- **Mantenha as keys seguras** - nunca compartilhe em público
- **Teste tudo localmente** antes do deploy

---

**Me avise quando terminar os passos 1-4 para eu continuar a implementação!** 🚀
