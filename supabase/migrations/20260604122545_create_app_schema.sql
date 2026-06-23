/*
  # QuadroElétrico — Esquema Completo da Aplicação

  ## Tabelas Criadas
  1. `profiles` — Perfis de utilizador (admin, collaborator, client)
  2. `companies` — Empresas/clientes
  3. `budgets` — Orçamentos
  4. `budget_items` — Itens dos orçamentos
  5. `custom_catalog_items` — Itens de catálogo personalizados (adicionados por admins)

  ## Segurança
  - RLS activado em todas as tabelas
  - Admins têm acesso total
  - Colaboradores vêem os seus orçamentos
  - Clientes vêem apenas os orçamentos da sua empresa
  - Trigger automático cria perfil ao registar utilizador
  - Primeiro utilizador torna-se admin automaticamente
*/

-- =========================================================
-- PROFILES
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'collaborator' CHECK (role IN ('admin','collaborator','client')),
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  company_id uuid,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    OR NOT EXISTS (SELECT 1 FROM profiles)
  );

CREATE POLICY "Admin can delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- =========================================================
-- COMPANIES
-- =========================================================
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tax_id text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  country text DEFAULT 'Portugal',
  phone text DEFAULT '',
  email text DEFAULT '',
  website text DEFAULT '',
  sector text DEFAULT '',
  notes text DEFAULT '',
  active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and collaborators can read companies"
  ON companies FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin','collaborator')
    OR id = (SELECT company_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admin and collaborators can insert companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin','collaborator')
  );

CREATE POLICY "Admin and collaborators can update companies"
  ON companies FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin','collaborator'))
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin','collaborator'));

CREATE POLICY "Admin can delete companies"
  ON companies FOR DELETE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- =========================================================
-- BUDGETS
-- =========================================================
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  company_id uuid REFERENCES companies(id),
  assigned_to uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'rascunho'
    CHECK (status IN ('rascunho','enviado','aprovado','rejeitado','em_execucao','concluido')),
  sector text DEFAULT 'Eletricidade Industrial',
  date date DEFAULT CURRENT_DATE,
  valid_until date DEFAULT (CURRENT_DATE + interval '30 days'),
  notes text DEFAULT '',
  client_contact text DEFAULT '',
  client_email text DEFAULT '',
  include_tax boolean DEFAULT false,
  tax_rate numeric(5,2) DEFAULT 23,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin sees all budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Collaborators see own budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'collaborator'
    AND (created_by = auth.uid() OR assigned_to = auth.uid())
  );

CREATE POLICY "Clients see their company budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'client'
    AND company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admin and collaborators can insert budgets"
  ON budgets FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin','collaborator')
  );

CREATE POLICY "Admin can update all budgets"
  ON budgets FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Collaborators can update own budgets"
  ON budgets FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'collaborator'
    AND (created_by = auth.uid() OR assigned_to = auth.uid())
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'collaborator'
    AND (created_by = auth.uid() OR assigned_to = auth.uid())
  );

CREATE POLICY "Admin can delete budgets"
  ON budgets FOR DELETE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Collaborators can delete own budgets"
  ON budgets FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'collaborator'
    AND created_by = auth.uid()
  );

-- =========================================================
-- BUDGET ITEMS
-- =========================================================
CREATE TABLE IF NOT EXISTS budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  code text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  reference text DEFAULT '',
  brand text DEFAULT '',
  category text DEFAULT '',
  sector text DEFAULT '',
  unit text DEFAULT 'un',
  quantity numeric(10,3) DEFAULT 1,
  unit_cost numeric(14,4) DEFAULT 0,
  margin numeric(8,2) DEFAULT 30,
  discount numeric(8,2) DEFAULT 0,
  notes text DEFAULT '',
  sort_order int DEFAULT 0
);

ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Budget items access mirrors budget select"
  ON budget_items FOR SELECT
  TO authenticated
  USING (
    budget_id IN (SELECT id FROM budgets)
  );

CREATE POLICY "Budget items insert mirrors budget"
  ON budget_items FOR INSERT
  TO authenticated
  WITH CHECK (
    budget_id IN (SELECT id FROM budgets WHERE
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
      OR created_by = auth.uid()
      OR assigned_to = auth.uid()
    )
  );

CREATE POLICY "Budget items update mirrors budget"
  ON budget_items FOR UPDATE
  TO authenticated
  USING (
    budget_id IN (SELECT id FROM budgets WHERE
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
      OR created_by = auth.uid()
      OR assigned_to = auth.uid()
    )
  )
  WITH CHECK (
    budget_id IN (SELECT id FROM budgets WHERE
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
      OR created_by = auth.uid()
      OR assigned_to = auth.uid()
    )
  );

CREATE POLICY "Budget items delete mirrors budget"
  ON budget_items FOR DELETE
  TO authenticated
  USING (
    budget_id IN (SELECT id FROM budgets WHERE
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
      OR created_by = auth.uid()
      OR assigned_to = auth.uid()
    )
  );

-- =========================================================
-- CUSTOM CATALOG ITEMS
-- =========================================================
CREATE TABLE IF NOT EXISTS custom_catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  description text NOT NULL,
  reference text DEFAULT '',
  brand text DEFAULT '',
  category text DEFAULT '',
  sector text DEFAULT '',
  unit text DEFAULT 'un',
  unit_cost numeric(14,4) DEFAULT 0,
  supplier text DEFAULT '',
  active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE custom_catalog_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated can read active custom items"
  ON custom_catalog_items FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admin can insert custom items"
  ON custom_catalog_items FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can update custom items"
  ON custom_catalog_items FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can delete custom items"
  ON custom_catalog_items FOR DELETE
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- =========================================================
-- FUNCTION + TRIGGER: Auto-create profile on user signup
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT CASE WHEN COUNT(*) = 0 THEN 'admin' ELSE 'collaborator' END
  INTO user_role
  FROM public.profiles;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    user_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- FUNCTION: Update budget updated_at timestamp
-- =========================================================
CREATE OR REPLACE FUNCTION public.touch_budget()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS budget_updated_at ON budgets;
CREATE TRIGGER budget_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION public.touch_budget();
