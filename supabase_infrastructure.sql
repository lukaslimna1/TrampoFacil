-- MIRA DE INFRAESTRUTURA SUPABASE - TRAMPO FÁCIL
-- Execute este script no SQL Editor do Supabase para preparar o backend

-- 1. ADICIONAR CAMPOS DE PAGAMENTO, VISIBILIDADE E DETALHES À TABELA JOBS
-- Garante que todas as colunas necessárias existam para evitar erros de inserção
ALTER TABLE jobs 
-- Campos de Monetização
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
-- Flags de Destaque
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
-- Novos Campos do Formulário Premium
ADD COLUMN IF NOT EXISTS modalidade_trabalho TEXT DEFAULT 'Presencial',
ADD COLUMN IF NOT EXISTS modalidade_contrato TEXT DEFAULT 'CLT',
ADD COLUMN IF NOT EXISTS salario_max TEXT,
ADD COLUMN IF NOT EXISTS nivel TEXT DEFAULT 'Não informado',
ADD COLUMN IF NOT EXISTS num_vagas TEXT DEFAULT '1',
ADD COLUMN IF NOT EXISTS atividades TEXT,
ADD COLUMN IF NOT EXISTS diferenciais TEXT,
ADD COLUMN IF NOT EXISTS descricao_empresa TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS recruiter_email TEXT,
-- Campos Booleanos e JSON
ADD COLUMN IF NOT EXISTS pcd BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS exclusiva_pcd BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS afirmativa JSONB DEFAULT '{"mulheres": false, "negros": false, "lgbt": false, "senior": false, "vulnerabilidade": false}',
ADD COLUMN IF NOT EXISTS beneficios_lista JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS token_edicao TEXT; -- Garantindo o token

-- 2. CRIAR TABELA DE MENSAGENS DE CONTATO
-- Captura leads e dúvidas vindos do formulário de contato
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' -- 'new', 'read', 'replied'
);

-- 3. HABILITAR RLS (ROW LEVEL SECURITY) NA TABELA DE CONTATO
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode inserir mensagens (público)
DROP POLICY IF EXISTS "Enable public inserts" ON contact_messages;
CREATE POLICY "Enable public inserts" ON contact_messages
FOR INSERT WITH CHECK (true);

-- Política: Apenas leitura interna (opcional para admins)
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON contact_messages;
CREATE POLICY "Enable read for authenticated users only" ON contact_messages
FOR SELECT USING (auth.role() = 'authenticated');

-- 4. FUNÇÃO PARA INCREMENTAR VISUALIZAÇÕES (RPC)
-- Usada no JobDetail.jsx para métricas de engajamento
CREATE OR REPLACE FUNCTION increment_views(job_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE jobs
    SET views = COALESCE(views, 0) + 1
    WHERE id = job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_jobs_payment_status ON jobs(payment_status);
CREATE INDEX IF NOT EXISTS idx_jobs_plan_type ON jobs(plan_type);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);

-- NOTA PARA AUTOMATIZAÇÃO:
-- As vagas criadas como 'free' devem ser marcadas como is_active = true imediatamente.
-- As vagas criadas como 'pending' (pagas) serão ativadas pelo Webhook do Stripe.
