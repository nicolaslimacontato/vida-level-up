# 🚀 Configuração de Variáveis de Ambiente para Vercel

## ❌ Erro Atual:

```
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

## ✅ Solução:

### 1. **Acesse o Dashboard da Vercel:**

- Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
- Selecione seu projeto "vida-level-up"

### 2. **Configure as Variáveis de Ambiente:**

1. Clique na aba **"Settings"**
2. Clique em **"Environment Variables"** no menu lateral
3. Adicione as seguintes variáveis:

### 3. **Variáveis Necessárias:**

```
NEXT_PUBLIC_SUPABASE_URL
Valor: https://hwqytyowfvbqowbkzmzs.supabase.co
Environment: Production, Preview, Development

NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: [sua-anon-key-do-supabase]
Environment: Production, Preview, Development

SUPABASE_SERVICE_ROLE_KEY
Valor: [sua-service-role-key-do-supabase]
Environment: Production, Preview, Development
```

### 4. **Obter as Chaves do Supabase:**

1. Vá para [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 5. **Redeploy:**

Após configurar as variáveis:

1. Vá para a aba **"Deployments"** na Vercel
2. Clique nos três pontos do último deploy
3. Selecione **"Redeploy"**

## 🔍 **Verificação:**

Após o redeploy, o erro deve desaparecer e o app deve funcionar normalmente.

## 📝 **Nota:**

Certifique-se de que todas as variáveis estão marcadas para **Production**, **Preview** e **Development** para funcionar em todos os ambientes.
