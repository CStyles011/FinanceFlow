import { FormEvent, useState } from 'react';
import { Goal } from '@/types';
import { useFinance } from '@/store/FinanceContext';
import { FormField } from '@/components/forms/FormField';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';

interface GoalFormProps {
  initialValue?: Goal | null;
  onSubmitDone: () => void;
}

export function GoalForm({ initialValue, onSubmitDone }: GoalFormProps) {
  const { addGoal, updateGoal } = useFinance();
  const [targetInput, setTargetInput] = useState(formatCurrencyInput(initialValue?.targetAmount ?? 0));
  const [monthlyInput, setMonthlyInput] = useState(formatCurrencyInput(initialValue?.monthlyContribution ?? 0));
  const [currentInput, setCurrentInput] = useState(formatCurrencyInput(initialValue?.currentAmount ?? 0));
  const [form, setForm] = useState({
    title: initialValue?.title ?? '',
    targetAmount: initialValue?.targetAmount ?? 0,
    monthlyContribution: initialValue?.monthlyContribution ?? 0,
    currentAmount: initialValue?.currentAmount ?? 0,
    deadline: initialValue?.deadline ?? ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError('Informe um nome para a meta.');
      return;
    }

    if (initialValue) {
      updateGoal({ ...initialValue, ...form });
    } else {
      addGoal(form);
    }

    onSubmitDone();
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <FormField
        label="Nome da meta"
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
        placeholder="Ex.: Reserva, viagem, notebook"
        error={error}
      />
      <FormField
        label="Prazo"
        type="date"
        value={form.deadline}
        onChange={(event) => setForm({ ...form, deadline: event.target.value })}
      />
      <FormField
        label="Valor alvo"
        value={`R$ ${targetInput}`}
        onChange={(event) => {
          const parsed = parseCurrencyInput(event.target.value);
          setTargetInput(formatCurrencyInput(parsed));
          setForm({ ...form, targetAmount: parsed });
        }}
      />
      <FormField
        label="Aporte mensal"
        value={`R$ ${monthlyInput}`}
        onChange={(event) => {
          const parsed = parseCurrencyInput(event.target.value);
          setMonthlyInput(formatCurrencyInput(parsed));
          setForm({ ...form, monthlyContribution: parsed });
        }}
      />
      <div className="md:col-span-2">
        <FormField
          label="Valor já acumulado"
          value={`R$ ${currentInput}`}
          onChange={(event) => {
            const parsed = parseCurrencyInput(event.target.value);
            setCurrentInput(formatCurrencyInput(parsed));
            setForm({ ...form, currentAmount: parsed });
          }}
        />
      </div>
      <div className="md:col-span-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={onSubmitDone}
          className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-brand to-accent px-5 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
        >
          {initialValue ? 'Salvar meta' : 'Criar meta'}
        </button>
      </div>
    </form>
  );
}
