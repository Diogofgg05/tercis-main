import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileText, BookOpen, Building2, Users,
  BarChart3, Settings, LogOut, Zap, ChevronRight,
  TrendingUp, Bell, HelpCircle, Menu, ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import type { UserRole } from '../types';

export type View = 'dashboard' | 'budgets' | 'editor' | 'catalog' | 'companies' | 'team' | 'reports' | 'settings';

interface Props {
  current: View;
  onChange: (v: View) => void;
  budgetCount?: number;
}

interface NavItem { id: View; label: string; icon: React.ReactNode; roles: UserRole[]; badge?: number }

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Super admin',
  collaborator: 'Colaborador',
  client: 'Admin da empresa',
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-blue-500/20 text-blue-300',
  collaborator: 'bg-emerald-500/20 text-emerald-300',
  client: 'bg-amber-500/20 text-amber-300',
};

export function Sidebar({ current, onChange, budgetCount = 0 }: Props) {
  const { profile, signOut } = useAuth();
  const role = profile?.role ?? 'collaborator';
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isCollapsed));
  }, [isCollapsed]);

  const NAV: NavItem[] = [
    { id: 'dashboard', label: 'Painel', icon: <LayoutDashboard size={18} />, roles: ['admin', 'collaborator', 'client'] },
    { id: 'budgets', label: 'Orçamentos', icon: <FileText size={18} />, roles: ['admin', 'collaborator', 'client'], badge: budgetCount > 0 ? budgetCount : undefined },
    { id: 'companies', label: role === 'client' ? 'A minha empresa' : 'Empresas', icon: <Building2 size={18} />, roles: ['admin', 'collaborator', 'client'] },
    { id: 'catalog', label: 'Catálogo', icon: <BookOpen size={18} />, roles: ['admin', 'collaborator'] },
    { id: 'reports', label: 'Relatórios', icon: <BarChart3 size={18} />, roles: ['admin', 'client'] },
    { id: 'team', label: role === 'client' ? 'A minha equipa' : 'Equipa', icon: <Users size={18} />, roles: ['admin', 'client'] },
    { id: 'settings', label: 'Definições', icon: <Settings size={18} />, roles: ['admin', 'collaborator', 'client'] },
  ];

  const visible = NAV.filter((n) => n.roles.includes(role));
  const initials = profile?.full_name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  const groups = [
    { label: 'Principal', items: visible.filter(n => ['dashboard', 'budgets'].includes(n.id)) },
    { label: 'Gestão', items: visible.filter(n => ['companies', 'catalog'].includes(n.id)) },
    { label: 'Analytics', items: visible.filter(n => ['reports', 'team'].includes(n.id)) },
    { label: 'Sistema', items: visible.filter(n => ['settings'].includes(n.id)) },
  ].filter(g => g.items.length > 0);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleCollapse}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 z-50 h-screen
        bg-slate-950 border-r border-white/5
        flex flex-col transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
      `}>
        {/* Header com botão de toggle */}
        <div className="px-4 py-5 border-b border-white/5 flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">tercis</p>
                  <p className="text-slate-600 text-[10px] font-medium mt-0.5">Operations OS</p>
                </div>
              </div>
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft size={14} className="text-slate-400" />
              </button>
            </>
          ) : (
            <>
              <div className="w-full flex justify-center">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <Zap size={16} className="text-white" />
                </div>
              </div>
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700 transition-colors absolute -right-3 top-1/2 -translate-y-1/2"
              >
                <ChevronRight size={14} className="text-slate-400" />
              </button>
            </>
          )}
        </div>

        {/* Botão fechar mobile */}
        <button
          onClick={toggleCollapse}
          className="lg:hidden absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10"
        >
          <ChevronLeft size={18} className="text-slate-400" />
        </button>

        {/* User block */}
        <div className="px-3 py-4 border-b border-white/5">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{profile?.full_name ?? 'Utilizador'}</p>
                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 ${ROLE_COLORS[role]}`}>
                  {ROLE_LABELS[role]}
                </span>
              </div>
            )}
            {!isCollapsed && <Bell size={13} className="text-slate-600 flex-shrink-0" />}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.label} className="mb-4">
              {!isCollapsed && (
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 px-2 mb-2">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = current === item.id || (current === 'editor' && item.id === 'budgets');
                  return (
                    <button
                      key={item.id}
                      onClick={() => onChange(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`
                        w-full flex items-center rounded-xl text-xs font-medium transition-all duration-150
                        ${active
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }
                        ${isCollapsed ? 'justify-center px-2 py-2' : 'justify-between px-3 py-2'}
                      `}
                    >
                      <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                        <span className={active ? 'text-white' : 'text-slate-500'}>
                          {item.icon}
                        </span>
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>
                      
                      {!isCollapsed && item.badge !== undefined && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-700'}`}>
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 py-3 border-t border-white/5">
          <button 
            className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-400 hover:bg-white/5 transition-all ${isCollapsed ? 'justify-center' : ''}`}
          >
            <HelpCircle size={16} />
            {!isCollapsed && 'Ajuda & Suporte'}
          </button>

          {showLogoutConfirm ? (
            <div className="mt-2 bg-red-950/50 border border-red-800/50 rounded-xl p-2 space-y-2">
              {!isCollapsed && <p className="text-red-400 text-[10px] font-semibold text-center">Sair da conta?</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-semibold hover:bg-slate-700"
                >
                  {isCollapsed ? 'X' : 'Cancelar'}
                </button>
                <button
                  onClick={signOut}
                  className="flex-1 py-1.5 rounded-lg bg-red-700 text-white text-[10px] font-semibold hover:bg-red-600"
                >
                  {isCollapsed ? '✓' : 'Sair'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`w-full flex items-center gap-3 px-2 py-2 mt-1 rounded-xl text-xs text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-all ${isCollapsed ? 'justify-center' : ''}`}
            >
              <LogOut size={16} />
              {!isCollapsed && 'Terminar sessão'}
            </button>
          )}
          
          {!isCollapsed && (
            <p className="text-slate-800 text-[9px] mt-3 px-2 flex items-center gap-1">
              <TrendingUp size={9} />
              v4.0 · 2026
            </p>
          )}
        </div>
      </aside>

      {/* Botão para abrir sidebar no mobile quando fechada */}
      {isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="lg:hidden fixed bottom-6 left-4 z-40 w-10 h-10 bg-slate-800 border border-white/10 rounded-xl flex items-center justify-center hover:bg-slate-700 shadow-lg"
        >
          <Menu size={18} className="text-white" />
        </button>
      )}
    </>
  );
}
