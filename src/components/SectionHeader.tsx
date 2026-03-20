import { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-brand/70">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
