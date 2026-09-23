import React, {
  useState, useMemo, useCallback, useEffect, useReducer, useRef,
} from 'react';
import {
  Search, Upload, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Loader, Star, X, Download, Eye, CheckSquare, Square, Trash2, RotateCcw,
  AlertTriangle, CheckCircle, Info,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { Modal } from '../components/Modal';
import { ALL_CATALOG_ITEMS, SECTORS } from '../data/catalog';
import type { CatalogItem } from '../types';

// ============================================================================
// TIPOS
// ============================================================================
interface ExternalProduct {
  id: string;
  code: string;
  description: string;
  brand: string;
  unit_cost: number;
  unit: string;
}

interface CustomItemForm {
  code: string;
  description: string;
  reference: string;
  brand: string;
  category: string;
  sector: string;
  unit: string;
  unit_cost: string;
  supplier: string;
  // Novos campos adicionais
  manufacturer: string;
  model: string;
  voltage: string;
  current: string;
  power: string;
  dimensions: string;
  weight: string;
  certifications: string;
  stock: string;
  location: string;
  notes: string;
}

interface FilterState {
  search: string;
  searchMode: 'contains' | 'exact';
  sector: string | 'all';
  brand: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

type FilterAction =
  | { type: 'SET_FIELD'; field: keyof FilterState; value: string }
  | { type: 'CLEAR_FILTERS' };

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

type SortKey = 'code' | 'description' | 'brand' | 'unit_cost' | 'category';
type SortDir = 'asc' | 'desc';

// ============================================================================
// CONSTANTES
// ============================================================================
const ITEMS_PER_PAGE = 15;
const DEBOUNCE_DELAY = 300;

const MOCK_SUPPLIER_PRODUCTS: Record<string, ExternalProduct[]> = {
  abb: [
    { id: 'abb-1', code: 'ABB-1SBL157001R1000', description: 'Contator AF09 24V AC/DC', brand: 'ABB', unit_cost: 125.9, unit: 'un' },
    { id: 'abb-2', code: 'ABB-1SBL137001R1000', description: 'Contator AF12 24V AC/DC', brand: 'ABB', unit_cost: 148.5, unit: 'un' },
    { id: 'abb-3', code: 'ABB-1SBL247001R1000', description: 'Contator AF16 24V AC/DC', brand: 'ABB', unit_cost: 189.0, unit: 'un' },
  ],
  siemens: [
    { id: 'siemens-1', code: '3RT2015-1BB42', description: 'Contator 3RT20 7A 24V DC', brand: 'Siemens', unit_cost: 98.75, unit: 'un' },
    { id: 'siemens-2', code: '3RT2025-1BB42', description: 'Contator 3RT20 9A 24V DC', brand: 'Siemens', unit_cost: 112.3, unit: 'un' },
  ],
  weg: [
    { id: 'weg-1', code: 'WEG-CW18-24V', description: 'Contator CW18 9A 24V', brand: 'WEG', unit_cost: 79.9, unit: 'un' },
    { id: 'weg-2', code: 'WEG-CW25-24V', description: 'Contator CW25 12A 24V', brand: 'WEG', unit_cost: 95.0, unit: 'un' },
  ],
};

async function buscarProdutosFornecedor(supplierId: string, query: string): Promise<ExternalProduct[]> {
  if (!query.trim()) return [];
  await new Promise(resolve => setTimeout(resolve, 600));
  const produtos = MOCK_SUPPLIER_PRODUCTS[supplierId] || [];
  const lowerQuery = query.toLowerCase();
  return produtos.filter(p =>
    p.code.toLowerCase().includes(lowerQuery) || p.description.toLowerCase().includes(lowerQuery)
  );
}

// ============================================================================
// FORMATADORES
// ============================================================================
function formatEuro(value: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value);
}

// ============================================================================
// HOOKS
// ============================================================================
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return { toasts, addToast, removeToast };
}

// ============================================================================
// REDUCER DE FILTROS
// ============================================================================
const initialFilterState: FilterState = {
  search: '',
  searchMode: 'contains',
  sector: 'all',
  brand: '',
  category: '',
  minPrice: '',
  maxPrice: '',
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'CLEAR_FILTERS':
      return { ...initialFilterState };
    default:
      return state;
  }
}

// ============================================================================
// COMPONENTES INTERNOS
// ============================================================================

// --- Toast Container ---
const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
    {toasts.map(toast => (
      <div
        key={toast.id}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
          toast.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}
      >
        {toast.type === 'success' ? <CheckCircle size={16} /> : toast.type === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
        <span>{toast.message}</span>
        <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-70"><X size={14} /></button>
      </div>
    ))}
  </div>
);

// --- Confirm Dialog ---
const ConfirmDialog: React.FC<{
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void;
}> = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-none">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

// --- Paginação ---
const Pagination: React.FC<{
  page: number; totalPages: number; onPageChange: (p: number) => void; totalItems: number;
}> = ({ page, totalPages, onPageChange, totalItems }) => {
  if (totalPages <= 1) return null;
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
      <div className="text-sm text-slate-500">Página {page} de {totalPages} ({totalItems} itens)</div>
      <div className="flex gap-1">
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronLeft size={16} /></button>
        {pages.map(p => (
          <button key={p} onClick={() => onPageChange(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>
        ))}
        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
};

// --- Slide‑over de detalhes expandido com todas as características ---
const QuickViewSlideOver: React.FC<{ item: CatalogItem | null; onClose: () => void }> = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-none" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-xl p-6 space-y-4 overflow-y-auto animate-slide-left">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        <h2 className="text-xl font-bold text-slate-800">{item.code}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-xs text-slate-500 block">Descrição</span><p className="font-medium">{item.description}</p></div>
          <div><span className="text-xs text-slate-500 block">Referência</span><p>{item.reference || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Marca</span><p>{item.brand || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Categoria</span><p>{item.category || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Custo</span><p className="font-bold">{formatEuro(item.unit_cost)}</p></div>
          <div><span className="text-xs text-slate-500 block">Unidade</span><p>{item.unit}</p></div>
          <div><span className="text-xs text-slate-500 block">Fornecedor</span><p>{item.supplier || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Setor</span><p>{item.sector || '-'}</p></div>
          {/* Novos campos */}
          <div><span className="text-xs text-slate-500 block">Fabricante</span><p>{item.manufacturer || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Modelo</span><p>{item.model || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Tensão</span><p>{item.voltage || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Corrente</span><p>{item.current || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Potência</span><p>{item.power || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Dimensões</span><p>{item.dimensions || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Peso</span><p>{item.weight || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Certificações</span><p>{item.certifications || '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Stock</span><p>{item.stock ?? '-'}</p></div>
          <div><span className="text-xs text-slate-500 block">Localização</span><p>{item.location || '-'}</p></div>
          <div className="col-span-2"><span className="text-xs text-slate-500 block">Notas</span><p>{item.notes || '-'}</p></div>
        </div>
      </div>
    </div>
  );
};

// --- Barra de filtros minimalista (inline) ---
const FilterBar: React.FC<{
  filters: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  uniqueBrands: string[];
  uniqueCategories: string[];
}> = ({ filters, dispatch, uniqueBrands, uniqueCategories }) => {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.brand) count++;
    if (filters.category) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.sector !== 'all') count++;
    return count;
  }, [filters]);

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Setor */}
      <div className="flex-1 min-w-[100px]">
        <label className="block text-xs font-semibold text-slate-500 mb-1">Setor</label>
        <select
          value={filters.sector}
          onChange={e => dispatch({ type: 'SET_FIELD', field: 'sector', value: e.target.value })}
          className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs"
        >
          <option value="all">Todos</option>
          {SECTORS.map(s => (
            <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
          ))}
        </select>
      </div>

      {/* Marca */}
      <div className="flex-1 min-w-[100px]">
        <label className="block text-xs font-semibold text-slate-500 mb-1">Marca</label>
        <select
          value={filters.brand}
          onChange={e => dispatch({ type: 'SET_FIELD', field: 'brand', value: e.target.value })}
          className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs"
        >
          <option value="">Todas</option>
          {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Categoria */}
      <div className="flex-1 min-w-[100px]">
        <label className="block text-xs font-semibold text-slate-500 mb-1">Categoria</label>
        <select
          value={filters.category}
          onChange={e => dispatch({ type: 'SET_FIELD', field: 'category', value: e.target.value })}
          className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs"
        >
          <option value="">Todas</option>
          {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Preço mín */}
      <div className="w-20">
        <label className="block text-xs font-semibold text-slate-500 mb-1">Preço mín.</label>
        <input
          type="number"
          placeholder="0"
          value={filters.minPrice}
          onChange={e => dispatch({ type: 'SET_FIELD', field: 'minPrice', value: e.target.value })}
          className="w-full h-9 rounded-lg border border-slate-200 px-2 text-xs"
        />
      </div>

      {/* Preço máx */}
      <div className="w-20">
        <label className="block text-xs font-semibold text-slate-500 mb-1">Preço máx.</label>
        <input
          type="number"
          placeholder="∞"
          value={filters.maxPrice}
          onChange={e => dispatch({ type: 'SET_FIELD', field: 'maxPrice', value: e.target.value })}
          className="w-full h-9 rounded-lg border border-slate-200 px-2 text-xs"
        />
      </div>

      {/* Limpar filtros */}
      <button
        onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
        className="flex items-center gap-1 h-9 px-3 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        <RotateCcw size={14} />
      </button>

      {/* Badge de ativos */}
      {activeFilterCount > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {activeFilterCount} ativo(s)
        </span>
      )}
    </div>
  );
};

// --- Search Bar ---
const SearchBar: React.FC<{
  search: string;
  searchMode: 'contains' | 'exact';
  onSearchChange: (value: string) => void;
  onModeChange: (mode: 'contains' | 'exact') => void;
}> = ({ search, searchMode, onSearchChange, onModeChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        ref={inputRef}
        type="text"
        placeholder="Pesquisar (Ctrl+K)"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-28 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <select
          value={searchMode}
          onChange={e => onModeChange(e.target.value as 'contains' | 'exact')}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white"
        >
          <option value="contains">Contém</option>
          <option value="exact">Exato</option>
        </select>
      </div>
    </div>
  );
};

// --- Grupo de tabela (estilo original mantido) ---
const TableGroup: React.FC<{
  category: string;
  items: CatalogItem[];
  isOpen: boolean;
  onToggle: () => void;
  selectedItems: Set<string>;
  onToggleSelectItem: (id: string) => void;
  onToggleSelectAll: () => void;
  allSelected: boolean;
  onQuickView: (item: CatalogItem) => void;
  isAdmin: boolean;
  onDeleteItem: (id: string) => void;
  searchTerm: string;
}> = ({
  category, items, isOpen, onToggle, selectedItems, onToggleSelectItem,
  onToggleSelectAll, allSelected, onQuickView, isAdmin, onDeleteItem, searchTerm,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{category}</span>
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-4 py-2 w-10">
                  <button onClick={onToggleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Código</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrição</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Referência</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Marca</th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Custo (€)</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Unid.</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5">
                    <button onClick={() => onToggleSelectItem(item.id)} className="text-slate-400 hover:text-slate-600">
                      {selectedItems.has(item.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                        {highlightMatch(item.code, searchTerm)}
                      </code>
                      {item.is_custom && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-semibold">Personalizado</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-slate-700">
                    {highlightMatch(item.description, searchTerm)}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 font-mono text-xs">{item.reference || '-'}</td>
                  <td className="px-4 py-2.5">
                    {item.brand && (
                      <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                        <Star size={10} className="text-slate-400" />{item.brand}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-slate-900 text-right">{formatEuro(item.unit_cost)}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs uppercase">{item.unit}</td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onQuickView(item)} className="p-1 hover:bg-blue-50 rounded text-blue-600" title="Detalhes"><Eye size={14} /></button>
                      {item.is_custom && isAdmin && (
                        <button onClick={() => onDeleteItem(item.id)} className="p-1 hover:bg-red-50 rounded text-red-500" title="Remover"><Trash2 size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Função auxiliar para destacar texto
function highlightMatch(text: string, term: string): React.ReactNode {
  if (!term.trim()) return text;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part}</mark> : part
      )}
    </>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export function CatalogView() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'collaborator';

  // Itens customizados (com os novos campos já mapeados)
  const [customItems, setCustomItems] = useState<CatalogItem[]>([]);
  const addCustomItems = useCallback((items: CatalogItem[]) => setCustomItems(prev => [...prev, ...items]), []);
  const removeCustomItems = useCallback((ids: string[]) => {
    setCustomItems(prev => prev.filter(i => !ids.includes(i.id)));
  }, []);

  const allItems = useMemo(() => [...ALL_CATALOG_ITEMS, ...customItems], [customItems]);

  // Filtros com useReducer
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);
  const debouncedSearch = useDebounce(filters.search, DEBOUNCE_DELAY);

  // Filtro efetivo (com debounce na pesquisa)
  const effectiveFilters = useMemo<FilterState>(() => ({
    ...filters,
    search: debouncedSearch,
  }), [filters, debouncedSearch]);

  // Ordenação
  const [sortKey, setSortKey] = useState<SortKey>('code');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);

  // Modal importação
  const [showImportModal, setShowImportModal] = useState(false);

  // Detalhe rápido
  const [quickViewItem, setQuickViewItem] = useState<CatalogItem | null>(null);

  // Seleção múltipla
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const toggleSelectItem = (id: string) => setSelectedItems(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const [confirmBatchDelete, setConfirmBatchDelete] = useState(false);

  // Toasts
  const { toasts, addToast, removeToast } = useToasts();

  // Formulário manual (inicialmente vazio, com novos campos)
  const emptyForm: CustomItemForm = {
    code: '', description: '', reference: '', brand: '', category: '',
    sector: 'Eletricidade Industrial', unit: 'un', unit_cost: '', supplier: '',
    manufacturer: '', model: '', voltage: '', current: '', power: '',
    dimensions: '', weight: '', certifications: '', stock: '', location: '', notes: '',
  };
  const [formData, setFormData] = useState<CustomItemForm>(emptyForm);

  const handleAddCustomItem = async () => {
    if (!formData.code || !formData.description) return;
    const newItem: CatalogItem = {
      id: `custom-${Date.now()}`,
      code: formData.code,
      description: formData.description,
      reference: formData.reference,
      brand: formData.brand,
      category: formData.category,
      sector: formData.sector,
      unit: formData.unit,
      unit_cost: parseFloat(formData.unit_cost) || 0,
      supplier: formData.supplier,
      manufacturer: formData.manufacturer,
      model: formData.model,
      voltage: formData.voltage,
      current: formData.current,
      power: formData.power,
      dimensions: formData.dimensions,
      weight: formData.weight,
      certifications: formData.certifications,
      stock: formData.stock ? parseInt(formData.stock) : undefined,
      location: formData.location,
      notes: formData.notes,
      is_custom: true,
    };
    localStorage.setItem('tercis_catalog_custom', JSON.stringify(newItem));
    addCustomItems([newItem]);
    addToast('success', 'Componente adicionado.');
    setFormData(emptyForm);
  };

  // Busca externa (mantida simples)
  const [extSupplier, setExtSupplier] = useState('abb');
  const [extQuery, setExtQuery] = useState('');
  const [extResults, setExtResults] = useState<ExternalProduct[]>([]);
  const [loadingExt, setLoadingExt] = useState(false);
  const [selectedExt, setSelectedExt] = useState<Set<string>>(new Set());
  const handleExtSearch = async () => {
    if (!extQuery.trim()) return;
    setLoadingExt(true);
    try {
      const res = await buscarProdutosFornecedor(extSupplier, extQuery);
      setExtResults(res);
    } catch { addToast('error', 'Erro ao buscar.'); }
    finally { setLoadingExt(false); }
  };
  const importExt = async () => {
    const toImport = extResults.filter(p => selectedExt.has(p.id));
    if (!toImport.length) return;
    const newItems: CatalogItem[] = toImport.map((p, idx) => ({
      id: `ext-${Date.now()}-${idx}`,
      code: p.code,
      description: p.description,
      reference: p.code,
      brand: p.brand,
      category: `Importado ${extSupplier.toUpperCase()}`,
      sector: effectiveFilters.sector === 'all' ? 'Eletricidade Industrial' : effectiveFilters.sector,
      unit: p.unit,
      unit_cost: p.unit_cost,
      supplier: extSupplier.toUpperCase(),
      is_custom: true,
      // Campos extras ficam vazios
      manufacturer: '', model: '', voltage: '', current: '', power: '',
      dimensions: '', weight: '', certifications: '', stock: undefined, location: '', notes: '',
    }));
    localStorage.setItem('tercis_catalog_custom', JSON.stringify(newItems));
    addCustomItems(newItems);
    addToast('success', `${newItems.length} importados.`);
    setSelectedExt(new Set()); setExtResults([]); setExtQuery('');
  };

  // Filtragem e ordenação
  const filteredItems = useMemo(() => {
    let result = allItems;
    const q = effectiveFilters.search.toLowerCase();
    if (q) {
      result = result.filter(i => {
        const fields = [i.code, i.description, i.brand, i.reference, i.manufacturer, i.model].join(' ').toLowerCase();
        if (effectiveFilters.searchMode === 'exact') return fields === q;
        return fields.includes(q);
      });
    }
    if (effectiveFilters.sector !== 'all') result = result.filter(i => i.sector === effectiveFilters.sector);
    if (effectiveFilters.brand) result = result.filter(i => i.brand === effectiveFilters.brand);
    if (effectiveFilters.category) result = result.filter(i => i.category === effectiveFilters.category);
    if (effectiveFilters.minPrice) result = result.filter(i => i.unit_cost >= parseFloat(effectiveFilters.minPrice));
    if (effectiveFilters.maxPrice) result = result.filter(i => i.unit_cost <= parseFloat(effectiveFilters.maxPrice));

    result = [...result].sort((a, b) => {
      let valA: any = a[sortKey];
      let valB: any = b[sortKey];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [allItems, effectiveFilters, sortKey, sortDir]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedFlat = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [effectiveFilters, sortKey, sortDir]);

  // Agrupamento
  const grouped = useMemo(() => {
    const map = new Map<string, CatalogItem[]>();
    paginatedFlat.forEach(item => {
      const cat = item.category || 'Sem Categoria';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    });
    return map;
  }, [paginatedFlat]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleCategory = (cat: string) => setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));

  // Valores únicos
  const uniqueBrands = useMemo(() => [...new Set(allItems.map(i => i.brand).filter(Boolean))].sort(), [allItems]);
  const uniqueCategories = useMemo(() => [...new Set(allItems.map(i => i.category).filter(Boolean))].sort(), [allItems]);

  // Exportação CSV (incluindo novos campos)
  const exportCSV = useCallback(() => {
    const headers = ['Código','Descrição','Referência','Marca','Categoria','Custo','Unidade','Fornecedor','Setor','Fabricante','Modelo','Tensão','Corrente','Potência','Dimensões','Peso','Certificações','Stock','Localização','Notas'];
    const rows = filteredItems.map(i => [
      i.code, i.description, i.reference||'', i.brand||'', i.category||'', i.unit_cost, i.unit, i.supplier||'', i.sector||'',
      i.manufacturer||'', i.model||'', i.voltage||'', i.current||'', i.power||'',
      i.dimensions||'', i.weight||'', i.certifications||'', i.stock??'', i.location||'', i.notes||''
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF'+csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `catalogo_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    addToast('info', 'Catálogo exportado.');
  }, [filteredItems, addToast]);

  const handleDeleteItem = async (id: string) => {
    removeCustomItems([id]);
    addToast('success', 'Item removido.');
  };

  const handleBatchDelete = async () => {
    const ids = Array.from(selectedItems);
    removeCustomItems(ids);
    setSelectedItems(new Set());
    setConfirmBatchDelete(false);
    addToast('success', `${ids.length} itens removidos.`);
  };

  // ========== RENDER ==========
  return (
    <div className="catalog-page min-h-screen bg-[#f7f9fc]">
      {/* Cabeçalho */}
      <div className="bg-[#0a1a2f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Catálogo de Componentes</h1>
              <p className="text-blue-200 text-sm mt-1">{filteredItems.length} de {allItems.length} itens</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && (
                <button onClick={() => setShowImportModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white text-[#0a1a2f] hover:bg-gray-100 shadow-md">
                  <Upload size={16} /> Importar
                </button>
              )}
              <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20">
                <Download size={16} /> Exportar CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Search Bar */}
        <SearchBar
          search={filters.search}
          searchMode={filters.searchMode}
          onSearchChange={value => dispatch({ type: 'SET_FIELD', field: 'search', value })}
          onModeChange={mode => dispatch({ type: 'SET_FIELD', field: 'searchMode', value: mode })}
        />

        {/* Linha de filtros minimalista */}
        <FilterBar
          filters={filters}
          dispatch={dispatch}
          uniqueBrands={uniqueBrands}
          uniqueCategories={uniqueCategories}
        />

        {/* Ações em lote */}
        {selectedItems.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
            <CheckSquare size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">{selectedItems.size} selecionados</span>
            <div className="flex-1" />
            {isAdmin && (
              <button onClick={() => setConfirmBatchDelete(true)} className="text-xs bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-100">
                <Trash2 size={12} /> Remover
              </button>
            )}
            <button onClick={() => setSelectedItems(new Set())} className="text-xs text-slate-500 hover:underline">Cancelar</button>
          </div>
        )}

        {/* Ordenação */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{filteredItems.length} resultados</span>
          <select
            value={`${sortKey}-${sortDir}`}
            onChange={e => {
              const [key, dir] = e.target.value.split('-');
              setSortKey(key as SortKey);
              setSortDir(dir as SortDir);
            }}
            className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
          >
            <option value="code-asc">Código (A-Z)</option>
            <option value="code-desc">Código (Z-A)</option>
            <option value="description-asc">Descrição (A-Z)</option>
            <option value="description-desc">Descrição (Z-A)</option>
            <option value="brand-asc">Marca (A-Z)</option>
            <option value="brand-desc">Marca (Z-A)</option>
            <option value="unit_cost-asc">Preço (menor)</option>
            <option value="unit_cost-desc">Preço (maior)</option>
          </select>
        </div>

        {/* Tabelas agrupadas */}
        {grouped.size === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Search size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Nenhum componente encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(grouped.entries()).map(([cat, items]) => (
              <TableGroup
                key={cat}
                category={cat}
                items={items}
                isOpen={expanded[cat] !== false}
                onToggle={() => toggleCategory(cat)}
                selectedItems={selectedItems}
                onToggleSelectItem={toggleSelectItem}
                onToggleSelectAll={() => {
                  if (items.every(i => selectedItems.has(i.id))) {
                    setSelectedItems(prev => { const next = new Set(prev); items.forEach(i => next.delete(i.id)); return next; });
                  } else {
                    setSelectedItems(prev => { const next = new Set(prev); items.forEach(i => next.add(i.id)); return next; });
                  }
                }}
                allSelected={items.every(i => selectedItems.has(i.id))}
                onQuickView={setQuickViewItem}
                isAdmin={isAdmin}
                onDeleteItem={handleDeleteItem}
                searchTerm={effectiveFilters.search}
              />
            ))}
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredItems.length} />
          </div>
        )}
      </div>

      {/* Modal de importação (completo, com novos campos) */}
      <Modal open={showImportModal} onClose={() => setShowImportModal(false)} title="Importar componente" size="lg">
        <div className="space-y-6">
          {/* Manual */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preenchimento manual</h4>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Código *" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="p-2 border rounded-xl text-sm" />
              <input placeholder="Descrição *" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="p-2 border rounded-xl text-sm" />
              <input placeholder="Referência" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} className="p-2 border rounded-xl text-sm" />
              <input placeholder="Marca" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="p-2 border rounded-xl text-sm" />
              <input placeholder="Categoria" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="p-2 border rounded-xl text-sm" />
              <input placeholder="Unidade" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="p-2 border rounded-xl text-sm" />
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span><input type="number" step="0.01" placeholder="Custo unitário *" value={formData.unit_cost} onChange={e => setFormData({...formData, unit_cost: e.target.value})} className="w-full pl-8 p-2 border rounded-xl text-sm" /></div>
              <select value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} className="p-2 border rounded-xl text-sm">
                {SECTORS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <input placeholder="Fornecedor" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full p-2 border rounded-xl text-sm" />

            {/* Novos campos */}
            <details className="mt-2">
              <summary className="text-xs font-semibold text-slate-500 cursor-pointer">Mais características</summary>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <input placeholder="Fabricante" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} className="p-2 border rounded-xl text-sm" />
                <input placeholder="Modelo" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="p-2 border rounded-xl text-sm" />
                <input placeholder="Tensão" value={formData.voltage} onChange={e => setFormData({...formData, voltage: e.target.value})} className="p-2 border rounded-xl text-sm" />
                <input placeholder="Corrente" value={formData.current} onChange={e => setFormData({...formData, current: e.target.value})} className="p-2 border rounded-xl text-sm" />
                <input placeholder="Potência" value={formData.power} onChange={e => setFormData({...formData, power: e.target.value})} className="p-2 border rounded-xl text-sm" />
                <input placeholder="Dimensões" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} className="p-2 border rounded-xl text-sm" />
                <input placeholder="Peso" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="p-2 border rounded-xl text-sm" />
                <input placeholder="Certificações" value={formData.certifications} onChange={e => setFormData({...formData, certifications: e.target.value})} className="p-2 border rounded-xl text-sm" />
                <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="p-2 border rounded-xl text-sm" />
                <input placeholder="Localização" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="p-2 border rounded-xl text-sm" />
                <input placeholder="Notas" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="col-span-2 p-2 border rounded-xl text-sm" />
              </div>
            </details>

            <button onClick={handleAddCustomItem} disabled={!formData.code || !formData.description} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50">Adicionar ao catálogo</button>
          </div>

          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div><div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-400">ou</span></div></div>

          {/* Busca externa (inalterada) */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Buscar produtos online</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <select value={extSupplier} onChange={e => setExtSupplier(e.target.value)} className="p-2 border rounded-xl text-sm"><option value="abb">ABB</option><option value="siemens">Siemens</option><option value="weg">WEG</option></select>
              <div className="relative flex-1"><input type="text" placeholder="Código ou descrição" value={extQuery} onChange={e => setExtQuery(e.target.value)} className="w-full p-2 pr-20 border rounded-xl text-sm" /><button onClick={handleExtSearch} className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs">Buscar</button></div>
            </div>
            {loadingExt && <div className="flex justify-center py-4"><Loader className="animate-spin text-blue-600" size={20} /></div>}
            {extResults.length > 0 && (
              <>
                <div className="max-h-64 overflow-y-auto border rounded-xl divide-y">
                  {extResults.map(prod => (
                    <label key={prod.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" checked={selectedExt.has(prod.id)} onChange={() => { const next = new Set(selectedExt); next.has(prod.id) ? next.delete(prod.id) : next.add(prod.id); setSelectedExt(next); }} className="rounded" />
                      <div className="flex-1"><div className="font-mono text-xs font-bold text-blue-700">{prod.code}</div><div className="text-sm">{prod.description}</div><div className="text-xs text-slate-400">{prod.brand} • {formatEuro(prod.unit_cost)} / {prod.unit}</div></div>
                    </label>
                  ))}
                </div>
                <button onClick={importExt} disabled={selectedExt.size === 0} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50">Importar {selectedExt.size} produto(s)</button>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* Slide‑over detalhes */}
      <QuickViewSlideOver item={quickViewItem} onClose={() => setQuickViewItem(null)} />

      {/* Confirm batch delete */}
      <ConfirmDialog open={confirmBatchDelete} title="Remover selecionados" message={`Deseja remover ${selectedItems.size} itens?`} onConfirm={handleBatchDelete} onCancel={() => setConfirmBatchDelete(false)} />

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
