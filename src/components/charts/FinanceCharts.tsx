import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Category, Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function RevenueExpenseChart({ transactions }: { transactions: Transaction[] }) {
  const grouped = Object.entries(
    transactions.reduce<Record<string, { receitas: number; despesas: number }>>((acc, transaction) => {
      const month = transaction.date.slice(0, 7);
      if (!acc[month]) acc[month] = { receitas: 0, despesas: 0 };
      acc[month][transaction.type === 'receita' ? 'receitas' : 'despesas'] += transaction.amount;
      return acc;
    }, {}),
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, totals]) => ({
      month: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(`${month}-01T00:00:00`)),
      ...totals
    }));

  return (
    <ResponsiveContainer width="100%" height={310}>
      <BarChart data={grouped}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="month" stroke="#7d8bb1" />
        <YAxis stroke="#7d8bb1" tickFormatter={(value) => `R$${value / 1000}k`} />
        <Tooltip
          contentStyle={{ background: '#0b1224', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18 }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Bar dataKey="receitas" radius={[10, 10, 0, 0]} fill="#45d483" />
        <Bar dataKey="despesas" radius={[10, 10, 0, 0]} fill="#ff6b81" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryChart({
  transactions,
  categories
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const data = categories
    .map((category) => ({
      name: category.name,
      value: transactions
        .filter((transaction) => transaction.categoryId === category.id && transaction.type === 'despesa')
        .reduce((total, transaction) => total + transaction.amount, 0),
      color: category.color
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#0b1224', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18 }}
            formatter={(value: number) => formatCurrency(value)}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-3">
        {data.slice(0, 6).map((item) => (
          <div key={item.name} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-200">{item.name}</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
