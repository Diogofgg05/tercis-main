import React, { useState } from 'react';
import { Zap, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

type Mode = 'login' | 'register';

export function LoginView() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) { setError('Preencha email e senha.'); return; }
    if (mode === 'register' && !fullName) { setError('Indique o seu nome.'); return; }
    setLoading(true);
    const err = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, fullName);
    setLoading(false);
    if (err) { setError(err); return; }
    if (mode === 'register') setSuccess('Conta criada! Pode agora iniciar sessão.');
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-14 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">tercis</p>
            <p className="text-cyan-300 text-xs">Operations OS</p>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
            A empresa toda<br />em <span className="text-cyan-300">sintonia</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            A tercis liga administração, empresas e equipas numa operação clara. Automatize tarefas, acompanhe aprovações e mantenha tudo no ritmo certo.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            {[
              { label: 'Setores', value: '10+' },
              { label: 'Componentes', value: '200+' },
              { label: 'Fornecedores', value: '40+' },
              { label: 'Funções', value: '∞' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-slate-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs">© 2026 tercis. Operações mais simples, equipas mais fortes.</p>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-cyan-400 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-slate-950" fill="currentColor" />
            </div>
            <p className="text-white font-bold">tercis</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login'
                ? 'Introduza as suas credenciais para continuar'
                : 'Preencha os dados para criar a sua conta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Field
                icon={<User size={15} />}
                type="text"
                placeholder="Nome completo"
                value={fullName}
                onChange={setFullName}
              />
            )}
            <Field
              icon={<Mail size={15} />}
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Lock size={15} />
              </span>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-950 border border-red-800 text-red-400 text-sm px-4 py-2.5 rounded-xl">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-sm px-4 py-2.5 rounded-xl">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-lg shadow-cyan-900/30"
            >
              {loading ? 'A processar...' : mode === 'login' ? 'Iniciar Sessão' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-slate-500 text-sm">
              {mode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
            </span>
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
              className="text-cyan-300 hover:text-cyan-200 text-sm font-semibold transition-colors"
            >
              {mode === 'login' ? 'Registar' : 'Iniciar sessão'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-slate-500 text-xs text-center">
              O primeiro utilizador a registar-se torna-se automaticamente <strong className="text-slate-400">Administrador</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon, type, placeholder, value, onChange,
}: {
  icon: React.ReactNode; type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
      />
    </div>
  );
}
