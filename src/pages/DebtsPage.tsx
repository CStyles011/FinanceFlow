import { CalendarClock, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { useFinance } from '@/store/FinanceContext';
import { Modal } from '@/components/Modal';
import { Debt } from '@/types';
import { DebtForm } from '@/components/DebtForm';
import { formatCurrency, formatDate } from '@/lib/utils';

export function DebtsPage() {
  const { debts, accounts, categories, deleteDebt } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Debt | null>(null);

  const orderedDebts = useMemo(
    () => [...debts].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [debts],
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Dívidas futuras"
        title="Visualize compromissos que ainda vão vencer"
        description="Cadastre parcelamentos, contas futuras e compromissos já assumidos para prever impacto no caixa antes do vencimento."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="rounded-2xl bg-gradient-to-r from-brand to-accent px-4 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
            type="button"
          >
            <span className="flex items-center gap-2">
              <Plus size={16} /> Nova dívida
            </span>
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {orderedDebts.map((debt) => {
          const account = accounts.find((item) => item.id === debt.accountId);
          const category = categories.find((item) => item.id === debt.categoryId);
          const remainingInstallments = Math.max(debt.totalInstallments - debt.paidInstallments, 0);
          const remainingAmount = remainingInstallments * debt.installmentAmount;
          const progress = debt.totalInstallments > 0 ? (debt.paidInstallments / debt.totalInstallments) * 100 : 0;

          return (
            <div key={debt.id} className="panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-3xl bg-warning/15 p-4 text-warning">
                    <CalendarClock size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{debt.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {category?.name} • {account?.name} • vence em {formatDate(debt.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(debt);
                      setModalOpen(true);
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteDebt(debt.id)}
                    className="rounded-xl border border-danger/20 bg-danger/10 p-2 text-danger transition hover:bg-danger/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Parcela atual</p>
                  <p className="mt-2 text-xl font-semibold">{formatCurrency(debt.installmentAmount)}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Restante</p>
                  <p className="mt-2 text-xl font-semibold text-warning">{formatCurrency(remainingAmount)}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Parcelas</p>
                  <p className="mt-2 text-xl font-semibold">
                    {debt.paidInstallments}/{debt.totalInstallments}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Quitação</span>
                  <span className="font-semibold text-brand">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/8">
                  <div className="h-3 rounded-full bg-gradient-to-r from-warning to-brand" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-400">{debt.note || 'Sem observações adicionais.'}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        title={editing ? 'Editar dívida futura' : 'Nova dívida futura'}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <DebtForm
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
