import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  tone?: 'default' | 'success' | 'danger' | 'brand';
  trend?: 'up' | 'down';
}

export function StatCard({ title, value, subtitle, icon: Icon, tone = 'default', trend }: StatCardProps) {
  const tones = {
    default: 'from-white/10 to-white/5',
    success: 'from-success/15 to-success/5',
    danger: 'from-danger/15 to-danger/5',
    brand: 'from-brand/15 to-brand/5'
  };

  return (
    <div className={`panel bg-gradient-to-br ${tones[tone]} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-white">
          <Icon size={20} />
        </div>
      </div>
      {trend ? (
        <div
          className={clsx(
            'mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
            trend === 'up' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger',
          )}
        >
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          Tendência {trend === 'up' ? 'positiva' : 'de atenção'}
        </div>
      ) : null}
    </div>
  );
}
