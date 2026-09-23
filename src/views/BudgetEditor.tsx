import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import type { Budget, BudgetItem, BudgetStatus, CatalogItem } from '../types';
import {
  ArrowLeft, Save, Download, FileSpreadsheet, Plus, Info,
  ChevronDown, ReceiptText, Tag, FileText, Percent, DollarSign,
  CheckCircle2, AlertCircle, Layers, Trash2,
} from 'lucide-react';

// ----------------------------- TIPOS PARA DADOS EXTERNOS (SEM ANY) -----------------------------
type ExternalCompany = {
  id?: string | number;
  ID?: string | number;
  name?: string;
  nome?: string;
  designacao?: string;
};

type ExternalTeamMember = {
  id?: string | number;
  ID?: string | number;
  full_name?: string;
  nome_completo?: string;
  name?: string;
  nome?: string;
};

interface CalculatedItem extends BudgetItem {
  pvp: number;
  finalPrice: number;
  totalPrice: number;
}

// ----------------------------- DADOS FIXOS DE EXEMPLO -----------------------------
export const FIXED_COMPANIES = [
  { id: '1', name: 'Meevo - Soluções Digitais' },
  { id: '2', name: 'FastRotator - Tecnologia Rápida' },
  { id: '3', name: 'Coploca - Consultoria Lda' },
  { id: '4', name: 'InovaTech SA' },
  { id: '5', name: 'Grupo Energia Global' },
];

export const FIXED_TEAM = [
  { id: '101', full_name: 'João Silva (Comercial)' },
  { id: '102', full_name: 'Maria Oliveira (Diretora)' },
  { id: '103', full_name: 'Carlos Santos (Técnico)' },
  { id: '104', full_name: 'Ana Costa (Financeiro)' },
];

// ----------------------------- FUNÇÕES DE CÁLCULO -----------------------------
export const calcItem = (item: BudgetItem): CalculatedItem => {
  const pvp = item.unit_cost * (1 + item.margin / 100);
  const finalPrice = pvp * (1 - item.discount / 100);
  const totalPrice = finalPrice * item.quantity;
  return { ...item, pvp, finalPrice, totalPrice };
};

export const grandTotal = (items: CalculatedItem[]): number =>
  items.reduce((sum, item) => sum + item.totalPrice, 0);

export const totalWithTax = (budget: Budget, items: CalculatedItem[]): number => {
  const total = grandTotal(items);
  if (!budget.include_tax) return total;
  return total * (1 + budget.tax_rate / 100);
};

export const avgMargin = (items: BudgetItem[]): number => {
  if (items.length === 0) return 0;
  const totalMargin = items.reduce((sum, item) => sum + item.margin, 0);
  return totalMargin / items.length;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
};

// ----------------------------- CATÁLOGO DE COMPONENTES -----------------------------
export const SECTORS = [
  { id: 'eletricidade', label: 'Eletricidade' },
  { id: 'iluminacao', label: 'Iluminação' },
  { id: 'automacao', label: 'Automação' },
];

export const ALL_CATALOG_ITEMS: CatalogItem[] = [
  { id: 'cat-1', code: 'DISJ-16A', description: 'Disjuntor 16A', reference: 'D16', brand: 'Schneider', category: 'Proteção', sector: 'eletricidade', unit: 'un', unit_cost: 12.5, supplier: 'Schneider' },
  { id: 'cat-2', code: 'LED-10W', description: 'Lâmpada LED 10W', reference: 'L10', brand: 'Philips', category: 'Iluminação', sector: 'iluminacao', unit: 'un', unit_cost: 4.2, supplier: 'Philips' },
  { id: 'cat-3', code: 'CLP-21', description: 'Controlador Lógico', reference: 'CLP21', brand: 'Siemens', category: 'Automação', sector: 'automacao', unit: 'un', unit_cost: 89.9, supplier: 'Siemens' },
];

// ----------------------------- COMPONENTES AUXILIARES -----------------------------
const inputCls = "w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-white";

const STATUS_LABELS: Record<BudgetStatus, string> = {
  rascunho: 'Rascunho', em_revisao: 'Em revisão', enviado: 'Enviado', aprovado: 'Aprovado', rejeitado: 'Rejeitado', expirado: 'Expirado', em_execucao: 'Em execução', concluido: 'Concluído',
};

const STATUS_CONFIG: Record<BudgetStatus, { bg: string; text: string; dot: string }> = {
  rascunho: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
  em_revisao: { bg: 'bg-violet-100', text: 'text-violet-800', dot: 'bg-violet-500' },
  expirado: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  enviado: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  aprovado: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  rejeitado: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  em_execucao: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  concluido: { bg: 'bg-cyan-100', text: 'text-cyan-800', dot: 'bg-cyan-600' },
};

const StatusBadge = memo<{ status: BudgetStatus; size?: 'sm' | 'md' }>(({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses} font-medium rounded-full ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {STATUS_LABELS[status]}
    </span>
  );
});

const Field = memo<{ label: string; children: React.ReactNode; error?: string; className?: string }>(
  ({ label, children, error, className = '' }) => (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
);

const SummaryCard = memo<{ title: string; value: string; icon: React.ReactNode; variant?: 'default' | 'dark' }>(
  ({ title, value, icon, variant = 'default' }) => {
    const bgClass = variant === 'dark' ? 'bg-slate-900 text-white' : 'bg-white';
    return (
      <div className={`rounded-2xl border border-slate-100 shadow-sm p-4 ${bgClass}`}>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{title}</p>
        </div>
        <p className={`text-xl font-black ${variant === 'dark' ? 'text-white' : 'text-slate-800'}`}>{value}</p>
      </div>
    );
  }
);

interface ComponentSelectProps {
  options: CatalogItem[];
  value: CatalogItem | null;
  onChange: (value: CatalogItem | null) => void;
}

const ComponentSelect = memo<ComponentSelectProps>(({ options, value, onChange }) => (
  <select
    className={inputCls}
    value={value?.code ?? ''}
    onChange={(e) => {
      const selected = options.find(opt => opt.code === e.target.value);
      onChange(selected ?? null);
    }}
  >
    <option value="">Selecionar componente...</option>
    {options.map(opt => (
      <option key={opt.code} value={opt.code}>
        {opt.code} - {opt.description}
      </option>
    ))}
  </select>
));

interface ItemsTableProps {
  items: CalculatedItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof BudgetItem, value: string | number) => void;
}

const ItemsTable = memo<ItemsTableProps>(({ items, onRemove, onUpdate }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-50 border-b border-slate-100">
        <tr>
          <th className="text-left p-3 font-semibold text-slate-600">Código</th>
          <th className="text-left p-3 font-semibold text-slate-600">Descrição</th>
          <th className="text-right p-3 font-semibold text-slate-600">Qtd</th>
          <th className="text-right p-3 font-semibold text-slate-600">Unitário</th>
          <th className="text-right p-3 font-semibold text-slate-600">Total</th>
          <th className="text-center p-3 font-semibold text-slate-600">Ações</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
            <td className="p-3 font-mono text-xs">{item.code}</td>
            <td className="p-3">{item.description}</td>
            <td className="p-3 text-right">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e => onUpdate(item.id, 'quantity', parseInt(e.target.value, 10) || 1)}
                className="w-20 px-2 py-1 border rounded text-right"
              />
            </td>
            <td className="p-3 text-right">{formatCurrency(item.pvp)}</td>
            <td className="p-3 text-right font-semibold">{formatCurrency(item.totalPrice)}</td>
            <td className="p-3 text-center">
              <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

// ----------------------------- HOOK PERSONALIZADO -----------------------------
function useBudgetCalculations(items: BudgetItem[], budget: Budget) {
  return useMemo(() => {
    const calcItems = items.map(calcItem);
    const total = grandTotal(calcItems);
    const totalTax = totalWithTax(budget, calcItems);
    const costTotal = items.reduce((s, i) => s + i.unit_cost * i.quantity, 0);
    const marginAvg = avgMargin(items);
    const discountTotal = calcItems.reduce((sum, item) => sum + (item.pvp - item.finalPrice) * item.quantity, 0);
    return { calcItems, total, totalTax, costTotal, marginAvg, discountTotal, itemCount: items.length };
  }, [items, budget]);
}

// ----------------------------- COMPONENTE PRINCIPAL -----------------------------
interface BudgetEditorProps {
  budget: Budget;
  companies?: ExternalCompany[];   // agora tipado corretamente
  team?: ExternalTeamMember[];     // agora tipado corretamente
  onChange: (b: Budget) => void;
  onSave: () => void;
  onBack: () => void;
  saving: boolean;
  unsaved: boolean;
}

export const BudgetEditor: React.FC<BudgetEditorProps> = ({
  budget,
  companies: externalCompanies,
  team: externalTeam,
  onChange,
  onSave,
  onBack,
  saving,
  unsaved,
}) => {
  const [activeSection, setActiveSection] = useState<'info' | 'items'>('info');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<CatalogItem | null>(null);
  const [itemForm, setItemForm] = useState({ quantity: 1, margin: 30, discount: 0, notes: '' });

  // Normalização sem any: usamos a interface ExternalCompany
  const effectiveCompanies = useMemo(() => {
    if (externalCompanies && externalCompanies.length > 0) {
      return externalCompanies.map((c: ExternalCompany) => ({
        id: String(c.id ?? c.ID ?? crypto.randomUUID()),
        name: c.name ?? c.nome ?? c.designacao ?? 'Cliente',
      }));
    }
    return FIXED_COMPANIES;
  }, [externalCompanies]);

  const effectiveTeam = useMemo(() => {
    if (externalTeam && externalTeam.length > 0) {
      return externalTeam.map((t: ExternalTeamMember) => ({
        id: String(t.id ?? t.ID ?? crypto.randomUUID()),
        full_name: t.full_name ?? t.nome_completo ?? t.name ?? t.nome ?? 'Responsável',
      }));
    }
    return FIXED_TEAM;
  }, [externalTeam]);

  const { calcItems, total, totalTax, costTotal, marginAvg, discountTotal, itemCount } = useBudgetCalculations(budget.items || [], budget);
  const hasItems = itemCount > 0;

  const filteredCatalog = useMemo(() => {
    if (!budget.sector) return ALL_CATALOG_ITEMS;
    return ALL_CATALOG_ITEMS.filter(c => c.sector === budget.sector);
  }, [budget.sector]);

  const selectedCompany = useMemo(() => effectiveCompanies.find(c => c.id === budget.company_id), [effectiveCompanies, budget.company_id]);
  const selectedAssignee = useMemo(() => effectiveTeam.find(t => t.id === budget.assigned_to), [effectiveTeam, budget.assigned_to]);

  const expiresIn = useMemo(() => {
    if (!budget.valid_until) return null;
    return Math.round((new Date(budget.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }, [budget.valid_until]);
  const expiresLabel = expiresIn !== null
    ? expiresIn >= 0 ? `Vence em ${expiresIn} dia${expiresIn === 1 ? '' : 's'}` : `Vencido há ${Math.abs(expiresIn)} dia${Math.abs(expiresIn) === 1 ? '' : 's'}`
    : 'Data indefinida';

  const updateBudget = useCallback(<K extends keyof Budget>(key: K, value: Budget[K]) => {
    onChange({ ...budget, [key]: value });
  }, [budget, onChange]);

  const addItem = useCallback(() => {
    if (!selectedComponent) return;
    const newItem: BudgetItem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      code: selectedComponent.code,
      description: selectedComponent.description,
      reference: selectedComponent.reference,
      brand: selectedComponent.brand,
      category: selectedComponent.category,
      sector: selectedComponent.sector,
      unit: selectedComponent.unit,
      unit_cost: selectedComponent.unit_cost,
      quantity: itemForm.quantity,
      margin: itemForm.margin,
      discount: itemForm.discount,
      notes: itemForm.notes,
    };
    onChange({ ...budget, items: [...(budget.items || []), newItem] });
    setSelectedComponent(null);
    setItemForm({ quantity: 1, margin: 30, discount: 0, notes: '' });
    setActiveSection('items');
  }, [selectedComponent, itemForm, budget, onChange]);

  const removeItem = useCallback((id: string) => {
    onChange({ ...budget, items: (budget.items || []).filter(i => i.id !== id) });
  }, [budget, onChange]);

  const updateItem = useCallback((id: string, field: keyof BudgetItem, value: string | number) => {
    onChange({
      ...budget,
      items: (budget.items || []).map(i => i.id === id ? { ...i, [field]: value } : i),
    });
  }, [budget, onChange]);

  const previewPrice = useMemo(() => {
    if (!selectedComponent) return null;
    const pvp = selectedComponent.unit_cost * (1 + itemForm.margin / 100);
    const final = pvp * (1 - itemForm.discount / 100) * itemForm.quantity;
    return { pvp, final };
  }, [selectedComponent, itemForm]);

  const statusMenuRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false);
      }
    };
    if (showStatusMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStatusMenu]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-100 shrink-0">
                <ArrowLeft size={15} />
                <span className="hidden sm:inline">Voltar</span>
              </button>
              <div className="h-4 w-px bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded shrink-0">{budget.ref}</span>
                <span className="font-bold text-slate-800 truncate text-sm">{budget.name || 'Sem nome'}</span>
                {unsaved && <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full"><AlertCircle size={10} />Não guardado</span>}
                {!unsaved && hasItems && <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"><CheckCircle2 size={10} />Guardado</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative" ref={statusMenuRef}>
                <button onClick={() => setShowStatusMenu(v => !v)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm text-slate-700 hover:bg-slate-50 transition-all text-xs sm:text-sm">
                  <StatusBadge status={budget.status} size="sm" />
                  <ChevronDown size={12} />
                </button>
                {showStatusMenu && (
                  <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-44">
                    {(['rascunho', 'enviado', 'aprovado', 'rejeitado', 'em_execucao', 'concluido'] as BudgetStatus[]).map(s => {
                      const dotColor = STATUS_CONFIG[s].dot;
                      return (
                        <button
                          key={s}
                          onClick={() => { updateBudget('status', s); setShowStatusMenu(false); }}
                          className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                        >
                          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                          {STATUS_LABELS[s]}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button onClick={() => {}} disabled={!hasItems} className="p-2 text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40">
                <Download size={15} />
              </button>
              <button onClick={() => {}} disabled={!hasItems} className="p-2 text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 hidden sm:flex">
                <FileSpreadsheet size={15} />
              </button>
              <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-all flex items-center gap-1.5">
                <Save size={14} />
                <span className="hidden sm:inline">{saving ? 'A guardar...' : 'Guardar'}</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex border-t border-slate-50 overflow-x-auto">
          <button onClick={() => setActiveSection('info')} className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${activeSection === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>
            <FileText size={13} /> Dados
          </button>
          <button onClick={() => setActiveSection('items')} className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${activeSection === 'items' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>
            <Layers size={13} /> Itens {hasItems && `(${itemCount})`}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        {activeSection === 'info' && (
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><ReceiptText size={15} className="text-blue-600" /></div>
              <h2 className="text-base font-bold text-slate-800">Dados do Orçamento</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_0.95fr] gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Field label="Designação *">
                    <input type="text" value={budget.name} onChange={e => updateBudget('name', e.target.value)} placeholder="Ex: Quadro Geral BT" className={inputCls} />
                  </Field>
                  <Field label="Setor">
                    <select value={budget.sector} onChange={e => updateBudget('sector', e.target.value)} className={inputCls}>
                      <option value="">Selecionar setor...</option>
                      {SECTORS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Cliente">
                    <select value={budget.company_id || ''} onChange={e => updateBudget('company_id', e.target.value || null)} className={inputCls}>
                      <option value="">Selecionar cliente...</option>
                      {effectiveCompanies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Responsável">
                    <select value={budget.assigned_to || ''} onChange={e => updateBudget('assigned_to', e.target.value || null)} className={inputCls}>
                      <option value="">Atribuir a...</option>
                      {effectiveTeam.map(t => (
                        <option key={t.id} value={t.id}>{t.full_name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Data de Emissão">
                    <input type="date" value={budget.date.slice(0, 10)} onChange={e => updateBudget('date', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Válido até">
                    <input type="date" value={budget.valid_until.slice(0, 10)} onChange={e => updateBudget('valid_until', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Contacto Cliente">
                    <input type="text" value={budget.client_contact} onChange={e => updateBudget('client_contact', e.target.value)} placeholder="Nome do contacto" className={inputCls} />
                  </Field>
                  <Field label="Email Cliente">
                    <input type="email" value={budget.client_email} onChange={e => updateBudget('client_email', e.target.value)} placeholder="email@empresa.pt" className={inputCls} />
                  </Field>
                  <Field label="IVA (%)">
                    <div className="flex gap-2 items-center">
                      <input type="number" value={budget.tax_rate} min="0" max="100" step="0.5" onChange={e => updateBudget('tax_rate', parseFloat(e.target.value) || 0)} className="w-24 px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-center" />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-10 h-6 rounded-full transition-colors relative ${budget.include_tax ? 'bg-blue-600' : 'bg-slate-200'}`} onClick={() => updateBudget('include_tax', !budget.include_tax)}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${budget.include_tax ? 'left-5' : 'left-1'}`} />
                        </div>
                        <span className="text-xs text-slate-600 font-medium">Incluir</span>
                      </label>
                    </div>
                  </Field>
                </div>
                <Field label="Observações">
                  <textarea value={budget.notes} onChange={e => updateBudget('notes', e.target.value)} placeholder="Notas, condições especiais, termos de pagamento..." rows={4} className={`${inputCls} resize-none`} />
                </Field>
              </div>
              <aside className="space-y-4">
                <div className="rounded-3xl border border-slate-100 bg-slate-950 p-5 text-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div><p className="text-xs uppercase tracking-wider text-slate-400">Resumo</p><p className="mt-3 text-lg font-bold truncate">{budget.name || 'Sem nome'}</p></div>
                    <StatusBadge status={budget.status} size="sm" />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-900/80 p-3"><p className="text-[11px] text-slate-400">Itens</p><p className="mt-2 text-xl font-bold">{itemCount}</p></div>
                    <div className="rounded-2xl bg-slate-900/80 p-3"><p className="text-[11px] text-slate-400">Desconto</p><p className="mt-2 text-xl font-bold">{formatCurrency(discountTotal)}</p></div>
                  </div>
                  <div className="mt-3 rounded-3xl bg-slate-900/80 p-4"><p className="text-[11px] text-slate-400">Validade</p><p className="mt-2 text-base font-semibold">{expiresLabel}</p></div>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-white p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Cliente & Responsável</p>
                  <div className="mt-4 space-y-3 text-sm">
                    <div><p className="text-slate-500">Cliente</p><p className="font-semibold truncate">{selectedCompany?.name || 'A definir'}</p></div>
                    <div><p className="text-slate-500">Contacto</p><p>{budget.client_contact || '—'} {budget.client_email && `(${budget.client_email})`}</p></div>
                    <div><p className="text-slate-500">Responsável</p><p className="font-semibold">{selectedAssignee?.full_name || 'Não atribuído'}</p></div>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        )}

        {activeSection === 'items' && (
          <>
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center"><Plus size={15} className="text-emerald-600" /></div>
                <h2 className="text-base font-bold text-slate-800">Adicionar Item</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-end">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Componente</label>
                  <ComponentSelect options={filteredCatalog} value={selectedComponent} onChange={setSelectedComponent} />
                </div>
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Qtd</label><input type="number" min="1" value={itemForm.quantity} onChange={e => setItemForm(f => ({ ...f, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) }))} className={inputCls} /></div>
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Margem %</label><input type="number" min="0" step="0.5" value={itemForm.margin} onChange={e => setItemForm(f => ({ ...f, margin: parseFloat(e.target.value) || 0 }))} className={inputCls} /></div>
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Desc. %</label><input type="number" min="0" max="100" step="0.5" value={itemForm.discount} onChange={e => setItemForm(f => ({ ...f, discount: Math.min(100, parseFloat(e.target.value) || 0) }))} className={inputCls} /></div>
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">Notas</label><input type="text" value={itemForm.notes} onChange={e => setItemForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observação..." className={inputCls} /></div>
                <button onClick={addItem} disabled={!selectedComponent} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"><Plus size={15} /> Adicionar</button>
              </div>
              {selectedComponent && previewPrice && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm flex items-start gap-2.5">
                  <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
                  <div><p className="font-bold text-slate-800 truncate">{selectedComponent.code} — {selectedComponent.description}</p><div className="flex flex-wrap gap-4 mt-1 text-xs"><span>Custo: <strong>{formatCurrency(selectedComponent.unit_cost)}</strong></span><span>PVP: <strong className="text-blue-700">{formatCurrency(previewPrice.pvp)}</strong></span><span>Total: <strong className="text-emerald-700">{formatCurrency(previewPrice.final)}</strong></span></div></div>
                </div>
              )}
            </section>

            {hasItems && (
              <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-4">
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 overflow-x-auto">
                  <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center"><ReceiptText size={15} className="text-slate-600" /></div><h2 className="text-base font-bold">Itens</h2><span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span></div>
                  <ItemsTable items={calcItems} onRemove={removeItem} onUpdate={updateItem} />
                </section>
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4">
                  <div><p className="text-xs uppercase tracking-wider text-slate-400">Resumo de Itens</p><p className="text-base font-bold">Métricas chave</p></div>
                  <SummaryCard title="Total sem IVA" value={formatCurrency(total)} icon={<DollarSign size={14} />} />
                  <SummaryCard title="Total com IVA" value={formatCurrency(totalTax)} icon={<Tag size={14} />} />
                  <SummaryCard title="Margem média" value={`${marginAvg.toFixed(1)}%`} icon={<Percent size={14} />} />
                  <SummaryCard title="Desconto total" value={formatCurrency(discountTotal)} icon={<AlertCircle size={14} />} />
                </section>
              </div>
            )}

            {hasItems && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <SummaryCard title="Custo Total" value={formatCurrency(costTotal)} icon={<DollarSign size={14} />} />
                <SummaryCard title="PVP Total" value={formatCurrency(calcItems.reduce((s, i) => s + i.pvp * i.quantity, 0))} icon={<Tag size={14} />} />
                <SummaryCard title="Margem Média" value={`${marginAvg.toFixed(1)}%`} icon={<Percent size={14} />} />
                <SummaryCard title="Total Final" value={formatCurrency(totalTax)} icon={<CheckCircle2 size={14} />} variant="dark" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
