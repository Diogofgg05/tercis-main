// -------------------------------------------------------
// Auth & Users
// -------------------------------------------------------
export type UserRole = 'admin' | 'collaborator' | 'client';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string;
  avatar_url: string;
  company_id: string | null;
  active: boolean;
  created_at: string;
}

// -------------------------------------------------------
// Companies
// -------------------------------------------------------
export interface Company {
  id: string;
  name: string;
  tax_id: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  sector: string;
  notes: string;
  active: boolean;
  created_by?: string;
  created_at: string;
}

// -------------------------------------------------------
// Catalog
// -------------------------------------------------------
export interface CatalogItem {
  id: string;
  code: string;
  description: string;
  reference: string;
  brand: string;
  category: string;
  sector: string;
  unit: string;
  unit_cost: number;
  unitCost?: number;
  supplier: string;
  is_custom?: boolean;
}

// -------------------------------------------------------
// Budgets
// -------------------------------------------------------
export type BudgetStatus =
  | 'rascunho'
  | 'enviado'
  | 'aprovado'
  | 'rejeitado'
  | 'em_execucao'
  | 'concluido';

export interface BudgetItem {
  id: string;
  budget_id?: string;
  code: string;
  description: string;
  reference: string;
  brand: string;
  category: string;
  sector: string;
  unit: string;
  unit_cost: number;
  quantity: number;
  margin: number;
  discount: number;
  notes: string;
  sort_order?: number;
}

export interface CalculatedItem extends BudgetItem {
  pvp: number;
  finalPrice: number;
  subtotal: number;
}

export interface Budget {
  id: string;
  ref: string;
  name: string;
  company_id: string | null;
  company?: Company;
  assigned_to: string | null;
  assignee?: Profile;
  status: BudgetStatus;
  sector: string;
  date: string;
  valid_until: string;
  notes: string;
  client_contact: string;
  client_email: string;
  include_tax: boolean;
  tax_rate: number;
  created_by?: string;
  creator?: Profile;
  created_at?: string;
  updated_at?: string;
  items?: BudgetItem[];
}
