import { Goal as GoalIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Goal } from '@/types';
import { SectionHeader } from '@/components/SectionHeader';
import { useFinance } from '@/store/FinanceContext';
import { Modal } from '@/components/Modal';
import { GoalForm } from '@/components/GoalForm';
import { formatCurrency, formatDate } from '@/lib/utils';

export function GoalsPage() {
  const { goals, deleteGoal } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Metas"
        title="Construa objetivos com progresso visível"
        description="Defina quanto deseja juntar, acompanhe aportes mensais e veja sua evolução em barras elegantes e claras."
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
              <Plus size={16} /> Nova meta
            </span>
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {goals.map((goal) => {
          const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
          return (
            <div key={goal.id} className="panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-3xl bg-brand/15 p-4 text-brand">
                    <GoalIcon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{goal.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {goal.deadline ? `Prazo: ${formatDate(goal.deadline)}` : 'Sem prazo definido'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(goal);
                      setModalOpen(true);
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteGoal(goal.id)}
                    className="rounded-xl border border-danger/20 bg-danger/10 p-2 text-danger transition hover:bg-danger/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Atual</p>
                  <p className="mt-2 text-xl font-semibold">{formatCurrency(goal.currentAmount)}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Meta</p>
                  <p className="mt-2 text-xl font-semibold">{formatCurrency(goal.targetAmount)}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Aporte/mês</p>
                  <p className="mt-2 text-xl font-semibold">{formatCurrency(goal.monthlyContribution)}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Progresso</span>
                  <span className="font-semibold text-brand">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/8">
                  <div className="h-3 rounded-full bg-gradient-to-r from-brand to-accent" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  Status: {progress >= 100 ? 'concluída' : progress >= 50 ? 'em ótimo ritmo' : 'em andamento'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        title={editing ? 'Editar meta' : 'Nova meta'}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <GoalForm
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
