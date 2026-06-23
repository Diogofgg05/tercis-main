import type { Budget, BudgetItem, Company, Profile } from './types';
import { ALL_CATALOG_ITEMS } from './data/catalog';

export const DEMO_PASSWORD = '123456';

export const DEMO_PROFILES: Profile[] = [
  {
    id: 'demo-admin',
    email: 'admin@tercis.pt',
    full_name: 'Diogo Admin',
    role: 'admin',
    phone: '+351 910 000 001',
    avatar_url: '',
    company_id: null,
    active: true,
    created_at: '2026-01-02',
  },
  {
    id: 'demo-tecnico',
    email: 'tecnico@tercis.pt',
    full_name: 'Marta Técnica',
    role: 'collaborator',
    phone: '+351 910 000 002',
    avatar_url: '',
    company_id: null,
    active: true,
    created_at: '2026-01-05',
  },
  {
    id: 'demo-cliente',
    email: 'cliente@tercis.pt',
    full_name: 'Cliente Demo',
    role: 'client',
    phone: '+351 910 000 003',
    avatar_url: '',
    company_id: 'cmp-001',
    active: true,
    created_at: '2026-01-08',
  },
];

export const DEMO_COMPANIES: Company[] = [
  {
    id: 'cmp-001',
    name: 'Atlantic Foods',
    tax_id: 'PT509000111',
    address: 'Rua da Indústria 24',
    city: 'Aveiro',
    country: 'Portugal',
    phone: '+351 234 000 100',
    email: 'cliente@tercis.pt',
    website: 'https://example.com',
    sector: 'Indústria Alimentar',
    notes: 'Cliente demo com várias linhas de produção.',
    active: true,
    created_by: 'demo-admin',
    created_at: '2026-01-10',
  },
  {
    id: 'cmp-002',
    name: 'Norte Logistics',
    tax_id: 'PT508000222',
    address: 'Zona Industrial Norte, Lote 8',
    city: 'Porto',
    country: 'Portugal',
    phone: '+351 220 000 200',
    email: 'compras@nortelogistics.pt',
    website: 'https://example.com',
    sector: 'Logística',
    notes: 'Instalações com armazém automatizado.',
    active: true,
    created_by: 'demo-admin',
    created_at: '2026-02-14',
  },
  {
    id: 'cmp-003',
    name: 'SolarVale Energia',
    tax_id: 'PT507000333',
    address: 'Avenida das Renováveis 12',
    city: 'Lisboa',
    country: 'Portugal',
    phone: '+351 210 000 300',
    email: 'geral@solarvale.pt',
    website: 'https://example.com',
    sector: 'Energia',
    notes: 'Projetos solares e gestão técnica.',
    active: true,
    created_by: 'demo-admin',
    created_at: '2026-03-03',
  },
];

function item(code: string, quantity: number, margin = 30, discount = 0): BudgetItem {
  const found = ALL_CATALOG_ITEMS.find((catalogItem) => catalogItem.code === code) ?? ALL_CATALOG_ITEMS[0];
  return {
    id: `item-${code}-${quantity}`,
    code: found.code,
    description: found.description,
    reference: found.reference,
    brand: found.brand,
    category: found.category,
    sector: found.sector,
    unit: found.unit,
    unit_cost: found.unit_cost,
    quantity,
    margin,
    discount,
    notes: '',
  };
}

export const DEMO_BUDGETS: Budget[] = [
  {
    id: 'bud-001',
    ref: 'ORC-2026-001',
    name: 'Quadro Geral BT - Linha Enchimento',
    company_id: 'cmp-001',
    assigned_to: 'demo-tecnico',
    status: 'aprovado',
    sector: 'Eletricidade Industrial',
    date: '2026-05-08',
    valid_until: '2026-07-08',
    notes: 'Inclui montagem, cablagem, ensaios e documentação final.',
    client_contact: 'Ana Ribeiro',
    client_email: 'cliente@tercis.pt',
    include_tax: true,
    tax_rate: 23,
    created_by: 'demo-admin',
    created_at: '2026-05-08T09:30:00.000Z',
    updated_at: '2026-05-12T14:00:00.000Z',
    items: [
      item('DJ-ABB-3P125', 1, 28),
      item('CT-SM-40A', 4, 32),
      item('BR-PC-2.5', 80, 35, 5),
      item('MO-MONT', 16, 20),
    ],
  },
  {
    id: 'bud-002',
    ref: 'ORC-2026-002',
    name: 'Automação Transportador Paletes',
    company_id: 'cmp-002',
    assigned_to: 'demo-admin',
    status: 'enviado',
    sector: 'Automação Industrial',
    date: '2026-05-18',
    valid_until: '2026-06-30',
    notes: 'PLC, HMI, variador e sensores principais.',
    client_contact: 'João Neves',
    client_email: 'compras@nortelogistics.pt',
    include_tax: true,
    tax_rate: 23,
    created_by: 'demo-admin',
    created_at: '2026-05-18T11:20:00.000Z',
    updated_at: '2026-05-21T10:00:00.000Z',
    items: [
      item('PLC-SM-1214C', 1, 30),
      item('HMI-SM-KTP700', 1, 26),
      item('VFD-ABB-ACS355-1.5', 2, 28),
      item('SN-OM-E2E-NA', 8, 35),
    ],
  },
  {
    id: 'bud-003',
    ref: 'ORC-2026-003',
    name: 'Monitorização Solar e Proteções DC',
    company_id: 'cmp-003',
    assigned_to: 'demo-tecnico',
    status: 'rascunho',
    sector: 'Energias Renováveis',
    date: '2026-06-01',
    valid_until: '2026-07-01',
    notes: 'Proposta inicial para monitorização e proteção de string.',
    client_contact: 'Carla Sousa',
    client_email: 'geral@solarvale.pt',
    include_tax: false,
    tax_rate: 23,
    created_by: 'demo-tecnico',
    created_at: '2026-06-01T15:10:00.000Z',
    updated_at: '2026-06-02T08:00:00.000Z',
    items: [
      item('INV-SMA-SB6.0', 1, 22),
      item('SUP-SC-DJ2P32', 6, 34),
      item('SUP-SC-SPD-DC', 3, 30),
      item('PV-MONI-DL', 1, 25),
    ],
  },
];

export function hydrateDemoBudget(budget: Budget): Budget {
  return {
    ...budget,
    company: DEMO_COMPANIES.find((company) => company.id === budget.company_id),
    assignee: DEMO_PROFILES.find((profile) => profile.id === budget.assigned_to),
    creator: DEMO_PROFILES.find((profile) => profile.id === budget.created_by),
  };
}

export function getDemoProfile(email: string, password: string) {
  if (password !== DEMO_PASSWORD) return null;
  return DEMO_PROFILES.find((profile) => profile.email.toLowerCase() === email.toLowerCase()) ?? null;
}
