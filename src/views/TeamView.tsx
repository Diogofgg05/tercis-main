import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import {
  UserPlus,
  Copy,
  ToggleLeft,
  ToggleRight,
  Shield,
  Users,
  Award,
  Mail,
  Phone,
  Briefcase,
  X,
  Search,
  CheckCircle,
  Circle,
  SlidersHorizontal,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  Check,
  Loader2,
  UserX,
  Eye,
  Calendar,
  Tag,
  Euro,
  Edit3,
  MessageSquare,
  TrendingUp,
  Clock,
  Hash,
} from 'lucide-react';

// ============================================================
// Mocks autossuficientes
// ============================================================
const useAuth = () => ({ profile: { role: 'admin' } });

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  if (!open) return null;
  const maxW = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-xl' : 'max-w-lg';
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${maxW} mx-4 p-6 transform transition-all duration-200 scale-100 max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1 hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ============================================================
// Tipos
// ============================================================
type Role = 'admin' | 'collaborator' | 'client';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  role: Role;
  active: boolean;
}

interface BudgetItem {
  id: string;
  unit_cost: number;
  margin: number;
  discount: number;
  quantity: number;
}

interface Budget {
  id: string;
  assigned_to: string | null;
  created_by: string;
  status: string;
  items: BudgetItem[];
}

// ============================================================
// Dados fixos (enriquecidos)
// ============================================================
const FIXED_TEAM: Profile[] = [
  {
    id: 'user1',
    full_name: 'Carlos Silva',
    email: 'carlos@exemplo.pt',
    phone: '+351 912 345 678',
    department: 'Direção Técnica',
    role: 'admin',
    active: true,
  },
  {
    id: 'user2',
    full_name: 'Marta Oliveira',
    email: 'marta@exemplo.pt',
    phone: '+351 923 456 789',
    department: 'Orçamentação',
    role: 'collaborator',
    active: true,
  },
  {
    id: 'user3',
    full_name: 'Rui Sousa',
    email: 'rui@exemplo.pt',
    phone: '+351 934 567 890',
    department: 'Cliente Externo',
    role: 'client',
    active: true,
  },
  {
    id: 'user4',
    full_name: 'Ana Pereira',
    email: 'ana@exemplo.pt',
    phone: '+351 945 678 901',
    department: 'Compras',
    role: 'collaborator',
    active: false,
  },
  {
    id: 'user5',
    full_name: 'João Martins',
    email: 'joao@exemplo.pt',
    phone: '+351 956 789 012',
    department: 'Manutenção',
    role: 'client',
    active: true,
  },
];

const FIXED_BUDGETS: Budget[] = [
  {
    id: 'b1',
    assigned_to: 'user1',
    created_by: 'user1',
    status: 'aprovado',
    items: [{ id: 'i1', unit_cost: 2500, margin: 20, discount: 5, quantity: 1 }],
  },
  {
    id: 'b2',
    assigned_to: 'user2',
    created_by: 'user1',
    status: 'aprovado',
    items: [{ id: 'i2', unit_cost: 150, margin: 25, discount: 0, quantity: 10 }],
  },
  {
    id: 'b3',
    assigned_to: 'user3',
    created_by: 'user2',
    status: 'rascunho',
    items: [{ id: 'i3', unit_cost: 300, margin: 18, discount: 3, quantity: 50 }],
  },
  {
    id: 'b4',
    assigned_to: 'user1',
    created_by: 'user1',
    status: 'enviado',
    items: [{ id: 'i4', unit_cost: 1200, margin: 30, discount: 10, quantity: 1 }],
  },
  {
    id: 'b5',
    assigned_to: 'user5',
    created_by: 'user2',
    status: 'concluido',
    items: [{ id: 'i5', unit_cost: 3500, margin: 10, discount: 0, quantity: 1 }],
  },
];

// ============================================================
// Constantes visuais
// ============================================================
const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  collaborator: 'Colaborador',
  client: 'Cliente',
};
const ROLE_COLORS: Record<Role, string> = {
  admin: 'bg-blue-100 text-blue-800',
  collaborator: 'bg-slate-100 text-slate-700',
  client: 'bg-amber-100 text-amber-800',
};
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
];
const STATUS_COLORS: Record<string, string> = {
  aprovado: 'bg-emerald-100 text-emerald-700',
  rascunho: 'bg-slate-100 text-slate-600',
  enviado: 'bg-blue-100 text-blue-700',
  concluido: 'bg-purple-100 text-purple-700',
};

// ============================================================
// Helpers
// ============================================================
function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

function computeBudgetTotal(budget: Budget): number {
  return budget.items.reduce((sum, item) => {
    const base = item.unit_cost * item.quantity;
    const discounted = base * (1 - item.discount / 100);
    const final = discounted * (1 + item.margin / 100);
    return sum + final;
  }, 0);
}

// ============================================================
// Reducer do time
// ============================================================
type TeamAction =
  | { type: 'SET_TEAM'; payload: Profile[] }
  | { type: 'ADD_MEMBER'; payload: Profile }
  | { type: 'TOGGLE_ACTIVE'; payload: string }
  | { type: 'UPDATE_ROLE'; payload: { id: string; role: Role } };

function teamReducer(state: Profile[], action: TeamAction): Profile[] {
  switch (action.type) {
    case 'SET_TEAM':
      return action.payload;
    case 'ADD_MEMBER':
      return [...state, action.payload];
    case 'TOGGLE_ACTIVE':
      return state.map((p) =>
        p.id === action.payload ? { ...p, active: !p.active } : p
      );
    case 'UPDATE_ROLE':
      return state.map((p) =>
        p.id === action.payload.id ? { ...p, role: action.payload.role } : p
      );
    default:
      return state;
  }
}

// ============================================================
// Toast
// ============================================================
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback(
    (message: string, type: Toast['type'] = 'info', duration = 3000) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    },
    []
  );
  return { toasts, addToast };
}

// ============================================================
// Hook de debounce
// ============================================================
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ============================================================
// Subcomponente: Card da Equipa (corrigido e melhorado)
// ============================================================
interface TeamMemberCardProps {
  member: Profile;
  initials: string;
  color: string;
  assignedCount: number;
  createdCount: number;
  isAdmin: boolean;
  onToggleActive: (id: string) => void;
  onUpdateRole: (id: string, role: Role) => void;
  onCopyEmail: (email: string) => void;
  onPhoneClick: (phone: string) => void;
  onOpenDetail: (id: string) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member: m,
  initials,
  color,
  assignedCount,
  createdCount,
  isAdmin,
  onToggleActive,
  onUpdateRole,
  onCopyEmail,
  onPhoneClick,
  onOpenDetail,
}) => {
  const [showConfirmToggle, setShowConfirmToggle] = useState(false);

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdmin) setShowConfirmToggle(true);
  };

  const confirmToggle = () => {
    onToggleActive(m.id);
    setShowConfirmToggle(false);
  };

  return (
    <>
      <div
        onClick={() => onOpenDetail(m.id)}
        className={`relative group grid grid-cols-[auto_1fr] items-center gap-4 bg-white px-5 py-4 transition-colors duration-200 hover:bg-blue-50/40 cursor-pointer ${
          !m.active
            ? 'opacity-60 border-slate-200 bg-slate-50/50'
            : 'border-slate-100 hover:border-blue-200 hover:ring-2 hover:ring-blue-50'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpenDetail(m.id);
        }}
        aria-label={`Ver detalhes de ${m.full_name}`}
      >
        {/* Cabeçalho */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-sm`}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold text-slate-800 truncate">
                  {m.full_name}
                  {!m.active && (
                    <span className="ml-2 text-xs font-medium text-slate-400">
                      (Inativo)
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyEmail(m.email);
                    }}
                    className="text-xs text-slate-500 flex items-center gap-1 truncate hover:text-blue-600 transition-colors"
                    title="Copiar email"
                  >
                    <Mail size={10} className="flex-shrink-0" />
                    <span className="group-hover:underline">{m.email}</span>
                    <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  {m.phone && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPhoneClick(m.phone);
                      }}
                      className="text-xs text-slate-500 flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      <Phone size={10} /> {m.phone}
                    </button>
                  )}
                </div>
                {m.department && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Briefcase size={10} /> {m.department}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {isAdmin ? (
                  <select
                    value={m.role}
                    onChange={(e) => {
                      e.stopPropagation();
                      onUpdateRole(m.id, e.target.value as Role);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer border-0 appearance-none ${ROLE_COLORS[m.role]} pr-6 bg-no-repeat`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpath d='m2 4 4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 4px center',
                    }}
                    aria-label="Alterar função"
                  >
                    <option value="admin">Admin</option>
                    <option value="collaborator">Colaborador</option>
                    <option value="client">Cliente</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold ${ROLE_COLORS[m.role]}`}
                  >
                    {ROLE_LABELS[m.role]}
                  </span>
                )}
                {isAdmin && (
                  <button
                    onClick={handleToggleClick}
                    className={`p-1 rounded-lg transition-colors ${
                      m.active
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={m.active ? 'Desativar membro' : 'Ativar membro'}
                    aria-label={m.active ? 'Desativar membro' : 'Ativar membro'}
                  >
                    {m.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-1.5 mb-3">
          {m.active ? (
            <>
              <CheckCircle size={12} className="text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Ativo</span>
            </>
          ) : (
            <>
              <Circle size={12} className="text-slate-300" />
              <span className="text-xs font-medium text-slate-400">Inativo</span>
            </>
          )}
        </div>

        {/* Métricas resumidas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
            <p className="text-lg font-black text-slate-800">{assignedCount}</p>
            <p className="text-[10px] text-slate-400">Atribuídos</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-xl">
            <p className="text-lg font-black text-blue-700">{createdCount}</p>
            <p className="text-[10px] text-slate-400">Criados por si</p>
          </div>
        </div>
      </div>

      {/* Modal de confirmação toggle */}
      <Modal
        open={showConfirmToggle}
        onClose={() => setShowConfirmToggle(false)}
        title={m.active ? 'Desativar membro' : 'Ativar membro'}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-white font-bold`}>
              {initials}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{m.full_name}</p>
              <p className="text-xs text-slate-500">{m.email}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            {m.active
              ? 'Tem a certeza de que deseja desativar este membro? Ele deixará de aparecer em listagens ativas e perderá acesso temporário.'
              : 'Tem a certeza de que deseja reativar este membro? Ele voltará a ter acesso normalmente.'}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowConfirmToggle(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmToggle}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors ${
                m.active ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {m.active ? 'Sim, desativar' : 'Sim, ativar'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// ============================================================
// Subcomponente: Modal de Detalhes do Membro (REPAGINADO)
// ============================================================
interface MemberDetailModalProps {
  open: boolean;
  onClose: () => void;
  member: Profile | null;
  budgets: Budget[];
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  open,
  onClose,
  member,
  budgets,
}) => {
  if (!member) return null;
  const initials = getInitials(member.full_name);
  // Cor baseada num hash simples do id para consistência, mesmo para novos membros
  const colorIndex = member.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  const avatarColor = AVATAR_COLORS[colorIndex];

  const assignedBudgets = budgets.filter((b) => b.assigned_to === member.id);
  const createdBudgets = budgets.filter((b) => b.created_by === member.id);

  const totalAssigned = assignedBudgets.reduce((sum, b) => sum + computeBudgetTotal(b), 0);
  const totalCreated = createdBudgets.reduce((sum, b) => sum + computeBudgetTotal(b), 0);

  return (
    <Modal open={open} onClose={onClose} title="Detalhes do Membro" size="lg">
      <div className="space-y-6 animate-fade-in">
        {/* Perfil */}
        <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100">
          <div
            className={`w-16 h-16 rounded-2xl ${avatarColor} flex items-center justify-center text-white font-black text-2xl shadow-sm flex-shrink-0`}
          >
            {initials}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{member.full_name}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {member.email}
                  </span>
                  {member.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={14} /> {member.phone}
                    </span>
                  )}
                </div>
                {member.department && (
                  <p className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                    <Briefcase size={14} /> {member.department}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${ROLE_COLORS[member.role]}`}>
                  {ROLE_LABELS[member.role]}
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  member.active ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {member.active ? (
                    <CheckCircle size={14} className="text-emerald-500" />
                  ) : (
                    <Circle size={14} className="text-slate-300" />
                  )}
                  {member.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            {/* Ações rápidas */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => navigator.clipboard.writeText(member.email)}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <Copy size={12} /> Copiar email
              </button>
              {member.phone && (
                <button
                  onClick={() => navigator.clipboard.writeText(member.phone)}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <Phone size={12} /> Copiar telefone
                </button>
              )}
              <button
                onClick={() => alert('Funcionalidade de edição em breve')}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <Edit3 size={12} /> Editar
              </button>
            </div>
          </div>
        </div>

        {/* Resumo financeiro */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <p className="text-sm font-medium text-emerald-700 mb-1">Total Atribuído</p>
            <p className="text-2xl font-black text-emerald-800">{formatCurrency(totalAssigned)}</p>
            <p className="text-xs text-emerald-600 mt-1">{assignedBudgets.length} orçamentos</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm font-medium text-blue-700 mb-1">Total Criado</p>
            <p className="text-2xl font-black text-blue-800">{formatCurrency(totalCreated)}</p>
            <p className="text-xs text-blue-600 mt-1">{createdBudgets.length} orçamentos</p>
          </div>
        </div>

        {/* Orçamentos atribuídos */}
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <Hash size={14} className="text-emerald-600" />
            Orçamentos Atribuídos
          </h4>
          {assignedBudgets.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Nenhum orçamento atribuído.</p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {assignedBudgets.map((b) => (
                <div
                  key={b.id}
                  className="bg-white border border-slate-100 rounded-xl p-3 flex justify-between items-center hover:border-slate-200 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{b.id.toUpperCase()}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">{formatCurrency(computeBudgetTotal(b))}</p>
                    <p className="text-[10px] text-slate-400">{b.items.length} itens</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orçamentos criados */}
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <Hash size={14} className="text-blue-600" />
            Orçamentos Criados
          </h4>
          {createdBudgets.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Nenhum orçamento criado.</p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {createdBudgets.map((b) => (
                <div
                  key={b.id}
                  className="bg-white border border-slate-100 rounded-xl p-3 flex justify-between items-center hover:border-slate-200 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{b.id.toUpperCase()}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">{formatCurrency(computeBudgetTotal(b))}</p>
                    <p className="text-[10px] text-slate-400">{b.items.length} itens</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export function TeamView() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [team, dispatch] = useReducer(teamReducer, []);
  const [budgets] = useState<Budget[]>(FIXED_BUDGETS);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_TEAM', payload: FIXED_TEAM });
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const { toasts, addToast } = useToast();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [email, setEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('collaborator');
  const [emailError, setEmailError] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [sortKey, setSortKey] = useState<'name' | 'role' | 'active'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (!showInviteModal) {
      setEmail('');
      setEmailError('');
      setInviteRole('collaborator');
    }
  }, [showInviteModal]);

  const selectedMember = useMemo(
    () => team.find((m) => m.id === selectedMemberId) || null,
    [team, selectedMemberId]
  );

  const stats = useMemo(
    () => ({
      total: team.length,
      admins: team.filter((m) => m.role === 'admin').length,
      collaborators: team.filter((m) => m.role === 'collaborator').length,
      clients: team.filter((m) => m.role === 'client').length,
      active: team.filter((m) => m.active).length,
    }),
    [team]
  );

  const filteredTeam = useMemo(() => {
    let result = team.filter((m) => {
      const matchesRole = roleFilter === 'all' || m.role === roleFilter;
      const term = debouncedSearchTerm;
      const matchesSearch =
        !term ||
        m.full_name.toLowerCase().includes(term.toLowerCase()) ||
        m.email.toLowerCase().includes(term.toLowerCase()) ||
        m.department.toLowerCase().includes(term.toLowerCase());
      return matchesRole && matchesSearch;
    });

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.full_name.localeCompare(b.full_name);
          break;
        case 'role': {
          const order = ['admin', 'collaborator', 'client'];
          cmp = order.indexOf(a.role) - order.indexOf(b.role);
          break;
        }
        case 'active':
          cmp = Number(b.active) - Number(a.active);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [team, roleFilter, debouncedSearchTerm, sortKey, sortDir]);

  const memberData = useMemo(() => {
    return filteredTeam.map((m) => {
      const assigned = budgets.filter((b) => b.assigned_to === m.id);
      const created = budgets.filter((b) => b.created_by === m.id);
      return {
        member: m,
        initials: getInitials(m.full_name),
        assignedCount: assigned.length,
        createdCount: created.length,
      };
    });
  }, [filteredTeam, budgets]);

  const copyToClipboard = useCallback(
    (text: string, label = 'Texto') => {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 2000);
      addToast(`${label} copiado!`, 'success');
    },
    [addToast]
  );

  const handleCopyEmail = useCallback(
    (email: string) => copyToClipboard(email, 'Email'),
    [copyToClipboard]
  );

  const handlePhoneClick = useCallback(
    (phone: string) => {
      navigator.clipboard.writeText(phone);
      addToast('Número de telefone copiado', 'info');
    },
    [addToast]
  );

  const handleInvite = useCallback(() => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Por favor, insira um email válido.');
      return;
    }
    const exists = team.some((m) => m.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setEmailError('Este email já pertence a um membro da equipa.');
      return;
    }
    const newMember: Profile = {
      id: Date.now().toString(),
      full_name: email.split('@')[0],
      email,
      phone: '',
      department: '',
      role: inviteRole,
      active: true,
    };
    dispatch({ type: 'ADD_MEMBER', payload: newMember });
    addToast('Membro convidado com sucesso!', 'success');
    setShowInviteModal(false);
    setEmail('');
    setEmailError('');
  }, [email, inviteRole, team, addToast]);

  const toggleActive = useCallback(
    (id: string) => {
      dispatch({ type: 'TOGGLE_ACTIVE', payload: id });
      const member = team.find((m) => m.id === id);
      if (member) {
        addToast(
          member.active
            ? `${member.full_name} foi desativado.`
            : `${member.full_name} foi reativado.`,
          'info'
        );
      }
    },
    [team, addToast]
  );

  const updateRole = useCallback(
    (id: string, role: Role) => {
      dispatch({ type: 'UPDATE_ROLE', payload: { id, role } });
      addToast('Função atualizada.', 'success');
    },
    [addToast]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setRoleFilter('all');
    setSortKey('name');
    setSortDir('asc');
  }, []);

  return (
    <div className="workspace-page workspace-team p-6 sm:p-8 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-300">Workspace / Pessoas</p>
            <h1 className="text-3xl font-black tracking-tight">A equipa por trás de cada orçamento.</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Dê contexto, responsabilidade e velocidade a cada pessoa que participa no ciclo comercial.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex -space-x-2"><span className="flex size-8 items-center justify-center rounded-full border-2 border-slate-950 bg-orange-400 text-[10px] font-black text-slate-950">CS</span><span className="flex size-8 items-center justify-center rounded-full border-2 border-slate-950 bg-white text-[10px] font-black text-slate-950">MO</span></div>
            <div><p className="text-xs font-bold">Colaboração ativa</p><p className="text-[11px] text-slate-300">Permissões por função</p></div>
          </div>
        </div>
      </section>
      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            {toast.type === 'success' ? (
              <Check size={16} />
            ) : toast.type === 'error' ? (
              <AlertCircle size={16} />
            ) : (
              <CheckCircle size={16} />
            )}
            {toast.message}
          </div>
        ))}
      </div>

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Equipa</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading ? 'A carregar…' : `${stats.total} membros · ${stats.active} ativos`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
            >
              <UserPlus size={16} />
              Convidar Membro
            </button>
          )}
          <button
            onClick={clearFilters}
            className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Limpar filtros"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total" value={stats.total} icon={<Users size={15} className="text-blue-600" />} bg="bg-blue-50" tooltip="Todos os membros" />
        <StatCard label="Ativos" value={stats.active} icon={<CheckCircle size={15} className="text-emerald-600" />} bg="bg-emerald-50" tooltip="Membros ativos atualmente" />
        <StatCard label="Admins" value={stats.admins} icon={<Shield size={15} className="text-blue-600" />} bg="bg-blue-50" tooltip="Administradores" />
        <StatCard label="Colaboradores" value={stats.collaborators} icon={<Users size={15} className="text-slate-600" />} bg="bg-slate-100" tooltip="Colaboradores internos" />
        <StatCard label="Clientes" value={stats.clients} icon={<Award size={15} className="text-amber-600" />} bg="bg-amber-50" tooltip="Clientes externos" />
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome, email ou departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-white"
            aria-label="Pesquisar membro"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Limpar pesquisa"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | 'all')}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
        >
          <option value="all">Todas as funções</option>
          <option value="admin">Administrador</option>
          <option value="collaborator">Colaborador</option>
          <option value="client">Cliente</option>
        </select>
        <div className="flex gap-2">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as 'name' | 'role' | 'active')}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          >
            <option value="name">Nome</option>
            <option value="role">Função</option>
            <option value="active">Estado</option>
          </select>
          <button
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white hover:bg-slate-50 transition-colors flex items-center gap-1"
            title={`Ordem ${sortDir === 'asc' ? 'descendente' : 'ascendente'}`}
          >
            <SlidersHorizontal size={14} />
            <ChevronDown size={14} className={`transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Lista operacional de membros */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : memberData.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
            <UserX size={48} className="text-slate-300" />
            <p className="text-lg font-medium">Nenhum membro encontrado.</p>
            <p className="text-sm">
              {searchTerm || roleFilter !== 'all'
                ? 'Tente ajustar os filtros ou a pesquisa.'
                : 'A equipa ainda está vazia. Convide o primeiro membro!'}
            </p>
            {isAdmin && !searchTerm && roleFilter === 'all' && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Convidar Membro
              </button>
            )}
          </div>
        ) : (
          memberData.map((data, idx) => (
            <TeamMemberCard
              key={data.member.id}
              member={data.member}
              initials={data.initials}
              color={AVATAR_COLORS[idx % AVATAR_COLORS.length]}
              assignedCount={data.assignedCount}
              createdCount={data.createdCount}
              isAdmin={isAdmin}
              onToggleActive={toggleActive}
              onUpdateRole={updateRole}
              onCopyEmail={handleCopyEmail}
              onPhoneClick={handlePhoneClick}
              onOpenDetail={setSelectedMemberId}
            />
          ))
        )}
      </div>

      {/* Modal de detalhes */}
      <MemberDetailModal
        open={!!selectedMemberId}
        onClose={() => setSelectedMemberId(null)}
        member={selectedMember}
        budgets={budgets}
      />

      {/* Modal de convite */}
      <Modal open={showInviteModal} onClose={() => setShowInviteModal(false)} title="Convidar Membro" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email do membro</label>
            <input
              type="email"
              placeholder="exemplo@dominio.pt"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                emailError ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-50' : 'border-slate-200 focus:border-blue-400 focus:ring-blue-50'
              }`}
            />
            {emailError && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle size={12} /> {emailError}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Função</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as Role)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
            >
              <option value="admin">Administrador</option>
              <option value="collaborator">Colaborador</option>
              <option value="client">Cliente</option>
            </select>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-2">Ou partilhe o link de registo:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/register?role=${inviteRole}&token=${Math.random().toString(36).substring(2, 10)}`}
                readOnly
                className="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono truncate"
              />
              <button
                onClick={() =>
                  copyToClipboard(
                    `${window.location.origin}/register?role=${inviteRole}&token=${Math.random().toString(36).substring(2, 10)}`,
                    'Link de registo'
                  )
                }
                className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors"
                title="Copiar link"
              >
                <Copy size={13} />
              </button>
            </div>
            {copiedText && (
              <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                <Check size={12} /> Link copiado!
              </p>
            )}
          </div>
          <button
            onClick={handleInvite}
            disabled={!email}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus size={16} />
            Enviar Convite
          </button>
        </div>
      </Modal>

      {/* Estilos de animação */}
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}

// ============================================================
// Componentes auxiliares
// ============================================================
function StatCard({ label, value, icon, bg, tooltip }: {
  label: string; value: number; icon: React.ReactNode; bg: string; tooltip?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 transition-all hover:shadow-md hover:border-slate-200" title={tooltip}>
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
