-- =============================================
-- VIDA LEVEL UP - SCHEMA DO BANCO DE DADOS
-- =============================================
-- Execute estes scripts no Supabase Dashboard > SQL Editor

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Criar tabela profiles (estende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_access_date TIMESTAMP WITH TIME ZONE,
  completed_quests_today BOOLEAN DEFAULT FALSE,
  purchased_upgrades JSONB DEFAULT '[]'::jsonb,
  active_effects JSONB DEFAULT '{"hasStreakProtection": false, "xpBoostActive": false, "coinMultiplierActive": false}'::jsonb,
  strength INTEGER DEFAULT 0,
  intelligence INTEGER DEFAULT 0,
  charisma INTEGER DEFAULT 0,
  discipline INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela quests
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  frequency TEXT NOT NULL,
  xp INTEGER NOT NULL,
  coins INTEGER NOT NULL,
  icon TEXT,
  attribute_bonus TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela main_quests
CREATE TABLE IF NOT EXISTS public.main_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  xp INTEGER NOT NULL,
  coins INTEGER NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar tabela inventory
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  icon TEXT,
  type TEXT,
  category TEXT,
  effect TEXT,
  price INTEGER DEFAULT 0,
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Criar tabela rewards
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL,
  category TEXT DEFAULT 'general',
  purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Criar tabela upgrades (NOVO)
CREATE TABLE IF NOT EXISTS public.upgrades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  upgrade_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  attribute_cost JSONB DEFAULT '{}'::jsonb,
  is_permanent BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT FALSE,
  purchased BOOLEAN DEFAULT FALSE,
  effect TEXT NOT NULL,
  icon TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Criar tabela achievements (NOVO)
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0,
  max_progress INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Criar tabela activity_log (NOVO)
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_data JSONB DEFAULT '{}'::jsonb,
  xp_gained INTEGER DEFAULT 0,
  coins_gained INTEGER DEFAULT 0,
  level_before INTEGER,
  level_after INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Criar tabela notifications (NOVO)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- =============================================

-- Add category column to rewards table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'rewards' 
                   AND column_name = 'category' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.rewards ADD COLUMN category TEXT DEFAULT 'general';
    END IF;
END $$;

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.main_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Dropar políticas existentes (se existirem)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own quests" ON public.quests;
DROP POLICY IF EXISTS "Users can manage own main quests" ON public.main_quests;
DROP POLICY IF EXISTS "Users can manage own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Users can manage own rewards" ON public.rewards;
DROP POLICY IF EXISTS "Users can manage own upgrades" ON public.upgrades;
DROP POLICY IF EXISTS "Users can manage own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can manage own activity log" ON public.activity_log;
DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;

-- Policies para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

-- Policies para quests
CREATE POLICY "Users can manage own quests" ON public.quests
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Policies para main_quests
CREATE POLICY "Users can manage own main quests" ON public.main_quests
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Policies para inventory
CREATE POLICY "Users can manage own inventory" ON public.inventory
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Policies para rewards
CREATE POLICY "Users can manage own rewards" ON public.rewards
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Policies para upgrades (NOVO)
CREATE POLICY "Users can manage own upgrades" ON public.upgrades
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Policies para achievements (NOVO)
CREATE POLICY "Users can manage own achievements" ON public.achievements
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Policies para activity_log (NOVO)
CREATE POLICY "Users can manage own activity log" ON public.activity_log
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- Policies para notifications (NOVO)
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING ((SELECT auth.uid()) = user_id);

-- =============================================
-- FUNCTIONS E TRIGGERS
-- =============================================

-- Dropar triggers existentes (se existirem)
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS handle_updated_at_quests ON public.quests;
DROP TRIGGER IF EXISTS handle_updated_at_main_quests ON public.main_quests;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Dropar funções existentes (se existirem)
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers para updated_at
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_quests
  BEFORE UPDATE ON public.quests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_main_quests
  BEFORE UPDATE ON public.main_quests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar profile automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, level, current_xp, total_xp, coins, current_streak, best_streak, completed_quests_today, purchased_upgrades, active_effects, strength, intelligence, charisma, discipline)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Usuário'),
    1,
    0,
    0,
    100, -- Moedas iniciais
    0,
    0,
    FALSE,
    '[]'::jsonb,
    '{"hasStreakProtection": false, "xpBoostActive": false, "coinMultiplierActive": false}'::jsonb,
    0,
    0,
    0,
    0
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar profile automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices para queries frequentes
CREATE INDEX IF NOT EXISTS idx_quests_user_id ON public.quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_completed ON public.quests(completed);
CREATE INDEX IF NOT EXISTS idx_main_quests_user_id ON public.main_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_main_quests_completed ON public.main_quests(completed);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_purchased ON public.rewards(purchased);

-- Índices para novas tabelas
CREATE INDEX IF NOT EXISTS idx_upgrades_user_id ON public.upgrades(user_id);
CREATE INDEX IF NOT EXISTS idx_upgrades_purchased ON public.upgrades(purchased);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_unlocked ON public.achievements(unlocked);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- =============================================
-- VERIFICAÇÕES FINAIS
-- =============================================

-- Verificar se as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'quests', 'main_quests', 'inventory', 'rewards', 'upgrades', 'achievements', 'activity_log', 'notifications');

-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'quests', 'main_quests', 'inventory', 'rewards', 'upgrades', 'achievements', 'activity_log', 'notifications');

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'quests', 'main_quests', 'inventory', 'rewards', 'upgrades', 'achievements', 'activity_log', 'notifications');

-- Verificar se as funções foram criadas
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN ('handle_updated_at', 'handle_new_user');

-- Verificar se os triggers foram criados
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name IN ('handle_updated_at_profiles', 'handle_updated_at_quests', 'handle_updated_at_main_quests', 'on_auth_user_created');
