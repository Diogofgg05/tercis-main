import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LoginView } from './auth/LoginView';
import { Sidebar } from './components/Sidebar';
import type { View } from './components/Sidebar';
import { Toast } from './components/Toast';
import type { ToastType } from './components/Toast';
import { Dashboard } from './views/Dashboard';
import { BudgetList } from './views/BudgetList';
import { BudgetEditor } from './views/BudgetEditor';
import { CatalogView } from './views/CatalogView';
import { CompaniesView } from './views/CompaniesView';
import { TeamView } from './views/TeamView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { ChatView } from './views/ChatView';
import { LandingView } from './views/LandingView';
import type { Budget, BudgetStatus, Company, Profile } from './types';
import { DEMO_BUDGETS, DEMO_COMPANIES, DEMO_PROFILES, hydrateDemoBudget } from './demoData';
import { calcItem } from './calc';

// ----------------------------------------------
// Helpers
// ----------------------------------------------
function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function buildRef(count: number): string {
  return `ORC-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
}

function addDays(n: number): string {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10);
}

function emptyBudget(ref: string, userId: string): Budget {
  return {
    id: newId(), ref,
    name: '', company_id: null, assigned_to: userId,
    status: 'rascunho' as BudgetStatus,
    sector: 'Eletricidade Industrial',
    date: new Date().toISOString().slice(0, 10),
    valid_until: addDays(30),
    notes: '', client_contact: '', client_email: '',
    include_tax: false, tax_rate: 23,
    created_by: userId, items: [],
  };
}

// ----------------------------------------------
// Inner app (requires auth)
// ----------------------------------------------
type ToastState = { message: string; type: ToastType } | null;

function AppInner() {
  const { profile } = useAuth();
  const [view, setView] = useState<View>('dashboard');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);
  const [activeBudget, setActiveBudget] = useState<Budget | null>(null);
  const [unsaved, setUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const notify = useCallback((message: string, type: ToastType = 'success') => setToast({ message, type }), []);

  // -- Load data ------------------------------
  function loadBudgets() {
    const saved = localStorage.getItem('tercis_budgets');
    setBudgets(saved ? JSON.parse(saved) : DEMO_BUDGETS.map(hydrateDemoBudget));
  }

  function loadCompanies() {
    const saved = localStorage.getItem('tercis_companies');
    setCompanies(saved ? JSON.parse(saved) : DEMO_COMPANIES);
  }

  function loadTeam() { setTeam(DEMO_PROFILES); }

  useEffect(() => { loadBudgets(); loadCompanies(); loadTeam(); }, []);

  // -- Budget CRUD ----------------------------
  async function handleSave() {
    if (!activeBudget || !profile) return;
    if (!activeBudget.name.trim()) { notify('Indique uma designação para o orçamento.', 'error'); return; }
    setSaving(true);
    try {
      const nextBudget = hydrateDemoBudget({ ...activeBudget, created_by: activeBudget.created_by ?? profile.id, updated_at: new Date().toISOString() });
      const next = budgets.some((item) => item.id === nextBudget.id)
        ? budgets.map((item) => item.id === nextBudget.id ? nextBudget : item)
        : [nextBudget, ...budgets];
      setBudgets(next);
      localStorage.setItem('tercis_budgets', JSON.stringify(next));
      setUnsaved(false);
      notify('Orçamento guardado.');
    } catch (e: any) {
      notify(e.message ?? 'Erro ao guardar.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function openBudget(b: Budget) {
    setActiveBudget({ ...b, items: b.items ?? [] });
    setUnsaved(false);
    setView('editor');
  }

  function openNew() {
    if (!profile) return;
    setActiveBudget(emptyBudget(buildRef(budgets.length), profile.id));
    setUnsaved(false);
    setView('editor');
  }

  function duplicateBudget(b: Budget) {
    if (!profile) return;
    const copy: Budget = {
      ...b,
      id: newId(),
      ref: buildRef(budgets.length),
      name: `${b.name} (cópia)`,
      date: new Date().toISOString().slice(0, 10),
      valid_until: addDays(30),
      status: 'rascunho',
      created_by: profile.id,
      items: (b.items ?? []).map((i) => ({ ...i, id: newId(), budget_id: undefined })),
    };
    setActiveBudget(copy);
    setUnsaved(true);
    setView('editor');
    notify('Orçamento duplicado. Guarde para confirmar.', 'info');
  }

  async function deleteBudget(id: string) {
    const next = budgets.filter((budget) => budget.id !== id);
    setBudgets(next);
    localStorage.setItem('tercis_budgets', JSON.stringify(next));
    notify('Orçamento eliminado.', 'info');
  }

  function handleBack() {
    if (unsaved && !confirm('Tem alterações por guardar. Sair sem guardar?')) return;
    setView('budgets');
    setActiveBudget(null);
    setUnsaved(false);
  }

  function changeActiveBudget(b: Budget) {
    setActiveBudget(b);
    setUnsaved(true);
  }

  const isEditor = view === 'editor';

  return (
    <div className="flex bg-slate-100 min-h-screen">
      {!isEditor && (
        <Sidebar
          current={view}
          budgetCount={budgets.length}
          onChange={(v) => {
            if (v !== 'editor') { setActiveBudget(null); setUnsaved(false); }
            setView(v);
          }}
        />
      )}

      <main className="flex-1 min-w-0 overflow-x-hidden">
        {view === 'dashboard' && (
          <Dashboard
            budgets={budgets}
            companies={companies}
            onNew={openNew}
            onOpen={openBudget}
          />
        )}
        {view === 'budgets' && (
          <BudgetList
            budgets={budgets}
            companies={companies}
            team={team}
            onNew={openNew}
            onEdit={openBudget}
            onDelete={(id) => { if (confirm('Eliminar orçamento?')) deleteBudget(id); }}
            onDuplicate={duplicateBudget}
          />
        )}
        {view === 'editor' && activeBudget && (
          <BudgetEditor
            budget={activeBudget}
            companies={companies}
            team={team}
            onChange={changeActiveBudget}
            onSave={handleSave}
            onBack={handleBack}
            saving={saving}
            unsaved={unsaved}
          />
        )}
        {view === 'catalog' && <CatalogView />}
        {view === 'companies' && (
          <CompaniesView
            companies={companies}
            budgets={budgets}
            onRefresh={() => { loadCompanies(); loadBudgets(); }}
          />
        )}
        {view === 'team' && (
          <TeamView
            team={team}
            budgets={budgets}
            onRefresh={loadTeam}
          />
        )}
        {view === 'reports' && (
          <ReportsView
            budgets={budgets}
            companies={companies}
            team={team}
          />
        )}
        {view === 'settings' && (
          <SettingsView
            budgets={budgets}
            companies={companies}
            team={team}
          />
        )}
        {view === 'chat' && <ChatView />}
      </main>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}

// ----------------------------------------------
// Root with auth guard
// ----------------------------------------------
function AppRoot() {
  const { session, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!session) return showLogin ? <LoginView /> : <LandingView onLogin={() => setShowLogin(true)} />;
  return <AppInner />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  );
}
