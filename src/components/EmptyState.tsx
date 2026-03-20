import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="panel flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="rounded-3xl border border-brand/20 bg-brand/10 p-5 text-brand">
        <Icon size={28} />
      </div>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
