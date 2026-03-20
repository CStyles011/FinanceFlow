import { useMemo, useState } from 'react';
import { Download, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { SectionHeader } from '@/components/SectionHeader';
import { FiltersBar } from '@/components/FiltersBar';
import { Modal } from '@/components/Modal';
import { TransactionForm } from '@/components/TransactionForm';
import { useFinance } from '@/store/FinanceContext';
import { Transaction } from '@/types';
import { exportTransactionsToCsv } from '@/lib/export';
import { formatCurrency, formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/EmptyState';

type SortKey = 'date' | 'description' | 'amount' | 'type';

export function TransactionsPage() {
  const { filteredTransactions, categories, accounts, deleteTransaction } = useFinance();
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortKey === 'amount') return (a.amount - b.amount) * direction;
      return a[sortKey].localeCompare(b[sortKey]) * direction;
    });
  }, [filteredTransactions, sortDirection, sortKey]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection(key === 'amount' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Transações"
        title="Controle detalhado em formato de planilha"
        description="Cadastre receitas e despesas com filtros avançados, edição rápida, ordenação por coluna e visual profissional inspirado em ferramentas modernas."
        action={
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => exportTransactionsToCsv(filteredTransactions, categories, accounts)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
              type="button"
            >
              <span className="flex items-center gap-2">
                <Download size={16} /> Exportar CSV
              </span>
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              className="rounded-2xl bg-gradient-to-r from-brand to-accent px-4 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
              type="button"
            >
              <span className="flex items-center gap-2">
                <Plus size={16} /> Nova transação
              </span>
            </button>
          </div>
        }
      />

      <FiltersBar />

      {sortedTransactions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhuma transação encontrada"
          description="Ajuste os filtros ou crie sua primeira movimentação para começar a alimentar a planilha financeira."
        />
      ) : (
        <div className="panel overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead className="sticky top-0 z-10 bg-[#0d1427]/95 backdrop-blur-xl">
                <tr>
                  {[
                    ['date', 'Data'],
                    ['description', 'Descrição'],
                    ['type', 'Tipo'],
                    ['amount', 'Valor']
                  ].map(([key, label]) => (
                    <th key={key} className="border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.24em] text-slate-500">
                      <button type="button" onClick={() => toggleSort(key as SortKey)} className="flex items-center gap-2">
                        {label}
                        <span className={clsx('text-[10px]', sortKey === key ? 'text-brand' : 'text-slate-600')}>
                          {sortKey === key ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                        </span>
                      </button>
                    </th>
                  ))}
                  <th className="border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.24em] text-slate-500">Categoria</th>
                  <th className="border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.24em] text-slate-500">Conta</th>
                  <th className="border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.24em] text-slate-500">Observação</th>
                  <th className="border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.24em] text-slate-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction) => {
                  const category = categories.find((item) => item.id === transaction.categoryId);
                  const account = accounts.find((item) => item.id === transaction.accountId);
                  return (
                    <tr key={transaction.id} className="transition hover:bg-white/[0.03]">
                      <td className="border-b border-white/5 px-5 py-4 text-sm text-slate-300">{formatDate(transaction.date)}</td>
                      <td className="border-b border-white/5 px-5 py-4">
                        <p className="font-medium">{transaction.description}</p>
                      </td>
                      <td className="border-b border-white/5 px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${transaction.type === 'receita' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className={`border-b border-white/5 px-5 py-4 text-sm font-semibold ${transaction.type === 'receita' ? 'text-success' : 'text-danger'}`}>
                        {transaction.type === 'receita' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="border-b border-white/5 px-5 py-4 text-sm text-slate-300">{category?.name}</td>
                      <td className="border-b border-white/5 px-5 py-4 text-sm text-slate-300">{account?.name}</td>
                      <td className="border-b border-white/5 px-5 py-4 text-sm text-slate-400">{transaction.note || 'Sem observação'}</td>
                      <td className="border-b border-white/5 px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(transaction);
                              setModalOpen(true);
                            }}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTransaction(transaction.id)}
                            className="rounded-xl border border-danger/20 bg-danger/10 p-2 text-danger transition hover:bg-danger/20"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        title={editing ? 'Editar transação' : 'Nova transação'}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <TransactionForm
          initialValue={editing}
          onSubmitDone={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </Modal>
    </div>
  );
}
