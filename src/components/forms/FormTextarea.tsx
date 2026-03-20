import { TextareaHTMLAttributes } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function FormTextarea({ label, ...props }: FormTextareaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <textarea
        {...props}
        className="min-h-28 w-full rounded-2xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand/70 focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
