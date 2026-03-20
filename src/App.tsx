import { useState } from 'react';
import {
  ArrowDownUp,
  CalendarClock,
  CreditCard,
  FolderKanban,
  Goal,
  LayoutDashboard,
  Menu,
  Settings,
  WalletCards
} from 'lucide-react';
import clsx from 'clsx';
import { DashboardPage } from '@/pages/DashboardPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { AccountsPage } from '@/pages/AccountsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ToastViewport } from '@/components/ToastViewport';
import { DebtsPage } from '@/pages/DebtsPage';
import { AuthPage } from '@/pages/AuthPage';
import { useAuth } from '@/store/AuthContext';
import { useFinance } from '@/store/FinanceContext';

type View =
  | 'dashboard'
  | 'transacoes'
  | 'categorias'
  | 'contas'
  | 'relatorios'
  | 'metas'
  | 'dividas'
  | 'configuracoes';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transacoes', label: 'Transações', icon: ArrowDownUp },
  { id: 'categorias', label: 'Categorias', icon: FolderKanban },
  { id: 'contas', label: 'Contas', icon: CreditCard },
  { id: 'relatorios', label: 'Relatórios', icon: WalletCards },
  { id: 'metas', label: 'Metas', icon: Goal },
  { id: 'dividas', label: 'Dívidas futuras', icon: CalendarClock },
  { id: 'configuracoes', label: 'Configurações', icon: Settings }
] as const;

export default function App() {
  const { cloudEnabled, session, loading: authLoading } = useAuth();
  const { isReady, storageMode } = useFinance();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading || !isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="panel w-full max-w-lg p-8 text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-brand/70">FinanceFlow</p>
          <h1 className="mt-3 text-3xl font-bold">Preparando seu ambiente financeiro</h1>
          <p className="mt-3 text-sm text-slate-400">
            Carregando dados e configurando sua experiência.
          </p>
        </div>
      </div>
    );
  }

  if (cloudEnabled && !session) {
    return <AuthPage />;
  }

  const page = (() => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage onNavigate={(view) => setActiveView(view)} />;
      case 'transacoes':
        return <TransactionsPage />;
      case 'categorias':
        return <CategoriesPage />;
      case 'contas':
        return <AccountsPage />;
      case 'relatorios':
        return <ReportsPage />;
      case 'metas':
        return <GoalsPage />;
      case 'dividas':
        return <DebtsPage />;
      case 'configuracoes':
        return <SettingsPage />;
    }
  })();

  return (
    <div className="min-h-screen bg-hero-grid">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 px-3 py-3 lg:px-6">
        <aside
          className={clsx(
            'panel fixed inset-y-3 left-3 z-40 flex w-[280px] flex-col p-5 transition duration-300 lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]',
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent text-lg font-bold text-ink">
              F
            </div>
            <div>
              <h1 className="text-lg font-bold">FinanceFlow</h1>
              <p className="text-sm text-slate-400">Controle financeiro premium</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-brand/20 bg-brand/10 p-4">
            <p className="text-xs uppercase tracking-[0.32em] text-brand/70">Visão geral</p>
            <h2 className="mt-2 text-2xl font-bold">Seu dinheiro em ordem.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Acompanhe saldo, gastos, metas, dívidas e desempenho mensal em uma única experiência.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition',
                    active
                      ? 'bg-gradient-to-r from-brand/25 to-accent/15 text-white shadow-soft'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  )}
                  type="button"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 text-sm text-slate-500">
            FinanceFlow v1.0
            <p className="mt-1">
              {storageMode === 'cloud'
                ? 'Sincronizado na nuvem'
                : 'Salvo localmente neste navegador'}
            </p>
          </div>
        </aside>

        {sidebarOpen ? (
          <button
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            type="button"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <main className="flex-1">
          <header className="panel sticky top-3 z-20 mb-4 flex items-center justify-between px-4 py-4 lg:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-brand/70">Painel financeiro</p>
              <h2 className="mt-1 text-2xl font-bold">Gestão pessoal inteligente</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right sm:block">
                <p className="text-xs text-slate-400">Status do sistema</p>
                <p className="text-sm font-semibold text-success">
                  {storageMode === 'cloud' ? 'Sincronização cloud ativa' : 'Sincronização local ativa'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white lg:hidden"
              >
                <Menu size={18} />
              </button>
            </div>
          </header>

          {page}
        </main>
      </div>
      <ToastViewport />
    </div>
  );
}
