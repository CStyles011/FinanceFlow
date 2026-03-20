import { CreditCard, Pencil, Plus, Trash2 } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { useFinance } from '@/store/FinanceContext';
import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Account } from '@/types';
import { AccountForm } from '@/components/AccountForm';
import { formatCurrency } from '@/lib/utils';

export function AccountsPage() {
  const { accountBalances, deleteAccount } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Contas"
        title="Múltiplas contas em um só lugar"
        description="Gerencie carteira, conta corrente, poupança e cartão com saldos individuais e visão consolidada."
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
              <Plus size={16} /> Nova conta
            </span>
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {accountBalances.map((account) => (
          <div key={account.id} className="panel bg-gradient-to-br from-white/8 to-white/[0.02] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl" style={{ backgroundColor: `${account.color}25`, color: account.color }}>
                  <CreditCard size={22} />
                </div>
                <h3 className="text-lg font-semibold">{account.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{account.type}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(account);
                    setModalOpen(true);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteAccount(account.id)}
                  className="rounded-xl border border-danger/20 bg-danger/10 p-2 text-danger transition hover:bg-danger/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-8 text-3xl font-bold tracking-tight">{formatCurrency(account.balance)}</p>
            <p className="mt-2 text-sm text-slate-400">Saldo atualizado com todas as movimentações.</p>
          </div>
        ))}
      </div>

      <Modal
        title={editing ? 'Editar conta' : 'Nova conta'}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <AccountForm
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
