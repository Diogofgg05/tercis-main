import React from 'react';
import type { BudgetStatus } from '../types';

const CFG: Record<BudgetStatus, { label: string; dot: string; base: string }> = {
  rascunho:    { label:'Rascunho',    dot:'bg-slate-400',  base:'bg-slate-100 text-slate-700 border-slate-200' },
  enviado:     { label:'Enviado',     dot:'bg-blue-500',   base:'bg-blue-50 text-blue-700 border-blue-200' },
  aprovado:    { label:'Aprovado',    dot:'bg-emerald-500',base:'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejeitado:   { label:'Rejeitado',   dot:'bg-red-500',    base:'bg-red-50 text-red-700 border-red-200' },
  em_execucao: { label:'Em Execução', dot:'bg-amber-500',  base:'bg-amber-50 text-amber-700 border-amber-200' },
  concluido:   { label:'Concluído',   dot:'bg-teal-500',   base:'bg-teal-50 text-teal-700 border-teal-200' },
  em_revisao:   { label:'Em revisão',  dot:'bg-violet-500', base:'bg-violet-50 text-violet-700 border-violet-200' },
  expirado:    { label:'Expirado',    dot:'bg-orange-500', base:'bg-orange-50 text-orange-700 border-orange-200' },
};

export const ALL_STATUSES = Object.keys(CFG) as BudgetStatus[];
export const STATUS_LABELS = Object.fromEntries(ALL_STATUSES.map(s => [s, CFG[s].label])) as Record<BudgetStatus,string>;

export function StatusBadge({ status, size = 'md' }: { status: BudgetStatus; size?: 'sm'|'md' }) {
  const c = CFG[status] ?? CFG.rascunho;
  const sz = size === 'sm' ? 'text-[9.5px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${sz} ${c.base}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}
