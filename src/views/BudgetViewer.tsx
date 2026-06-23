// =============================================================================
// FICHEIRO ÚNICO: BudgetViewer.tsx (SEM PARTILHAR + SIDEBAR MELHORADA + ADD ITEM)
// =============================================================================
import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  ArrowLeft, Printer, Package,
  CheckCircle2, XCircle, Circle, Plus,
  Clock3, Send, Hash, QrCode,
  MessageSquare, Sparkles, Zap,
  TrendingUp, Info,
  CheckCheck, Edit3, Save,
  Mail, Phone, MapPin, Building2, Calendar, Clock,
} from 'lucide-react';

// =============================================================================
// TIPOS (inalterados)
// =============================================================================
export type BudgetStatus = 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'em_execucao' | 'concluido';

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  nif?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
}

export interface BudgetItem {
  unit_cost: number;
  margin: number;
  discount: number;
  quantity: number;
  description?: string;
  sku?: string;
}

export interface Budget {
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
  created_at?: string;
  updated_at?: string;
  notes?: string;
}

// =============================================================================
// UTILITÁRIOS SEGUROS (anti‑NaN)
// =============================================================================
function safeNumber(val: any, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

export function formatCurrency(val: number): string {
  const safeVal = safeNumber(val, 0);
  try {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(safeVal);
  } catch {
    return `${safeVal.toFixed(2)} €`;
  }
}

function calcSubtotal(item: BudgetItem): number {
  const unit = safeNumber(item.unit_cost, 0);
  const margin = safeNumber(item.margin, 0);
  const discount = safeNumber(item.discount, 0);
  const qty = safeNumber(item.quantity, 0);
  const base = unit * (1 + margin / 100);
  const discounted = base * (1 - discount / 100);
  return discounted * qty;
}

function grandTotal(items: BudgetItem[]): number {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, i) => sum + calcSubtotal(i), 0);
}

// =============================================================================
// CONSTANTES DE CORES (tema Sidebar)
// =============================================================================
const STATUS_COLORS: Record<BudgetStatus, string> = {
  rascunho: '#94a3b8',
  enviado: '#3b82f6',
  aprovado: '#10b981',
  rejeitado: '#ef4444',
  em_execucao: '#f59e0b',
  concluido: '#7c3aed',
};

const STATUS_LABELS: Record<BudgetStatus, string> = {
  rascunho: 'Rascunho',
  enviado: 'Enviado',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  em_execucao: 'Em Execução',
  concluido: 'Concluído',
};

const STATUS_ICONS: Record<BudgetStatus, React.FC<{ size?: number; className?: string }>> = {
  rascunho: Circle,
  enviado: Send,
  aprovado: CheckCircle2,
  rejeitado: XCircle,
  em_execucao: Clock3,
  concluido: CheckCheck,
};

const STEP_ORDER: BudgetStatus[] = ['rascunho', 'enviado', 'aprovado', 'em_execucao', 'concluido'];

// =============================================================================
// SUBCOMPONENTES (mantidos, mas ShareModal removido)
// =============================================================================
const StatusStepper: React.FC<{ currentStatus: BudgetStatus }> = ({ currentStatus }) => {
  const currentIdx = STEP_ORDER.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-2 w-full overflow-x-auto py-2 px-1">
      {STEP_ORDER.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const Icon = STATUS_ICONS[step] || Circle;
        const color = STATUS_COLORS[step] || '#94a3b8';
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5 min-w-[70px] group">
              <div
                className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-500 ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200/50'
                    : isCurrent
                    ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-lg shadow-blue-200/50 ring-4 ring-blue-100/60'
                    : 'border-slate-200 bg-white text-slate-300 group-hover:border-slate-300'
                }`}
                title={STATUS_LABELS[step] || step}
              >
                <Icon size={16} strokeWidth={2.5} />
                {isCompleted && <CheckCircle2 size={12} className="absolute -top-1 -right-1 text-emerald-600 bg-white rounded-full" />}
                {isCurrent && <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping-slow" />}
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap transition-colors ${
                isCurrent ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {STATUS_LABELS[step] || step}
              </span>
            </div>
            {idx < STEP_ORDER.length - 1 && (
              <div className={`flex-1 h-0.5 rounded-full transition-all duration-700 ${
                idx < currentIdx ? 'bg-emerald-400' : idx === currentIdx ? 'bg-gradient-to-r from-emerald-400 to-slate-200' : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const ProgressBar: React.FC<{ value: number; max: number; color?: string; label?: string }> = ({
  value, max, color = '#3b82f6', label
}) => {
  const safeMax = max === 0 ? 1 : max;
  const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100));
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between text-xs text-slate-500">
          <span>{label}</span>
          <span className="font-mono font-medium text-slate-700">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%`, backgroundColor: color, boxShadow: `0 0 12px ${color}60` }} />
      </div>
    </div>
  );
};

// =============================================================================
// LEITURA / ESCRITA NO LOCALSTORAGE
// =============================================================================
const STORAGE_PREFIX = 'budget_';

function loadBudgetFromStorage(id: string): Budget | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.items) parsed.items = [];
    return parsed;
  } catch {
    return null;
  }
}

function saveBudgetToStorage(budget: Budget): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${budget.id}`, JSON.stringify(budget));
  } catch (e) {
    console.warn('Falha ao guardar no localStorage', e);
  }
}

// =============================================================================
// NORMALIZAÇÃO (unit_price → unit_cost, etc.)
// =============================================================================
function normalizeBudget(raw: any): Budget {
  return {
    ...raw,
    items: (raw.items || []).map((item: any) => ({
      unit_cost: safeNumber(item.unit_price ?? item.unit_cost, 0),
      margin: safeNumber(item.margin, 0),
      discount: safeNumber(item.discount, 0),
      quantity: safeNumber(item.quantity, 1),
      description: item.description || '',
      sku: item.sku || '',
    })),
  };
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================
interface BudgetViewerProps {
  budget: Budget;
  onBack: () => void;
  onUpdate?: (updatedBudget: Budget) => void;
  issuer?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    logo?: string;
    website?: string;
    taxId?: string;
    companyRegNumber?: string;
  };
  showQRCode?: boolean;
  watermarkStatus?: boolean;
}

export const BudgetViewer: React.FC<BudgetViewerProps> = ({
  budget: initialBudget,
  onBack,
  onUpdate,
  issuer,
  showQRCode = true,
  watermarkStatus = true,
}) => {
  const normalizedInitial = useMemo(() => normalizeBudget(initialBudget), [initialBudget]);

  const [budget, setBudget] = useState<Budget>(() => {
    const stored = loadBudgetFromStorage(initialBudget.id);
    if (stored) {
      return normalizeBudget(stored);
    }
    return normalizedInitial;
  });

  const [editing, setEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState<'full' | 'compact' | 'detailed'>('full');
  const [savedRows, setSavedRows] = useState<number[]>([]);
  const [dirtyRows, setDirtyRows] = useState<number[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editing) {
      const stored = loadBudgetFromStorage(initialBudget.id);
      if (!stored) {
        setBudget(normalizedInitial);
      }
      setDirtyRows([]);
    }
  }, [normalizedInitial, editing]);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const saveBudget = useCallback((updatedBudget: Budget) => {
    setBudget(updatedBudget);
    saveBudgetToStorage(updatedBudget);
    showToast('Orçamento guardado com sucesso', 'success');
    onUpdate?.(updatedBudget);
  }, [onUpdate, showToast]);

  const handleStartEdit = () => {
    setEditing(true);
    setDirtyRows([]);
  };

  const handleCancelEdit = () => {
    const stored = loadBudgetFromStorage(initialBudget.id);
    if (stored) {
      setBudget(normalizeBudget(stored));
    } else {
      setBudget(normalizedInitial);
    }
    setEditing(false);
    setDirtyRows([]);
    showToast('Alterações descartadas', 'info');
  };

  const handleSaveEdit = () => {
    const now = new Date().toISOString();
    const updated = { ...budget, updated_at: now };
    saveBudget(updated);
    setEditing(false);
    setSavedRows([...dirtyRows]);
    setDirtyRows([]);
    setTimeout(() => setSavedRows([]), 2000);
  };

  const handleApprove = () => {
    const updated = { ...budget, status: 'aprovado' as BudgetStatus, updated_at: new Date().toISOString() };
    saveBudget(updated);
  };
  const handleSend = () => {
    const updated = { ...budget, status: 'enviado' as BudgetStatus, updated_at: new Date().toISOString() };
    saveBudget(updated);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(prev => ({ ...prev, name: e.target.value }));
  };
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBudget(prev => ({ ...prev, notes: e.target.value }));
  };

  const handleItemChange = (index: number, field: keyof BudgetItem, value: string | number) => {
    setBudget(prev => {
      const newItems = [...prev.items];
      const item = { ...newItems[index] };
      if (field === 'description' || field === 'sku') {
        (item as any)[field] = value;
      } else {
        (item as any)[field] = safeNumber(value, 0);
      }
      newItems[index] = item;
      return { ...prev, items: newItems };
    });
    setDirtyRows(prev => prev.includes(index) ? prev : [...prev, index]);
  };

  // Adicionar novo item
  const addNewItem = () => {
    const newItem: BudgetItem = {
      unit_cost: 0,
      margin: 0,
      discount: 0,
      quantity: 1,
      description: '',
      sku: '',
    };
    setBudget(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    // Marcar a nova linha como suja
    const newIdx = items.length;
    setDirtyRows(prev => [...prev, newIdx]);
  };

  const items = budget.items || [];
  const subtotal = useMemo(() => grandTotal(items), [items]);
  const totalTax = subtotal * 0.23;
  const totalWithTax = subtotal + totalTax;

  const statusColor = STATUS_COLORS[budget.status] || '#94a3b8';
  const StatusIconComponent = STATUS_ICONS[budget.status] || Circle;

  const dateStr = budget.date
    ? new Date(budget.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  const validUntil = budget.valid_until
    ? new Date(budget.valid_until).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  const updatedAtStr = budget.updated_at
    ? new Date(budget.updated_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  let daysUntilExpiry = 0;
  try {
    if (budget.valid_until) {
      const validDate = new Date(budget.valid_until);
      if (!isNaN(validDate.getTime())) {
        daysUntilExpiry = Math.max(0, Math.ceil((validDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      }
    }
  } catch (e) { /* mantém 0 */ }

  const handlePrint = useCallback(() => window.print(), []);

  const mainGridClass = previewMode === 'compact'
    ? 'grid grid-cols-1 gap-6 items-start'
    : 'grid grid-cols-1 lg:grid-cols-4 gap-6 items-start';

  const docColSpan = previewMode === 'compact' ? '' : 'lg:col-span-3';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8 animate-fade-in font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Toast notification */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 animate-slide-up">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md ${
              toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-blue-500/90 text-white'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
              <span className="text-sm font-semibold">{toast.message}</span>
            </div>
          </div>
        )}

        {/* Barra superior (SEM Partilhar) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200/60 shadow-lg print:hidden sticky top-4 z-40">
          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group p-2 rounded-xl hover:bg-slate-100">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="flex bg-slate-100/80 rounded-xl p-0.5 gap-0.5">
              {(['full', 'compact', 'detailed'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    previewMode === mode ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {mode === 'full' ? 'Normal' : mode === 'compact' ? 'Compacto' : 'Detalhado'}
                </button>
              ))}
            </div>
            {!editing ? (
              <button onClick={handleStartEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition-colors shadow-sm">
                <Edit3 size={14} /> Editar
              </button>
            ) : (
              <>
                <button onClick={handleSaveEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200/50">
                  <Save size={14} /> Guardar
                </button>
                <button onClick={handleCancelEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Apenas o botão Imprimir */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md shadow-blue-200/50"
            >
              <Printer size={15} /> <span className="hidden md:inline">Imprimir</span>
            </button>
          </div>
        </div>

        {/* Grelha principal */}
        <div className={mainGridClass}>
          {/* Documento */}
          <div
            ref={printableRef}
            id="printable-document"
            className={`${docColSpan} bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden print:shadow-none print:border-none print:p-0 transition-all duration-300 ${
              previewMode === 'compact' ? 'text-sm' : ''
            }`}
          >
            {/* Watermark */}
            {watermarkStatus && budget.status === 'rascunho' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] z-0">
                <span className="text-9xl font-black text-slate-900 rotate-[-15deg] tracking-widest">RASCUNHO</span>
              </div>
            )}

            {/* Cabeçalho */}
            <div className="relative p-5 md:p-6 border-b border-slate-100 bg-gradient-to-br from-blue-50/40 to-white">
              <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                <div className="flex items-start gap-4">
                  {issuer?.logo ? (
                    <img src={issuer.logo} alt="Logo" className="h-14 w-14 object-contain rounded-xl border border-slate-200 p-1 bg-white shadow-sm" />
                  ) : (
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg flex items-center justify-center text-white text-xl font-bold">B</div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-blue-700 tracking-tight">{issuer?.name || 'BudgetGest Pro'}</h2>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5"><Building2 size={13} className="text-blue-400" /> {issuer?.name || 'Empresa Exemplar, Lda.'}</p>
                    {issuer?.taxId && <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1"><Hash size={12} className="text-blue-400" /> NIF: {issuer.taxId}</p>}
                    {issuer?.email && <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1"><Mail size={12} className="text-blue-400" /> {issuer.email}</p>}
                    {issuer?.phone && <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1"><Phone size={12} className="text-blue-400" /> {issuer.phone}</p>}
                    {issuer?.address && <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1"><MapPin size={12} className="text-blue-400" /> {issuer.address}</p>}
                  </div>
                </div>
                <div className="text-left md:text-right space-y-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 flex-wrap md:justify-end">
                    <div className="inline-flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/40">
                      <span className="font-mono text-xs font-bold text-slate-700 tracking-wider">{budget.ref}</span>
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg shadow-sm uppercase tracking-wide"
                        style={{ backgroundColor: `${statusColor}18`, color: statusColor }}
                      >
                        <StatusIconComponent size={12} /> {STATUS_LABELS[budget.status] || budget.status}
                      </span>
                    </div>
                    {showQRCode && (
                      <div className="hidden md:block bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm hover:rotate-6 transition-transform duration-300">
                        <QrCode size={30} className="text-slate-700" />
                      </div>
                    )}
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      value={budget.name}
                      onChange={handleNameChange}
                      className="text-2xl md:text-3xl font-extrabold text-slate-900 bg-transparent border-b-2 border-blue-300 focus:outline-none focus:border-blue-500 w-full md:text-right"
                    />
                  ) : (
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">{budget.name}</h1>
                  )}
                  <div className="flex flex-wrap items-center md:justify-end gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-blue-400" /> Emitido: <strong className="text-slate-700 font-medium">{dateStr}</strong></span>
                    <span className="flex items-center gap-1"><Clock size={12} className="text-blue-400" /> Válido até: <strong className="text-slate-700 font-medium">{validUntil}</strong></span>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-200/60">
                <StatusStepper currentStatus={budget.status} />
              </div>
            </div>

            {/* Informações extra (apenas normal/detalhado) */}
            {previewMode !== 'compact' && (
              <div className="px-5 md:px-6 py-3 bg-slate-50/60 border-b border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600">
                <div><span className="text-slate-400">Cliente</span><p className="font-medium text-slate-800">{budget.company?.name || '—'}</p></div>
                <div><span className="text-slate-400">Setor</span><p className="font-medium text-slate-800">{budget.sector || '—'}</p></div>
                <div><span className="text-slate-400">Responsável</span><p className="font-medium text-slate-800">{budget.assignee?.full_name || '—'}</p></div>
                <div><span className="text-slate-400">Validade</span><p className={`font-medium ${daysUntilExpiry <= 7 && daysUntilExpiry > 0 ? 'text-amber-600' : daysUntilExpiry === 0 ? 'text-red-600' : 'text-slate-800'}`}>{validUntil}</p></div>
              </div>
            )}

            {/* Tabela de Itens + Adicionar Item */}
            <div className="p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Package size={18} className="text-blue-500" />
                  <h3 className="font-bold text-slate-800 tracking-tight text-lg">Itens do Orçamento</h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">{items.length}</span>
                </div>
                {previewMode === 'detailed' && <span className="text-[11px] text-slate-400 font-medium">Preços em EUR · IVA incluído quando aplicável</span>}
              </div>

              {items.length === 0 && !editing ? (
                <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <Package size={36} className="mx-auto mb-3 text-slate-300 stroke-[1.5]" />
                  <p className="font-semibold text-sm text-slate-600">Nenhum item adicionado</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-xl border border-slate-200/60 shadow-sm bg-white">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-left">
                          <th className="px-3 py-2.5 font-semibold text-slate-600 w-8 text-center">#</th>
                          <th className="px-3 py-2.5 font-semibold text-slate-600 min-w-36">Descrição</th>
                          {previewMode !== 'compact' && (
                            <>
                              <th className="px-3 py-2.5 font-semibold text-slate-600 text-right">Qtd.</th>
                              <th className="px-3 py-2.5 font-semibold text-slate-600 text-right">Custo Un.</th>
                              <th className="px-3 py-2.5 font-semibold text-slate-600 text-right">Margem</th>
                              <th className="px-3 py-2.5 font-semibold text-slate-600 text-right">Desc.</th>
                            </>
                          )}
                          <th className="px-3 py-2.5 font-semibold text-slate-600 text-right">Total</th>
                          {previewMode === 'detailed' && <th className="px-3 py-2.5 font-semibold text-slate-600 text-right">Subtotal</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map((item, idx) => {
                          const subtotalItem = calcSubtotal(item);
                          const isDirty = dirtyRows.includes(idx);
                          const wasSaved = savedRows.includes(idx);
                          
                          let rowClasses = 'transition-all duration-300 group';
                          if (wasSaved) {
                            rowClasses += ' bg-emerald-100 scale-[1.02] shadow-inner';
                          } else if (isDirty && editing) {
                            rowClasses += ' bg-blue-100/60';
                          } else {
                            rowClasses += ' even:bg-slate-50/30 hover:bg-blue-50/30';
                          }

                          return (
                            <tr key={idx} className={rowClasses}>
                              <td className="px-3 py-3 text-slate-400 font-mono text-xs text-center">
                                {wasSaved ? (
                                  <CheckCircle2 size={14} className="text-emerald-500 mx-auto animate-pulse-slow" />
                                ) : (
                                  idx + 1
                                )}
                              </td>
                              <td className="px-3 py-3">
                                {editing && previewMode !== 'compact' ? (
                                  <input
                                    type="text"
                                    value={item.description || ''}
                                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                                    className="w-full bg-transparent border-b border-slate-300 text-slate-800 font-medium text-xs focus:outline-none focus:border-blue-500"
                                    placeholder="Descrição"
                                  />
                                ) : (
                                  <>
                                    <div className="font-medium text-slate-800">{item.description || `Item ${idx + 1}`}</div>
                                    {item.sku && previewMode !== 'compact' && <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>}
                                  </>
                                )}
                              </td>
                              {previewMode !== 'compact' && (
                                <>
                                  <td className="px-3 py-3 text-right">
                                    {editing ? (
                                      <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                                        className="w-16 text-right bg-transparent border-b border-slate-300 font-mono font-medium text-slate-700 text-xs focus:outline-none focus:border-blue-500"
                                      />
                                    ) : (
                                      <span className="font-mono font-medium text-slate-700">{item.quantity}</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-3 text-right">
                                    {editing ? (
                                      <input
                                        type="number"
                                        value={item.unit_cost}
                                        onChange={(e) => handleItemChange(idx, 'unit_cost', e.target.value)}
                                        className="w-20 text-right bg-transparent border-b border-slate-300 font-mono text-slate-600 text-xs focus:outline-none focus:border-blue-500"
                                      />
                                    ) : (
                                      <span className="font-mono text-slate-600">{formatCurrency(item.unit_cost)}</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-3 text-right">
                                    {editing ? (
                                      <div className="flex items-center justify-end gap-1">
                                        <input
                                          type="number"
                                          value={item.margin}
                                          onChange={(e) => handleItemChange(idx, 'margin', e.target.value)}
                                          className="w-14 text-right bg-transparent border-b border-slate-300 font-mono text-emerald-600 text-xs focus:outline-none focus:border-emerald-500"
                                        />
                                        <span>%</span>
                                      </div>
                                    ) : (
                                      <span className="font-mono text-emerald-600 font-medium">{item.margin}%</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-3 text-right">
                                    {editing ? (
                                      <div className="flex items-center justify-end gap-1">
                                        <input
                                          type="number"
                                          value={item.discount}
                                          onChange={(e) => handleItemChange(idx, 'discount', e.target.value)}
                                          className="w-14 text-right bg-transparent border-b border-slate-300 font-mono text-amber-600 text-xs focus:outline-none focus:border-amber-500"
                                        />
                                        <span>%</span>
                                      </div>
                                    ) : (
                                      <span className="font-mono text-amber-600 font-medium">{item.discount}%</span>
                                    )}
                                  </td>
                                </>
                              )}
                              <td className="px-3 py-3 text-right font-bold text-slate-900 font-mono">
                                {formatCurrency(subtotalItem)}
                              </td>
                              {previewMode === 'detailed' && (
                                <td className="px-3 py-3 text-right font-bold text-slate-900 font-mono">
                                  {formatCurrency(subtotalItem)}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Botão Adicionar Item (só no modo edição) */}
                  {editing && (
                    <button
                      onClick={addNewItem}
                      className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 active:bg-blue-200 transition-colors shadow-sm"
                    >
                      <Plus size={16} />
                      Adicionar Item
                    </button>
                  )}
                </>
              )}

              {/* Bloco de Totais */}
              {items.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
                  <div className="w-full sm:w-72 bg-gradient-to-br from-white to-blue-50/40 rounded-xl p-5 space-y-2 border border-blue-100/60 shadow-md">
                    {previewMode !== 'compact' ? (
                      <>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>Subtotal (sem IVA)</span>
                          <span className="font-mono font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>IVA (23%)</span>
                          <span className="font-mono font-semibold text-slate-800">{formatCurrency(totalTax)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-extrabold text-blue-700 border-t-2 border-blue-200 pt-2 mt-1">
                          <span>Total Global</span>
                          <span className="font-mono text-xl text-blue-600">{formatCurrency(totalWithTax)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-800">Total</span>
                        <span className="font-mono text-xl font-extrabold text-blue-600">{formatCurrency(totalWithTax)}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 text-right border-t border-slate-100 pt-1 mt-1">
                      Ref: <span className="font-mono">{budget.ref}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notas (apenas normal/detalhado) */}
              {previewMode !== 'compact' && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                    <MessageSquare size={14} className="text-blue-400" /> Notas
                  </div>
                  {editing ? (
                    <textarea
                      value={budget.notes || ''}
                      onChange={handleNotesChange}
                      className="w-full text-sm text-slate-700 bg-white border border-slate-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 resize-none"
                      rows={3}
                      placeholder="Adicionar notas..."
                    />
                  ) : (
                    budget.notes ? (
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{budget.notes}</p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">Sem notas</p>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="px-5 md:px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 gap-1">
              <div className="flex items-center gap-2"><Sparkles size={11} className="text-blue-400" /> Gerado via BudgetGest Pro</div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-slate-500">Validade: {validUntil}</span>
                {daysUntilExpiry > 0 && daysUntilExpiry <= 7 && (
                  <span className="text-amber-500 font-bold animate-pulse-slow">Expira em {daysUntilExpiry} dias</span>
                )}
                {daysUntilExpiry === 0 && <span className="text-red-500 font-bold">Expirado</span>}
                {updatedAtStr && <span className="text-slate-400">Atualizado: {updatedAtStr}</span>}
              </div>
            </div>
          </div>

          {/* Sidebar (melhorada com sticky) */}
          {previewMode !== 'compact' && (
            <div className="space-y-5 print:hidden sticky top-24 self-start">
              {budget.company && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    <Building2 size={16} className="text-blue-400" /> Cliente
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900">{budget.company.name}</h4>
                    {budget.company.email && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Mail size={13} className="text-blue-400 shrink-0" /> {budget.company.email}
                      </div>
                    )}
                    {budget.company.phone && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Phone size={13} className="text-blue-400 shrink-0" /> {budget.company.phone}
                      </div>
                    )}
                    {budget.company.address && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <MapPin size={13} className="text-blue-400 shrink-0" /> {budget.company.address}
                      </div>
                    )}
                    {budget.company.nif && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Hash size={13} className="text-blue-400 shrink-0" /> NIF: {budget.company.nif}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {previewMode === 'detailed' && items.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <TrendingUp size={16} className="text-blue-400" /> Progresso
                  </div>
                  <ProgressBar value={subtotal} max={totalWithTax} color={statusColor} label="Subtotal / Total" />
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="p-3 bg-slate-50/80 rounded-xl">
                      <p className="text-slate-400">Itens</p>
                      <p className="font-bold text-slate-800 text-lg">{items.length}</p>
                    </div>
                    <div className="p-3 bg-slate-50/80 rounded-xl">
                      <p className="text-slate-400">Total</p>
                      <p className="font-bold text-slate-800 text-lg">{formatCurrency(totalWithTax)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm space-y-2">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider"><Zap size={16} className="text-blue-400" /> Ações</div>
                <button
                  onClick={handleApprove}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-200/50"
                >
                  <CheckCircle2 size={15} /> Aprovar
                </button>
                <button
                  onClick={handleSend}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200/50"
                >
                  <Send size={15} /> Enviar
                </button>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  <Info size={16} className="text-blue-400" /> Detalhes
                </div>
                <div className="space-y-2 text-[11px] text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Ref.</span>
                    <span className="font-mono font-medium">{budget.ref}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Data</span><span className="font-medium">{dateStr}</span></div>
                  <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Validade</span><span className="font-medium">{validUntil}</span></div>
                  {updatedAtStr && (
                    <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Atualização</span><span className="font-medium">{updatedAtStr}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-slate-400">Estado</span><span className="font-bold uppercase text-[10px] px-2.5 py-0.5 rounded-lg" style={{ backgroundColor: `${statusColor}18`, color: statusColor }}>{STATUS_LABELS[budget.status]}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estilos de impressão e animações */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-family: 'Arial', 'Helvetica', sans-serif !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body > div:not(#printable-document), div:not(#printable-document) {
            display: none !important;
          }
          #printable-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            font-family: 'Arial', 'Helvetica', sans-serif !important;
            font-size: 12pt;
          }
          .overflow-x-auto { overflow: visible !important; }
          table { page-break-inside: auto; width: 100%; }
          tr { page-break-inside: avoid; }
          @page {
            size: A4;
            margin: 12mm;
          }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes ping-slow { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export default BudgetViewer;