import { FormEvent, useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { Category } from '@/types';
import { useFinance } from '@/store/FinanceContext';

const iconOptions = ['Shapes', 'UtensilsCrossed', 'Car', 'Home', 'HeartPulse', 'Sparkles', 'BookOpen', 'PiggyBank'];

interface CategoryFormProps {
  initialValue?: Category | null;
  onSubmitDone: () => void;
}

export function CategoryForm({ initialValue, onSubmitDone }: CategoryFormProps) {
  const { addCategory, updateCategory } = useFinance();
  const [form, setForm] = useState({
    name: initialValue?.name ?? '',
    color: initialValue?.color ?? '#7c9cff',
    icon: initialValue?.icon ?? 'Shapes',
    builtIn: initialValue?.builtIn ?? false
  });
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Informe o nome da categoria.');
      return;
    }

    if (initialValue) {
      updateCategory({ ...initialValue, ...form });
    } else {
      addCategory(form);
    }

    onSubmitDone();
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <FormField
        label="Nome da categoria"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
        placeholder="Ex.: Pets, presentes, assinatura"
        error={error}
      />
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-300">Cor</span>
        <input
          type="color"
          value={form.color}
          onChange={(event) => setForm({ ...form, color: event.target.value })}
          className="h-[54px] w-full rounded-2xl border border-white/10 bg-[#0b1224] p-2"
        />
      </label>
      <label className="md:col-span-2 block">
        <span className="mb-2 block text-sm font-medium text-slate-300">Ícone</span>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {iconOptions.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setForm({ ...form, icon })}
              className={`rounded-2xl border px-4 py-3 text-sm transition ${
                form.icon === icon ? 'border-brand bg-brand/15 text-white' : 'border-white/10 bg-white/5 text-slate-300'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
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
          {initialValue ? 'Salvar categoria' : 'Criar categoria'}
        </button>
      </div>
    </form>
  );
}
