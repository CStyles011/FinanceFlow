import { FormEvent, useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { useFinance } from '@/store/FinanceContext';
import { Debt } from '@/types';
import { formatCurrencyInput, parseCurrencyInput } from '@/lib/utils';

interface DebtFormProps {
  initialValue?: Debt | null;
  onSubmitDone: () => void;
}

export function DebtForm({ initialValue, onSubmitDone }: DebtFormProps) {
  const { addDebt, updateDebt, categories, accounts } = useFinance();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalInput, setTotalInput] = useState(formatCurrencyInput(initialValue?.totalAmount ?? 0));
  const [installmentInput, setInstallmentInput] = useState(formatCurrencyInput(initialValue?.installmentAmount ?? 0));
  const [form, setForm] = useState({
    title: initialValue?.title ?? '',
    totalAmount: initialValue?.totalAmount ?? 0,
    installmentAmount: initialValue?.installmentAmount ?? 0,
    totalInstallments: initialValue?.totalInstallments ?? 1,
    paidInstallments: initialValue?.paidInstallments ?? 0,
    dueDate: initialValue?.dueDate ?? new Date().toISOString().slice(0, 10),
    accountId: initialValue?.accountId ?? accounts[0]?.id ?? '',
    categoryId: initialValue?.categoryId ?? categories[0]?.id ?? '',
    note: initialValue?.note ?? ''
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!form.title.trim()) nextErrors.title = 'Informe uma descrição da dívida.';
    if (form.totalAmount <= 0) nextErrors.totalAmount = 'Informe o valor total.';
    if (form.installmentAmount <= 0) nextErrors.installmentAmount = 'Informe o valor da parcela.';
    if (form.totalInstallments < 1) nextErrors.totalInstallments = 'Informe a quantidade de parcelas.';
    if (form.paidInstallments > form.totalInstallments) nextErrors.paidInstallments = 'Parcelas pagas não podem exceder o total.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (initialValue) {
      updateDebt({ ...initialValue, ...form });
    } else {
      addDebt(form);
    }

    onSubmitDone();
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <FormField
        label="Descrição da dívida"
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
        error={errors.title}
        placeholder="Ex.: Parcelamento de celular"
      />
      <FormField
        label="Próximo vencimento"
        type="date"
        value={form.dueDate}
        onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
      />
      <FormField
        label="Valor total"
        value={`R$ ${totalInput}`}
        onChange={(event) => {
          const parsed = parseCurrencyInput(event.target.value);
          setTotalInput(formatCurrencyInput(parsed));
          setForm({ ...form, totalAmount: parsed });
        }}
        error={errors.totalAmount}
      />
      <FormField
        label="Valor da parcela"
        value={`R$ ${installmentInput}`}
        onChange={(event) => {
          const parsed = parseCurrencyInput(event.target.value);
          setInstallmentInput(formatCurrencyInput(parsed));
          setForm({ ...form, installmentAmount: parsed });
        }}
        error={errors.installmentAmount}
      />
      <FormField
        label="Total de parcelas"
        type="number"
        min={1}
        value={String(form.totalInstallments)}
        onChange={(event) => setForm({ ...form, totalInstallments: Number(event.target.value) })}
        error={errors.totalInstallments}
      />
      <FormField
        label="Parcelas pagas"
        type="number"
        min={0}
        value={String(form.paidInstallments)}
        onChange={(event) => setForm({ ...form, paidInstallments: Number(event.target.value) })}
        error={errors.paidInstallments}
      />
      <FormSelect
        label="Conta"
        value={form.accountId}
        onChange={(event) => setForm({ ...form, accountId: event.target.value })}
        options={accounts.map((account) => ({ value: account.id, label: account.name }))}
      />
      <FormSelect
        label="Categoria"
        value={form.categoryId}
        onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
        options={categories.map((category) => ({ value: category.id, label: category.name }))}
      />
      <div className="md:col-span-2">
        <FormTextarea
          label="Observação"
          value={form.note}
          onChange={(event) => setForm({ ...form, note: event.target.value })}
          placeholder="Detalhes úteis sobre esse compromisso futuro"
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
          {initialValue ? 'Salvar dívida' : 'Cadastrar dívida'}
        </button>
      </div>
    </form>
  );
}
