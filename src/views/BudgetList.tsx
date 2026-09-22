import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Plus, Search, FileText, Trash2, Edit3, Download,
  FileSpreadsheet, Copy, Filter, ChevronUp, ChevronDown,
  ArrowUpDown, Tag, Calendar, Building2, User, CheckCircle2,
  AlertTriangle, X, Save,
} from 'lucide-react';

// ============================================================
// Error Boundary
// ============================================================
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-700 rounded-xl m-4">
          <h2 className="font-bold">Erro inesperado</h2>
          <p className="text-sm mt-1">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================
// TIPOS
// ============================================================
type BudgetStatus = 'rascunho' | 'em_revisao' | 'enviado' | 'aprovado' | 'rejeitado' | 'expirado' | 'em_execucao' | 'concluido';

interface BudgetItem {
  unit_cost: number;
  margin: number;
  discount: number;
  quantity: number;
}

interface Company {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  full_name: string;
  email?: string;
}

interface Budget {
  id: string;
  ref: string;
  name: string;
  company?: Company;
  company_id: string;
  sector?: string;
  assignee?: Profile;
  assigned_to?: string | null;
  status: BudgetStatus;
  items: BudgetItem[];
  date: string;
  valid_until: string;
}

// ============================================================
// HELPERS
// ============================================================
function generateId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {}
  return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

function grandTotal(items: BudgetItem[]): number {
  return items?.reduce((s, i) => {
    const pvp = i.unit_cost * (1 + i.margin / 100);
    return s + pvp * (1 - i.discount / 100) * i.quantity;
  }, 0) || 0;
}

function formatCurrency(val: number): string {
  try {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(val);
  } catch {
    return `${val.toFixed(2)} €`;
  }
}

// ============================================================
// STATUS BADGE
// ============================================================
const STATUS_CONFIG: Record<BudgetStatus, { bg: string; text: string; dot: string }> = {
  rascunho: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  em_revisao: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  enviado: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  aprovado: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  rejeitado: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  expirado: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  em_execucao: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  concluido: { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-600' },
};

const STATUS_LABELS: Record<BudgetStatus, string> = {
  rascunho: 'Rascunho',
  em_revisao: 'Em revisão',
  enviado: 'Enviado ao comercial',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  expirado: 'Expirado',
  em_execucao: 'Em execução',
  concluido: 'Concluído',
};

const StatusBadge: React.FC<{ status: BudgetStatus }> = ({ status }) => {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.rascunho;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {STATUS_LABELS[status] || status}
    </span>
  );
};

// ============================================================
// EXPORTAÇÕES (mock)
// ============================================================
function exportToPDF(budget: Budget): void {
  const content = `Orçamento: ${budget.ref} - ${budget.name}\nCliente: ${budget.company?.name || 'N/A'}\nTotal: ${formatCurrency(grandTotal(budget.items))}\nEstado: ${STATUS_LABELS[budget.status] || budget.status}\nData: ${budget.date}`;
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${budget.ref}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToExcel(budget: Budget): void {
  const rows = [
    ['Ref', 'Nome', 'Cliente', 'Estado', 'Total', 'Data'],
    [budget.ref, budget.name, budget.company?.name || '', STATUS_LABELS[budget.status] || budget.status, formatCurrency(grandTotal(budget.items)), budget.date],
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${budget.ref}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// DADOS FIXOS
// ============================================================
const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'Construtora Nova Era' },
  { id: 'c2', name: 'EletroPlus' },
  { id: 'c3', name: 'Águas do Tejo' },
  { id: 'c4', name: 'TechPark' },
];

const MOCK_TEAM: Profile[] = [
  { id: 'u1', full_name: 'Carlos Silva', email: 'carlos@exemplo.pt' },
  { id: 'u2', full_name: 'Marta Oliveira', email: 'marta@exemplo.pt' },
  { id: 'u3', full_name: 'Rui Sousa', email: 'rui@exemplo.pt' },
];

const MOCK_BUDGETS: Budget[] = [
  {
    id: 'b1', ref: 'ORC-2026-001', name: 'Instalação Elétrica',
    company: MOCK_COMPANIES[1], company_id: 'c2', sector: 'Eletricidade',
    assignee: MOCK_TEAM[0], assigned_to: 'u1',
    status: 'aprovado',
    items: [{ unit_cost: 2500, margin: 20, discount: 5, quantity: 1 }],
    date: '2026-01-15', valid_until: '2026-02-28',
  },
  {
    id: 'b2', ref: 'ORC-2026-002', name: 'Manutenção de Rede',
    company: MOCK_COMPANIES[0], company_id: 'c1', sector: 'Construção',
    assignee: MOCK_TEAM[1], assigned_to: 'u2',
    status: 'enviado',
    items: [{ unit_cost: 1500, margin: 18, discount: 0, quantity: 3 }],
    date: '2026-02-10', valid_until: '2026-03-15',
  },
  {
    id: 'b3', ref: 'ORC-2026-003', name: 'Projeto AVAC',
    company: MOCK_COMPANIES[3], company_id: 'c4', sector: 'Climatização',
    assignee: MOCK_TEAM[2], assigned_to: 'u3',
    status: 'rascunho',
    items: [{ unit_cost: 8000, margin: 25, discount: 10, quantity: 1 }],
    date: '2026-03-01', valid_until: '2026-04-30',
  },
  {
    id: 'b4', ref: 'ORC-2026-004', name: 'Consultoria',
    company: MOCK_COMPANIES[2], company_id: 'c3', sector: 'Saneamento',
    assignee: undefined, assigned_to: null,
    status: 'rejeitado',
    items: [{ unit_cost: 1200, margin: 30, discount: 5, quantity: 2 }],
    date: '2026-04-05', valid_until: '2026-05-20',
  },
  {
    id: 'b5', ref: 'ORC-2026-005', name: 'Obra Pública',
    company: MOCK_COMPANIES[0], company_id: 'c1', sector: 'Construção',
    assignee: MOCK_TEAM[0], assigned_to: 'u1',
    status: 'em_execucao',
    items: [{ unit_cost: 45000, margin: 12, discount: 0, quantity: 1 }],
    date: '2026-05-20', valid_until: '2026-07-01',
  },
];

// ============================================================
// HOOKS REUTILIZÁVEIS
// ============================================================
function useDirtyTracking<T extends Record<string, unknown>>(current: T, original: T) {
  const [isDirty, setIsDirty] = useState(false);
  useEffect(() => {
    const dirty = Object.keys(original).some(key => current[key] !== original[key]);
    setIsDirty(dirty);
  }, [current, original]);
  return isDirty;
}

function useEscapeKey(onEscape: () => void, disabled = false) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disabled) onEscape();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onEscape, disabled]);
}

function useAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return ref;
}

// ============================================================
// COMPONENTES ATÓMICOS DO MODAL
// ============================================================
const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-[39.6rem] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    <button
      onClick={onClose}
      className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      aria-label="Fechar"
    >
      <X size={18} />
    </button>
  </div>
);

const ModalFooter: React.FC<{ onCancel: () => void; onSave: () => void; isDirty: boolean; saving: boolean }> = ({ onCancel, onSave, isDirty, saving }) => (
  <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
    <button
      onClick={onCancel}
      disabled={saving}
      className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30"
    >
      Cancelar
    </button>
    <button
      onClick={onSave}
      disabled={saving || !isDirty}
      className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      {saving ? (
        <React.Fragment>
          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          A guardar...
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Save size={16} />
          Guardar alterações
        </React.Fragment>
      )}
    </button>
  </div>
);

const Field: React.FC<{ label: string; id: string; children: React.ReactNode; error?: string | null }> = ({ label, id, children, error }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
    {children}
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={12} /> {error}</p>
    )}
  </div>
);

// ============================================================
// MODAL DE EDIÇÃO
// ============================================================
interface BudgetEditModalProps {
  budget: Budget;
  onClose: () => void;
  onSave: (updated: Budget) => void;
}

const BudgetEditModal: React.FC<BudgetEditModalProps> = ({ budget, onClose, onSave }) => {
  const [name, setName] = useState(budget.name);
  const [status, setStatus] = useState<BudgetStatus>(budget.status);
  const [validUntil, setValidUntil] = useState(budget.valid_until);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});
  const nameInputRef = useAutoFocus<HTMLInputElement>();

  const original = useMemo(() => ({
    name: budget.name,
    status: budget.status,
    validUntil: budget.valid_until,
  }), [budget]);

  const isDirty = useDirtyTracking({ name, status, validUntil }, original);

  const handleCloseWithConfirmation = useCallback(() => {
    if (isDirty && !saving) {
      const discard = window.confirm('Tens alterações não guardadas. Descartar?');
      if (!discard) return;
    }
    onClose();
  }, [isDirty, saving, onClose]);

  useEscapeKey(handleCloseWithConfirmation, saving);

  const validate = (): boolean => {
    const newErrors: { name?: string; date?: string } = {};
    if (!name.trim()) newErrors.name = 'Nome obrigatório.';
    if (!validUntil) newErrors.date = 'Data de validade obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      onSave({ ...budget, name: name.trim(), status, valid_until: validUntil });
      onClose();
    } catch {
      setErrors({ name: 'Erro ao guardar. Tenta novamente.' });
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = () => {
    if (!saving) handleCloseWithConfirmation();
  };

  return (
    <Modal open={true} onClose={handleBackdropClick}>
      <ModalHeader title="Editar Orçamento" onClose={handleCloseWithConfirmation} />
      <div className="px-6 py-5 space-y-5">
        <Field label="Nome" id="edit-name" error={errors.name}>
          <input
            ref={nameInputRef}
            id="edit-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Orçamento Q4"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 bg-white shadow-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 transition-all"
          />
        </Field>
        <Field label="Estado" id="edit-status">
          <select
            id="edit-status"
            value={status}
            onChange={e => setStatus(e.target.value as BudgetStatus)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white shadow-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 transition-all appearance-none bg-no-repeat bg-[right_0.75rem_center] pr-10"
            style={{ backgroundImage: `url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"%3E%3Cpath d="m6 9 6 6 6-6"/%3E%3C/svg%3E')` }}
          >
            {(Object.keys(STATUS_LABELS) as BudgetStatus[]).map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </Field>
        <Field label="Validade" id="edit-validity" error={errors.date}>
          <input
            id="edit-validity"
            type="date"
            value={validUntil}
            onChange={e => setValidUntil(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white shadow-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 transition-all"
          />
        </Field>
      </div>
      <ModalFooter onCancel={handleCloseWithConfirmation} onSave={handleSave} isDirty={isDirty} saving={saving} />
    </Modal>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL (com zoom 1.1 e prop onNew)
// ============================================================
type SortField = 'ref' | 'name' | 'client' | 'date' | 'total' | 'status';
type SortDir = 'asc' | 'desc';

const ActionBtn: React.FC<{ icon: React.ReactNode; onClick: () => void; danger?: boolean; title?: string }> = ({ icon, onClick, danger, title }) => (
  <button type="button" onClick={onClick} title={title} className={`p-1.5 rounded-lg transition-all ${danger ? 'text-slate-300 hover:text-red-600 hover:bg-red-50' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'}`}>
    {icon}
  </button>
);

const StatCard: React.FC<{ icon: React.ReactNode; bg: string; label: string; value: string; valueClass?: string }> = ({ icon, bg, label, value, valueClass = 'text-slate-900' }) => (
  <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3">
    <div className={`w-10 h-10 ${bg} rounded-2xl flex items-center justify-center`}>{icon}</div>
    <div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className={`text-lg font-black ${valueClass}`}>{value}</p>
    </div>
  </div>
);

interface BudgetListProps {
  onNew?: () => void;
  budgets?: Budget[];
  onOpen?: (budget: Budget) => void;
  onApprove?: (budget: Budget) => void;
}

const BudgetListContent: React.FC<BudgetListProps> = ({ onNew, budgets: initialBudgets, onOpen, onApprove }) => {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets ?? MOCK_BUDGETS);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const isClient = false;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [detailsBudget, setDetailsBudget] = useState<Budget | null>(null);

  useEffect(() => {
    if (initialBudgets) setBudgets(initialBudgets);
  }, [initialBudgets]);

  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }, [sortField]);

  const filtered = useMemo(() => {
    const list = budgets.filter(b => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.ref.toLowerCase().includes(q) || b.name.toLowerCase().includes(q) || (b.company?.name || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'ref') cmp = a.ref.localeCompare(b.ref);
      else if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'client') cmp = (a.company?.name || '').localeCompare(b.company?.name || '');
      else if (sortField === 'date') {
        const da = new Date(a.date);
        const db = new Date(b.date);
        cmp = (isNaN(da.getTime()) ? 0 : da.getTime()) - (isNaN(db.getTime()) ? 0 : db.getTime());
      }
      else if (sortField === 'total') cmp = grandTotal(a.items || []) - grandTotal(b.items || []);
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [budgets, search, statusFilter, sortField, sortDir]);

  const summaryStats = useMemo(() => {
    const total = filtered.reduce((s, b) => s + grandTotal(b.items || []), 0);
    const approved = filtered.filter(b => b.status === 'aprovado').length;
    const expired = filtered.filter(b => {
      if (!b.valid_until) return false;
      const d = new Date(b.valid_until);
      if (isNaN(d.getTime())) return false;
      return d < new Date() && !['aprovado', 'concluido'].includes(b.status);
    }).length;
    return { total, approved, expired, count: filtered.length };
  }, [filtered]);

  const SortHeader: React.FC<{ field: SortField; label: string; className?: string }> = ({ field, label, className = '' }) => {
    const active = sortField === field;
    return (
      <th onClick={() => toggleSort(field)} className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-slate-700 select-none whitespace-nowrap transition-colors ${active ? 'text-blue-600' : 'text-slate-400'} ${className}`}>
        <span className="inline-flex items-center gap-1">
          {label}
          {active ? (sortDir === 'asc' ? <ChevronUp size={10} className="text-blue-600" /> : <ChevronDown size={10} className="text-blue-600" />) : <ArrowUpDown size={9} className="opacity-30" />}
        </span>
      </th>
    );
  };

  const handleNew = useCallback(() => {
    // Se a prop onNew foi passada, chama-a (ex.: navegar para o BudgetEditor)
    if (onNew) {
      onNew();
      return;
    }
    // Caso contrário, cria um orçamento local de demonstração
    const newBudget: Budget = {
      id: generateId(),
      ref: `ORC-${new Date().getFullYear()}-${String(budgets.length + 1).padStart(3, '0')}`,
      name: 'Novo Orçamento',
      company: MOCK_COMPANIES[0],
      company_id: MOCK_COMPANIES[0].id,
      sector: 'Geral',
      assignee: undefined,
      assigned_to: null,
      status: 'rascunho',
      items: [],
      date: new Date().toISOString().slice(0, 10),
      valid_until: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10),
    };
    setBudgets(prev => [newBudget, ...prev]);
  }, [budgets.length, onNew]);

  const handleEdit = useCallback((b: Budget) => setEditingBudget(b), []);
  const handleRowOpen = useCallback((b: Budget) => {
    if (onOpen) onOpen(b);
    else setDetailsBudget(b);
  }, [onOpen]);
  const handleSaveEdit = useCallback((updated: Budget) => {
    setBudgets(prev => prev.map(b => b.id === updated.id ? updated : b));
    setEditingBudget(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  }, []);

  const handleDuplicate = useCallback((b: Budget) => {
    const dup: Budget = {
      ...b,
      id: generateId(),
      ref: `ORC-${new Date().getFullYear()}-${String(budgets.length + 1).padStart(3, '0')}`,
      name: `${b.name} (cópia)`,
      status: 'rascunho',
      date: new Date().toISOString().slice(0, 10),
      items: b.items.map(item => ({ ...item })),
    };
    setBudgets(prev => [dup, ...prev]);
  }, [budgets.length]);

  if (!budgets) return <div className="p-6">Erro ao carregar dados.</div>;

  return (
    <div className="p-6 sm:p-8 space-y-5 max-w-7xl mx-auto" style={{ zoom: 1.1 }}>
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orçamentos</h1>
          <p className="text-sm text-slate-400 mt-0.5">{budgets.length} orçamento{budgets.length !== 1 ? 's' : ''} no total</p>
        </div>
        {!isClient && (
          <button onClick={handleNew} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2">
            <Plus size={16} /> Novo Orçamento
          </button>
        )}
      </div>

      {/* Mini dashboard */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={<FileText size={16} className="text-blue-600" />} bg="bg-blue-50" label="Orçamentos filtrados" value={summaryStats.count.toString()} />
          <StatCard icon={<CheckCircle2 size={16} className="text-emerald-600" />} bg="bg-emerald-50" label="Aprovados" value={summaryStats.approved.toString()} valueClass="text-emerald-700" />
          <StatCard icon={<AlertTriangle size={16} className="text-amber-600" />} bg="bg-amber-50" label="Atrasados" value={summaryStats.expired.toString()} valueClass="text-amber-700" />
          <StatCard icon={<Tag size={16} className="text-cyan-600" />} bg="bg-cyan-50" label="Volume total" value={formatCurrency(summaryStats.total)} />
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-56 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Pesquisar ref, nome, cliente..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setStatusFilter('all')} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${statusFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>Todos</button>
          {(Object.keys(STATUS_CONFIG) as BudgetStatus[]).map(status => {
            const c = STATUS_CONFIG[status] || STATUS_CONFIG.rascunho;
            const active = statusFilter === status;
            return (
              <button key={status} onClick={() => setStatusFilter(active ? 'all' : status)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${active ? `${c.bg} ${c.text} shadow-sm` : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
                {STATUS_LABELS[status] || status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Filter size={22} className="text-slate-300" />
            </div>
            <p className="font-semibold text-slate-600 text-sm">{budgets.length === 0 ? 'Sem orçamentos' : 'Nenhum resultado'}</p>
            <p className="text-slate-400 text-xs mt-1">{budgets.length === 0 ? 'Crie o seu primeiro orçamento' : 'Tente ajustar os filtros'}</p>
            {budgets.length === 0 && !isClient && (
              <button onClick={handleNew} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 inline-flex items-center gap-2">
                <Plus size={14} /> Criar primeiro orçamento
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <SortHeader field="ref" label="Ref" />
                  <SortHeader field="name" label="Nome" className="min-w-36" />
                  <SortHeader field="client" label="Cliente" />
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Setor</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Resp.</th>
                  <SortHeader field="status" label="Estado" />
                  <SortHeader field="total" label="Total" />
                  <SortHeader field="date" label="Data" />
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Validade</th>
                  {!isClient && <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 w-36">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const total = grandTotal(b.items || []);
                  const validDate = b.valid_until ? new Date(b.valid_until) : null;
                  const expired = validDate && !isNaN(validDate.getTime()) && validDate < new Date() && !['aprovado', 'concluido'].includes(b.status);
                  const isHovered = hoveredRow === b.id;
                  return (
                    <tr key={b.id} onClick={() => handleRowOpen(b)} onMouseEnter={() => setHoveredRow(b.id)} onMouseLeave={() => setHoveredRow(null)} className="border-b border-slate-50 hover:bg-blue-50/30 cursor-pointer transition-colors">
                      <td className="px-4 py-3.5"><span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{b.ref}</span></td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800 max-w-44"><span className="block truncate">{b.name}</span></td>
                      <td className="px-4 py-3.5 text-xs text-slate-600">{b.company?.name ? <span className="flex items-center gap-1.5"><Building2 size={11} className="text-slate-400 flex-shrink-0" /><span className="truncate max-w-28">{b.company.name}</span></span> : <span className="text-slate-300">—</span>}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 max-w-24"><span className="block truncate">{b.sector || '—'}</span></td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{b.assignee?.full_name ? <span className="flex items-center gap-1.5"><User size={10} className="text-slate-400" />{b.assignee.full_name.split(' ')[0]}</span> : <span className="text-slate-300">—</span>}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">{formatCurrency(total)}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-500"><span className="flex items-center gap-1"><Calendar size={10} className="text-slate-400" />{new Date(b.date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span></td>
                      <td className={`px-4 py-3.5 text-xs ${expired ? 'text-red-600 font-bold' : 'text-slate-500'}`}><span className="flex items-center gap-1">{expired && <AlertTriangle size={10} className="text-red-500" />}{validDate ? validDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'}</span></td>
                      {!isClient && (
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <div className={`flex gap-0.5 justify-center transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <ActionBtn icon={<Edit3 size={13} />} title="Editar" onClick={() => handleEdit(b)} />
                            {onApprove && ['em_revisao', 'aprovado'].includes(b.status) && (
                              <button type="button" onClick={() => onApprove(b)} title="Validar e entregar ao comercial" className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold hover:bg-emerald-100">Validar</button>
                            )}
                            <ActionBtn icon={<Copy size={13} />} title="Duplicar" onClick={() => handleDuplicate(b)} />
                            <ActionBtn icon={<Download size={13} />} title="Exportar PDF" onClick={() => exportToPDF(b)} />
                            <ActionBtn icon={<FileSpreadsheet size={13} />} title="Exportar Excel" onClick={() => exportToExcel(b)} />
                            <ActionBtn icon={<Trash2 size={13} />} title="Eliminar" onClick={() => { if (confirm(`Eliminar "${b.name}"?`)) handleDelete(b.id); }} danger />
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detailsBudget && (
        <Modal open={true} onClose={() => setDetailsBudget(null)}>
          <ModalHeader title={`${detailsBudget.ref} · ${detailsBudget.name}`} onClose={() => setDetailsBudget(null)} />
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between"><StatusBadge status={detailsBudget.status} /><span className="font-black text-slate-900">{formatCurrency(grandTotal(detailsBudget.items || []))}</span></div>
            <div className="grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-400">Cliente</p><p className="font-semibold text-slate-700 mt-1">{detailsBudget.company?.name || 'Sem cliente'}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-400">Validade</p><p className="font-semibold text-slate-700 mt-1">{detailsBudget.valid_until || '—'}</p></div></div>
            <div className="rounded-xl border border-slate-100 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Fluxo de validação</p><div className="flex items-center gap-2 text-xs text-slate-600"><span className="size-2 rounded-full bg-violet-500" /> Avaliador definido <ChevronDown size={12} className="rotate-[-90deg] text-slate-300" /><span className="size-2 rounded-full bg-emerald-500" /> Comercial recebe após validação</div></div>
            {onApprove && ['em_revisao', 'aprovado'].includes(detailsBudget.status) && <button onClick={() => { onApprove(detailsBudget); setDetailsBudget(null); }} className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700">Validar e entregar ao comercial</button>}
          </div>
        </Modal>
      )}

      {/* Modal de edição */}
      {editingBudget && (
        <BudgetEditModal
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

// ============================================================
// Exportação principal
// ============================================================
export function BudgetList({ onNew, budgets, onOpen, onApprove }: BudgetListProps) {
  return (
    <ErrorBoundary>
      <BudgetListContent onNew={onNew} budgets={budgets} onOpen={onOpen} onApprove={onApprove} />
    </ErrorBoundary>
  );
}
