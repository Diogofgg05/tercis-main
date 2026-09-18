import React, { useState } from 'react';
import { Search, Send, Paperclip, MoreHorizontal, Circle, Sparkles } from 'lucide-react';

const conversations = [
  { name: 'Equipa Tercis', role: 'Canal geral', initials: 'ET', color: 'bg-blue-600', preview: 'O orçamento ORC-2026-014 está pronto para revisão.', time: '09:42', unread: 3 },
  { name: 'Marta Silva', role: 'Admin da empresa', initials: 'MS', color: 'bg-violet-600', preview: 'Enviei os documentos do cliente.', time: 'Ontem', unread: 0 },
  { name: 'João Costa', role: 'Colaborador', initials: 'JC', color: 'bg-emerald-600', preview: 'Pode validar os preços desta proposta?', time: 'Seg', unread: 0 },
];

export function ChatView() {
  const [selected, setSelected] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { from: 'Marta Silva', text: 'Bom dia. O orçamento da TechNova já pode seguir para aprovação?', own: false, time: '09:38' },
    { from: 'Você', text: 'Sim, estou a terminar a revisão dos itens e envio já.', own: true, time: '09:40' },
    { from: 'João Costa', text: 'O orçamento ORC-2026-014 está pronto para revisão.', own: false, time: '09:42' },
  ]);

  const sendMessage = () => {
    const value = message.trim();
    if (!value) return;
    setMessages((current) => [...current, { from: 'Você', text: value, own: true, time: 'agora' }]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] p-4 md:p-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="label text-blue-600">Colaboração</p><h1 className="section-title">Chat da equipa</h1><p className="mt-1 text-sm text-slate-500">Decisões, revisões e contexto no mesmo lugar que os seus orçamentos.</p></div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"><Circle size={8} fill="currentColor" /> 4 pessoas online</div>
      </header>
      <div className="card grid min-h-[620px] overflow-hidden lg:grid-cols-[300px_1fr]">
        <aside className="border-b border-slate-100 bg-white lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-100 p-4"><div className="relative"><Search size={15} className="absolute left-3 top-3 text-slate-400" /><input className="input-field pl-9" placeholder="Pesquisar conversas" /></div></div>
          <div className="flex flex-col gap-1 p-2">{conversations.map((conversation, index) => <button key={conversation.name} onClick={() => setSelected(index)} className={`flex items-center gap-3 rounded-xl p-3 text-left transition-colors ${selected === index ? 'bg-blue-50' : 'hover:bg-slate-50'}`}><div className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${conversation.color}`}>{conversation.initials}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-bold text-slate-800">{conversation.name}</p><span className="text-[10px] text-slate-400">{conversation.time}</span></div><p className="text-[11px] text-slate-400">{conversation.role}</p><p className="mt-1 truncate text-xs text-slate-500">{conversation.preview}</p></div>{conversation.unread > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{conversation.unread}</span>}</button>)}</div>
        </aside>
        <section className="flex min-h-[580px] flex-col bg-slate-50/60">
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white">{conversations[selected].initials}</div><div><p className="text-sm font-bold text-slate-800">{conversations[selected].name}</p><p className="text-xs text-emerald-600">Ativo agora</p></div></div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><MoreHorizontal size={18} /></button></div>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">{messages.map((item, index) => <div key={`${item.time}-${index}`} className={`flex ${item.own ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${item.own ? 'rounded-br-md bg-blue-600 text-white' : 'rounded-bl-md border border-slate-100 bg-white text-slate-700 shadow-sm'}`}><p className={`mb-1 text-[10px] font-bold ${item.own ? 'text-blue-100' : 'text-slate-400'}`}>{item.from}</p><p>{item.text}</p><p className={`mt-2 text-[10px] ${item.own ? 'text-blue-100' : 'text-slate-400'}`}>{item.time}</p></div></div>)}<div className="mt-auto flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700"><Sparkles size={15} /><span>Automação: quando um orçamento for aprovado, a equipa recebe uma notificação neste canal.</span></div></div>
          <div className="border-t border-slate-100 bg-white p-4"><div className="flex items-end gap-2"><button className="rounded-xl p-3 text-slate-400 hover:bg-slate-100"><Paperclip size={18} /></button><textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); sendMessage(); } }} rows={1} placeholder="Escreva uma mensagem..." className="input-field min-h-12 resize-none" /><button onClick={sendMessage} aria-label="Enviar mensagem" className="btn-primary p-3"><Send size={17} /></button></div></div>
        </section>
      </div>
    </div>
  );
}

export default ChatView;
