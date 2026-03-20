import { FormEvent, useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { useFinance } from '@/store/FinanceContext';
import { Transaction } from '@/types';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';

interface TransactionFormProps {
  initialValue?: Transaction | null;
  onSubmitDone: () => void;
}

export function TransactionForm({ initialValue, onSubmitDone }: TransactionFormProps) {
  const { addTransaction, updateTransaction, categories, accounts } = useFinance();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [amountInput, setAmountInput] = useState(
    initialValue ? formatCurrencyInput(initialValue.amount) : formatCurrencyInput(0),
  );
  const [form, setForm] = useState({
    description: initialValue?.description ?? '',
    amount: initialValue?.amount ?? 0,
    categoryId: initialValue?.categoryId ?? categories[0]?.id ?? '',
    type: initialValue?.type ?? 'despesa',
    date: initialValue?.date ?? new Date().toISOString().slice(0, 10),
    accountId: initialValue?.accountId ?? accounts[0]?.id ?? '',
    note: initialValue?.note ?? ''
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!form.description.trim()) nextErrors.description = 'Informe a descrição.';
    if (form.amount <= 0) nextErrors.amount = 'Informe um valor maior que zero.';
    if (!form.categoryId) nextErrors.categoryId = 'Escolha uma categoria.';
    if (!form.accountId) nextErrors.accountId = 'Escolha uma conta.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (initialValue) {
      updateTransaction({ ...initialValue, ...form });
    } else {
      addTransaction(form);
    }

    onSubmitDone();
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <FormField
        label="Descrição"
        value={form.description}
        onChange={(event) => setForm({ ...form, description: event.target.value })}
        placeholder="Ex.: Mercado, salário, freelance"
        error={errors.description}
      />
      <FormSelect
        label="Tipo"
        value={form.type}
        onChange={(event) => setForm({ ...form, type: event.target.value as typeof form.type })}
        options={[
          { value: 'receita', label: 'Receita' },
          { value: 'despesa', label: 'Despesa' }
        ]}
      />
      <FormField
        label="Valor"
        value={`R$ ${amountInput}`}
        onChange={(event) => {
          const parsed = parseCurrencyInput(event.target.value);
          setAmountInput(formatCurrencyInput(parsed));
          setForm({ ...form, amount: parsed });
        }}
        placeholder="R$ 0,00"
        error={errors.amount}
      />
      <FormField
        label="Data"
        type="date"
        value={form.date}
        onChange={(event) => setForm({ ...form, date: event.target.value })}
      />
      <FormSelect
        label="Categoria"
        value={form.categoryId}
        onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
        options={categories.map((category) => ({ value: category.id, label: category.name }))}
        error={errors.categoryId}
      />
      <FormSelect
        label="Conta"
        value={form.accountId}
        onChange={(event) => setForm({ ...form, accountId: event.target.value })}
        options={accounts.map((account) => ({ value: account.id, label: account.name }))}
        error={errors.accountId}
      />
      <div className="md:col-span-2">
        <FormTextarea
          label="Observação"
          value={form.note}
          onChange={(event) => setForm({ ...form, note: event.target.value })}
          placeholder="Anote detalhes importantes dessa movimentação"
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
          {initialValue ? 'Salvar alterações' : 'Adicionar transação'}
        </button>
      </div>
    </form>
  );
}
