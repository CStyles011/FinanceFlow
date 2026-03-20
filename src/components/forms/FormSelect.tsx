import { SelectHTMLAttributes } from 'react';

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export function FormSelect({ label, options, error, ...props }: FormSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <select
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm text-white outline-none transition focus:border-brand/70 focus:ring-2 focus:ring-brand/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-2 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}
