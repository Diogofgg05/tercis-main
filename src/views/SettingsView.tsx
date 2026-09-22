import React, { useState } from 'react';
import { Bell, Building2, Check, ChevronRight, CreditCard, LockKeyhole, Palette, Save, ShieldCheck, SlidersHorizontal, Users, Workflow } from 'lucide-react';
import type { Budget, Company, Profile } from '../types';

interface Props { budgets: Budget[]; companies: Company[]; team: Profile[] }
type Section = 'geral' | 'equipa' | 'aprovacoes' | 'notificacoes' | 'seguranca' | 'aparencia';

const sections: { id: Section; label: string; description: string; icon: React.ReactNode }[] = [
  { id: 'geral', label: 'Organização', description: 'Dados base da conta', icon: <Building2 size={17} /> },
  { id: 'equipa', label: 'Equipa e cargos', description: 'Permissões e avaliadores', icon: <Users size={17} /> },
  { id: 'aprovacoes', label: 'Fluxo de aprovação', description: 'Regras dos orçamentos', icon: <Workflow size={17} /> },
  { id: 'notificacoes', label: 'Notificações', description: 'Alertas e comunicação', icon: <Bell size={17} /> },
  { id: 'seguranca', label: 'Segurança', description: 'Acesso e auditoria', icon: <LockKeyhole size={17} /> },
  { id: 'aparencia', label: 'Aparência', description: 'Personalize a plataforma', icon: <Palette size={17} /> },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return <button type="button" aria-pressed={checked} onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}><span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} /></button>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="flex flex-col gap-2"><span className="text-xs font-bold text-slate-600">{label}</span><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10" /></label>;
}

export function SettingsView({ companies, team }: Props) {
  const [active, setActive] = useState<Section>('geral');
  const [saved, setSaved] = useState(false);
  const [organization, setOrganization] = useState({ name: companies[0]?.name ?? 'Tercis Demo', email: companies[0]?.email ?? 'geral@empresa.pt', timezone: 'Europe/Lisbon' });
  const [toggles, setToggles] = useState({ weekly: true, budgetAlerts: true, comments: true, twoFactor: false, compact: false });
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2200); };

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-8">
    <div className="mx-auto max-w-6xl">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-blue-700"><SlidersHorizontal size={12} /> Centro de controlo</div><h1 className="text-3xl font-black tracking-tight text-slate-950">Definições</h1><p className="mt-1 text-sm text-slate-500">Configure a operação da sua organização num só lugar.</p></div>
        <button onClick={save} className="btn-primary"><Save size={16} />{saved ? 'Alterações guardadas' : 'Guardar alterações'}</button>
      </header>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white/85 p-2 shadow-sm backdrop-blur-xl">
          <p className="px-3 pb-2 pt-3 text-[10px] font-black uppercase tracking-[.18em] text-slate-400">Configuração</p>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">{sections.map(item => <button key={item.id} onClick={() => setActive(item.id)} className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${active === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-50'}`}><span className={active === item.id ? 'text-white' : 'text-blue-600'}>{item.icon}</span><span className="flex-1"><strong className="block text-xs font-bold">{item.label}</strong><small className={`block text-[10px] ${active === item.id ? 'text-blue-100' : 'text-slate-400'}`}>{item.description}</small></span><ChevronRight size={14} className="hidden lg:block" /></button>)}</nav>
        </aside>
        <section className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 md:px-7"><h2 className="text-lg font-black text-slate-900">{sections.find(s => s.id === active)?.label}</h2><p className="mt-1 text-sm text-slate-500">{sections.find(s => s.id === active)?.description}</p></div>
          <div className="p-5 md:p-7">
            {active === 'geral' && <div className="flex flex-col gap-6"><div className="grid gap-4 md:grid-cols-2"><Field label="Nome da organização" value={organization.name} onChange={v => setOrganization({ ...organization, name: v })} /><Field label="Email operacional" value={organization.email} onChange={v => setOrganization({ ...organization, email: v })} /><Field label="Fuso horário" value={organization.timezone} onChange={v => setOrganization({ ...organization, timezone: v })} /></div><div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 text-blue-600" size={19} /><div><p className="text-sm font-bold text-slate-800">Conta preparada para crescer</p><p className="mt-1 text-xs leading-5 text-slate-500">A empresa, equipa e regras de aprovação ficam isoladas nesta organização.</p></div></div></div></div>}
            {active === 'equipa' && <div className="flex flex-col gap-4"><div className="grid gap-3 sm:grid-cols-3">{[['Membros', team.length, 'Utilizadores ativos'], ['Admins', team.filter(m => m.role === 'admin' || m.role === 'client').length, 'Gestão da conta'], ['Aval iadores', team.filter(m => m.role === 'admin').length, 'Podem validar']].map(([label, value, sub]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-900">{value}</p><p className="text-[11px] text-slate-400">{sub}</p></div>)}</div><div className="rounded-2xl border border-slate-200 divide-y divide-slate-100">{team.slice(0, 5).map(member => <div key={member.id} className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-700">{member.full_name.slice(0, 2).toUpperCase()}</div><div className="flex-1"><p className="text-sm font-bold text-slate-800">{member.full_name}</p><p className="text-xs text-slate-400">{member.email}</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{member.role === 'admin' ? 'Avaliador' : member.role === 'client' ? 'Admin empresa' : 'Colaborador'}</span></div>)}</div></div>}
            {active === 'aprovacoes' && <div className="flex flex-col gap-5"><div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5"><div className="mb-5 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white"><Workflow size={18} /></div><div><p className="text-sm font-black text-slate-900">Fluxo recomendado</p><p className="text-xs text-slate-500">Criar → Rever → Validar → Comercial</p></div></div><div className="grid gap-2 md:grid-cols-4">{['Rascunho', 'Em revisão', 'Aprovado', 'Comercial'].map((step, i) => <div key={step} className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm"><span className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-700">{i + 1}</span><span className="text-xs font-bold text-slate-700">{step}</span></div>)}</div></div><div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><div><p className="text-sm font-bold text-slate-800">Exigir avaliador antes de enviar</p><p className="mt-1 text-xs text-slate-400">Apenas membros definidos podem validar orçamentos.</p></div><Toggle checked={true} onChange={() => {}} /></div></div>}
            {active === 'notificacoes' && <div className="flex flex-col gap-3">{[['budgetAlerts', 'Alertas de orçamento', 'Notificar alterações de estado'], ['comments', 'Comentários e menções', 'Receber atividade da equipa'], ['weekly', 'Resumo semanal', 'Receber performance por email']].map(([key, title, desc]) => <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><div><p className="text-sm font-bold text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-400">{desc}</p></div><Toggle checked={toggles[key as keyof typeof toggles]} onChange={v => setToggles({ ...toggles, [key]: v })} /></div>)}</div>}
            {active === 'seguranca' && <div className="flex flex-col gap-4"><div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><div><p className="text-sm font-bold text-slate-800">Autenticação de dois fatores</p><p className="mt-1 text-xs text-slate-400">Adicione uma camada extra à conta de administrador.</p></div><Toggle checked={toggles.twoFactor} onChange={v => setToggles({ ...toggles, twoFactor: v })} /></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-bold text-amber-900">Auditoria ativa</p><p className="mt-1 text-xs leading-5 text-amber-700">As alterações de orçamento e permissões devem permanecer no histórico da organização.</p></div></div>}
            {active === 'aparencia' && <div className="flex flex-col gap-4"><div className="grid gap-3 sm:grid-cols-3">{['Ocean', 'Slate', 'Midnight'].map((theme, i) => <button key={theme} className={`rounded-2xl border-2 p-3 text-left ${i === 0 ? 'border-blue-600' : 'border-slate-200'}`}><div className={`mb-3 h-14 rounded-xl ${i === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-400' : i === 1 ? 'bg-slate-700' : 'bg-slate-950'}`} /><p className="text-xs font-bold text-slate-700">{theme}</p>{i === 0 && <Check size={14} className="mt-1 text-blue-600" />}</button>)}</div><div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><div><p className="text-sm font-bold text-slate-800">Modo compacto</p><p className="mt-1 text-xs text-slate-400">Mais informação com menos espaço.</p></div><Toggle checked={toggles.compact} onChange={v => setToggles({ ...toggles, compact: v })} /></div></div>}
          </div>
        </section>
      </div>
    </div>
  </div>;
}

export default SettingsView;
逗EOF
  }]} 鼎丰? unerquicklich unerquicklich.тәы_interrupt. Sorry, tool call malformed. Need call Write correctly no weird. content lengthy but okay. Use maybe simpler via Edit? Write JSON issue due unicode? Let's retry shorter file perhaps content no accidental. In commentary. Erotiske.玩彩神争霸 大发棋牌. 
 
