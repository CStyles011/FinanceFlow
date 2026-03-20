import { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export function FormField({ label, error, icon, className, ...props }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <div
        className={clsx(
          'flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 transition focus-within:border-brand/70 focus-within:ring-2 focus-within:ring-brand/20',
          className,
        )}
      >
        {icon ? <span className="text-slate-500">{icon}</span> : null}
        <input {...props} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
      </div>
      {error ? <span className="mt-2 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}
