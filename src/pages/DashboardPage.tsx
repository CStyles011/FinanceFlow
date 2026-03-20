import { Activity, ArrowDownCircle, ArrowUpCircle, CalendarClock, Landmark, Sparkles } from 'lucide-react';
import { useFinance } from '@/store/FinanceContext';
import { SectionHeader } from '@/components/SectionHeader';
import { StatCard } from '@/components/StatCard';
import { CategoryChart, RevenueExpenseChart } from '@/components/charts/FinanceCharts';
import { formatCurrency, formatDate } from '@/lib/utils';

export function DashboardPage({ onNavigate }: { onNavigate: (view: 'transacoes' | 'metas' | 'relatorios' | 'dividas') => void }) {
  const { transactions, filteredTransactions, categories, accounts, accountBalances, debts } = useFinance();

  const totalRevenue = filteredTransactions.filter((item) => item.type === 'receita').reduce((total, item) => total + item.amount, 0);
  const totalExpense = filteredTransactions.filter((item) => item.type === 'despesa').reduce((total, item) => total + item.amount, 0);
  const totalBalance = accountBalances.reduce((total, item) => total + item.balance, 0);
  const monthlyBalance = totalRevenue - totalExpense;
  const recentTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const futureDebtAmount = debts.reduce((total, debt) => total + Math.max(debt.totalInstallments - debt.paidInstallments, 0) * debt.installmentAmount, 0);
  const nextDebt = [...debts].sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Dashboard"
        title="Visão completa das suas finanças"
        description="Acompanhe indicadores principais, tendência mensal, desempenho por categoria e movimentações recentes em uma experiência SaaS refinada."
        action={
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('transacoes')}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
              type="button"
            >
              Nova transação
            </button>
            <button
              onClick={() => onNavigate('relatorios')}
              className="rounded-2xl bg-gradient-to-r from-brand to-accent px-4 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
              type="button"
            >
              Ver relatórios
            </button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <StatCard title="Saldo total" value={formatCurrency(totalBalance)} subtitle="Somando todas as contas" icon={Landmark} tone="brand" trend={totalBalance >= 0 ? 'up' : 'down'} />
        <StatCard title="Receitas" value={formatCurrency(totalRevenue)} subtitle="Entradas filtradas no período" icon={ArrowUpCircle} tone="success" trend="up" />
        <StatCard title="Despesas" value={formatCurrency(totalExpense)} subtitle="Saídas filtradas no período" icon={ArrowDownCircle} tone="danger" trend={totalExpense > totalRevenue ? 'down' : 'up'} />
        <StatCard title="Saldo do mês" value={formatCurrency(monthlyBalance)} subtitle="Diferença entre entradas e saídas" icon={Activity} tone={monthlyBalance >= 0 ? 'success' : 'danger'} trend={monthlyBalance >= 0 ? 'up' : 'down'} />
        <StatCard title="Dívidas futuras" value={formatCurrency(futureDebtAmount)} subtitle={nextDebt ? `Próximo vencimento em ${formatDate(nextDebt.dueDate)}` : 'Nenhuma dívida cadastrada'} icon={CalendarClock} tone="default" trend={futureDebtAmount > 0 ? 'down' : 'up'} />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-5">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.28em] text-brand/70">Receitas x despesas</p>
            <h3 className="mt-2 text-xl font-semibold">Comportamento dos últimos meses</h3>
          </div>
          <RevenueExpenseChart transactions={transactions} />
        </div>

        <div className="panel p-5">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.28em] text-brand/70">Categorias</p>
            <h3 className="mt-2 text-xl font-semibold">Distribuição dos gastos</h3>
          </div>
          <CategoryChart transactions={filteredTransactions} categories={categories} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-5">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.28em] text-brand/70">Contas</p>
            <h3 className="mt-2 text-xl font-semibold">Saldo por conta</h3>
          </div>
          <div className="space-y-3">
            {accountBalances.map((account) => (
              <div key={account.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: account.color }} />
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-slate-400">{account.type}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{formatCurrency(account.balance)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-brand/70">Atividade</p>
              <h3 className="mt-2 text-xl font-semibold">Transações recentes</h3>
            </div>
            <button
              onClick={() => onNavigate('transacoes')}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
              type="button"
            >
              Ver tudo
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const category = categories.find((item) => item.id === transaction.categoryId);
              const account = accounts.find((item) => item.id === transaction.accountId);
              return (
                <div key={transaction.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {category?.name} • {account?.name} • {formatDate(transaction.date)}
                      </p>
                    </div>
                    <p className={transaction.type === 'receita' ? 'text-success' : 'text-danger'}>
                      {transaction.type === 'receita' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-3xl border border-brand/20 bg-brand/10 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3 text-brand">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="font-semibold">Leitura rápida do mês</p>
                <p className="text-sm text-slate-300">
                  Seu saldo mensal está {monthlyBalance >= 0 ? 'positivo' : 'negativo'} em{' '}
                  <span className="font-semibold text-white">{formatCurrency(monthlyBalance)}</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-warning/20 bg-warning/10 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">Radar de dívidas futuras</p>
                <p className="mt-1 text-sm text-slate-300">
                  Você ainda tem <span className="font-semibold text-white">{formatCurrency(futureDebtAmount)}</span> em compromissos futuros.
                </p>
              </div>
              <button
                onClick={() => onNavigate('dividas')}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm transition hover:bg-white/15"
                type="button"
              >
                Ver dívidas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
