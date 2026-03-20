import { Search } from 'lucide-react';
import { useFinance } from '@/store/FinanceContext';

export function FiltersBar() {
  const { filters, setFilters, categories, accounts } = useFinance();

  return (
    <div className="panel mb-6 grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-6">
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Mês</span>
        <input
          type="month"
          value={filters.month}
          onChange={(event) => setFilters({ ...filters, month: event.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">De</span>
        <input
          type="date"
          value={filters.startDate}
          onChange={(event) => setFilters({ ...filters, startDate: event.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Até</span>
        <input
          type="date"
          value={filters.endDate}
          onChange={(event) => setFilters({ ...filters, endDate: event.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Categoria</span>
        <select
          value={filters.categoryId}
          onChange={(event) => setFilters({ ...filters, categoryId: event.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm outline-none"
        >
          <option value="todos">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Tipo</span>
        <select
          value={filters.type}
          onChange={(event) => setFilters({ ...filters, type: event.target.value as typeof filters.type })}
          className="w-full rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm outline-none"
        >
          <option value="todos">Todos</option>
          <option value="receita">Receitas</option>
          <option value="despesa">Despesas</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Conta</span>
        <select
          value={filters.accountId}
          onChange={(event) => setFilters({ ...filters, accountId: event.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm outline-none"
        >
          <option value="todos">Todas</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </label>

      <label className="md:col-span-2 xl:col-span-6">
        <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Busca</span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3">
          <Search size={16} className="text-slate-500" />
          <input
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
            placeholder="Busque por descrição da transação"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
        </div>
      </label>
    </div>
  );
}
