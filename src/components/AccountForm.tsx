import { FormEvent, useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { Account } from '@/types';
import { useFinance } from '@/store/FinanceContext';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';

interface AccountFormProps {
  initialValue?: Account | null;
  onSubmitDone: () => void;
}

export function AccountForm({ initialValue, onSubmitDone }: AccountFormProps) {
  const { addAccount, updateAccount } = useFinance();
  const [balanceInput, setBalanceInput] = useState(formatCurrencyInput(initialValue?.initialBalance ?? 0));
  const [form, setForm] = useState({
    name: initialValue?.name ?? '',
    type: initialValue?.type ?? 'Conta corrente',
    initialBalance: initialValue?.initialBalance ?? 0,
    color: initialValue?.color ?? '#7c9cff'
  });
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Informe o nome da conta.');
      return;
    }

    if (initialValue) {
      updateAccount({ ...initialValue, ...form });
    } else {
      addAccount(form);
    }

    onSubmitDone();
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <FormField
        label="Nome da conta"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
        placeholder="Ex.: Nubank, Itaú, Dinheiro"
        error={error}
      />
      <FormSelect
        label="Tipo da conta"
        value={form.type}
        onChange={(event) => setForm({ ...form, type: event.target.value as Account['type'] })}
        options={[
          { value: 'Carteira', label: 'Carteira' },
          { value: 'Conta corrente', label: 'Conta corrente' },
          { value: 'Poupança', label: 'Poupança' },
          { value: 'Cartão', label: 'Cartão' },
          { value: 'Outro', label: 'Outro' }
        ]}
      />
      <FormField
        label="Saldo inicial"
        value={`R$ ${balanceInput}`}
        onChange={(event) => {
          const parsed = parseCurrencyInput(event.target.value);
          setBalanceInput(formatCurrencyInput(parsed));
          setForm({ ...form, initialBalance: parsed });
        }}
      />
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-300">Cor da conta</span>
        <input
          type="color"
          value={form.color}
          onChange={(event) => setForm({ ...form, color: event.target.value })}
          className="h-[54px] w-full rounded-2xl border border-white/10 bg-[#0b1224] p-2"
        />
      </label>
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
          {initialValue ? 'Salvar conta' : 'Criar conta'}
        </button>
      </div>
    </form>
  );
}
