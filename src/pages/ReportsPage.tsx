import { Download, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { CategoryChart, RevenueExpenseChart } from '@/components/charts/FinanceCharts';
import { useFinance } from '@/store/FinanceContext';
import { exportElementToPdf } from '@/lib/export';
import { formatCurrency } from '@/lib/utils';

export function ReportsPage() {
  const { transactions, filteredTransactions, categories, accounts, debts } = useFinance();

  const reportData = useMemo(() => {
    const expenses = filteredTransactions.filter((item) => item.type === 'despesa');
    const revenue = filteredTransactions.filter((item) => item.type === 'receita');
    const byCategory = categories
      .map((category) => ({
        category: category.name,
        total: expenses.filter((item) => item.categoryId === category.id).reduce((sum, item) => sum + item.amount, 0)
      }))
      .sort((a, b) => b.total - a.total);

    const biggestExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];
    const topCategory = byCategory[0];
    const totalSaved = revenue.reduce((sum, item) => sum + item.amount, 0) - expenses.reduce((sum, item) => sum + item.amount, 0);
    const averageExpense = expenses.length > 0 ? expenses.reduce((sum, item) => sum + item.amount, 0) / expenses.length : 0;
    const byAccount = accounts.map((account) => ({
      name: account.name,
      total: filteredTransactions
        .filter((item) => item.accountId === account.id)
        .reduce((sum, item) => sum + (item.type === 'receita' ? item.amount : -item.amount), 0)
    }));
    const futureDebtTotal = debts.reduce(
      (sum, debt) => sum + Math.max(debt.totalInstallments - debt.paidInstallments, 0) * debt.installmentAmount,
      0,
    );

    return {
      biggestExpense,
      topCategory,
      totalSaved,
      averageExpense,
      byAccount,
      futureDebtTotal
    };
  }, [accounts, categories, debts, filteredTransactions]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Relatórios"
        title="Insights claros para decisões melhores"
        description="Analise comparativos mensais, concentração por categoria, comportamento por conta e um resumo inteligente com os principais sinais do período."
        action={
          <button
            onClick={() => exportElementToPdf('report-capture', 'financeflow-relatorio.pdf')}
            className="rounded-2xl bg-gradient-to-r from-brand to-accent px-4 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
            type="button"
          >
            <span className="flex items-center gap-2">
              <Download size={16} /> Exportar PDF
            </span>
          </button>
        }
      />

      <div id="report-capture" className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-5">
          <div className="panel p-5">
            <p className="text-sm text-slate-400">Maior gasto do mês</p>
            <p className="mt-3 text-2xl font-bold">
              {reportData.biggestExpense ? formatCurrency(reportData.biggestExpense.amount) : formatCurrency(0)}
            </p>
            <p className="mt-2 text-sm text-slate-400">{reportData.biggestExpense?.description ?? 'Sem despesas no período selecionado'}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-slate-400">Categoria campeã em gastos</p>
            <p className="mt-3 text-2xl font-bold">{reportData.topCategory?.category ?? 'Sem dados'}</p>
            <p className="mt-2 text-sm text-slate-400">{formatCurrency(reportData.topCategory?.total ?? 0)}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-slate-400">Total economizado</p>
            <p className={`mt-3 text-2xl font-bold ${reportData.totalSaved >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(reportData.totalSaved)}
            </p>
            <p className="mt-2 text-sm text-slate-400">Diferença entre receitas e despesas.</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-slate-400">Média de gastos</p>
            <p className="mt-3 text-2xl font-bold">{formatCurrency(reportData.averageExpense)}</p>
            <p className="mt-2 text-sm text-slate-400">Média por transação de despesa.</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-slate-400">Dívidas futuras</p>
            <p className="mt-3 text-2xl font-bold text-warning">{formatCurrency(reportData.futureDebtTotal)}</p>
            <p className="mt-2 text-sm text-slate-400">Compromissos ainda não quitados.</p>
          </div>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-brand/70">Comparativo de meses</p>
            <h3 className="mt-2 text-xl font-semibold">Receitas e despesas</h3>
            <div className="mt-6">
              <RevenueExpenseChart transactions={transactions} />
            </div>
          </div>

          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-brand/70">Categoria</p>
            <h3 className="mt-2 text-xl font-semibold">Distribuição por categoria</h3>
            <div className="mt-6">
              <CategoryChart transactions={filteredTransactions} categories={categories} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-brand/70">Resumo por conta</p>
            <h3 className="mt-2 text-xl font-semibold">Desempenho consolidado</h3>
            <div className="mt-5 space-y-3">
              {reportData.byAccount.map((item) => (
                <div key={item.name} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-300">{item.name}</span>
                    <span className={`text-sm font-semibold ${item.total >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand/15 p-3 text-brand">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-brand/70">Resumo inteligente</p>
                <h3 className="mt-1 text-xl font-semibold">Leitura automática do período</h3>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                O maior gasto registrado no filtro atual foi{' '}
                <span className="font-semibold text-white">{reportData.biggestExpense?.description ?? 'nenhuma despesa relevante'}</span>{' '}
                com valor de <span className="font-semibold text-white">{formatCurrency(reportData.biggestExpense?.amount ?? 0)}</span>.
              </p>
              <p>
                A categoria que mais consumiu dinheiro foi <span className="font-semibold text-white">{reportData.topCategory?.category ?? 'sem categoria líder'}</span>, totalizando{' '}
                <span className="font-semibold text-white">{formatCurrency(reportData.topCategory?.total ?? 0)}</span>.
              </p>
              <p>
                O período fechou com <span className={`font-semibold ${reportData.totalSaved >= 0 ? 'text-success' : 'text-danger'}`}>{reportData.totalSaved >= 0 ? 'economia' : 'déficit'} de {formatCurrency(reportData.totalSaved)}</span> e uma média de gastos de{' '}
                <span className="font-semibold text-white">{formatCurrency(reportData.averageExpense)}</span> por saída.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
