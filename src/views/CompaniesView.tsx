import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Edit2, Trash2, X, Building2, Mail, Phone,
  MapPin, Globe, FileText, DollarSign, ChevronRight,
  Save,
  Sparkles,
  Flag,
  Layers,
  Tag,
  ShieldCheck,
} from 'lucide-react';

// ============================================================
// Mocks autossuficientes (substituem dependências externas)
// ============================================================
const useAuth = () => ({ profile: { role: 'admin' } });

const Modal = ({ open, onClose, title, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SECTORS = [
  { id: 'Eletricidade Industrial', label: 'Eletricidade Industrial' },
  { id: 'Automação Industrial', label: 'Automação Industrial' },
  { id: 'HVAC & Climatização', label: 'HVAC & Climatização' },
  { id: 'Energias Renováveis', label: 'Energias Renováveis' },
  { id: 'Telecomunicações & Redes', label: 'Telecomunicações & Redes' },
  { id: 'Iluminação Técnica', label: 'Iluminação Técnica' },
];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(val);

// ============================================================
// Tipos e dados fixos
// ============================================================
interface Company {
  id: string; name: string; tax_id: string; address: string; city: string;
  country: string; phone: string; email: string; website: string; sector: string;
  notes: string; active: boolean; created_at: string;
}

interface BudgetItem {
  id: string; code: string; reference: string; brand: string; model: string;
  unit: string; category: string; description: string; quantity: number;
  unit_cost: number; margin: number; discount: number; notes: string;
}

interface Budget {
  id: string; company_id: string; ref: string; name: string; status: string;
  items: BudgetItem[];
}

const FIXED_COMPANIES: Company[] = [
  {
    id: '1', name: 'TechNova Lda', tax_id: '500123456',
    address: 'Rua da Tecnologia, 42', city: 'Lisboa', country: 'Portugal',
    phone: '+351 210 123 456', email: 'info@technova.pt',
    website: 'https://technova.pt', sector: 'Eletricidade Industrial',
    notes: 'Cliente preferencial', active: true, created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2', name: 'GreenPower SA', tax_id: '510654321',
    address: 'Av. das Energias, 17', city: 'Porto', country: 'Portugal',
    phone: '+351 220 987 654', email: 'contacto@greenpower.pt',
    website: 'https://greenpower.pt', sector: 'Energias Renováveis',
    notes: '', active: true, created_at: '2024-02-20T09:30:00Z',
  },
  {
    id: '3', name: 'AutoMecânica do Sul', tax_id: '505111222',
    address: 'Zona Industrial, Lote 3', city: 'Faro', country: 'Portugal',
    phone: '+351 289 555 333', email: 'geral@automecanica.pt',
    website: '', sector: 'Manutenção Industrial',
    notes: 'Fornecedor de peças', active: true, created_at: '2024-03-10T14:15:00Z',
  },
];

const FIXED_BUDGETS: Budget[] = [
  {
    id: 'b1', company_id: '1', ref: 'ORC-2025-001', name: 'Instalação Quadro Elétrico', status: 'aprovado',
    items: [
      { id: 'item1', code: 'QE-01', reference: 'REF-QE-01', brand: 'Schneider', model: 'X100', unit: 'un', category: 'Material', description: 'Quadro principal', quantity: 1, unit_cost: 2500, margin: 20, discount: 5, notes: '' },
      { id: 'item2', code: 'DJ-03', reference: 'REF-DJ-03', brand: 'Siemens', model: 'D200', unit: 'un', category: 'Material', description: 'Disjuntores', quantity: 3, unit_cost: 800, margin: 15, discount: 0, notes: '' },
    ],
  },
  {
    id: 'b2', company_id: '1', ref: 'ORC-2025-005', name: 'Manutenção Preventiva', status: 'enviado',
    items: [
      { id: 'item3', code: 'SERV-HT', reference: 'REF-HT', brand: '', model: '', unit: 'h', category: 'Serviço', description: 'Horas técnicas', quantity: 10, unit_cost: 150, margin: 25, discount: 0, notes: '' },
    ],
  },
  {
    id: 'b3', company_id: '2', ref: 'ORC-2025-012', name: 'Painéis Solares 50kW', status: 'aprovado',
    items: [
      { id: 'item4', code: 'PS-400', reference: 'REF-PS-400', brand: 'LG', model: 'NeON', unit: 'un', category: 'Material', description: 'Painel 400W', quantity: 50, unit_cost: 300, margin: 18, discount: 3, notes: '' },
      { id: 'item5', code: 'INV-5K', reference: 'REF-INV-5K', brand: 'Fronius', model: 'Primo', unit: 'un', category: 'Material', description: 'Inversor', quantity: 2, unit_cost: 5000, margin: 12, discount: 0, notes: '' },
    ],
  },
  {
    id: 'b4', company_id: '2', ref: 'ORC-2025-020', name: 'Estudo de Viabilidade', status: 'rascunho',
    items: [
      { id: 'item6', code: 'EST-01', reference: 'REF-EST-01', brand: '', model: '', unit: 'un', category: 'Serviço', description: 'Estudo', quantity: 1, unit_cost: 3500, margin: 10, discount: 0, notes: '' },
    ],
  },
  {
    id: 'b5', company_id: '3', ref: 'ORC-2025-008', name: 'Reparação de Compressor', status: 'concluido',
    items: [
      { id: 'item7', code: 'COMP-PC', reference: 'REF-COMP-PC', brand: 'Atlas Copco', model: 'GA30', unit: 'un', category: 'Peças', description: 'Peças', quantity: 1, unit_cost: 1200, margin: 30, discount: 10, notes: '' },
      { id: 'item8', code: 'MO-5H', reference: 'REF-MO-5H', brand: '', model: '', unit: 'h', category: 'Mão‑de‑obra', description: 'Mão‑de‑obra', quantity: 5, unit_cost: 80, margin: 20, discount: 0, notes: '' },
    ],
  },
];

// ============================================================
// Utilitários
// ============================================================
function calcValue(b: Budget): number {
  return b.items?.reduce((s, i) => s + i.unit_cost * (1 + i.margin / 100) * (1 - i.discount / 100) * i.quantity, 0) || 0;
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const sectorColors = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#ef4444', '#0ea5e9'];

// ============================================================
// Formulário
// ============================================================
interface FormData {
  name: string; tax_id: string; address: string; city: string;
  country: string; phone: string; email: string; website: string;
  sector: string; notes: string;
}

const emptyForm: FormData = {
  name: '', tax_id: '', address: '', city: '', country: 'Portugal',
  phone: '', email: '', website: '', sector: 'Eletricidade Industrial', notes: '',
};

// ============================================================
// COMPONENTE PRINCIPAL (layout original, ordenado por nome)
// ============================================================
export function CompaniesView() {
  const { profile } = useAuth();
  const canEdit = profile?.role === 'admin' || profile?.role === 'collaborator';

  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [companies, setCompanies] = useState<Company[]>(FIXED_COMPANIES);
  const [budgets, setBudgets] = useState<Budget[]>(FIXED_BUDGETS);

  // Pré‑cálculos (performance máxima)
  const budgetsByCompany = useMemo(() => {
    const map: Record<string, Budget[]> = {};
    budgets.forEach(b => {
      if (b.company_id) {
        if (!map[b.company_id]) map[b.company_id] = [];
        map[b.company_id].push(b);
      }
    });
    return map;
  }, [budgets]);

  const companyValues = useMemo(() => {
    const map: Record<string, number> = {};
    budgets.forEach(b => {
      if (b.company_id) map[b.company_id] = (map[b.company_id] || 0) + calcValue(b);
    });
    return map;
  }, [budgets]);

  const companyApprovedCount = useMemo(() => {
    const map: Record<string, number> = {};
    budgets.forEach(b => {
      if (b.status === 'aprovado' && b.company_id) map[b.company_id] = (map[b.company_id] || 0) + 1;
    });
    return map;
  }, [budgets]);

  const companiesWithBudgets = useMemo(() => new Set(budgets.map(b => b.company_id).filter(Boolean)).size, [budgets]);

  const totalVolume = useMemo(() => companies.reduce((sum, c) => sum + (companyValues[c.id] || 0), 0), [companies, companyValues]);

  // Lista filtrada e **sempre ordenada por nome (A–Z)**
  const filtered = useMemo(() => {
    let list = companies.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
      return matchSearch && (sectorFilter === 'all' || c.sector === sectorFilter);
    });
    // Ordenação fixa: alfabética crescente
    list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, sectorFilter, companies]);

  const openNew = () => {
    setSelectedCompany(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c: Company) => {
    setSelectedCompany(c);
    setFormData({ name: c.name, tax_id: c.tax_id, address: c.address, city: c.city, country: c.country, phone: c.phone, email: c.email, website: c.website, sector: c.sector, notes: c.notes });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name) return;
    setSaving(true);
    setTimeout(() => {
      if (selectedCompany) {
        setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? { ...selectedCompany, ...formData } : c));
      } else {
        const newCompany: Company = { id: Date.now().toString(), ...formData, active: true, created_at: new Date().toISOString() };
        setCompanies(prev => [...prev, newCompany]);
      }
      setShowModal(false);
      setSaving(false);
    }, 300);
  };

  const handleDelete = (c: Company) => {
    if (!confirm(`Eliminar ${c.name}?`)) return;
    setCompanies(prev => prev.filter(co => co.id !== c.id));
    setBudgets(prev => prev.filter(b => b.company_id !== c.id));
    setDetailOpen(false);
  };

  const STATUS_COLORS: Record<string, string> = {
    rascunho: '#94a3b8', enviado: '#3b82f6', aprovado: '#10b981',
    rejeitado: '#ef4444', em_execucao: '#f59e0b', concluido: '#6366f1',
  };

  return (
    <div className="workspace-page workspace-companies p-6 sm:p-8 space-y-5 max-w-7xl mx-auto animate-fade-in">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-300">Workspace / Clientes</p>
            <h1 className="text-3xl font-black tracking-tight">Empresas com contexto comercial.</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Centralize relações, volume e histórico para transformar cada oportunidade num próximo passo claro.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm"><p className="text-[11px] uppercase tracking-widest text-slate-300">Carteira ativa</p><p className="mt-1 text-2xl font-black">{companies.length}<span className="ml-1 text-sm font-medium text-orange-300">contas</span></p></div>
        </div>
      </section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Empresas</h1>
          <p className="text-slate-400 text-sm mt-0.5">{filtered.length} de {companies.length} empresa{companies.length !== 1 ? 's' : ''}</p>
        </div>
        {canEdit && (
          <button onClick={openNew} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2">
            <Plus size={16} />
            Nova Empresa
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: companies.length, icon: <Building2 size={14} className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Com Orçamentos', value: companiesWithBudgets, icon: <FileText size={14} className="text-emerald-600" />, bg: 'bg-emerald-50' },
          { label: 'Volume Total', value: formatCurrency(totalVolume), icon: <DollarSign size={14} className="text-amber-600" />, bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3">
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className="text-lg font-black text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filters (APENAS os originais, sem dropdown de ordenação) */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-52 bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
          <Search size={15} className="text-slate-400 flex-shrink-0" />
          <input type="text" placeholder="Pesquisar por nome, cidade, email..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400" />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setSectorFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${sectorFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
          Todos
        </button>
        {SECTORS.slice(0, 6).map(s => (
          <button key={s.id} onClick={() => setSectorFilter(sectorFilter === s.id ? 'all' : s.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${sectorFilter === s.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Building2 size={36} className="mx-auto text-slate-200 mb-3" />
          <p className="text-slate-500 font-medium text-sm">Nenhuma empresa encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company, idx) => {
            const cBudgets = budgetsByCompany[company.id] || [];
            const val = companyValues[company.id] || 0;
            const approved = companyApprovedCount[company.id] || 0;
            const color = sectorColors[idx % sectorColors.length];

            return (
              <button
                key={company.id}
                onClick={() => { setSelectedCompany(company); setDetailOpen(true); }}
                className="p-5 rounded-[1.5rem] bg-white border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-950/5 hover:-translate-y-0.5 transition-all text-left group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {getInitials(company.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{company.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{company.city}{company.country ? `, ${company.country}` : ''}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0 mt-1" />
                </div>

                <div className="space-y-1.5 text-xs mb-3 pb-3 border-b border-slate-100">
                  {company.email && (
                    <p className="text-slate-500 flex items-center gap-1.5 truncate">
                      <Mail size={10} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{company.email}</span>
                    </p>
                  )}
                  {company.phone && (
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <Phone size={10} className="text-slate-400" />
                      {company.phone}
                    </p>
                  )}
                  <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {company.sector}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-black text-slate-800">{cBudgets.length}</p>
                    <p className="text-[10px] text-slate-400">Orçamentos</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-emerald-700">{approved}</p>
                    <p className="text-[10px] text-slate-400">Aprovados</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{formatCurrency(val).replace('€', '').trim()}</p>
                    <p className="text-[10px] text-slate-400">€ Volume</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Detail panel */}
      {detailOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-black">
                  {getInitials(selectedCompany.name)}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">{selectedCompany.name}</h2>
                  <p className="text-xs text-slate-400">{selectedCompany.sector}</p>
                </div>
              </div>
              <button onClick={() => setDetailOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Orçamentos', value: (budgetsByCompany[selectedCompany.id] || []).length },
                  { label: 'Aprovados', value: companyApprovedCount[selectedCompany.id] || 0 },
                  { label: 'Volume', value: formatCurrency(companyValues[selectedCompany.id] || 0) },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 bg-slate-50 rounded-xl">
                    <p className="text-base font-black text-slate-800">{s.value}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { icon: <Mail size={14} className="text-slate-400" />, value: selectedCompany.email },
                  { icon: <Phone size={14} className="text-slate-400" />, value: selectedCompany.phone },
                  { icon: <MapPin size={14} className="text-slate-400" />, value: [selectedCompany.address, selectedCompany.city, selectedCompany.country].filter(Boolean).join(', ') },
                  { icon: <Globe size={14} className="text-slate-400" />, value: selectedCompany.website },
                ].filter(i => i.value).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    {item.icon}
                    <span className="text-sm text-slate-700 break-all">{item.value}</span>
                  </div>
                ))}
              </div>

              {(budgetsByCompany[selectedCompany.id] || []).length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Orçamentos Recentes</p>
                  <div className="space-y-2">
                    {(budgetsByCompany[selectedCompany.id] || []).slice(0, 5).map(b => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-sm text-slate-800 truncate">{b.name || b.ref}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{b.ref}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: `${STATUS_COLORS[b.status]}18`, color: STATUS_COLORS[b.status] }}
                          >
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {canEdit && (
              <div className="border-t border-slate-100 p-4 flex gap-2">
                <button
                  onClick={() => { setDetailOpen(false); openEdit(selectedCompany); }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 size={14} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(selectedCompany)}
                  className="flex-1 py-2.5 rounded-xl bg-red-50 border border-red-200 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de formulário */}
<Modal
  open={showModal}
  onClose={() => setShowModal(false)}
  maxWidth="6xl"
  title={
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
        <Building2 size={24} className="text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          {selectedCompany ? 'Editar Empresa' : 'Nova Empresa'}
        </h2>
        <p className="text-slate-500 mt-1">
          {selectedCompany
            ? 'Atualize os dados da empresa'
            : 'Preencha os dados para criar uma nova empresa'}
        </p>
      </div>
    </div>
  }
>
  <div className="space-y-5">

    {/* LINHA 1: NOME (span 3) + SETOR + NIF */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Nome da Empresa *
        </label>
        <div className="relative">
          <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="GreenPower SA"
            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Setor</label>
        <select
          value={formData.sector}
          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
          className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl text-slate-800 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
        >
          <option value="">Selecionar setor</option>
          {SECTORS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">NIF</label>
        <input
          type="text"
          value={formData.tax_id}
          onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
          placeholder="510654321"
          className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
        />
      </div>
    </div>

    {/* LINHA 2: MORADA (span 3) + CIDADE + PAÍS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Morada</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Av. das Energias, 17"
          className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Cidade</label>
        <input
          type="text"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="Porto"
          className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">País</label>
        <input
          type="text"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          placeholder="Portugal"
          className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
        />
      </div>
    </div>

    {/* LINHA 3: TELEFONE + EMAIL + WEBSITE + NOTAS (span 2) — 5 colunas */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+351 220 912 345"
          className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="contacto@empresa.pt"
          className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://empresa.pt"
          className="w-full h-14 px-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
        />
      </div>

      <div className="lg:col-span-2">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Notas</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Observações internas, informações adicionais..."
          className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
        />
      </div>
    </div>

    {/* FOOTER */}
    <div className="border-t border-slate-200 pt-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50">
          <ShieldCheck size={22} className="text-blue-600" />
          <div>
            <p className="font-semibold text-slate-800">Os seus dados estão seguros</p>
            <p className="text-sm text-slate-500">Todas as alterações são guardadas com segurança.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="h-14 px-8 rounded-2xl border border-slate-200 bg-white font-medium hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={!formData.name || saving}
            className="h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'A guardar...' : selectedCompany ? 'Guardar Alterações' : 'Criar Empresa'}
          </button>
        </div>
      </div>
    </div>

  </div>
</Modal>
    </div>
  );
}
