import React, { useMemo, useState } from 'react';
import {
  TrendingUp, TrendingDown, BarChart2, PieChart, Users,
  Building2, DollarSign, Award, Target,

} from 'lucide-react';
import { formatCurrency, formatPercent } from '../calc';
import type { Budget, Company, Profile, BudgetStatus } from '../types';

interface Props {
  budgets: Budget[];
  companies: Company[];
  team: Profile[];
}

const STATUS_COLORS: Record<BudgetStatus, string> = {
  rascunho: '#94a3b8',
  enviado: '#3b82f6',
  aprovado: '#10b981',
  rejeitado: '#ef4444',
  em_execucao: '#f59e0b',
  concluido: '#6366f1',
};

const STATUS_LABELS: Record<BudgetStatus, string> = {
  rascunho: 'Rascunho',
  enviado: 'Enviado',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  em_execucao: 'Em Execução',
  concluido: 'Concluído',
};

const ALL_STATUSES: BudgetStatus[] = ['rascunho', 'enviado', 'aprovado', 'rejeitado', 'em_execucao', 'concluido'];

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function calcBudgetValue(b: Budget): number {
  return b.items?.reduce((s, i) => {
    const pvp = i.unit_cost * (1 + i.margin / 100);
    return s + pvp * (1 - i.discount / 100) * i.quantity;
  }, 0) || 0;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────
const KpiCard: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  sub?: string;
  trend?: number;
  highlight?: boolean;
}> = ({ label, value, icon, iconBg, sub, trend, highlight }) => (
  <div className={`rounded-2xl p-5 border ${highlight ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-100 shadow-sm'} hover:shadow-md transition-all duration-200 relative overflow-hidden group`}>
    {highlight && (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
    )}
    <div className="relative">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>{icon}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
            {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${highlight ? 'text-slate-400' : 'text-slate-400'}`}>{label}</p>
      <p className={`text-2xl font-black tracking-tight ${highlight ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${highlight ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</p>}
    </div>
  </div>
);

// ─── Horizontal Bar Chart ────────────────────────────────────────────────
const HorizontalBar: React.FC<{ label: string; value: number; max: number; color: string; total?: number }> = ({ label, value, max, color, total }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium truncate flex-1 mr-4">{label}</span>
        <span className="font-bold text-slate-800 flex-shrink-0">{total !== undefined ? total : value}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────
const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[]; centerText?: string; centerSub?: string }> = ({ data, centerText, centerSub }) => {
  const total = data.reduce((a, b) => a + b.value, 0);
  if (total === 0) return <div className="h-32 flex items-center justify-center text-slate-300 text-sm">Sem dados</div>;

  const cx = 80, cy = 80, r = 62, inner = 36;
  let angle = -90;

  const segments = data.filter(d => d.value > 0).map(d => {
    const a = (d.value / total) * 360;
    const s = angle;
    angle += a;
    const sr = (s * Math.PI) / 180;
    const er = ((s + a) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(sr), y1 = cy + r * Math.sin(sr);
    const x2 = cx + r * Math.cos(er), y2 = cy + r * Math.sin(er);
    const ix1 = cx + inner * Math.cos(sr), iy1 = cy + inner * Math.sin(sr);
    const ix2 = cx + inner * Math.cos(er), iy2 = cy + inner * Math.sin(er);
    const la = a > 180 ? 1 : 0;
    return {
      ...d,
      path: `M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${la} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${la} 0 ${ix1} ${iy1} Z`,
      pct: Math.round((d.value / total) * 100),
    };
  });

  return (
    <div className="flex gap-5 items-center">
      <svg viewBox="0 0 160 160" className="w-40 h-40 flex-shrink-0">
        {segments.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="2.5"
            className="hover:opacity-80 transition-opacity cursor-pointer" />
        ))}
        {centerText && (
          <>
            <text x={cx} y={cy - 3} textAnchor="middle" fontSize="18" fontWeight="900" fill="#0f172a">{centerText}</text>
            {centerSub && <text x={cx} y={cy + 13} textAnchor="middle" fontSize="9" fill="#94a3b8">{centerSub}</text>}
          </>
        )}
      </svg>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-slate-600 flex-1 truncate">{s.label}</span>
            <span className="text-xs font-bold text-slate-800">{s.value}</span>
            <span className="text-[10px] text-slate-400 w-8 text-right">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Monthly Trend Chart ──────────────────────────────────────────────────
const TrendChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
  const max = Math.max(...data, 1);
  const h = 120;
  const w = 500;
  const padding = 40;
  const chartW = w - padding * 2;
  const chartH = h - 20;

  const points = data.map((v, i) => ({
    x: padding + (i / (data.length - 1)) * chartW,
    y: 10 + (1 - v / max) * chartH,
    v,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${h + 10} L ${points[0].x} ${h + 10} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h + 30}`} className="w-full">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map(pct => (
        <line key={pct}
          x1={padding} y1={10 + (1 - pct) * chartH}
          x2={w - padding} y2={10 + (1 - pct) * chartH}
          stroke="#f1f5f9" strokeWidth="1" />
      ))}
      <path d={areaD} fill="url(#trendGrad)" />
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#3b82f6" strokeWidth="2.5" />
          {p.v > 0 && (
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">
              {formatCurrency(p.v).replace('€', '').trim()}
            </text>
          )}
          <text x={p.x} y={h + 22} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="500">{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────
export function SettingsView({ budgets, companies, team }: Props) {
  const [period, setPeriod] = useState<6 | 12>(6);

  const now = new Date();

  const stats = useMemo(() => {
    const totalVolume = budgets.reduce((s, b) => s + calcBudgetValue(b), 0);
    const approved = budgets.filter(b => b.status === 'aprovado').length;
    const conversionRate = budgets.length > 0 ? (approved / budgets.length) * 100 : 0;
    const avgTicket = budgets.length > 0 ? totalVolume / budgets.length : 0;
    const inExecution = budgets.filter(b => b.status === 'em_execucao').length;
    return { totalVolume, approved, conversionRate, avgTicket, inExecution, total: budgets.length };
  }, [budgets]);

  const monthlyData = useMemo(() => {
    const months = Array(period).fill(0);
    budgets.forEach(b => {
      const d = new Date(b.date);
      const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diff >= 0 && diff < period) months[period - 1 - diff] += calcBudgetValue(b);
    });
    return months;
  }, [budgets, period]);

  const monthLabels = Array.from({ length: period }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (period - 1) + i, 1);
    return MONTH_NAMES[d.getMonth()];
  });

  const statusData = useMemo(() =>
    ALL_STATUSES.map(s => ({
      label: STATUS_LABELS[s],
      value: budgets.filter(b => b.status === s).length,
      color: STATUS_COLORS[s],
    })).filter(d => d.value > 0),
    [budgets]
  );

  const budgetsBySector = useMemo(() => {
    const map: Record<string, number> = {};
    budgets.forEach(b => { if (b.sector) map[b.sector] = (map[b.sector] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [budgets]);

  const maxSectorCount = Math.max(...budgetsBySector.map(([, c]) => c), 1);
  const sectorColors = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6'];

  const topCompanies = useMemo(() =>
    companies.map(c => {
      const cBudgets = budgets.filter(b => b.company_id === c.id);
      const value = cBudgets.reduce((s, b) => s + calcBudgetValue(b), 0);
      const approvedCount = cBudgets.filter(b => b.status === 'aprovado').length;
      return { company: c, value, count: cBudgets.length, approved: approvedCount };
    }).sort((a, b) => b.value - a.value).slice(0, 8),
    [companies, budgets]
  );

  const teamPerformance = useMemo(() =>
    team.map(m => {
      const mb = budgets.filter(b => b.assigned_to === m.id);
      const value = mb.reduce((s, b) => s + calcBudgetValue(b), 0);
      const approved = mb.filter(b => b.status === 'aprovado').length;
      const rate = mb.length > 0 ? (approved / mb.length) * 100 : 0;
      return { member: m, budgets: mb.length, value, approved, rate };
    }).sort((a, b) => b.value - a.value),
    [team, budgets]
  );

  const maxTeamValue = Math.max(...teamPerformance.map(t => t.value), 1);

  return (
    <div className="p-8 space-y-7 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Relatórios & Analytics</h1>
          <p className="text-slate-400 text-sm mt-0.5">Visão geral do desempenho do negócio</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {([6, 12] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${period === p ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {p}M
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Volume Total"
          value={formatCurrency(stats.totalVolume)}
          icon={<DollarSign size={18} className="text-blue-600" />}
          iconBg="bg-blue-50"
          sub={`${stats.total} orçamentos`}
          highlight
        />
        <KpiCard
          label="Taxa Conversão"
          value={formatPercent(stats.conversionRate)}
          icon={<Target size={18} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          sub={`${stats.approved} aprovados`}
          trend={stats.conversionRate}
        />
        <KpiCard
          label="Ticket Médio"
          value={formatCurrency(stats.avgTicket)}
          icon={<TrendingUp size={18} className="text-amber-600" />}
          iconBg="bg-amber-50"
          sub="por orçamento"
        />
        <KpiCard
          label="Em Execução"
          value={stats.inExecution.toString()}
          icon={<Award size={18} className="text-cyan-600" />}
          iconBg="bg-cyan-50"
          sub="projetos ativos"
        />
      </div>

      {/* Trend + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <BarChart2 size={15} className="text-blue-500" />
                Evolução de Volume
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Últimos {period} meses</p>
            </div>
          </div>
          <TrendChart data={monthlyData} labels={monthLabels} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PieChart size={15} className="text-emerald-500" />
            Por Estado
          </h2>
          <DonutChart
            data={statusData}
            centerText={stats.total.toString()}
            centerSub="total"
          />
        </div>
      </div>

      {/* Sector + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* By sector */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <BarChart2 size={15} className="text-amber-500" />
            Orçamentos por Setor
          </h2>
          <div className="space-y-3">
            {budgetsBySector.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">Sem dados</p>
            ) : budgetsBySector.map(([sector, count], i) => (
              <HorizontalBar
                key={sector}
                label={sector}
                value={count}
                max={maxSectorCount}
                color={sectorColors[i % sectorColors.length]}
                total={count}
              />
            ))}
          </div>
        </div>

        {/* Team performance */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Users size={15} className="text-blue-500" />
            Performance da Equipa
          </h2>
          <div className="space-y-4">
            {teamPerformance.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">Sem dados de equipa</p>
            ) : teamPerformance.map((t, i) => {
              const initials = t.member.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
              const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500', 'bg-rose-500'];
              return (
                <div key={t.member.id} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${colors[i % colors.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 truncate">{t.member.full_name}</span>
                      <span className="text-xs font-bold text-slate-800 ml-2">{formatCurrency(t.value)}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[i % colors.length].replace('bg-', 'bg-')}`}
                        style={{ width: `${maxTeamValue > 0 ? (t.value / maxTeamValue) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-slate-400">{t.budgets} orçamentos</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">{t.approved} aprovados</span>
                      <span className="text-[10px] text-slate-400">{t.rate.toFixed(0)}% taxa</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top companies table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Building2 size={15} className="text-slate-600" />
          <h2 className="font-bold text-slate-800">Top Clientes por Volume</h2>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{topCompanies.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['#', 'Empresa', 'Setor', 'Orçamentos', 'Aprovados', 'Volume Total', 'Último Orçamento'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topCompanies.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-slate-400 text-sm">Sem dados de empresas</td></tr>
              ) : topCompanies.map((item, i) => {
                const lastBudget = budgets
                  .filter(b => b.company_id === item.company.id)
                  .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())[0];
                const rankColors = ['text-amber-600 bg-amber-50', 'text-slate-600 bg-slate-100', 'text-orange-600 bg-orange-50'];

                return (
                  <tr key={item.company.id} className="border-b border-slate-50 hover:bg-blue-50/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center ${rankColors[i] || 'text-slate-400 bg-slate-50'}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{item.company.name}</td>
                    <td className="px-4 py-3.5 text-slate-500">{item.company.sector || '—'}</td>
                    <td className="px-4 py-3.5 text-slate-600">{item.count}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-emerald-700 font-semibold">{item.approved}</span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">{formatCurrency(item.value)}</td>
                    <td className="px-4 py-3.5 text-slate-400">
                      {lastBudget
                        ? new Date(lastBudget.created_at || '').toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: '2-digit' })
                        : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
