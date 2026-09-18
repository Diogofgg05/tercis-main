import React from 'react';
import {
  ArrowRight, ArrowUpRight, BarChart3, Check, ChevronRight,
  FileCheck2, Layers3, ShieldCheck, Sparkles, Users2, Zap,
} from 'lucide-react';

interface LandingViewProps {
  onLogin: () => void;
}

const features = [
  { icon: Layers3, title: 'Tudo num só lugar', text: 'Empresas, equipas, orçamentos e operações ligados numa única plataforma.' },
  { icon: Sparkles, title: 'Automação que trabalha', text: 'Atribua tarefas, acompanhe aprovações e mantenha cada cliente no ritmo certo.' },
  { icon: ShieldCheck, title: 'Permissões claras', text: 'Cada pessoa vê exatamente o que precisa. Sem confusão, sem acessos indevidos.' },
];

export function LandingView({ onLogin }: LandingViewProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9fc] text-slate-950">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 shadow-lg shadow-slate-900/20">
            <Zap className="text-cyan-300" size={19} fill="currentColor" />
          </div>
          <div>
            <p className="text-base font-black tracking-tight">tercis</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">operations OS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLogin} className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 sm:block">Entrar</button>
          <button onClick={onLogin} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800">Começar agora <ArrowRight size={15} /></button>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-14 lg:grid-cols-[1.02fr_.98fr] lg:px-10 lg:pb-28 lg:pt-24">
          <div className="absolute -left-40 top-10 size-96 rounded-full bg-cyan-200/30 blur-3xl" />
          <div className="relative">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-800"><span className="size-1.5 rounded-full bg-cyan-500" /> A nova forma de gerir operações</div>
            <h1 className="max-w-2xl text-5xl font-black leading-[.98] tracking-[-0.06em] sm:text-6xl lg:text-[5.35rem]">A empresa toda, <span className="text-cyan-500">em sintonia.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">A tercis dá ao administrador controlo total, ao representante da empresa clareza e aos colaboradores o foco para executar.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={onLogin} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-1 hover:bg-slate-800">Entrar na plataforma <ArrowUpRight size={17} /></button>
              <a href="#como-funciona" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-300">Ver como funciona <ChevronRight size={16} /></a>
            </div>
            <div className="mt-10 flex items-center gap-5 text-xs font-semibold text-slate-400"><div className="flex -space-x-2">{['DS','MC','AF','+'].map((x, i) => <span key={x} className={`flex size-8 items-center justify-center rounded-full border-2 border-[#f7f9fc] text-[10px] font-black ${i === 3 ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-600'}`}>{x}</span>)}</div><span>Feito para equipas que querem avançar</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-[530px] lg:ml-auto">
            <div className="absolute -right-6 -top-8 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl shadow-slate-300/30"><div className="flex items-center gap-2 text-xs font-bold text-slate-600"><span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><Check size={14} /></span> 12 tarefas concluídas</div></div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-300/40"><div className="rounded-[21px] bg-slate-950 p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">Visão geral</p><p className="mt-1 text-xl font-bold text-white">Bom dia, Diogo.</p></div><div className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-cyan-300"><BarChart3 size={17} /></div></div><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-slate-400">Volume ativo</p><p className="mt-2 text-2xl font-black text-white">€84.620</p><p className="mt-1 text-[10px] font-bold text-emerald-300">+18,4% este mês</p></div><div className="rounded-2xl bg-cyan-400 p-4"><p className="text-xs text-cyan-950/70">Taxa de aprovação</p><p className="mt-2 text-2xl font-black text-slate-950">78,6%</p><p className="mt-1 text-[10px] font-bold text-cyan-950/70">acima da meta</p></div></div><div className="mt-3 rounded-2xl bg-white/5 p-4"><div className="mb-4 flex items-center justify-between"><p className="text-xs font-bold text-slate-300">Fluxo de trabalho</p><span className="text-[10px] text-slate-500">Últimos 30 dias</span></div><div className="flex h-24 items-end gap-2">{[38,55,48,70,61,88,76,94,82,100,91,100].map((height, i) => <div key={i} className={`flex-1 rounded-t-md ${i > 8 ? 'bg-cyan-400' : 'bg-slate-700'}`} style={{ height: `${height}%` }} />)}</div></div></div></div>
            <div className="absolute -bottom-7 -left-8 flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl shadow-slate-300/30"><span className="flex size-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600"><FileCheck2 size={15} /></span><div><p className="text-[10px] text-slate-400">Automação ativa</p><p className="text-xs font-bold text-slate-700">Enviar lembrete de aprovação</p></div></div>
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28"><div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[.22em] text-cyan-600">Uma plataforma, três experiências</p><h2 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">Cada papel com o poder certo.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"><div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300"><Icon size={20} /></div><h3 className="mt-7 text-xl font-black tracking-tight">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{text}</p></article>)}</div><div className="mt-5 grid gap-4 rounded-3xl bg-cyan-300 p-7 sm:grid-cols-3 sm:p-10"><div><p className="text-3xl font-black tracking-tight">Super admin</p><p className="mt-2 text-sm text-cyan-950/70">Gere a plataforma inteira, empresas e regras.</p></div><div className="border-cyan-950/10 sm:border-l sm:pl-7"><p className="text-3xl font-black tracking-tight">Admin empresa</p><p className="mt-2 text-sm text-cyan-950/70">Lidera a conta e cria a sua equipa.</p></div><div className="border-cyan-950/10 sm:border-l sm:pl-7"><p className="text-3xl font-black tracking-tight">Colaborador</p><p className="mt-2 text-sm text-cyan-950/70">Executa, atualiza e entrega sem ruído.</p></div></div></section>
      </main>
      <footer className="border-t border-slate-200 px-6 py-8 text-center text-xs font-semibold text-slate-400">tercis · Operações mais simples, equipas mais fortes.</footer>
    </div>
  );
}
