import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  FileText, Clock, Building2, CheckCircle2,
  DollarSign, ArrowUpRight, ArrowDownRight, Plus,
  Calendar, Activity, Layers, ChevronRight,
  BarChart2, X, ExternalLink, Package, Search,
  SortAsc, SortDesc, AlertCircle, ArrowLeft,
  Printer, Share2, Mail, Phone, MapPin
} from 'lucide-react';
import type { Budget, Company } from '../types';
import { useAuth } from '../auth/AuthContext';
import { formatCurrency, grandTotal } from '../calc';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { BudgetViewer } from './BudgetViewer'; // ← import do componente avançado

// ─── Mock Data (usado quando não são passadas props) ─────────────────
const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'TechNova Lda.', email: 'contacto@technova.pt' },
  { id: '2', name: 'Construtora Horizonte', email: 'geral@horizonte.pt' },
  { id: '3', name: 'Digital Wave Studio', email: 'info@digitalwave.pt' },
  { id: '4', name: 'EcoFoods Portugal', email: 'propostas@ecofoods.pt' },
  { id: '5', name: 'MedCare Solutions', email: 'admin@medcare.pt' },
  { id: '6', name: 'Retail Plus', email: 'comercial@retailplus.pt' },
];

const MOCK_BUDGETS: Budget[] = [
  {
    id: 'b1', ref: 'ORC-2024-001', name: 'Renovação Fachada Edifício Sede', status: 'concluido',
    company_id: '2', company: { name: 'Construtora Horizonte' }, sector: 'Construção Civil',
    date: new Date(2024, 9, 12).toISOString(), created_at: new Date(2024, 9, 12).toISOString(),
    items: [{ unit_price: 12500, quantity: 1 }, { unit_price: 3500, quantity: 3 }],
  },
  {
    id: 'b2', ref: 'ORC-2024-002', name: 'Migração Cloud AWS', status: 'em_execucao',
    company_id: '1', company: { name: 'TechNova Lda.' }, sector: 'Tecnologia',
    date: new Date(2024, 10, 5).toISOString(), created_at: new Date(2024, 10, 5).toISOString(),
    items: [{ unit_price: 15000, quantity: 1 }, { unit_price: 1200, quantity: 12 }],
  },
  {
    id: 'b3', ref: 'ORC-2024-003', name: 'Campanha Marketing Digital', status: 'aprovado',
    company_id: '3', company: { name: 'Digital Wave Studio' }, sector: 'Marketing',
    date: new Date(2024, 10, 20).toISOString(), created_at: new Date(2024, 10, 20).toISOString(),
    items: [{ unit_price: 8000, quantity: 2 }, { unit_price: 2500, quantity: 4 }],
  },
  {
    id: 'b4', ref: 'ORC-2024-004', name: 'Fornecimento Embalagens Bio', status: 'enviado',
    company_id: '4', company: { name: 'EcoFoods Portugal' }, sector: 'Alimentar',
    date: new Date(2024, 11, 1).toISOString(), created_at: new Date(2024, 11, 1).toISOString(),
    items: [{ unit_price: 4200, quantity: 5 }],
  },
  {
    id: 'b5', ref: 'ORC-2024-005', name: 'Equipamento Hospitalar', status: 'rascunho',
    company_id: '5', company: { name: 'MedCare Solutions' }, sector: 'Saúde',
    date: new Date(2024, 11, 10).toISOString(), created_at: new Date(2024, 11, 10).toISOString(),
    items: [{ unit_price: 45000, quantity: 1 }, { unit_price: 500, quantity: 20 }],
  },
  {
    id: 'b6', ref: 'ORC-2024-006', name: 'Sistema POS Retail', status: 'rejeitado',
    company_id: '6', company: { name: 'Retail Plus' }, sector: 'Retalho',
    date: new Date(2024, 8, 15).toISOString(), created_at: new Date(2024, 8, 15).toISOString(),
    items: [{ unit_price: 9500, quantity: 2 }],
  },
  {
    id: 'b7', ref: 'ORC-2024-007', name: 'Auditoria Segurança', status: 'aprovado',
    company_id: '1', company: { name: 'TechNova Lda.' }, sector: 'Cibersegurança',
    date: new Date(2024, 11, 22).toISOString(), created_at: new Date(2024, 11, 22).toISOString(),
    items: [{ unit_price: 3200, quantity: 3 }, { unit_price: 1800, quantity: 2 }],
  },
  {
    id: 'b8', ref: 'ORC-2024-008', name: 'Obras Ampliação Armazém', status: 'enviado',
    company_id: '2', company: { name: 'Construtora Horizonte' }, sector: 'Construção Civil',
    date: new Date(2024, 10, 12).toISOString(), created_at: new Date(2024, 10, 12).toISOString(),
    items: [{ unit_price: 67000, quantity: 1 }, { unit_price: 1200, quantity: 8 }],
  },
];

// ─── Constantes ──────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  rascunho: '#94a3b8',
  enviado: '#3b82f6',
  aprovado: '#10b981',
  rejeitado: '#ef4444',
  em_execucao: '#f59e0b',
  concluido: '#6366f1',
};

const STATUS_LABELS: Record<string, string> = {
  rascunho: 'Rascunho',
  enviado: 'Enviado',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  em_execucao: 'Em Execução',
  concluido: 'Concluído',
};

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// ─── Componentes auxiliares ─────────────────────────────────────────

const LiveClock = React.memo(() => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60">
      <Clock size={12} className="text-indigo-400" />
      <span className="tabular-nums font-semibold text-slate-700">
        {time.toLocaleTimeString('pt-PT', { hour12: false })}
      </span>
    </div>
  );
});

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  color: string;
  gradient?: string;
}

const StatCard: React.FC<StatCardProps> = React.memo(({ icon, label, value, sub, trend, color, gradient }) => (
  <div className="relative overflow-hidden rounded-2xl p-5 border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 group">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${gradient || ''}`} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl shadow-sm ${color} transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${
            trend >= 0 ? 'bg-emerald-50/80 border-emerald-200 text-emerald-700' : 'bg-red-50/80 border-red-200 text-red-600'
          }`}>
            {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1 font-medium">{sub}</p>}
    </div>
  </div>
));

// ─── Dashboard Principal ────────────────────────────────────────────
interface DashboardProps {
  budgets?: Budget[];
  companies?: Company[];
  onNew: () => void;
  onOpen?: (b: Budget) => void; // (opcional, mantido por compatibilidade)
}

export const Dashboard: React.FC<DashboardProps> = ({ budgets: propBudgets, companies: propCompanies, onNew, onOpen }) => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin' || !profile?.role;
  const isClient = profile?.role === 'client';

  const budgets = propBudgets && propBudgets.length > 0 ? propBudgets : MOCK_BUDGETS;
  const companies = propCompanies && propCompanies.length > 0 ? propCompanies : MOCK_COMPANIES;

  const filteredBudgets = useMemo(() => {
    if (isAdmin || !profile) return budgets;
    if (isClient) {
      const clientCompanyId = companies.find(c => c.email === profile?.email)?.id;
      return budgets.filter(b => b.company_id === clientCompanyId);
    }
    return budgets.filter(b => b.assigned_to === profile?.id || b.created_by === profile?.id);
  }, [budgets, companies, profile, isAdmin, isClient]);

  const now = useMemo(() => new Date(), []);

  const stats = useMemo(() => {
    const total = filteredBudgets.length;
    const approved = filteredBudgets.filter(b => b.status === 'aprovado').length;
    const pending = filteredBudgets.filter(b => !['aprovado', 'rejeitado', 'concluido'].includes(b.status)).length;
    const activeClients = new Set(filteredBudgets.map(b => b.company_id).filter(Boolean)).size;
    const totalVolume = filteredBudgets.reduce((sum, b) => sum + (b.items ? grandTotal(b.items as any) : 0), 0);
    const convRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    return { total, approved, pending, activeClients, totalVolume, convRate };
  }, [filteredBudgets]);

  const monthlyChartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return { name: MONTH_NAMES[d.getMonth()], total: 0 };
    });
    filteredBudgets.forEach(b => {
      if (!b.date) return;
      const d = new Date(b.date);
      const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diff >= 0 && diff < 6) {
        months[5 - diff].total += b.items ? grandTotal(b.items as any) : 0;
      }
    });
    return months;
  }, [filteredBudgets, now]);

  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredBudgets.forEach(b => { counts[b.status] = (counts[b.status] || 0) + 1; });
    return Object.entries(counts).map(([status, value]) => ({
      name: STATUS_LABELS[status] || status,
      value,
      color: STATUS_COLORS[status] || '#94a3b8',
    }));
  }, [filteredBudgets]);

  const topSectors = useMemo(() => {
    const map: Record<string, number> = {};
    filteredBudgets.forEach(b => { if (b.sector) map[b.sector] = (map[b.sector] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filteredBudgets]);
  const maxSectorCount = Math.max(...topSectors.map(([, c]) => c), 1);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const recentBudgets = useMemo(() => {
    let list = [...filteredBudgets].sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(b =>
        b.name?.toLowerCase().includes(term) ||
        b.ref?.toLowerCase().includes(term) ||
        b.company?.name?.toLowerCase().includes(term)
      );
    }
    if (sortDirection === 'asc') list.reverse();
    return list.slice(0, 10);
  }, [filteredBudgets, searchTerm, sortDirection]);

  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [activeChart, setActiveChart] = useState<'volume' | 'status'>('volume');

  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  // Handler único: ao clicar num orçamento, vai direto para a página completa
  const handleOpenFull = useCallback((budget: Budget) => {
    setSelectedBudget(budget);
  }, []);

  const handleBackToDashboard = useCallback(() => setSelectedBudget(null), []);

  // Se houver um orçamento selecionado, mostra a página completa (BudgetViewer importado)
  if (selectedBudget) {
    return <BudgetViewer budget={selectedBudget} onBack={handleBackToDashboard} />;
  }

  // ─── Visão Cliente ────────────────────────────────────────────────
  if (isClient) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{greeting}, {profile?.full_name?.split(' ')[0] || 'utilizador'}</h1>
            <p className="text-slate-500 text-sm mt-0.5">Os seus orçamentos estão aqui</p>
          </div>
          <button onClick={onNew} className="btn-primary">
            <Plus size={16} />
            Novo Orçamento
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Os meus orçamentos</h2>
          </div>
          <div className="divide-y divide-slate-50 px-2 py-2">
            {recentBudgets.length === 0 ? (
              <div className="text-center py-14 text-slate-400">
                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium text-sm">Sem orçamentos ainda</p>
              </div>
            ) : recentBudgets.map(b => (
              <button
                key={b.id}
                onClick={() => handleOpenFull(b)} // Abre página completa
                className="w-full flex items-center gap-4 p-3.5 rounded-xl hover:bg-slate-50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${STATUS_COLORS[b.status]}22` }}>
                  <FileText size={16} style={{ color: STATUS_COLORS[b.status] }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{b.name}</p>
                  <p className="text-xs text-slate-500">{b.ref} – {b.company?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-slate-800">{formatCurrency(grandTotal(b.items as any))}</p>
                  <span className="text-[10px] font-bold" style={{ color: STATUS_COLORS[b.status] }}>
                    {STATUS_LABELS[b.status]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Visão Admin ─────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {greeting}, {profile?.full_name?.split(' ')[0] || 'utilizador'}
            </h1>
            <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
              <Calendar size={14} className="text-indigo-400" />
              {now.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <LiveClock />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<FileText size={18} className="text-blue-600" />} label="Total Orçamentos" value={stats.total.toString()}
          sub={`${stats.pending} pendente${stats.pending !== 1 ? 's' : ''}`} color="bg-blue-100" gradient="bg-gradient-to-br from-blue-400 to-blue-600" />
        <StatCard icon={<CheckCircle2 size={18} className="text-emerald-600" />} label="Aprovados" value={stats.approved.toString()}
          sub={`${stats.convRate}% taxa conversão`} trend={stats.convRate} color="bg-emerald-100" gradient="bg-gradient-to-br from-emerald-400 to-emerald-600" />
        <StatCard icon={<Building2 size={18} className="text-amber-600" />} label="Clientes Ativos" value={stats.activeClients.toString()}
          sub={`de ${companies.length} total`} color="bg-amber-100" gradient="bg-gradient-to-br from-amber-400 to-amber-600" />
        <StatCard icon={<DollarSign size={18} className="text-cyan-600" />} label="Volume Total" value={formatCurrency(stats.totalVolume)}
          sub="em orçamentos" color="bg-cyan-100" gradient="bg-gradient-to-br from-cyan-400 to-cyan-600" />
      </div>

      {/* Gráficos e Setores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <BarChart2 size={18} className="text-blue-500" />
                {activeChart === 'volume' ? 'Volume por Mês' : 'Distribuição por Estado'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{activeChart === 'volume' ? 'Últimos 6 meses' : 'Todos os orçamentos'}</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 shadow-inner">
              <button onClick={() => setActiveChart('volume')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeChart === 'volume' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-500'}`}>
                Volume
              </button>
              <button onClick={() => setActiveChart('status')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeChart === 'status' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-500'}`}>
                Estado
              </button>
            </div>
          </div>

          {activeChart === 'volume' ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={60}
                  tickFormatter={(v: number) => formatCurrency(v).replace(' €', '€').replace('.000', 'k')} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="#3b82f6" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`${value} orçamento(s)`, name]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Setores */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-lg p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layers size={18} className="text-amber-500" />
            Setores Principais
          </h2>
          <div className="space-y-3">
            {topSectors.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Sem dados</p>
            ) : topSectors.map(([sector, count], i) => {
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];
              return (
                <div key={sector}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 truncate mr-2">{sector}</span>
                    <span className="text-slate-800">{count}</span>
                  </div>
                  <div className="h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${(count / maxSectorCount) * 100}%`, backgroundColor: colors[i % 5] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
              <p className="text-xl font-black text-blue-600">{stats.convRate}%</p>
              <p className="text-[10px] text-slate-500 font-medium">Conversão</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100">
              <p className="text-xl font-black text-emerald-600">{stats.approved}</p>
              <p className="text-[10px] text-slate-500 font-medium">Aprovados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-lg overflow-hidden">
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-200/70 gap-3">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-slate-600" />
            <h2 className="font-bold text-slate-800">Atividade Recente</h2>
            {recentBudgets.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                {recentBudgets.length} recentes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 w-44 md:w-56"
              />
            </div>
            <button
              onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Alternar ordenação"
            >
              {sortDirection === 'desc' ? <SortDesc size={16} className="text-slate-600" /> : <SortAsc size={16} className="text-slate-600" />}
            </button>
          </div>
        </div>

        {recentBudgets.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium text-sm">
              {searchTerm ? 'Nenhum resultado para a busca.' : 'Nenhum orçamento ainda.'}
            </p>
            {!searchTerm && (
              <button onClick={onNew} className="mt-3 btn-primary mx-auto text-xs py-2">
                <Plus size={13} /> Criar primeiro orçamento
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100/70">
            {recentBudgets.map(b => (
              <button
                key={b.id}
                onClick={() => handleOpenFull(b)} // Abre página completa do BudgetViewer
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${STATUS_COLORS[b.status]}22` }}>
                  <FileText size={16} style={{ color: STATUS_COLORS[b.status] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{b.name || b.ref}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 size={10} /> {b.company?.name} · {new Date(b.date || b.created_at).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-extrabold text-slate-800">{formatCurrency(grandTotal(b.items as any))}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ backgroundColor: `${STATUS_COLORS[b.status]}22`, color: STATUS_COLORS[b.status] }}>
                    {STATUS_LABELS[b.status]}
                  </span>
                </div>
                <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};